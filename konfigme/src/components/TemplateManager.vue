<script setup>
import { ref } from 'vue'
import { store, refreshTemplateList, loadTemplate, uploadTemplate, removeTemplate } from '../stores/templateStore.js'

const showDeleteConfirm = ref(false)
const pendingDeleteId = ref(null)
const uploadError = ref('')

const validExtensions = ['.j2', '.txt']

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  processFile(file)
}

function handleDrop(event) {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (!file) return
  processFile(file)
}

function handleDragOver(event) {
  event.preventDefault()
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
  <div class="template-manager">
    <div class="toolbar-left">
      <label class="app-title">KonfigMe</label>
      <select
        class="template-select"
        :value="store.activeTemplateId ?? ''"
        @change="onSelectTemplate"
      >
        <option value="" disabled>-- Select a template --</option>
        <option v-for="tpl in store.templates" :key="tpl.id" :value="tpl.id">
          {{ tpl.name }}
        </option>
      </select>
      <button
        v-if="store.activeTemplateId"
        class="btn btn-delete"
        @click="confirmDelete"
      >
        Delete
      </button>
    </div>
    <div class="toolbar-right">
      <div
        class="upload-zone"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <label class="btn btn-upload">
          Upload Template
          <input type="file" accept=".j2,.txt" hidden @change="handleFileSelect" />
        </label>
        <span class="drop-hint">or drop .j2/.txt file here</span>
      </div>
    </div>
    <p v-if="uploadError" class="error-msg">{{ uploadError }}</p>
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal">
        <p>Delete this template permanently?</p>
        <div class="modal-actions">
          <button class="btn btn-delete" @click="doDelete">Delete</button>
          <button class="btn" @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-manager {
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  background: #1e1e1e;
}
.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.template-manager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.app-title {
  font-size: 18px;
  font-weight: 700;
  color: #4fc3f7;
  letter-spacing: 1px;
}
.template-select {
  background: #2d2d2d;
  color: #ccc;
  border: 1px solid #444;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}
.btn {
  background: #333;
  color: #ccc;
  border: 1px solid #555;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn:hover { background: #444; }
.btn-upload {
  background: #0e639c;
  border-color: #0e639c;
  color: #fff;
  display: inline-block;
}
.btn-upload:hover { background: #1177bb; }
.btn-delete { background: #a33; border-color: #a33; color: #fff; }
.btn-delete:hover { background: #c44; }
.upload-zone {
  display: flex;
  align-items: center;
  gap: 8px;
}
.drop-hint {
  color: #666;
  font-size: 12px;
}
.error-msg {
  color: #f44747;
  font-size: 13px;
  margin-top: 6px;
  width: 100%;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #252526;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 24px;
  min-width: 300px;
}
.modal p { margin: 0 0 16px; color: #ccc; }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
</style>
