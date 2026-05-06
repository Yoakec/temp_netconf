import { openDB } from 'idb'

const DB_NAME = 'konfigme'
const DB_VERSION = 1
const STORE_NAME = 'templates'
const MAX_SIZE = 1_048_576 // 1MB

let dbPromise = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          })
          store.createIndex('name', 'name', { unique: true })
          store.createIndex('createdAt', 'createdAt')
        }
      },
    })
  }
  return dbPromise
}

export async function saveTemplate(name, content) {
  const bytes = new TextEncoder().encode(content).length
  if (bytes > MAX_SIZE) {
    throw new Error(`Template exceeds 1MB limit (${(bytes / 1_048_576).toFixed(1)}MB)`)
  }
  const db = await getDb()
  try {
    const id = await db.add(STORE_NAME, {
      name,
      content,
      createdAt: Date.now(),
    })
    return id
  } catch (err) {
    if (err.name === 'QuotaExceededError' || err.message?.includes('quota')) {
      throw new Error('Storage quota exceeded. Please delete some templates to free space.')
    }
    throw err
  }
}

export async function getAllTemplates() {
  const db = await getDb()
  return db.getAllFromIndex(STORE_NAME, 'createdAt')
}

export async function getTemplate(id) {
  const db = await getDb()
  return db.get(STORE_NAME, id)
}

export async function deleteTemplate(id) {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}
