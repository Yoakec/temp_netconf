import { reactive, computed, watch } from 'vue'
import { getAllSnippets, saveSnippet, updateSnippet, deleteSnippet } from '../utils/snippetDb.js'
import { snippetTree } from '../utils/snippets/index.js'
import { parseVariables } from '../utils/parser.js'
import { renderTemplate } from '../utils/renderer.js'

const TREE_PREFIX = 'tree::'

export const snippetStore = reactive({
  snippets: [],
  snippetTree,
  currentVendor: '',
  currentSeries: '',
  selectedIds: new Set(),
  formValues: {},
  validationErrors: {},
  combinedTemplate: '',
  variables: [],
  renderedOutput: '',
})

let debounceTimer = null

// Computed helpers (not Vue computed since we use reactive)
export function availableSeries() {
  if (!snippetStore.currentVendor) return []
  const vendor = snippetStore.snippetTree[snippetStore.currentVendor]
  return vendor ? Object.keys(vendor) : []
}

export function availableTreeSnippets() {
  if (!snippetStore.currentVendor || !snippetStore.currentSeries) return {}
  const vendor = snippetStore.snippetTree[snippetStore.currentVendor]
  if (!vendor) return {}
  const series = vendor[snippetStore.currentSeries]
  return series || {}
}

// Navigation
export function setVendor(vendor) {
  snippetStore.currentVendor = vendor
  snippetStore.currentSeries = ''
}

export function setSeries(series) {
  snippetStore.currentSeries = series
}

// Init
export async function refreshSnippetList() {
  snippetStore.snippets = await getAllSnippets()
}

// Selection
export function toggleSnippet(key) {
  const s = new Set(snippetStore.selectedIds)
  if (s.has(key)) {
    s.delete(key)
  } else {
    s.add(key)
  }
  snippetStore.selectedIds = s
}

// Get content for a key (tree or user)
function getSnippetContent(key) {
  if (typeof key === 'string' && key.startsWith(TREE_PREFIX)) {
    const parts = key.slice(TREE_PREFIX.length).split('::')
    if (parts.length === 3) {
      const [vendor, series, name] = parts
      return snippetTree[vendor]?.[series]?.[name] || ''
    }
    return ''
  }
  if (typeof key === 'number') {
    const s = snippetStore.snippets.find(s => s.id === key)
    return s ? s.content : ''
  }
  return ''
}

export function isTreeKey(key) {
  return typeof key === 'string' && key.startsWith(TREE_PREFIX)
}

// Build composite key for tree snippet
export function treeKey(vendor, series, name) {
  return `${TREE_PREFIX}${vendor}::${series}::${name}`
}

function updateCombinedTemplate() {
  const parts = []
  for (const key of snippetStore.selectedIds) {
    const content = getSnippetContent(key)
    if (content) parts.push(content)
  }
  snippetStore.combinedTemplate = parts.join('\n')
}

// Form
export function updateSnippetFormValue(varName, value) {
  snippetStore.formValues[varName] = value
  if (value.includes('{{') || value.includes('}}')) {
    snippetStore.validationErrors[varName] = 'Value must not contain {{ or }}'
  } else {
    delete snippetStore.validationErrors[varName]
  }
  doRender()
}

export function clearAllFormValues() {
  for (const k of Object.keys(snippetStore.formValues)) {
    snippetStore.formValues[k] = ''
  }
  snippetStore.validationErrors = {}
  doRender()
}

// CRUD for user snippets
export async function uploadSnippet(name, content) {
  await saveSnippet(name, content)
  await refreshSnippetList()
}

export async function editSnippet(id, name, content) {
  await updateSnippet(id, name, content)
  await refreshSnippetList()
  updateCombinedTemplate()
}

export async function removeSnippet(id) {
  await deleteSnippet(id)
  const s = new Set(snippetStore.selectedIds)
  s.delete(id)
  snippetStore.selectedIds = s
  await refreshSnippetList()
}

// Render
function doRender() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const hasErrors = Object.keys(snippetStore.validationErrors).length > 0
    if (hasErrors) {
      snippetStore.renderedOutput = snippetStore.combinedTemplate
    } else {
      const filled = {}
      for (const [k, v] of Object.entries(snippetStore.formValues)) {
        filled[k] = v !== '' ? v : '{{ ' + k + ' }}'
      }
      snippetStore.renderedOutput = renderTemplate(snippetStore.combinedTemplate, filled)
    }
  }, 50)
}

// ── Reactive Pipeline ──

// Clear tree selections on vendor/series change; never clear formValues
watch([() => snippetStore.currentVendor, () => snippetStore.currentSeries], () => {
  const s = new Set(snippetStore.selectedIds)
  for (const key of s) {
    if (typeof key === 'string' && key.startsWith(TREE_PREFIX)) {
      s.delete(key)
    }
  }
  snippetStore.selectedIds = s
})

// selectedIds → combinedTemplate
watch(() => snippetStore.selectedIds, () => {
  updateCombinedTemplate()
}, { deep: true })

// combinedTemplate → variables + render
watch(() => snippetStore.combinedTemplate, (template) => {
  snippetStore.variables = parseVariables(template)
  for (const v of snippetStore.variables) {
    if (!(v in snippetStore.formValues)) {
      snippetStore.formValues[v] = ''
    }
  }
  for (const k of Object.keys(snippetStore.validationErrors)) {
    if (!snippetStore.variables.includes(k)) {
      delete snippetStore.validationErrors[k]
    }
  }
  doRender()
})
