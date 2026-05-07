<script setup>
import { ref, watch, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as monaco from 'monaco-editor'
import { snippetStore } from '../stores/snippetStore.js'

const container = ref(null)
let editor = null
const decorations = shallowRef([])
const copied = ref(false)
let copyTimer = null

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
    fontFamily: "'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSize: 13,
    lineHeight: 22,
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: 'none',
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    occurrencesHighlight: 'off',
    selectionHighlight: false,
    guides: { indentation: false },
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
  })
  applyDecorations()
})

onBeforeUnmount(() => {
  if (editor) editor.dispose()
  if (copyTimer) clearTimeout(copyTimer)
})

watch(() => snippetStore.renderedOutput, (newVal) => {
  if (!editor) return
  const model = editor.getModel()
  if (!model) return
  model.setValue(newVal)
  applyDecorations()
})

function applyDecorations() {
  if (!editor) return
  const text = snippetStore.renderedOutput
  if (!text) {
    decorations.value = editor.deltaDecorations(decorations.value, [])
    return
  }

  const newDecorations = []
  const model = editor.getModel()

  const redRegex = /{{\s*\w+\s*}}/g
  let match
  while ((match = redRegex.exec(text)) !== null) {
    const startPos = model.getPositionAt(match.index)
    const endPos = model.getPositionAt(match.index + match[0].length)
    newDecorations.push({
      range: new monaco.Range(
        startPos.lineNumber, startPos.column,
        endPos.lineNumber, endPos.column
      ),
      options: { className: 'highlight-red' },
    })
  }

  for (const varName of snippetStore.variables) {
    const value = snippetStore.formValues[varName]
    if (!value || value.includes('{{') || value.includes('}}')) continue
    let idx = 0
    while ((idx = text.indexOf(value, idx)) !== -1) {
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
          options: { className: 'highlight-green' },
        })
      }
      idx += value.length
    }
  }

  decorations.value = editor.deltaDecorations(decorations.value, newDecorations)
}

async function handleCopy() {
  if (!snippetStore.renderedOutput) return
  await navigator.clipboard.writeText(snippetStore.renderedOutput)
  copied.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copied.value = false }, 1800)
}
</script>

<template>
  <section class="preview-panel">
    <div class="panel-topbar">
      <span class="panel-label">Preview</span>
      <button class="copy-btn" :class="{ copied }" @click="handleCopy">
        <svg v-if="!copied" width="13" height="13" viewBox="0 0 24 24" fill="none" class="copy-icon">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" class="copy-icon">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <div ref="container" class="editor-container" />
  </section>
</template>

<style scoped>
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  background: var(--bg-root);
}

.panel-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-surface);
  flex-shrink: 0;
}

.panel-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text-muted);
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-field);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--border-strong);
}

.copy-btn.copied {
  color: var(--success);
  border-color: rgba(52, 168, 83, 0.3);
  background: var(--success-soft);
}

.copy-icon {
  flex-shrink: 0;
}

.editor-container {
  flex: 1;
  min-height: 0;
}
</style>

<style>
.highlight-red {
  background-color: rgba(234, 67, 53, 0.28);
  border-bottom: 2px solid rgba(234, 67, 53, 0.5);
}

.highlight-green {
  background-color: rgba(52, 168, 83, 0.22);
  border-bottom: 2px solid rgba(52, 168, 83, 0.4);
}
</style>
