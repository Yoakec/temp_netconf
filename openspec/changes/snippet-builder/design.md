## Context

KonfigMe currently supports a single workflow: upload a `.j2`/`.txt` template file, fill in extracted variables, and preview the rendered output. Network engineers need to manage configs as composable blocks (Base, BGP, M-LAG, etc.) rather than monolithic files — assembling what they need by selecting blocks, like building with Lego.

The snippet builder is designed as a fully isolated second mode. No shared state, no shared IndexedDB store, no shared components beyond pure utility functions (`parser.js`, `renderer.js`). This avoids regression risk in the existing template mode and allows each mode to evolve independently.

## Goals / Non-Goals

**Goals:**
- Toggle between Template and Snippet modes via tabs in the toolbar
- Pre-seed the snippet library with common network config blocks on first use
- Checkbox-driven snippet selection that concatenates checked snippets into a combined template
- Reactive pipeline: selection → concatenation → variable extraction → form rendering → live preview
- Form values persist across snippet toggle (uncheck then re-check restores values)
- Full CRUD for snippets: upload (file/drag-drop), edit (Monaco modal), delete (confirmation)
- Complete isolation from template mode — separate store, DB, components

**Non-Goals:**
- No snippet reordering (drag-to-reorder) — v1 uses fixed display order
- No snippet categories or folders — flat list
- No export/import of snippet collections
- No cross-mode data sharing (template files cannot become snippets, and vice versa)
- No syntax validation of snippet content beyond the existing `{{` `}}` input guard

## Decisions

### 1. IndexedDB: separate `snippets` object store

Use the same `idb` wrapper and database name (`konfigme`), but a different object store (`snippets`). This keeps all data in one database for easier inspection while isolating template and snippet records.

Schema:
```
{ id: autoIncrement, name: string (unique index), content: string,
  category: 'built-in' | 'user', createdAt: timestamp, updatedAt: timestamp }
```

**Alternative considered**: Separate database. Rejected — `idb` handles multiple object stores cleanly, and a single DB is simpler to debug.

### 2. Seed built-in snippets on first run

On first load of snippet mode, check if the `snippets` store is empty. If so, seed from `snippetLibrary.js` with 5 blocks: Base_Config, BGP_Config, M-LAG_Config, ACL_Config, SNMP_Config. Marked `category: 'built-in'` so users can distinguish them from their own snippets.

**Alternative considered**: Ship a pre-populated IndexedDB. Rejected — IndexedDB is browser-specific and cannot be pre-shipped.

### 3. appStore for mode toggle

A minimal reactive singleton (`appStore.js`) with a single `mode` field: `'template'` | `'snippet'`. App.vue reads this to conditionally render `TemplateWorkspace` or `SnippetWorkspace`. TemplateManager reads/writes it for the tab toggle.

**Alternative considered**: Vue Router. Rejected — two-mode toggle doesn't warrant a full router dependency. A single reactive variable is sufficient.

### 4. TemplateWorkspace wrapper

Extract the existing `DynamicForm` + `MonacoPreview` pair into a `TemplateWorkspace.vue` wrapper. This is a zero-logic container — it just composes the two existing components. This keeps App.vue clean: `<TemplateWorkspace v-if="mode === 'template'" />`.

**Alternative considered**: Inline conditional in App.vue. Rejected — extracting a wrapper mirrors `SnippetWorkspace` and keeps App.vue readable.

### 5. Separate SnippetDynamicForm and SnippetMonacoPreview

Rather than refactoring the existing `DynamicForm.vue` and `MonacoPreview.vue` to be store-agnostic, create snippet-specific versions that import from `snippetStore.js`. This maintains full isolation — template components are unchanged, snippet components can diverge.

The snippet versions follow the same patterns:
- `SnippetDynamicForm`: reads `snippetStore.variables`, `snippetStore.formValues`, calls `snippetUpdateFormValue()`
- `SnippetMonacoPreview`: initializes Monaco read-only, watches `snippetStore.renderedOutput`, applies same red/green decorations

**Alternative considered**: Refactor existing components to accept a store prop. Rejected — breaks the isolation principle and risks regressions in the existing working template mode.

### 6. Snippet edit via Monaco modal

When user clicks edit on a snippet, open a `SnippetEditModal` with an editable Monaco Editor pre-filled with the snippet's raw content. On save, update IndexedDB and re-trigger the reactive pipeline.

**Alternative considered**: Inline expand in the selector panel. Rejected — cramped UX for potentially large config blocks. Modal provides full-screen editing space.

### 7. Reactive pipeline: watch chain

```js
// snippetStore.js core reactive flow
watch(selectedIds, () => {
  combinedTemplate = selected.map(id => getContent(id)).join('\n')
})

watch(combinedTemplate, () => {
  variables = parseVariables(combinedTemplate)
  // initialize new formValues keys to ''
})

watch([combinedTemplate, formValues], () => {
  debouncedRender()
})
```

Three watchers chained: selection → template → variables + render. Debounce (50ms) on render only, as in template mode.

**Alternative considered**: Vue computed for `combinedTemplate` and `variables`. Partially adopted — `combinedTemplate` can be computed, `variables` can be computed from `combinedTemplate`. But `renderedOutput` needs debounce, so a watcher is still needed. Using computed where possible reduces unnecessary recalculations.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicated component code (SnippetDynamicForm ~= DynamicForm) | Maintenance burden if both need same fix | Accept for v1; if divergence is low after stabilization, extract shared composable |
| IndexedDB `snippets` store schema may need migration later | Existing user data could break | Use versioned DB (`DB_VERSION` bump) if schema changes |
| Three-column layout too wide for small screens | Poor UX on narrow viewports | Target audience (network engineers) uses wide monitors; min-width on snippet selector panel |
| Monaco Editor modal for editing adds bundle size | Already bundled for preview, no additional cost | Reuse existing Monaco instance; modal creates a new editor instance which is lightweight |

## Open Questions

- Should snippets have a description or comment field for documentation? (v1: no)
- Should the snippet list show a preview of the template text on hover? (v1: no)
- Should deleting a built-in snippet be allowed? (v1: yes, treat built-in and user snippets equally after seeding)
