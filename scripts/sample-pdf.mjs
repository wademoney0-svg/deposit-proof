import http from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
}

const server = http.createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  try {
    // /__root/ serves project files (pdfjs from node_modules, the saved PDF)
    const file = path.startsWith('/__root/')
      ? join(ROOT, path.slice('/__root/'.length))
      : join(DIST, path)
    const data = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' })
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
  geolocation: { latitude: 41.8858, longitude: -87.6229 },
  permissions: ['geolocation'],
})
await context.addInitScript(() => localStorage.setItem('dp_unlocked', '1'))
const page = await context.newPage()
await page.goto('http://localhost:4173/')

await page.getByText('Start a walkthrough').click()
await page.getByPlaceholder('123 Main St, Springfield').fill('482 Maple Ave')
await page.getByPlaceholder('Apt 4B').fill('Apt 3B')
await page.getByPlaceholder('Acme Property Management').fill('Northside Property Group')
await page.getByText('Begin walkthrough').click()

async function documentRoom(roomName, files, note, caption) {
  await page.getByText(roomName).click()
  await page.locator('input[type=file]').setInputFiles(files)
  await page.waitForTimeout(1200)
  if (caption) await page.getByPlaceholder('Add a caption…').first().fill(caption)
  if (note) await page.locator('textarea').fill(note)
  await page.getByText('Mark room as done').click()
  await page.locator('.back').click()
  await page.waitForTimeout(300)
}

await documentRoom(
  'Living Room',
  ['shots/sample/living-room.jpg'],
  'Small scuff on the floor near the window was already present at move-in.',
  'West wall, window and radiator',
)
await documentRoom(
  'Kitchen',
  ['shots/sample/kitchen.jpg'],
  'All appliances clean and working. Cabinet doors aligned.',
  'Cabinets, counter and sink',
)
await documentRoom(
  'Bathroom',
  ['shots/sample/bathroom.jpg'],
  '',
  'Tub, vanity and tile in good condition',
)

const downloadPromise = page.waitForEvent('download')
await page.getByText('Export PDF report').click()
const download = await downloadPromise
await download.saveAs('shots/sample-report.pdf')
console.log('pdf saved')

// Render PDF pages to PNG using pdf.js inside the browser
const renderPage = await context.newPage()
await renderPage.goto('http://localhost:4173/')
const pages = await renderPage.evaluate(async () => {
  const pdfjs = await import('/__root/node_modules/pdfjs-dist/build/pdf.mjs')
  pdfjs.GlobalWorkerOptions.workerSrc = '/__root/node_modules/pdfjs-dist/build/pdf.worker.mjs'
  const doc = await pdfjs.getDocument('/__root/shots/sample-report.pdf').promise
  const out = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const viewport = page.getViewport({ scale: 2.2 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, viewport }).promise
    out.push(canvas.toDataURL('image/png'))
  }
  return out
})
for (let i = 0; i < pages.length; i++) {
  await writeFile(
    `shots/pdf-page-${i + 1}.png`,
    Buffer.from(pages[i].split(',')[1], 'base64'),
  )
}
await browser.close()
server.close()
console.log('page images written:', pages.length)
