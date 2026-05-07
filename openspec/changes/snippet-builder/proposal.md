## Why

Network engineers manage device configurations that share common building blocks (Base, BGP, M-LAG, ACL, SNMP). The current single-file template approach forces users to maintain separate copies of each config combination — a Base+BGP template, a Base+M-LAG template, etc. Users need to assemble templates from reusable blocks, like building with Lego bricks, without any server or backend.

## What Changes

- Add a "Snippet Builder" mode alongside the existing template file mode, toggled via tabs in the top toolbar
- Create a snippet library stored in IndexedDB (`snippets` object store), seeded with built-in defaults (Base_Config, BGP_Config, M-LAG_Config, ACL_Config, SNMP_Config) on first use
- Allow users to check/uncheck snippets to assemble a combined template; the reactive pipeline extracts variables, renders the form, and updates the preview automatically
- Support snippet CRUD: upload new snippets (same file picker + drag-drop as template mode), edit snippet content (Monaco Editor modal), delete snippets (confirmation dialog)
- Preserve form values when snippets are toggled off and on — user input survives module selection changes
- The snippet system is fully isolated from template mode: separate IndexedDB store, separate Vue reactive store, separate component tree

## Capabilities

### New Capabilities

- `snippet-management`: CRUD operations for reusable config snippets. store, retrieve, edit, and delete snippet text content in IndexedDB. seed built-in defaults on first run. support file upload (`.j2` / `.txt`) and in-app editing via Monaco Editor modal.
- `snippet-assembly`: checkbox-based snippet selection that drives a reactive pipeline — selected snippets are concatenated into a combined template, variables are extracted via regex, and the dynamic form + live preview update automatically. form values persist across snippet selection changes.
- `mode-routing`: toggle between existing Template File mode and new Snippet Builder mode via tabs in the top toolbar. each mode has its own isolated state, storage, and component tree.

### Modified Capabilities

None. The existing template mode (template-management, template-parsing, dynamic-form, real-time-preview, highlight-system) remains unchanged.

## Impact

- **New files**: `snippetStore.js`, `appStore.js`, `snippetDb.js`, `snippetLibrary.js`, `SnippetWorkspace.vue`, `SnippetSelector.vue`, `SnippetDynamicForm.vue`, `SnippetMonacoPreview.vue`, `SnippetEditModal.vue`, `TemplateWorkspace.vue`
- **Modified files**: `App.vue` (conditional workspace rendering), `TemplateManager.vue` (mode toggle tabs)
- **Unchanged**: All existing stores, components, and utilities — no regression risk
- **Shared dependencies**: `parser.js` (parseVariables), `renderer.js` (Nunjucks renderString) — pure functions, safe to reuse
- **No new npm dependencies**: Uses existing Vue 3, idb, monaco-editor, nunjucks
