import { openDB, type IDBPDatabase } from 'idb'
import type { Inspection } from './types'

const DB_NAME = 'depositcam'
const STORE = 'inspections'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

export async function listInspections(): Promise<Inspection[]> {
  const db = await getDB()
  const all: Inspection[] = await db.getAll(STORE)
  return all.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function saveInspection(inspection: Inspection): Promise<void> {
  const db = await getDB()
  await db.put(STORE, { ...inspection, updatedAt: Date.now() })
}

export async function deleteInspection(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE, id)
}
