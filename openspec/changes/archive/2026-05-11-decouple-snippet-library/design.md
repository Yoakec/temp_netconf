## Context

`snippetLibrary.js` exports a single `snippetTree` object consumed by `snippetStore.js`. The tree shape is:

```
{ vendorName: { seriesName: { snippetName: contentString } } }
```

This refactoring preserves the exact same export shape while moving the data into per-series JSON files assembled by a `glob`-based index.

## Goals / Non-Goals

**Goals:**
- Split snippet data into per-vendor/per-series JSON files
- Use `import.meta.glob` for zero-config auto-discovery of new files
- Keep vendor/series display names in a map dictionary (English file paths → Chinese UI names)
- One-line import path change in `snippetStore.js`, zero other code changes

**Non-Goals:**
- No change to snippet data content (same templates)
- No change to store logic, components, or UI
- No runtime file system access — `import.meta.glob` is build-time only

## Decisions

### 1. Per-series JSON files (not per-vendor, not per-snippet)

One JSON = one series = `{ "snippetName": "content" }`. This is the natural granularity — each file is a self-contained series worth of snippets.

### 2. `import.meta.glob` with `{ eager: true }`

```js
const jsonModules = import.meta.glob('./*/*.json', { eager: true })
```

Pattern `./*/*.json` matches `./<vendor>/<series>.json`. `eager: true` imports all files at build time (not lazy). Vite statically analyzes the glob and bundles matched files.

### 3. Dictionary mapping for UI names

```js
const vendorMap = { 'huawei': '华为 (Huawei)', 'h3c': '华三 (H3C)', 'cisco': '思科 (Cisco)' }
const seriesMap = { 'ce-vrp8': 'CE系列 (VRP8)', 's-vrp5': 'S系列 (VRP5)', ... }
```

English kebab-case file/dir names → Chinese UI names. Unmapped paths fall back to raw names (future-proof). Maps are in `index.js`, co-located with the data.

### 4. JSON format — standard strings with `\n`

Snippet content uses escaped newlines in JSON. Standard, portable, no template literals. Any JSON generator can produce these files.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| JSON strings with `\n` are less readable than JS template literals | Harder to manually edit | Trade-off accepted; JSON tooling (generators, editors) handles this |
| `import.meta.glob` pattern may miss deeply nested files | New vendor requires `vendor/series.json` structure — pattern `./*/*.json` covers exactly this | Document the convention |
| Build-time glob — files added after build not detected | Dev server auto-reloads on file changes; production builds include all files at build time | Expected behavior |
