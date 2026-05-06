import { reactive, watch } from 'vue'
import { getAllTemplates, getTemplate, saveTemplate, deleteTemplate } from '../utils/db.js'
import { parseVariables } from '../utils/parser.js'
import { renderTemplate } from '../utils/renderer.js'

export const store = reactive({
  templates: [],
  activeTemplateId: null,
  templateContent: '',
  variables: [],
  formValues: {},
  validationErrors: {},
  renderedOutput: '',
})

let debounceTimer = null

export async function refreshTemplateList() {
  store.templates = await getAllTemplates()
}

export async function loadTemplate(id) {
  const tpl = await getTemplate(id)
  if (!tpl) return
  store.activeTemplateId = id
  store.templateContent = tpl.content
  store.variables = parseVariables(tpl.content)
  store.formValues = {}
  store.validationErrors = {}
  for (const v of store.variables) {
    store.formValues[v] = ''
  }
  doRender()
}

export function updateFormValue(varName, value) {
  store.formValues[varName] = value
  if (value.includes('{{') || value.includes('}}')) {
    store.validationErrors[varName] = 'Value must not contain {{ or }}'
  } else {
    delete store.validationErrors[varName]
  }
  doRender()
}

function doRender() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const hasErrors = Object.keys(store.validationErrors).length > 0
    if (hasErrors) {
      store.renderedOutput = store.templateContent
    } else {
      // Only pass non-empty values to Nunjucks so unfilled {{ var }} stays in output
      const filled = {}
      for (const [k, v] of Object.entries(store.formValues)) {
        if (v !== '') filled[k] = v
      }
      store.renderedOutput = renderTemplate(store.templateContent, filled)
    }
  }, 50)
}

export async function uploadTemplate(name, content) {
  const id = await saveTemplate(name, content)
  await refreshTemplateList()
  await loadTemplate(id)
}

export async function removeTemplate(id) {
  await deleteTemplate(id)
  if (store.activeTemplateId === id) {
    store.activeTemplateId = null
    store.templateContent = ''
    store.variables = []
    store.formValues = {}
    store.validationErrors = {}
    store.renderedOutput = ''
  }
  await refreshTemplateList()
}
