import { reactive, computed, watch } from 'vue'
import { getAllSnippets, getSnippet, saveSnippet, updateSnippet, deleteSnippet, seedIfEmpty } from '../utils/snippetDb.js'
import { parseVariables } from '../utils/parser.js'
import { renderTemplate } from '../utils/renderer.js'

export const snippetStore = reactive({
  snippets: [],
  selectedIds: new Set(),
  formValues: {},
  validationErrors: {},
  combinedTemplate: '',
  variables: [],
  renderedOutput: '',
})

let debounceTimer = null

export async function initSnippetStore() {
  await seedIfEmpty()
  await refreshSnippetList()
}

export async function refreshSnippetList() {
  snippetStore.snippets = await getAllSnippets()
}

export function toggleSnippet(id) {
  const s = new Set(snippetStore.selectedIds)
  if (s.has(id)) {
    s.delete(id)
  } else {
    s.add(id)
  }
  snippetStore.selectedIds = s
}

export function updateSnippetFormValue(varName, value) {
  snippetStore.formValues[varName] = value
  if (value.includes('{{') || value.includes('}}')) {
    snippetStore.validationErrors[varName] = 'Value must not contain {{ or }}'
  } else {
    delete snippetStore.validationErrors[varName]
  }
  doRender()
}

export async function uploadSnippet(name, content) {
  await saveSnippet(name, content)
  await refreshSnippetList()
}

export async function editSnippet(id, name, content) {
  await updateSnippet(id, name, content)
  await refreshSnippetList()
  // re-evaluate combined template in case this snippet was selected
  updateCombinedTemplate()
}

export async function removeSnippet(id) {
  await deleteSnippet(id)
  // deselect if selected
  const s = new Set(snippetStore.selectedIds)
  s.delete(id)
  snippetStore.selectedIds = s
  await refreshSnippetList()
}

function updateCombinedTemplate() {
  const ids = snippetStore.selectedIds
  const parts = []
  for (const s of snippetStore.snippets) {
    if (ids.has(s.id)) {
      parts.push(s.content)
    }
  }
  snippetStore.combinedTemplate = parts.join('\n')
}

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

// Reactive pipeline
watch(() => snippetStore.selectedIds, () => {
  updateCombinedTemplate()
}, { deep: true })

watch(() => snippetStore.combinedTemplate, (template) => {
  snippetStore.variables = parseVariables(template)
  // preserve existing formValues, init new ones
  for (const v of snippetStore.variables) {
    if (!(v in snippetStore.formValues)) {
      snippetStore.formValues[v] = ''
    }
  }
  // clear validation errors for variables that no longer exist
  for (const k of Object.keys(snippetStore.validationErrors)) {
    if (!snippetStore.variables.includes(k)) {
      delete snippetStore.validationErrors[k]
    }
  }
  doRender()
})
