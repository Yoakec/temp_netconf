## Why

`snippetLibrary.js` is a 282-line monolithic JS file containing all vendor/series/snippets in one nested object. Adding a new vendor or series requires editing this file directly — error-prone and hard to automate. Splitting into per-series JSON files in a folder tree enables: (1) rapid snippet generation with any JSON tool, (2) auto-discovery via Vite's `import.meta.glob`, (3) zero-config addition of new vendors/series by dropping files into folders.

## What Changes

- Delete `utils/snippetLibrary.js`
- Create `utils/snippets/` directory with per-vendor subdirectories (huawei/, h3c/, cisco/)
- Create 5 per-series JSON files with snippet content
- Create `utils/snippets/index.js` using `import.meta.glob` + vendorMap/seriesMap to auto-assemble `snippetTree`
- Update `stores/snippetStore.js` import path: `'../utils/snippetLibrary.js'` → `'../utils/snippets/index.js'`

## Capabilities

### New Capabilities

None. This is a pure implementation refactoring — the exported `snippetTree` object shape is identical, all existing specs are unaffected.

### Modified Capabilities

None. No requirement-level behavior changes. The `snippet-management` and `tree-navigation` specs remain as-is.

## Impact

- **Modified**: `stores/snippetStore.js` (one import line)
- **Deleted**: `utils/snippetLibrary.js`
- **New**: `utils/snippets/index.js` + 5 JSON files
- **Unchanged**: All other files
