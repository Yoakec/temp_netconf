import { openDB } from 'idb'

const DB_NAME = 'konfigme-snippets'
const DB_VERSION = 1
const STORE_NAME = 'snippets'
const MAX_SIZE = 1_048_576

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
          store.createIndex('category', 'category')
          store.createIndex('createdAt', 'createdAt')
        }
      },
    })
  }
  return dbPromise
}

export async function getAllSnippets() {
  const db = await getDb()
  return db.getAllFromIndex(STORE_NAME, 'createdAt')
}

export async function saveSnippet(name, content) {
  const bytes = new TextEncoder().encode(content).length
  if (bytes > MAX_SIZE) {
    throw new Error(`Snippet exceeds 1MB limit (${(bytes / 1_048_576).toFixed(1)}MB)`)
  }
  const db = await getDb()
  try {
    const id = await db.add(STORE_NAME, {
      name,
      content,
      category: 'user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    return id
  } catch (err) {
    if (err.name === 'ConstraintError') {
      throw new Error(`A snippet named "${name}" already exists.`)
    }
    if (err.name === 'QuotaExceededError' || err.message?.includes('quota')) {
      throw new Error('Storage quota exceeded. Please delete some snippets to free space.')
    }
    throw err
  }
}

export async function updateSnippet(id, name, content) {
  const bytes = new TextEncoder().encode(content).length
  if (bytes > MAX_SIZE) {
    throw new Error(`Snippet exceeds 1MB limit (${(bytes / 1_048_576).toFixed(1)}MB)`)
  }
  const db = await getDb()
  const existing = await db.get(STORE_NAME, id)
  if (!existing) throw new Error('Snippet not found')
  await db.put(STORE_NAME, {
    ...existing,
    name,
    content,
    updatedAt: Date.now(),
  })
}

export async function deleteSnippet(id) {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}
