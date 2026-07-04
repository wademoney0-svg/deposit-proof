import type { Photo } from './types'
import { uid } from './types'

const MAX_DIM = 1600
const JPEG_QUALITY = 0.82

function getPosition(timeoutMs = 4000): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: timeoutMs, maximumAge: 60_000 },
    )
  })
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = reject
    img.src = url
  })
}

export function formatStamp(takenAt: number, lat?: number, lng?: number): string {
  const d = new Date(takenAt)
  const date = d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const gps =
    lat !== undefined && lng !== undefined
      ? `  •  ${lat.toFixed(5)}, ${lng.toFixed(5)}`
      : ''
  return `${date}${gps}`
}

/**
 * Downscale the photo and burn a timestamp + GPS stamp into the pixels so the
 * evidence stays attached to the image itself, not just app metadata.
 */
export async function processCapture(file: File): Promise<Photo> {
  const takenAt = Date.now()
  const [img, pos] = await Promise.all([loadImage(file), getPosition()])
  const lat = pos?.coords.latitude
  const lng = pos?.coords.longitude

  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)

  const stamp = formatStamp(takenAt, lat, lng)
  const fontSize = Math.max(14, Math.round(w * 0.022))
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`
  const pad = Math.round(fontSize * 0.6)
  const textW = ctx.measureText(stamp).width
  const barH = fontSize + pad * 2

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.fillRect(0, h - barH, textW + pad * 2, barH)
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.fillText(stamp, pad, h - barH / 2)

  return {
    id: uid(),
    dataUrl: canvas.toDataURL('image/jpeg', JPEG_QUALITY),
    takenAt,
    lat,
    lng,
    caption: '',
  }
}
