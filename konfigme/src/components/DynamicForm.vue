<script setup>
import { store, updateFormValue } from '../stores/templateStore.js'
</script>

<template>
  <div class="form-panel">
    <h2 class="panel-header">Variables</h2>
    <p v-if="!store.variables.length" class="empty-msg">
      {{ store.activeTemplateId ? 'No variables found in template' : 'Upload a template to begin' }}
    </p>
    <div v-for="v in store.variables" :key="v" class="field">
      <label :for="'var-' + v" class="field-label">
        <span class="indicator" :class="store.formValues[v] ? 'filled' : 'unfilled'" />
        {{ v }}
      </label>
      <input
        :id="'var-' + v"
        :value="store.formValues[v] ?? ''"
        :class="['field-input', { 'input-error': store.validationErrors[v] }]"
        :placeholder="store.validationErrors[v] || 'Enter value...'"
        @input="updateFormValue(v, $event.target.value)"
      />
      <span v-if="store.validationErrors[v]" class="error-text">
        {{ store.validationErrors[v] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.form-panel {
  width: 320px;
  min-width: 280px;
  background: #1e1e1e;
  border-right: 1px solid #333;
  padding: 16px;
  overflow-y: auto;
  height: 100%;
}
.panel-header {
  font-size: 15px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
}
.empty-msg {
  color: #666;
  font-size: 14px;
}
.field {
  margin-bottom: 14px;
}
.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #ccc;
  margin-bottom: 4px;
  font-family: monospace;
}
.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.indicator.filled { background: #4caf50; }
.indicator.unfilled { background: #555; }
.field-input {
  width: 100%;
  box-sizing: border-box;
  background: #2d2d2d;
  border: 1px solid #444;
  color: #ddd;
  padding: 7px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-family: monospace;
}
.field-input:focus {
  outline: none;
  border-color: #4fc3f7;
}
.field-input.input-error {
  border-color: #f44747;
}
.error-text {
  display: block;
  color: #f44747;
  font-size: 11px;
  margin-top: 2px;
}
</style>
