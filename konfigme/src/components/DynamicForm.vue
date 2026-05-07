<script setup>
import { store, updateFormValue } from '../stores/templateStore.js'
</script>

<template>
  <aside class="form-panel">
    <div class="panel-header">
      <span class="header-label">Variables</span>
      <span v-if="store.variables.length" class="var-count">{{ store.variables.length }}</span>
    </div>

    <p v-if="!store.variables.length" class="empty-state">
      <span class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="empty-text">{{ store.activeTemplateId ? 'No variables found in template' : 'Upload a template to begin' }}</span>
    </p>

    <TransitionGroup name="field-list" tag="div" class="field-list">
      <div v-for="v in store.variables" :key="v" class="field-card">
        <label :for="'var-' + v" class="field-label">
          <span class="indicator" :class="store.formValues[v] ? 'filled' : 'empty'" />
          <span class="var-name">{{ v }}</span>
        </label>
        <input
          :id="'var-' + v"
          :value="store.formValues[v] ?? ''"
          :class="['field-input', { 'has-error': store.validationErrors[v] }]"
          :placeholder="store.validationErrors[v] || 'Enter value…'"
          @input="updateFormValue(v, $event.target.value)"
          spellcheck="false"
          autocomplete="off"
        />
        <span v-if="store.validationErrors[v]" class="error-msg">
          {{ store.validationErrors[v] }}
        </span>
      </div>
    </TransitionGroup>
  </aside>
</template>

<style scoped>
.form-panel {
  width: 320px;
  min-width: 280px;
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
  padding: 14px 18px;
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

.var-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-field);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
  margin: 0;
}

.empty-icon {
  color: var(--text-muted);
  opacity: 0.4;
}

.empty-text {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.6;
}

.field-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.field-card:focus-within {
  border-color: var(--border-strong);
  box-shadow: 0 0 0 1px var(--border-strong);
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: default;
}

.var-name {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-secondary);
  font-weight: 500;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background var(--transition-smooth), box-shadow var(--transition-smooth);
}

.indicator.empty {
  background: var(--border-strong);
  box-shadow: 0 0 0 0 transparent;
}

.indicator.filled {
  background: var(--success);
  box-shadow: 0 0 6px rgba(52, 168, 83, 0.5);
}

.field-input {
  width: 100%;
  background: var(--bg-field);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--font-mono);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.field-input::placeholder {
  color: var(--text-muted);
  font-family: var(--font-ui);
  font-size: 12px;
}

.field-input:focus {
  outline: none;
  border-color: var(--border-accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.field-input.has-error {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px var(--danger-soft);
}

.error-msg {
  display: block;
  margin-top: 6px;
  color: var(--danger);
  font-size: 11px;
  font-family: var(--font-ui);
}

/* Transition */
.field-list-enter-active {
  transition: all 300ms ease;
}
.field-list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
