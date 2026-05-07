## MODIFIED Requirements

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
