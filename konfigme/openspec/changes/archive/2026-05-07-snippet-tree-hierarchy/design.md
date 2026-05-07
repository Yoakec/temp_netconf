## Context

The current snippet system is flat — all snippets (built-in and user-created) are loaded from IndexedDB into a single list. Network engineers need hierarchical organization: Vendor → Series → Snippet. This matches how they think about network configs and prevents mixing config blocks from different vendors.

The snippet-builder change established the isolation architecture (separate store, separate DB, separate components). This change upgrades the snippet data model within that existing isolation boundary.

## Goals / Non-Goals

**Goals:**
- Three-level hierarchy: Vendor → Series → Snippet, driven by a hardcoded JS tree
- Two cascading dropdowns (Vendor, Series) filter which snippets are visible
- Composite key system unifying tree snippets and user snippets in `selectedIds`
- Tree snippets are read-only in the UI (no edit/delete icons); user snippets remain mutable
- Vendor/series change clears only tree selections, preserves user selections and form values
- Clear All button on the Variables panel for explicit form reset

**Non-Goals:**
- No IndexedDB migration — `seedIfEmpty()` is removed, tree is pure JS
- No change to user snippet CRUD flow
- No change to Monaco preview or snippet edit modal
- No multi-vendor simultaneous selection (pick one vendor+series at a time)
- No tree editing UI (built-in snippets are code-defined)

## Decisions

### 1. Tree+Flat Hybrid Model (Model A)

Built-in snippets live in a hardcoded `snippetTree` JS object. User-created snippets remain in IndexedDB. The UI splits them visually:

```
[Vendor dropdown]
[Series dropdown]
─────────────────
[✓] Tree_Snippet_1
[ ] Tree_Snippet_2
─────────────────
📁 My Custom Snippets
[✓] user_snippet (✎ ✕)
```

**Rationale**: No seeding needed, no migration, clear separation of mutable vs immutable content. UI logic stays simple — edit/delete buttons always visible on user rows, always hidden on tree rows.

**Alternative**: Pure tree with user snippets as a "Custom" node. Rejected — requires special-casing the Custom node in edit/delete logic.

### 2. Composite Key System

```
tree::vendor::series::name  — tree snippet (string)
5                            — user snippet (numeric id)
```

`selectedIds` is a `Set` holding both types. `updateCombinedTemplate()` checks `typeof key`:
- `'string'` starting with `tree::` → parse path → `snippetTree[vendor][series][name]`
- `'number'` → `snippetStore.snippets.find(s => s.id === key)`

**Rationale**: The Set naturally supports mixed types. Using a prefix convention avoids collisions (DB auto-increment IDs are always numbers).

### 3. Vendor/Series Watch — Clear Only Tree Selections

```js
watch([currentVendor, currentSeries], () => {
  const s = new Set(snippetStore.selectedIds)
  for (const key of s) {
    if (typeof key === 'string' && key.startsWith('tree::')) {
      s.delete(key)
    }
  }
  snippetStore.selectedIds = s
})
```

formValues are **never cleared** on navigation. Common variables (vlan_id, ntp_server, bgp_as) persist across vendors, saving engineers repetitive typing.

**Rationale**: The user confirmed this behavior. "防呆" is achieved by clearing tree selections — no stale vendor snippets leak into the combined template. But form values are preserved deliberately, not accidentally.

### 4. Clear All Button

A small button in the Variables panel header (`🧹 Clear All`) calls `clearAllFormValues()`. This gives engineers explicit control to reset the form when needed, rather than imposing automatic clears.

### 5. Hardcoded Tree Instead of Seeded IndexedDB

Remove `seedIfEmpty()`. The `snippetTree` is imported directly into the store. User snippets continue to use IndexedDB for persistence.

**Rationale**: Built-in snippets shipped with the app are effectively source code — they don't need database storage. This eliminates the seeding race condition and makes updates a code change.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tree data grows large | JS bundle size increases | Current tree is ~5KB; monitor if adding more vendors |
| User expects to edit built-in snippets | Confusion when edit button is missing | Visual distinction (no action icons on tree rows) makes it clear |
| Composite key parsing overhead | Minor performance cost | String startsWith check is O(1); key count is small (<100) |
| Vendor+series names must match exactly | Brittle if renamed | Use constants or shared keys; keep names stable |

## Open Questions

None — all decisions resolved in explore phase.
