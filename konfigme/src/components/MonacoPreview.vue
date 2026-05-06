<script setup>
import { ref, watch, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as monaco from 'monaco-editor'
import { store } from '../stores/templateStore.js'

const container = ref(null)
let editor = null
const decorations = shallowRef([])

onMounted(() => {
  editor = monaco.editor.create(container.value, {
    value: '',
    language: 'plaintext',
    theme: 'vs-dark',
    readOnly: true,
    minimap: { enabled: false },
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
  })
  applyDecorations()
})

onBeforeUnmount(() => {
  if (editor) editor.dispose()
})

watch(() => store.renderedOutput, (newVal) => {
  if (!editor) return
  const model = editor.getModel()
  if (!model) return
  model.setValue(newVal)
  applyDecorations()
})

function applyDecorations() {
  if (!editor) return
  const text = store.renderedOutput
  if (!text) {
    decorations.value = editor.deltaDecorations(decorations.value, [])
    return
  }

  const newDecorations = []

  // Red: unreplaced {{ variable }} placeholders
  const redRegex = /{{\s*\w+\s*}}/g
  let match
  const model = editor.getModel()
  while ((match = redRegex.exec(text)) !== null) {
    const startPos = model.getPositionAt(match.index)
    const endPos = model.getPositionAt(match.index + match[0].length)
    newDecorations.push({
      range: new monaco.Range(
        startPos.lineNumber, startPos.column,
        endPos.lineNumber, endPos.column
      ),
      options: {
        className: 'highlight-red',
      },
    })
  }

  // Green: filled values (only non-empty, non-{{ }} values)
  for (const varName of store.variables) {
    const value = store.formValues[varName]
    if (!value || value.includes('{{') || value.includes('}}')) continue
    let idx = 0
    while ((idx = text.indexOf(value, idx)) !== -1) {
      // Skip if this occurrence is inside {{ ... }} (it's template syntax, not a rendered value)
      const before = text.substring(0, idx)
      const lastOpen = before.lastIndexOf('{{')
      const lastClose = before.lastIndexOf('}}')
      if (lastOpen <= lastClose) {
        const startPos = model.getPositionAt(idx)
        const endPos = model.getPositionAt(idx + value.length)
        newDecorations.push({
          range: new monaco.Range(
            startPos.lineNumber, startPos.column,
            endPos.lineNumber, endPos.column
          ),
          options: {
            className: 'highlight-green',
          },
        })
      }
      idx += value.length
    }
  }

  decorations.value = editor.deltaDecorations(decorations.value, newDecorations)
}
</script>

<template>
  <div class="preview-panel">
    <div class="panel-topbar">
      <span class="panel-header">Preview</span>
      <button class="btn-copy" @click="navigator.clipboard.writeText(store.renderedOutput)">
        Copy
      </button>
    </div>
    <div ref="container" class="editor-container" />
  </div>
</template>

<style scoped>
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}
.panel-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #333;
  background: #1e1e1e;
}
.panel-header {
  font-size: 15px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.btn-copy {
  background: #333;
  color: #ccc;
  border: 1px solid #555;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.btn-copy:hover { background: #444; }
.editor-container {
  flex: 1;
  min-height: 0;
}
</style>

<style>
.highlight-red { background-color: rgba(244,71,71,0.35); }
.highlight-green { background-color: rgba(76,175,80,0.35); }
</style>
