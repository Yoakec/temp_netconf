<script setup>
import { ref } from 'vue'
import { store, refreshTemplateList, loadTemplate, uploadTemplate, removeTemplate } from '../stores/templateStore.js'

const showDeleteConfirm = ref(false)
const pendingDeleteId = ref(null)
const uploadError = ref('')
const isDragOver = ref(false)

const validExtensions = ['.j2', '.txt']

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
      await uploadTemplate(file.name, e.target.result)
    } catch (err) {
      uploadError.value = err.message
    }
  }
  reader.readAsText(file)
}

function onSelectTemplate(event) {
  const id = Number(event.target.value)
  if (id) loadTemplate(id)
}

function confirmDelete() {
  showDeleteConfirm.value = true
  pendingDeleteId.value = store.activeTemplateId
}

async function doDelete() {
  if (pendingDeleteId.value != null) {
    await removeTemplate(pendingDeleteId.value)
  }
  showDeleteConfirm.value = false
  pendingDeleteId.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  pendingDeleteId.value = null
}
</script>

<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <span class="app-title">KonfigMe</span>
      <div class="divider" />
      <div class="select-wrapper">
        <select
          class="template-select"
          :value="store.activeTemplateId ?? ''"
          @change="onSelectTemplate"
        >
          <option value="" disabled>Select a template…</option>
          <option v-for="tpl in store.templates" :key="tpl.id" :value="tpl.id">
            {{ tpl.name }}
          </option>
        </select>
        <svg class="select-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <button
        v-if="store.activeTemplateId"
        class="btn btn-danger"
        @click="confirmDelete"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="btn-icon">
          <path d="M2.5 4.5h9M5.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M3.5 4.5l.5 7.5a1 1 0 001 1h4a1 1 0 001-1l.5-7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Delete
      </button>
    </div>

    <div class="toolbar-right">
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
          Upload Template
          <input type="file" accept=".j2,.txt" hidden @change="handleFileSelect" />
        </label>
        <span class="drop-hint">or drop .j2 / .txt</span>
      </div>
    </div>

    <p v-if="uploadError" class="error-banner">{{ uploadError }}</p>
  </header>

  <Teleport to="body">
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal">
        <div class="modal-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ea4335" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="modal-text">Delete this template permanently?</p>
        <p class="modal-sub">This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
          <button class="btn btn-danger" @click="doDelete">Delete</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 20px;
  background: var(--bg-surface);
  position: relative;
}

.toolbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-accent), transparent);
  opacity: 0.3;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  user-select: none;
}

.app-title::first-letter {
  color: var(--accent);
}

.divider {
  width: 1px;
  height: 22px;
  background: var(--border-default);
  border-radius: 0.5px;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.template-select {
  appearance: none;
  background: var(--bg-field);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  padding: 7px 32px 7px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--font-mono);
  min-width: 220px;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.template-select:hover {
  border-color: var(--border-strong);
}

.template-select:focus {
  border-color: var(--border-accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
  outline: none;
}

.template-select option {
  background: var(--bg-elevated);
  color: var(--text-primary);
  padding: 8px;
}

.select-chevron {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: var(--text-muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  white-space: nowrap;
  letter-spacing: 0.1px;
}

.btn-icon {
  flex-shrink: 0;
  opacity: 0.85;
}

.btn-upload {
  background: var(--accent);
  color: #0a0a0c;
  border-color: var(--accent);
  font-weight: 600;
}
.btn-upload:hover {
  background: #e09a18;
  box-shadow: 0 0 12px var(--accent-glow);
}

.btn-danger {
  background: transparent;
  color: var(--danger);
  border-color: var(--border-default);
}
.btn-danger:hover {
  background: var(--danger-soft);
  border-color: var(--danger);
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

.upload-zone {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px 5px 5px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-default);
  transition: all var(--transition-smooth);
}

.upload-zone.drag-over {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: 0 0 16px var(--accent-glow);
}

.drop-hint {
  color: var(--text-muted);
  font-size: 11.5px;
  user-select: none;
  font-family: var(--font-mono);
  letter-spacing: 0.2px;
}

.error-banner {
  width: 100%;
  margin: 0;
  padding: 8px 14px;
  background: var(--danger-soft);
  border: 1px solid rgba(234, 67, 53, 0.25);
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: 12.5px;
  font-family: var(--font-mono);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 150ms ease;
}

.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  min-width: 360px;
  text-align: center;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.03),
    0 24px 48px rgba(0,0,0,0.5);
  animation: modalIn 180ms ease;
}

.modal-icon {
  margin-bottom: 14px;
}

.modal-text {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.modal-sub {
  margin: 0 0 22px;
  color: var(--text-muted);
  font-size: 12.5px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-actions .btn {
  padding: 8px 22px;
  font-size: 13px;
}

.modal-actions .btn-danger {
  background: var(--danger);
  color: #fff;
  border-color: var(--danger);
}
.modal-actions .btn-danger:hover {
  background: #f15b4e;
}

@keyframes fadeIn {
  from { opacity: 0; }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
}
</style>
