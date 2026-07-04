import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

const DIST = new URL('../dist', import.meta.url).pathname
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
await new Promise((r) => server.listen(4173, r))

const browser = await chromium.launch({
  executablePath: new URL('../.pw-browsers/chromium-1228/chrome-linux64/chrome', import.meta.url)
    .pathname,
  args: ['--no-sandbox'],
})
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
})
const page = await context.newPage()
await page.goto('http://localhost:4173/')
await page.waitForTimeout(600)
await page.screenshot({ path: 'shots/1-home.png' })

await page.getByText('Start a walkthrough').click()
await page.getByPlaceholder('123 Main St, Springfield').fill('482 Maple Ave')
await page.getByPlaceholder('Apt 4B').fill('Apt 3B')
await page.getByPlaceholder('Acme Property Management').fill('Northside Property Group')
await page.getByText('Begin walkthrough').click()
await page.waitForTimeout(400)
await page.screenshot({ path: 'shots/2-walkthrough.png' })

await page.getByText('Kitchen').click()
await page.waitForTimeout(300)
await page.getByText('What to photograph').click()
await page.waitForTimeout(300)
await page.screenshot({ path: 'shots/3-room.png' })

await browser.close()
server.close()
console.log('screenshots written')
