<script setup>
import { onMounted } from 'vue'
import TemplateManager from './components/TemplateManager.vue'
import TemplateWorkspace from './components/TemplateWorkspace.vue'
import SnippetWorkspace from './components/SnippetWorkspace.vue'
import { appStore } from './stores/appStore.js'
import { refreshTemplateList } from './stores/templateStore.js'

onMounted(() => {
  refreshTemplateList()
})
</script>

<template>
  <TemplateManager />
  <div class="main-area">
    <TemplateWorkspace v-if="appStore.mode === 'template'" />
    <SnippetWorkspace v-else />
  </div>
</template>

<style scoped>
.main-area {
  flex: 1;
  display: flex;
  min-height: 0;
  border-top: 1px solid var(--border-default);
  background:
    linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-root) 100%);
}
</style>
