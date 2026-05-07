<script setup>
import { ref, onMounted } from 'vue'
import { snippetStore, initSnippetStore, toggleSnippet, uploadSnippet, removeSnippet } from '../stores/snippetStore.js'

const uploadError = ref('')
const isDragOver = ref(false)
const showDeleteConfirm = ref(false)
const pendingDeleteId = ref(null)
const validExtensions = ['.j2', '.txt']

const emit = defineEmits(['edit-snippet'])

onMounted(async () => {
  await initSnippetStore()
})

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  processFile(file)
}

function handleDrop(event) {
  event.preventDefault()
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (!file) return
  processFile(file)
}

function handleDragOver(event) {
  event.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function processFile(file) {
  uploadError.value = ''
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!validExtensions.includes(ext)) {
    uploadError.value = `Unsupported file type: ${file.name}. Please use .j2 or .txt files.`
    return
  }
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      await uploadSnippet(file.name, e.target.result)
    } catch (err) {
      uploadError.value = err.message
    }
  }
  reader.readAsText(file)
}

function confirmDelete(id) {
  showDeleteConfirm.value = true
  pendingDeleteId.value = id
}

async function doDelete() {
  if (pendingDeleteId.value != null) {
    await removeSnippet(pendingDeleteId.value)
  }
  showDeleteConfirm.value = false
  pendingDeleteId.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  pendingDeleteId.value = null
}

function isSelected(id) {
  return snippetStore.selectedIds.has(id)
}

function categoryBadge(cat) {
  return cat === 'built-in' ? 'Built-in' : 'User'
}
</script>

<template>
  <aside class="snippet-panel">
    <div class="panel-header">
      <span class="header-label">Snippets</span>
      <span v-if="snippetStore.snippets.length" class="count-badge">{{ snippetStore.snippets.length }}</span>
    </div>

    <p v-if="!snippetStore.snippets.length" class="empty-state">
      <span class="empty-text">No snippets yet. Upload one to get started.</span>
    </p>

    <div class="snippet-list">
      <label
        v-for="snip in snippetStore.snippets"
        :key="snip.id"
        class="snippet-item"
        :class="{ checked: isSelected(snip.id) }"
      >
        <input
          type="checkbox"
          :checked="isSelected(snip.id)"
          class="snippet-checkbox"
          @change="toggleSnippet(snip.id)"
        />
        <div class="snippet-info">
          <span class="snippet-name">{{ snip.name }}</span>
          <span class="snippet-category" :class="snip.category">{{ categoryBadge(snip.category) }}</span>
        </div>
        <div class="snippet-actions">
          <button class="icon-btn" title="Edit" @click.prevent="emit('edit-snippet', snip)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="icon-btn icon-btn-danger" title="Delete" @click.prevent="confirmDelete(snip.id)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </label>
    </div>

    <div class="upload-area">
      <div
        class="upload-zone"
        :class="{ 'drag-over': isDragOver }"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
      >
        <label class="btn btn-upload">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="btn-icon">
            <path d="M7 2v7M4 4.5L7 2l3 2.5M2.5 9v2a1 1 0 001 1h7a1 1 0 001-1V9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          New Snippet
          <input type="file" accept=".j2,.txt" hidden @change="handleFileSelect" />
        </label>
        <span class="drop-hint">or drop .j2 / .txt</span>
      </div>
      <p v-if="uploadError" class="error-msg">{{ uploadError }}</p>
    </div>

    <!-- Delete confirmation -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal">
        <p class="modal-text">Delete this snippet?</p>
        <p class="modal-sub">This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
          <button class="btn btn-danger" @click="doDelete">Delete</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.snippet-panel {
  width: 240px;
  min-width: 220px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px;
  border-bottom: 1px solid var(--border-default);
  flex-shrink: 0;
}

.header-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text-muted);
}

.count-badge {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-field);
  padding: 2px 8px;
  border-radius: 10px;
}

.empty-state {
  padding: 24px 14px;
  margin: 0;
  text-align: center;
}

.empty-text {
  color: var(--text-muted);
  font-size: 12.5px;
}

.snippet-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.snippet-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.snippet-item:hover {
  background: var(--bg-hover);
}

.snippet-item.checked {
  background: var(--accent-soft);
}

.snippet-checkbox {
  appearance: none;
  width: 15px;
  height: 15px;
  border: 1.5px solid var(--border-strong);
  border-radius: 3px;
  background: var(--bg-field);
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  position: relative;
}

.snippet-checkbox:checked {
  background: var(--accent);
  border-color: var(--accent);
}

.snippet-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #0a0a0c;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.snippet-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.snippet-name {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.snippet-category {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  width: fit-content;
  font-weight: 500;
}

.snippet-category.built-in {
  background: rgba(138, 180, 248, 0.12);
  color: var(--info);
}

.snippet-category.user {
  background: rgba(212, 136, 15, 0.12);
  color: var(--accent);
}

.snippet-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.snippet-item:hover .snippet-actions {
  opacity: 1;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  background: var(--bg-field);
  color: var(--text-primary);
}

.icon-btn-danger:hover {
  color: var(--danger);
  background: var(--danger-soft);
}

/* Upload area */
.upload-area {
  padding: 10px 10px 14px;
  border-top: 1px solid var(--border-default);
  flex-shrink: 0;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-default);
  transition: all var(--transition-smooth);
}

.upload-zone.drag-over {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: 0 0 12px var(--accent-glow);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-icon {
  flex-shrink: 0;
}

.btn-upload {
  background: var(--accent);
  color: #0a0a0c;
  border-color: var(--accent);
  font-weight: 600;
  font-size: 11.5px;
}

.btn-upload:hover {
  background: #e09a18;
  box-shadow: 0 0 10px var(--accent-glow);
}

.drop-hint {
  color: var(--text-muted);
  font-size: 10.5px;
  font-family: var(--font-mono);
}

.error-msg {
  color: var(--danger);
  font-size: 11px;
  margin: 6px 0 0;
}

/* Modal (scoped to this panel) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  min-width: 320px;
  text-align: center;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 24px 48px rgba(0,0,0,0.5);
}

.modal-text {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.modal-sub {
  margin: 0 0 20px;
  color: var(--text-muted);
  font-size: 12.5px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
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

.btn-danger {
  background: var(--danger);
  color: #fff;
  border-color: var(--danger);
}

.btn-danger:hover {
  background: #f15b4e;
}
</style>
