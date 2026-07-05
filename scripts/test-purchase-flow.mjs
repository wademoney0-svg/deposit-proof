import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
}

const server = http.createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  try {
    const data = await readFile(join(DIST, path))
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    const data = await readFile(join(DIST, 'index.html'))
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(data)
  }
})
await new Promise((r) => server.listen(4174, r))

const browser = await chromium.launch({
  executablePath: new URL('../.pw-browsers/chromium-1228/chrome-linux64/chrome', import.meta.url)
    .pathname,
  args: ['--no-sandbox'],
})
// Locked user: no dp_unlocked in localStorage
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await context.newPage()
await page.goto('http://localhost:4174/')

// Create a walkthrough with one photo
await page.getByText('Start a walkthrough').click()
await page.getByPlaceholder('123 Main St, Springfield').fill('77 Test St')
await page.getByText('Begin walkthrough').click()
await page.getByText('Living Room').click()
await page.locator('input[type=file]').setInputFiles('shots/sample/living-room.jpg')
await page.waitForTimeout(1200)
await page.locator('.back').click()

// Export while locked -> paywall must appear
await page.getByText('Export PDF report').click()
if (!(await page.getByText('Unlock PDF export').isVisible())) {
  throw new Error('FAIL: paywall did not appear for locked user')
}
console.log('ok: paywall shown, pending export remembered')

// Simulate coming back from Stripe approved
const downloadPromise = page.waitForEvent('download', { timeout: 15000 })
await page.goto('http://localhost:4174/?paid=1')
const download = await downloadPromise
console.log('ok: PDF auto-downloaded after purchase:', download.suggestedFilename())

await page.getByText('Email it now').waitFor({ timeout: 5000 })
console.log('ok: email option shown right after purchase')
await page.screenshot({ path: 'shots/after-purchase.png' })

// Sanity: the walkthrough view is open underneath
if (!(await page.getByText('77 Test St').first().isVisible())) {
  throw new Error('FAIL: walkthrough not reopened')
}
console.log('ok: renter is back on their walkthrough')

await browser.close()
server.close()
console.log('PASS')
