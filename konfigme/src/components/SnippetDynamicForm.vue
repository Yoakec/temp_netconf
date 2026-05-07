<script setup>
import { snippetStore, updateSnippetFormValue, clearAllFormValues } from '../stores/snippetStore.js'
</script>

<template>
  <aside class="form-panel">
    <div class="panel-header">
      <span class="header-label">Variables</span>
      <div class="header-right">
        <button
          v-if="snippetStore.variables.length"
          class="clear-btn"
          title="Clear all values"
          @click="clearAllFormValues"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span v-if="snippetStore.variables.length" class="var-count">{{ snippetStore.variables.length }}</span>
      </div>
    </div>

    <p v-if="!snippetStore.selectedIds.size" class="empty-state">
      <span class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM17 13h.01M21 13h.01M17 17h.01M21 17h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="empty-text">Select snippets to begin</span>
    </p>

    <p v-else-if="!snippetStore.variables.length" class="empty-state">
      <span class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="empty-text">No variables in selected snippets</span>
    </p>

    <TransitionGroup v-else name="field-list" tag="div" class="field-list">
      <div v-for="v in snippetStore.variables" :key="v" class="field-card">
        <label :for="'snip-var-' + v" class="field-label">
          <span class="indicator" :class="snippetStore.formValues[v] ? 'filled' : 'empty'" />
          <span class="var-name">{{ v }}</span>
        </label>
        <input
          :id="'snip-var-' + v"
          :value="snippetStore.formValues[v] ?? ''"
          :class="['field-input', { 'has-error': snippetStore.validationErrors[v] }]"
          :placeholder="snippetStore.validationErrors[v] || 'Enter value…'"
          @input="updateSnippetFormValue(v, $event.target.value)"
          spellcheck="false"
          autocomplete="off"
        />
        <span v-if="snippetStore.validationErrors[v]" class="error-msg">
          {{ snippetStore.validationErrors[v] }}
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

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-btn {
  background: none;
  border: 1px solid var(--border-default);
  color: var(--text-muted);
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: var(--danger-soft);
  border-color: var(--danger);
  color: var(--danger);
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

.indicator.empty { background: var(--border-strong); }

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

.field-list-enter-active {
  transition: all 300ms ease;
}
.field-list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
