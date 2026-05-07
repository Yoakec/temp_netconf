## Why

The current flat snippet list treats all snippets equally — a single scrollable checkbox list. Network engineers think in Vendor → Series → Snippet hierarchies. A Huawei CE switch has different config blocks than a Cisco Nexus. Without hierarchy, users must mentally filter through an undifferentiated list. Adding Vendor/Series navigation makes the library browsable and prevents cross-vendor config contamination.

## What Changes

- Replace the flat `builtInSnippets[]` array in `snippetLibrary.js` with a three-level `snippetTree` object: Vendor → Series → { snippetName: templateContent }
- Add two cascading dropdowns (Vendor, Series) to `SnippetSelector.vue` that filter which tree snippets are shown
- Introduce composite keys for tree snippets (`"tree::vendor::series::name"`) alongside numeric IDs for user snippets — both coexist in `selectedIds`
- Add a watch on vendor/series change that clears only tree snippet selections, not user snippets, and never clears form values
- Add a "Clear All" button to the Variables panel header so users can explicitly reset form values
- Split the snippet list UI: tree snippets (read-only, no action icons) above a divider, "My Custom Snippets" (mutable, with edit/delete) below
- Remove `seedIfEmpty()` from snippetDb — the tree is hardcoded, no seeding needed

## Capabilities

### New Capabilities

- `tree-navigation`: cascading Vendor → Series dropdowns that filter the available snippet list. built-in tree is hardcoded and read-only, rendered without edit/delete controls. vendor/series change clears only tree selections from `selectedIds`.

### Modified Capabilities

- `snippet-management`: data model upgraded from flat array to Tree+Flat hybrid. built-in snippets live in hardcoded `snippetTree` JS object instead of being seeded into IndexedDB. user-created snippets remain in IndexedDB. composite keys (`tree::` prefix for tree, numeric ID for user) unify selection across both sources.
- `snippet-assembly`: `updateCombinedTemplate()` resolves content by composite key prefix — `tree::` keys look up from `snippetTree`, numeric keys from IndexedDB. vendor/series watcher clears tree-keyed selections only, not user snippets or form values. form value persistence is explicitly preserved across vendor/series changes.

## Impact

- **Modified files**: `snippetLibrary.js` (tree object), `snippetDb.js` (remove seedIfEmpty), `snippetStore.js` (vendor/series state, composite key resolution, watcher), `SnippetSelector.vue` (dropdowns, split UI), `SnippetDynamicForm.vue` (Clear All button)
- **Unchanged**: `SnippetWorkspace.vue`, `SnippetMonacoPreview.vue`, `SnippetEditModal.vue`, `TemplateManager.vue`, template mode entirely
- **No new npm dependencies**
- **No breaking changes to template mode**
