<script setup>
import { onMounted } from 'vue'
import TemplateManager from './components/TemplateManager.vue'
import DynamicForm from './components/DynamicForm.vue'
import MonacoPreview from './components/MonacoPreview.vue'
import { refreshTemplateList } from './stores/templateStore.js'

onMounted(() => {
  refreshTemplateList()
})
</script>

<template>
  <TemplateManager />
  <div class="main-area">
    <DynamicForm />
    <MonacoPreview />
  </div>
</template>

<style scoped>
.main-area {
  flex: 1;
  display: flex;
  min-height: 0;
}
</style>
