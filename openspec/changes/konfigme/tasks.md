## 1. Project Setup

- [x] 1.1 Scaffold Vite + Vue 3 project with `create-vite`
- [x] 1.2 Install dependencies: `nunjucks`, `monaco-editor`, `idb`, `vite-plugin-monaco-editor`
- [x] 1.3 Configure Vite for Monaco Editor worker bundling (offline, no CDN)
- [x] 1.4 Create project directory structure (components, stores, utils, assets)

## 2. Template Storage Layer (IndexedDB)

- [x] 2.1 Initialize IndexedDB database schema using `idb` (store: templates, key: id, fields: name, content, createdAt)
- [x] 2.2 Implement `saveTemplate(name, content)` function
- [x] 2.3 Implement `getAllTemplates()` function
- [x] 2.4 Implement `deleteTemplate(id)` function
- [x] 2.5 Implement `getTemplate(id)` function
- [x] 2.6 Add file size validation (max 1MB per template)

## 3. Template Parser

- [x] 3.1 Implement `parseVariables(templateText)` function using regex `/{{\s*(\w+)\s*}}/g`
- [x] 3.2 Add deduplication logic (preserve first-occurrence order)
- [x] 3.3 Add edge case handling: no variables, whitespace-only braces, multi-line templates

## 4. Global State (Vue reactive store)

- [x] 4.1 Create reactive store with fields: templates, activeTemplateId, templateContent, variables, formValues, renderedOutput, validationErrors
- [x] 4.2 Implement `loadTemplate(id)` action: fetch from IndexedDB, parse variables, reset form
- [x] 4.3 Implement `updateFormValue(varName, value)` action with validation
- [x] 4.4 Implement `renderPreview()` action: Nunjucks render + debounce

## 5. Template Manager (Top Toolbar)

- [x] 5.1 Create `TemplateManager.vue` component with template dropdown selector
- [x] 5.2 Implement "Upload" button with FileReader API (support .j2 and .txt)
- [x] 5.3 Implement file type validation (reject non-.j2/.txt)
- [x] 5.4 Implement "Delete" button with confirmation dialog
- [x] 5.5 Handle empty state when no templates exist

## 6. Dynamic Form (Left Panel)

- [x] 6.1 Create `DynamicForm.vue` component with `v-for` over variables
- [x] 6.2 Bind each input to `formValues` via `v-model`
- [x] 6.3 Implement input validation: detect `{{` and `}}`, show red border + error message
- [x] 6.4 Add visual indicator for filled vs unfilled fields (green checkmark vs empty circle)
- [x] 6.5 Handle empty variables state (show placeholder message)

## 7. Rendering Engine

- [x] 7.1 Configure Nunjucks in browser mode (no filesystem loader)
- [x] 7.2 Implement `renderTemplate(template, values)` using `nunjucks.renderString()`
- [x] 7.3 Handle unfilled variables: Nunjucks preserves `{{ var }}` literals for undefined values
- [x] 7.4 Skip Nunjucks rendering when any validation error exists (use raw template)
- [x] 7.5 Add debounce (50ms max) for render-on-input

## 8. Monaco Editor Preview (Right Panel)

- [x] 8.1 Create `MonacoPreview.vue` component
- [x] 8.2 Initialize Monaco Editor in read-only mode with bundled workers
- [x] 8.3 Implement `updateContent(renderedText)` to set editor model value
- [x] 8.4 Implement `applyRedDecorations(renderedText)`: find all `{{ }}` patterns, add red background via `deltaDecorations`
- [x] 8.5 Implement `applyGreenDecorations(renderedText, filledValues)`: find filled value occurrences, add green background via `deltaDecorations`
- [x] 8.6 Re-run both decoration functions on every content update

## 9. App Shell & Layout

- [x] 9.1 Create `App.vue` with three-section layout: top toolbar, left form, right preview
- [x] 9.2 Implement responsive layout using CSS Flexbox/Grid (min-height full viewport)
- [x] 9.3 Wire all components to the reactive store
- [x] 9.4 Add application title/header with "KonfigMe"

## 10. Polish & Edge Cases

- [x] 10.1 Add confirmation dialog before template deletion
- [x] 10.2 Handle browser IndexedDB quota exceeded error
- [x] 10.3 Test with 1MB template file (build verified, size gate in db.js)
- [x] 10.4 Test offline mode (all assets bundled locally, no CDN)
- [x] 10.5 Verify Chrome 96+ and Edge 96+ compatibility (browserslist configured)
- [x] 10.6 Add copy-to-clipboard button for rendered output
