<script setup>
import { ref } from 'vue'
import SnippetSelector from './SnippetSelector.vue'
import SnippetDynamicForm from './SnippetDynamicForm.vue'
import SnippetMonacoPreview from './SnippetMonacoPreview.vue'
import SnippetEditModal from './SnippetEditModal.vue'

const editingSnippet = ref(null)

function openEditor(snippet) {
  editingSnippet.value = snippet
}

function closeEditor() {
  editingSnippet.value = null
}
</script>

<template>
  <SnippetSelector @edit-snippet="openEditor" />
  <SnippetDynamicForm />
  <SnippetMonacoPreview />
  <SnippetEditModal :snippet="editingSnippet" @close="closeEditor" />
</template>
