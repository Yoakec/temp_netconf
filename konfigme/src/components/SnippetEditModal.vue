<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import { editSnippet } from '../stores/snippetStore.js'
import { appStore } from '../stores/appStore.js'

const props = defineProps({
  snippet: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const container = ref(null)
const snippetName = ref('')
let editor = null

watch(() => props.snippet, async (snip) => {
  if (!snip) {
    if (editor) {
      editor.dispose()
      editor = null
    }
    return
  }
  snippetName.value = snip.name
  await nextTick()
  if (!editor && container.value) {
    editor = monaco.editor.create(container.value, {
      value: snip.content,
      language: 'plaintext',
      theme: appStore.theme === 'dark' ? 'vs-dark' : 'vs',
      minimap: { enabled: false },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      fontFamily: "'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontSize: 13,
      lineHeight: 22,
      padding: { top: 12, bottom: 12 },
    })
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (editor) editor.dispose()
})

watch(() => appStore.theme, (t) => {
  if (editor) monaco.editor.setTheme(t === 'dark' ? 'vs-dark' : 'vs')
})

async function handleSave() {
  if (!props.snippet || !editor) return
  await editSnippet(props.snippet.id, snippetName.value, editor.getValue())
  emit('close')
}

function handleCancel() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="snippet" class="modal-overlay" @click.self="handleCancel">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">Edit Snippet</span>
          <button class="close-btn" @click="handleCancel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <label class="field-label">
            <span>Name</span>
            <input
              v-model="snippetName"
              class="name-input"
              placeholder="Snippet name"
              spellcheck="false"
            />
          </label>
          <div ref="container" class="editor-container" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="handleCancel">Cancel</button>
          <button class="btn btn-primary" @click="handleSave">Save Changes</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 150ms ease;
}

.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  width: 720px;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.5);
  animation: modalIn 180ms ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-default);
}

.modal-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  gap: 12px;
  min-height: 0;
}

.field-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}

.name-input {
  background: var(--bg-field);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--font-mono);
  transition: border-color var(--transition-fast);
}

.name-input:focus {
  outline: none;
  border-color: var(--border-accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.editor-container {
  flex: 1;
  min-height: 320px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--border-default);
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 7px 18px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}

.btn-secondary {
  background: var(--bg-field);
  color: var(--text-secondary);
  border-color: var(--border-default);
}

.btn-secondary:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-primary {
  background: var(--accent);
  color: #0a0a0c;
  font-weight: 600;
}

.btn-primary:hover {
  background: #e09a18;
  box-shadow: 0 0 12px var(--accent-glow);
}

@keyframes fadeIn {
  from { opacity: 0; }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.96) translateY(-12px); }
}
</style>
