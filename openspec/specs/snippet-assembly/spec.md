## Requirements

### Requirement: Checkbox snippet selection
The system SHALL render each snippet as a checkbox item, allowing users to select which snippets to include in the combined template. Tree snippets SHALL use composite string keys (`tree::vendor::series::name`). User snippets SHALL use numeric IndexedDB IDs.

#### Scenario: Select a tree snippet
- **WHEN** user checks a tree snippet's checkbox
- **THEN** the composite key `"tree::vendor::series::name"` is added to `selectedIds` and its content is included in the combined template

#### Scenario: Select a user snippet
- **WHEN** user checks a user snippet's checkbox
- **THEN** the numeric snippet ID is added to `selectedIds` and its content is included in the combined template

#### Scenario: Deselect a snippet
- **WHEN** user unchecks any snippet's checkbox
- **THEN** the corresponding key is removed from `selectedIds` and its content is excluded from the combined template

### Requirement: Template concatenation
The system SHALL concatenate the content of all selected snippets into a single combined template string, resolved by key type: `tree::` prefix keys SHALL look up content from `snippetTree[vendor][series][name]`, numeric keys SHALL look up content from IndexedDB via `snippets.find(s => s.id === key)`.

#### Scenario: Concatenate tree and user snippets
- **WHEN** user has selected tree snippet `"tree::华为::CE系列 (VRP8)::Base_基础配置"` and user snippet with ID `5`
- **THEN** `combinedTemplate` equals the tree snippet content joined with the user snippet content by newline

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

### Requirement: Tree selection clear on vendor or series change
The system SHALL remove all tree-keyed selections (`tree::*` prefix) from `selectedIds` when the vendor or series dropdown changes. User snippet selections (numeric keys) SHALL NOT be affected. Form values SHALL NOT be cleared.

#### Scenario: Vendor change clears tree selections
- **WHEN** user has selected tree snippets from 华为/CE and switches vendor to 思科
- **THEN** all `tree::` prefixed keys are removed from `selectedIds`, user snippet selections remain, and `formValues` are unchanged

#### Scenario: Series change clears tree selections
- **WHEN** user has selected tree snippets from 华为/CE and switches series to S系列
- **THEN** all `tree::` prefixed keys are removed from `selectedIds`, user snippet selections remain, and `formValues` are unchanged

### Requirement: Manual clear all form values
The system SHALL provide a Clear All button in the Variables panel header that resets all form values to empty strings and clears all validation errors.

#### Scenario: User clicks Clear All
- **WHEN** user clicks the Clear All button
- **THEN** all `formValues` are set to empty strings and all `validationErrors` are removed
