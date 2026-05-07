## 1. Snippet Data Layer

- [x] 1.1 Create `src/utils/snippetDb.js` with IndexedDB CRUD for `snippets` object store (id autoIncrement, name unique index, content, category, createdAt, updatedAt)
- [x] 1.2 Add `seedIfEmpty()` function that checks for empty store and populates from snippetLibrary
- [x] 1.3 Create `src/utils/snippetLibrary.js` with 5 built-in snippet definitions (Base_Config, BGP_Config, M-LAG_Config, ACL_Config, SNMP_Config)

## 2. Snippet Reactive Store

- [x] 2.1 Create `src/stores/snippetStore.js` with reactive state: snippets, selectedIds (Set), combinedTemplate, variables, formValues, validationErrors, renderedOutput
- [x] 2.2 Implement `loadSnippets()` and `refreshSnippetList()` actions
- [x] 2.3 Implement `toggleSnippet(id)` action that adds/removes from selectedIds
- [x] 2.4 Implement `updateSnippetFormValue(varName, value)` with `{{` `}}` validation
- [x] 2.5 Implement reactive pipeline: watch selectedIds → computed combinedTemplate → watch combinedTemplate → parseVariables → watch formValues + combinedTemplate → debounced render
- [x] 2.6 Implement `uploadSnippet(name, content)`, `updateSnippet(id, name, content)`, `removeSnippet(id)` actions

## 3. App Mode Routing

- [x] 3.1 Create `src/stores/appStore.js` with reactive `mode: 'template' | 'snippet'`
- [x] 3.2 Create `src/components/TemplateWorkspace.vue` wrapper composing existing DynamicForm + MonacoPreview
- [x] 3.3 Update `src/App.vue` to conditionally render TemplateWorkspace or SnippetWorkspace based on appStore.mode

## 4. Snippet Selector Component

- [x] 4.1 Create `src/components/SnippetSelector.vue` with checkbox list of all snippets, category badges, edit/delete action icons
- [x] 4.2 Implement "New Snippet" upload (file picker + drag-drop, same UX as template upload, saves to snippets store)
- [x] 4.3 Implement delete snippet with confirmation dialog

## 5. Snippet Edit Modal

- [x] 5.1 Create `src/components/SnippetEditModal.vue` with editable Monaco Editor pre-filled with snippet content
- [x] 5.2 Implement save (update IndexedDB + refresh pipeline) and cancel actions
- [x] 5.3 Add modal open/close animation

## 6. Snippet Form and Preview

- [x] 6.1 Create `src/components/SnippetDynamicForm.vue` reading from snippetStore (variables, formValues, validationErrors), calling snippetUpdateFormValue
- [x] 6.2 Add empty state messaging ("Select snippets to begin" vs "No variables in selected snippets")
- [x] 6.3 Create `src/components/SnippetMonacoPreview.vue` with read-only Monaco Editor, watching snippetStore.renderedOutput
- [x] 6.4 Implement red/green deltaDecorations for unfilled placeholders and filled values (reuse same pattern as MonacoPreview)
- [x] 6.5 Add copy-to-clipboard button for rendered output

## 7. Snippet Workspace Layout

- [x] 7.1 Create `src/components/SnippetWorkspace.vue` with three-column layout: SnippetSelector | SnippetDynamicForm | SnippetMonacoPreview
- [x] 7.2 Apply consistent dark theme styling (CSS variables from existing design system)

## 8. Toolbar Mode Tabs

- [x] 8.1 Update `src/components/TemplateManager.vue` to add mode toggle tabs ("Template File" | "Snippet Builder")
- [x] 8.2 Show mode-appropriate toolbar actions: template controls when Template mode, snippet controls when Snippet mode
- [x] 8.3 Wire mode toggle to appStore.mode

## 9. Built-in Seed & Edge Cases

- [x] 9.1 Trigger `seedIfEmpty()` on first entry to Snippet mode
- [x] 9.2 Handle empty snippet list state (no snippets exist)
- [x] 9.3 Handle no-snippets-selected state in form and preview panels
- [x] 9.4 Verify form values persist across snippet toggle (uncheck → recheck restores value)
- [x] 9.5 Test mode switching preserves state in both directions
