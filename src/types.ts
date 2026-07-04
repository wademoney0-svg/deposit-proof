export type InspectionType = 'move-in' | 'move-out'

export interface Photo {
  id: string
  dataUrl: string
  takenAt: number
  lat?: number
  lng?: number
  caption: string
}

export interface Room {
  id: string
  name: string
  notes: string
  photos: Photo[]
  done: boolean
}

export interface Inspection {
  id: string
  address: string
  unit: string
  type: InspectionType
  landlord: string
  createdAt: number
  updatedAt: number
  rooms: Room[]
}

export const DEFAULT_ROOMS = [
  'Entry / Hallway',
  'Living Room',
  'Kitchen',
  'Bedroom',
  'Bathroom',
]

export const SHOT_CHECKLIST = [
  'Wide shot of each wall',
  'Floor (corners, under furniture areas)',
  'Ceiling (stains, cracks)',
  'Windows, blinds and sills',
  'Doors, frames and locks',
  'Outlets, switches and fixtures',
  'Appliances inside and out (if any)',
  'Any existing damage, up close',
]

export function uid(): string {
  return crypto.randomUUID()
}
