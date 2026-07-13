import { test, expect } from '@playwright/test'

/**
 * Critical-path smoke test, run against demo mode (no Supabase needed):
 * open the app → enter a budget → add an item → totals update.
 */
test('add an expense and see every total update', async ({ page }) => {
  await page.goto('/')

  // No Supabase configured in CI → setup screen with demo entry.
  await page.getByRole('button', { name: 'Continue in demo mode' }).click()

  // First run seeds budgets and shows the calm onboarding screen.
  await expect(page.getByRole('heading', { name: 'Build your financial picture' })).toBeVisible()
  await page.getByRole('button', { name: 'Start with Personal' }).click()

  await expect(page.getByRole('heading', { name: 'Personal', exact: true })).toBeVisible()

  // Add a weekly expense.
  await page.getByRole('button', { name: 'Add item' }).first().click()
  await page.getByLabel('Name').fill('Groceries')
  await page.getByLabel('Amount').fill('350')
  await page.getByLabel('Frequency').selectOption('weekly')
  await page.getByRole('button', { name: 'Save', exact: true }).click()

  // The item row shows the original entry in quieter text.
  await expect(page.getByText('Entered as $350.00 / week')).toBeVisible()

  // Weekly $350 → monthly view shows $1,516.67 out (default period monthly).
  await expect(page.getByText('-$1,516.67').first()).toBeVisible()

  // Overview reflects the same consolidated position.
  await page.getByRole('link', { name: 'Overview' }).first().click()
  await expect(page.getByText('-$1,516.67').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Key drivers' })).toBeVisible()
})

test('loans are preloaded in Property with estimated interest', async ({ page }) => {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Continue in demo mode' })
  if (await demoButton.isVisible().catch(() => false)) await demoButton.click()

  // Onboarding only shows on the very first seed.
  const onboarding = page.getByRole('button', { name: 'Go to Overview' })
  if (await onboarding.isVisible().catch(() => false)) await onboarding.click()

  await page.getByRole('link', { name: 'Property' }).first().click()
  await expect(page.getByText('Property Loan – Interest Only')).toBeVisible()
  await expect(page.getByText('Property Loan – Principal and Interest')).toBeVisible()
  await expect(page.getByText('Estimated', { exact: true })).toBeVisible()
  await expect(page.getByText('6.45% p.a.')).toBeVisible()
})
