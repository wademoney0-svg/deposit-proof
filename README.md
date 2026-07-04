# DepositCam

Timestamped photo evidence of your rental's condition, so your security deposit comes back to you.

Renters lose deposits because they can't prove what the apartment looked like at move-in or move-out. DepositCam guides you room by room through a photo walkthrough, burns the date, time, and GPS coordinates into every photo at the moment of capture, and exports a polished PDF condition report you can send to a landlord — or bring to small-claims court.

## Features

- Guided walkthrough with a default room list (add or remove rooms freely) and a "what to photograph" checklist per room
- Photos are downscaled and stamped with the capture timestamp and GPS coordinates directly in the image pixels
- Per-room notes and per-photo captions
- Everything is stored locally on your device (IndexedDB) — no account, no server, private by default
- One-tap export of a dispute-ready PDF report with a cover page, room sections, and page numbers
- Mobile-first PWA: installable to the home screen, works offline once loaded
- Optional Stripe paywall on PDF export (configured in `src/config.ts`)

## Tech stack

- React 19 + TypeScript + Vite
- `idb` for IndexedDB persistence
- `jspdf` for PDF report generation

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```

Note: camera capture and geolocation require a secure context (HTTPS or localhost).

## Deployment

The app deploys to GitHub Pages from the `gh-pages` branch:

```bash
GH_PAGES=1 npm run build   # builds with the /depositcam/ base path
```

Push the `dist/` output to the `gh-pages` branch to publish.
