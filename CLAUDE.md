# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo Overview

KonfigMe — an offline-first browser tool for network engineers to fill Jinja2-style device configuration templates. Upload `.j2`/`.txt` templates, extract `{{ variable }}` placeholders into a dynamic form, and see live-rendered output.

## Dev Commands

All commands run from the `konfigme/` directory:

```bash
cd konfigme && npm run dev      # Start Vite dev server (host 0.0.0.0:5173)
cd konfigme && npm run build    # Production build
cd konfigme && npm run preview  # Preview production build locally
```

No test suite or linter is configured yet.

## Architecture

```
konfigme/src/
  main.js                     # Vue app entry point
  App.vue                     # Root layout: TemplateManager + DynamicForm + MonacoPreview
  components/
    TemplateManager.vue       # Upload (drag-drop/file-pick), select, delete templates
    DynamicForm.vue            # Renders input fields for each extracted {{ variable }}
    MonacoPreview.vue          # Read-only Monaco editor with red/green highlights
  stores/
    templateStore.js           # Central reactive state + actions (no Pinia)
  utils/
    db.js                      # IndexedDB via idb (save/getAll/get/delete template)
    parser.js                  # Regex extract {{ variable }} names from template text
    renderer.js                # Nunjucks renderString with no tags, no autoescape
```

### Data Flow

1. **Upload** → `TemplateManager` reads file, calls `uploadTemplate()` → saves to IndexedDB via `db.js`
2. **Select** → `loadTemplate()` → `parser.js` extracts variables → `renderer.js` renders with empty values
3. **Type** → `DynamicForm` calls `updateFormValue()` → debounced (50ms) re-render via `renderer.js`
4. **Preview** → `MonacoPreview` watches `store.renderedOutput`, applies deltaDecorations (red = unreplaced `{{ }}`, green = filled values)

### Key Patterns

- **State management**: Vue 3 `reactive()` singleton (`stores/templateStore.js`), not Pinia. Import `store` for reading, named functions for writing.
- **Rendering**: Debounced at 50ms in `templateStore.js:doRender()`. Only non-empty values are passed to Nunjucks so unfilled `{{ var }}` remains visible in output.
- **Highlights**: Monaco `deltaDecorations` — red regex matches remaining `{{ \w+ }}`, green finds filled values in output text (skipping those inside `{{ }}`).
- **Validation**: Input containing `{{` or `}}` is rejected client-side with an error indicator on the field.
- **Storage**: IndexedDB via `idb` wrapper. Templates stored as `{ id, name, content, createdAt }`. Max 1MB per template. Indexed by `name` (unique) and `createdAt`.

## Constraints

- **No backend** — all logic runs in the browser, all data in IndexedDB
- **No CDN calls** — Monaco Editor bundled via npm (`vite-plugin-monaco-editor`)
- **Target browsers**: Chrome 96+, Edge 96+
- **Supported file types**: `.j2`, `.txt`
- **Nunjucks** is configured with `autoescape: false` and `tags: {}` (bare variable substitution only; loops/conditions technically available but not exposed via UI)
