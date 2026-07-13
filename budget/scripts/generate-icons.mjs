/**
 * Generates PWA app icons from the approved TacEdge brandmark SVG.
 * Renders the supplied asset (never a redrawn mark) centred on the
 * blackwood brand colour, via headless Chromium.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import { chromium } from '@playwright/test'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const brandmarkPath = path.join(root, '../public/brand/tacedge-brandmark-sage.svg')
const outDir = path.join(root, '../public/icons')

const svg = await readFile(brandmarkPath, 'utf8')
const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

// markScale: fraction of the canvas the mark occupies.
// Maskable icons keep the mark inside the central 60% safe zone.
const targets = [
  { file: 'icon-192.png', size: 192, markScale: 0.62 },
  { file: 'icon-512.png', size: 512, markScale: 0.62 },
  { file: 'icon-maskable-512.png', size: 512, markScale: 0.5 },
  { file: 'apple-touch-icon.png', size: 180, markScale: 0.62 },
]

await mkdir(outDir, { recursive: true })

const executablePath = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium'
const browser = await chromium.launch({ executablePath }).catch(() => chromium.launch())

for (const { file, size, markScale } of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(`<!doctype html><html><body style="margin:0">
    <div style="width:${size}px;height:${size}px;background:#0E2114;display:flex;align-items:center;justify-content:center">
      <img src="${dataUri}" style="width:${Math.round(size * markScale)}px" />
    </div>
  </body></html>`)
  const buffer = await page.screenshot({ type: 'png' })
  await writeFile(path.join(outDir, file), buffer)
  await page.close()
  console.log(`wrote ${file} (${size}×${size})`)
}

await browser.close()
