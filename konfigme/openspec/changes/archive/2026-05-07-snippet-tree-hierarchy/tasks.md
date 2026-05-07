## 1. Data Layer Upgrade

- [x] 1.1 Rewrite `src/utils/snippetLibrary.js` — replace `builtInSnippets[]` with `snippetTree` object (Huawei CE/S/USG, H3C S, Cisco Nexus)
- [x] 1.2 Remove `seedIfEmpty()` from `src/utils/snippetDb.js` — tree is hardcoded, no seeding needed

## 2. Store: Vendor/Series Navigation

- [x] 2.1 Add `currentVendor`, `currentSeries`, `snippetTree` to `snippetStore` reactive state
- [x] 2.2 Add computed `availableSeries` (series list for current vendor) and `availableTreeSnippets` (snippets for current vendor+series)
- [x] 2.3 Add `setVendor(vendor)` and `setSeries(series)` actions that also auto-clear the downstream field (set vendor clears series, set series triggers tree-snippet refresh)

## 3. Store: Composite Key Resolution

- [x] 3.1 Rewrite `updateCombinedTemplate()` to resolve content by key type: `tree::*` prefix → `snippetTree` lookup, numeric → IndexedDB lookup
- [x] 3.2 Rewrite `toggleSnippet()` to accept composite keys (tree string keys or numeric IDs)

## 4. Store: Navigation Watch & Clear All

- [x] 4.1 Add watch on `[currentVendor, currentSeries]` that removes all `tree::*` prefixed keys from `selectedIds` but preserves numeric user snippet keys
- [x] 4.2 Add `clearAllFormValues()` action that resets all form values to empty strings and clears validation errors
- [x] 4.3 Ensure form values are never cleared on vendor/series change (verify existing behavior)

## 5. SnippetSelector UI: Dropdowns

- [x] 5.1 Add Vendor dropdown (traverses `Object.keys(snippetTree)`) at top of snippet panel
- [x] 5.2 Add Series dropdown (computed from selected vendor) below vendor dropdown
- [x] 5.3 Disable series dropdown when no vendor is selected

## 6. SnippetSelector UI: Split Tree/User Sections

- [x] 6.1 Render tree snippets (from `availableTreeSnippets` computed) as checkbox list in upper section, without edit/delete icons
- [x] 6.2 Add horizontal divider with "My Custom Snippets" label
- [x] 6.3 Render user snippets below divider with full action icons (edit, delete) — same as current behavior
- [x] 6.4 Ensure tree snippet selection uses composite key format (`tree::vendor::series::name`)

## 7. DynamicForm: Clear All Button

- [x] 7.1 Add Clear All button (🧹 icon) in Variables panel header, aligned to the right
- [x] 7.2 Wire button to `clearAllFormValues()` action

## 8. Cleanup & Edge Cases

- [x] 8.1 Remove `initSnippetStore()` seeding call — replace with direct `refreshSnippetList()` for user snippets only
- [x] 8.2 Handle empty state when no vendor is selected (show hint "Select a vendor to browse snippets")
- [x] 8.3 Handle empty user snippets section (show hint "Upload a snippet to get started")
- [x] 8.4 Verify build passes with no regressions in template mode
