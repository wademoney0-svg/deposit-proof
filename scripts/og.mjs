import sharp from 'sharp'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0f1115"/>
  <path d="M150 140 L262 188 V258 C262 328 214 371 150 392 C86 371 38 328 38 258 V188 Z"
        fill="#22c55e" transform="translate(60,-40) scale(0.9)"/>
  <circle cx="195" cy="190" r="46" fill="#0f1115"/>
  <circle cx="195" cy="190" r="28" fill="#e8fbef"/>
  <circle cx="195" cy="190" r="12" fill="#0f1115"/>
  <text x="330" y="215" font-family="DejaVu Sans, sans-serif" font-size="86" font-weight="bold" fill="#ffffff">DepositCam</text>
  <text x="120" y="360" font-family="DejaVu Sans, sans-serif" font-size="42" fill="#c9d3de">Timestamped photo evidence of your rental,</text>
  <text x="120" y="420" font-family="DejaVu Sans, sans-serif" font-size="42" fill="#c9d3de">so your security deposit comes back to you.</text>
  <rect x="120" y="480" width="480" height="70" rx="35" fill="#22c55e"/>
  <text x="150" y="527" font-family="DejaVu Sans, sans-serif" font-size="34" font-weight="bold" fill="#06240f">depositcam.com</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile('public/og.png')
console.log('og.png written')
