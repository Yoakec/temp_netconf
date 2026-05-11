## ADDED Requirements

### Requirement: Snippet data loaded from per-series JSON files
The system SHALL load built-in snippet data from individual JSON files organized by vendor and series under `utils/snippets/`, using Vite's `import.meta.glob` for build-time auto-discovery. Each JSON file SHALL contain a flat `{ "snippetName": "content" }` object representing one series. The assembled `snippetTree` export SHALL maintain the identical `{ vendor: { series: { name: content } } }` shape as before.

#### Scenario: Add a new vendor
- **WHEN** a developer creates a new vendor subdirectory under `utils/snippets/` with one or more series JSON files
- **THEN** the glob pattern `./*/*.json` discovers them at build time and they appear in the snippet tree without any code changes to index.js

#### Scenario: Add a new series to an existing vendor
- **WHEN** a developer drops a new JSON file into an existing vendor directory
- **THEN** the series appears under that vendor in the snippet tree with its snippets available for selection

#### Scenario: Map display names via dictionary
- **WHEN** a JSON file path maps to an entry in `vendorMap` or `seriesMap`
- **THEN** the UI displays the mapped name; unmapped paths fall back to their raw directory/file name
