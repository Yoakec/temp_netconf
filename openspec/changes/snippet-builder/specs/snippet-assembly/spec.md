## ADDED Requirements

### Requirement: Checkbox snippet selection
The system SHALL render each snippet as a checkbox item, allowing users to select which snippets to include in the combined template.

#### Scenario: Select a snippet
- **WHEN** user checks a snippet's checkbox
- **THEN** the snippet's ID is added to `selectedIds` and its content is included in the combined template

#### Scenario: Deselect a snippet
- **WHEN** user unchecks a snippet's checkbox
- **THEN** the snippet's ID is removed from `selectedIds` and its content is excluded from the combined template

### Requirement: Template concatenation
The system SHALL concatenate the content of all selected snippets into a single combined template string, joined by newlines in selection order.

#### Scenario: Concatenate multiple snippets
- **WHEN** user has selected "Base_Config" and "BGP_Config"
- **THEN** `combinedTemplate` equals `snippetContent('Base_Config') + '\n' + snippetContent('BGP_Config')`

#### Scenario: No snippets selected
- **WHEN** user has no snippets checked
- **THEN** `combinedTemplate` is an empty string

### Requirement: Variable extraction from combined template
The system SHALL parse the combined template to extract all `{{ variable }}` placeholders into a deduplicated list, using the same regex pattern as template mode (`/{{\s*(\w+)\s*}}/g`).

#### Scenario: Extract variables from combined template
- **WHEN** the combined template contains `hostname {{ hostname }}\nrouter bgp {{ local_as }}\nhostname {{ hostname }}`
- **THEN** the extracted variables list is `['hostname', 'local_as']` (deduplicated, first-occurrence order)

#### Scenario: No variables in combined template
- **WHEN** the combined template contains no `{{ }}` placeholders
- **THEN** the extracted variables list is empty

### Requirement: Form value persistence across snippet toggle
The system SHALL preserve form field values when a snippet is unchecked and restore them if the snippet is re-checked. Values are stored in `formValues` keyed by variable name, independent of which snippets are currently selected.

#### Scenario: Value survives uncheck
- **WHEN** user fills `hostname = "Spine-01"` then unchecks the snippet that provided `{{ hostname }}`
- **THEN** `formValues.hostname` remains `"Spine-01"`

#### Scenario: Value restored on recheck
- **WHEN** user re-checks a previously unchecked snippet that contains `{{ hostname }}`
- **THEN** the form field for `hostname` displays the preserved value `"Spine-01"`

### Requirement: Real-time render of combined template
The system SHALL render the combined template with form values using Nunjucks, debounced at 50ms, and display the result in a read-only Monaco Editor preview.

#### Scenario: Render with filled values
- **WHEN** user fills `hostname = "Leaf-01"` and `local_as = "65000"`
- **THEN** the preview displays the rendered config with those values substituted

#### Scenario: Unfilled variables remain as placeholders
- **WHEN** user has not filled `hostname`
- **THEN** the preview displays `{{ hostname }}` as an unfilled placeholder with red highlighting

### Requirement: Red and green highlighting
The system SHALL apply Monaco Editor delta decorations to the preview: red background for unfilled `{{ variable }}` placeholders, green background for filled values in the rendered output.

#### Scenario: Red highlight on unfilled variable
- **WHEN** the rendered output contains `{{ peer_ip }}` with no value filled
- **THEN** `{{ peer_ip }}` is highlighted with a red background decoration

#### Scenario: Green highlight on filled value
- **WHEN** the rendered output contains the text `65000` which corresponds to a filled variable value
- **THEN** `65000` is highlighted with a green background decoration (when not inside `{{ }}`)
