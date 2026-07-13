/**
 * Visual review helper: opens the production build in demo mode, adds a
 * few representative entries through the real UI-facing localStorage seed,
 * and screenshots the key screens at the required breakpoints.
 * Output: scratchpad (not committed).
 */
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = process.env.OUT_DIR ?? '/tmp/review-shots'

const viewports = [
  { name: 'iphone-se', width: 375, height: 667, mobile: true },
  { name: 'iphone-15', width: 393, height: 852, mobile: true },
  { name: 'ipad-portrait', width: 820, height: 1180, mobile: false },
  { name: 'ipad-landscape', width: 1180, height: 820, mobile: false },
  { name: 'laptop-13', width: 1280, height: 800, mobile: false },
  { name: 'desktop-wide', width: 1728, height: 1000, mobile: false },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox'],
})

// One context to seed demo data through the actual UI.
const seedContext = await browser.newContext({ baseURL: BASE })
const seedPage = await seedContext.newPage()
await seedPage.goto('/')
await seedPage.getByRole('button', { name: 'Continue in demo mode' }).click()
await seedPage.getByRole('button', { name: 'Start with Personal' }).click()

async function addItem(page, { name, amount, frequency, type, budgetLabel }) {
  if (budgetLabel) await page.getByRole('link', { name: budgetLabel }).first().click()
  await page.getByRole('button', { name: 'Add item' }).first().click()
  await page.getByLabel('Name').fill(name)
  if (type) await page.getByLabel('Type').selectOption(type)
  await page.getByLabel('Amount').fill(amount)
  await page.getByLabel('Frequency').selectOption(frequency)
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  try {
    await page.getByRole('dialog').waitFor({ state: 'detached', timeout: 4000 })
  } catch {
    await page.screenshot({ path: `${OUT}/debug-stuck-sheet-${name.replaceAll(' ', '-')}.png` })
    throw new Error(`Sheet did not close after saving "${name}"`)
  }
}

await addItem(seedPage, { name: 'Salary', amount: '2400', frequency: 'fortnightly', type: 'income' })
await addItem(seedPage, { name: 'Groceries', amount: '350', frequency: 'weekly' })
await addItem(seedPage, { name: 'Power and internet', amount: '260', frequency: 'monthly' })
await addItem(seedPage, { name: 'Rent received', amount: '650', frequency: 'weekly', type: 'income', budgetLabel: 'Property' })
await addItem(seedPage, { name: 'Rates', amount: '3400', frequency: 'annual' })
await addItem(seedPage, { name: 'Hosting', amount: '120', frequency: 'monthly', budgetLabel: 'TacEdge' })
await addItem(seedPage, { name: 'Software subscriptions', amount: '95', frequency: 'monthly' })

// A transfer Personal → TacEdge
await seedPage.getByRole('button', { name: 'Add item' }).first().click()
await seedPage.getByLabel('Name').fill('Founder contribution')
await seedPage.getByLabel('Type').selectOption('transfer')
await seedPage.getByLabel('From budget').selectOption({ label: 'Personal' })
await seedPage.getByLabel('To budget').selectOption({ label: 'TacEdge' })
await seedPage.getByLabel('Amount').fill('2000')
await seedPage.getByLabel('Frequency').selectOption('monthly')
await seedPage.getByRole('button', { name: 'Save', exact: true }).click()
await seedPage.waitForTimeout(200)

// TacEdge cash balance for runway
await seedPage.getByRole('button', { name: 'Update cash balance' }).click()
await seedPage.locator('#cash-balance').fill('18000')
await seedPage.getByRole('button', { name: 'Save', exact: true }).click()
await seedPage.waitForTimeout(200)

const storage = await seedContext.storageState()
const localStorageState = storage.origins[0]?.localStorage ?? []
await seedContext.close()

const screens = [
  { path: '/', name: 'overview' },
  { path: '/b/personal', name: 'personal' },
  { path: '/b/property', name: 'property' },
  { path: '/b/tacedge', name: 'tacedge' },
  { path: '/settings', name: 'settings' },
]

for (const vp of viewports) {
  const context = await browser.newContext({
    baseURL: BASE,
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    deviceScaleFactor: 2,
  })
  await context.addInitScript((entries) => {
    for (const { name, value } of entries) localStorage.setItem(name, value)
  }, localStorageState)
  const page = await context.newPage()
  for (const screen of screens) {
    await page.goto(screen.path)
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/${vp.name}--${screen.name}.png`, fullPage: true })
  }
  // Item form sheet on the phone sizes
  if (vp.mobile) {
    await page.goto('/b/personal')
    await page.getByRole('button', { name: 'Add item' }).first().click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${OUT}/${vp.name}--item-sheet.png` })
  }
  await context.close()
  console.log(`done ${vp.name}`)
}

await browser.close()
