import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

await mkdir('shots/sample', { recursive: true })

const livingRoom = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200">
  <rect width="1600" height="820" fill="#e8e2d8"/>
  <rect y="820" width="1600" height="380" fill="#b08d5f"/>
  <rect y="812" width="1600" height="14" fill="#8a6b45"/>
  <g stroke="#9a7a50" stroke-width="4">
    <line x1="0" y1="900" x2="1600" y2="900"/><line x1="0" y1="990" x2="1600" y2="990"/>
    <line x1="0" y1="1090" x2="1600" y2="1090"/>
  </g>
  <rect x="980" y="120" width="420" height="520" rx="8" fill="#7fb3d8" stroke="#ffffff" stroke-width="22"/>
  <line x1="1190" y1="120" x2="1190" y2="640" stroke="#ffffff" stroke-width="16"/>
  <line x1="980" y1="380" x2="1400" y2="380" stroke="#ffffff" stroke-width="16"/>
  <rect x="120" y="520" width="640" height="300" rx="30" fill="#6b7f8f"/>
  <rect x="150" y="460" width="580" height="140" rx="40" fill="#7d93a5"/>
  <rect x="120" y="790" width="60" height="60" fill="#4d5c68"/>
  <rect x="700" y="790" width="60" height="60" fill="#4d5c68"/>
  <rect x="820" y="640" width="90" height="180" rx="10" fill="#8a5f3e"/>
  <ellipse cx="865" cy="600" rx="110" ry="90" fill="#5f8f5a"/>
</svg>`

const kitchen = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200">
  <rect width="1600" height="1200" fill="#ece7df"/>
  <rect y="960" width="1600" height="240" fill="#9aa5ab"/>
  <rect x="60" y="120" width="1480" height="300" fill="#f5f2ec" stroke="#cfc8bc" stroke-width="6"/>
  <g stroke="#cfc8bc" stroke-width="6"><line x1="430" y1="120" x2="430" y2="420"/>
  <line x1="800" y1="120" x2="800" y2="420"/><line x1="1170" y1="120" x2="1170" y2="420"/></g>
  <rect x="60" y="560" width="1480" height="60" fill="#8f8577"/>
  <rect x="60" y="620" width="1480" height="340" fill="#f5f2ec" stroke="#cfc8bc" stroke-width="6"/>
  <g stroke="#cfc8bc" stroke-width="6"><line x1="430" y1="620" x2="430" y2="960"/>
  <line x1="800" y1="620" x2="800" y2="960"/><line x1="1170" y1="620" x2="1170" y2="960"/></g>
  <rect x="500" y="540" width="240" height="30" rx="8" fill="#b8bfc4"/>
  <rect x="590" y="470" width="24" height="80" fill="#b8bfc4"/>
  <g fill="#7d746a"><circle cx="245" cy="790" r="14"/><circle cx="615" cy="790" r="14"/>
  <circle cx="985" cy="790" r="14"/><circle cx="1355" cy="790" r="14"/></g>
</svg>`

const bathroom = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200">
  <rect width="1600" height="1200" fill="#dfe7ea"/>
  <g stroke="#c3ced3" stroke-width="4">
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${150 * (i + 1)}" x2="1600" y2="${150 * (i + 1)}"/>`).join('')}
    ${Array.from({ length: 10 }, (_, i) => `<line x1="${160 * (i + 1)}" y1="0" x2="${160 * (i + 1)}" y2="1200"/>`).join('')}
  </g>
  <rect x="120" y="520" width="520" height="90" rx="14" fill="#ffffff" stroke="#b9c4c9" stroke-width="6"/>
  <rect x="330" y="610" width="100" height="330" fill="#ffffff" stroke="#b9c4c9" stroke-width="6"/>
  <rect x="140" y="300" width="480" height="180" rx="10" fill="#aebfc7" stroke="#8fa2ab" stroke-width="6"/>
  <ellipse cx="1150" cy="900" rx="260" ry="130" fill="#ffffff" stroke="#b9c4c9" stroke-width="8"/>
  <rect x="1050" y="560" width="200" height="300" rx="24" fill="#ffffff" stroke="#b9c4c9" stroke-width="8"/>
  <rect x="380" y="530" width="26" height="50" fill="#8fa2ab"/>
</svg>`

const scenes = { 'living-room': livingRoom, kitchen, bathroom }
for (const [name, svg] of Object.entries(scenes)) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(`shots/sample/${name}.jpg`)
}
console.log('sample photos written')
