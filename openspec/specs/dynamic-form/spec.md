## ADDED Requirements

### Requirement: Dynamic input generation
The system SHALL render one text input field for each variable extracted from the template, using Vue's `v-for` directive for dynamic rendering.

#### Scenario: Three variables extracted
- **WHEN** the parser returns `["hostname", "ip", "vlan"]`
- **THEN** the form renders three labeled input fields in order

#### Scenario: No variables to render
- **WHEN** the parser returns an empty variable list
- **THEN** the form area SHALL display "No variables found in template"

### Requirement: Two-way data binding
Each input field SHALL be bound to a Vue reactive object so that changes are reflected immediately in the preview.

#### Scenario: User types a value into an input
- **WHEN** user types `"leaf-01"` into the `hostname` input field
- **THEN** the reactive store updates `hostname` to `"leaf-01"` and triggers a re-render of the preview

### Requirement: Input validation — no template syntax
The system SHALL validate that user input does not contain `{{` or `}}` sequences. Invalid input SHALL trigger a visual error state on the field.

#### Scenario: User enters valid text
- **WHEN** user types `10.0.0.1` into an input field
- **THEN** the field displays normally with no error indicator

#### Scenario: User enters text containing template syntax
- **WHEN** user types `{{ var }}` or `prefix {{` into an input field
- **THEN** the field SHALL show a red border and display an error message: "Value must not contain {{ or }}"

#### Scenario: Invalid input prevents preview rendering
- **WHEN** any input field contains `{{` or `}}`
- **THEN** the rendered preview SHALL use the raw template text (no Nunjucks rendering) until the input is corrected

### Requirement: Form state reset
The system SHALL clear all form values when switching to a different template.

#### Scenario: User switches template with filled values
- **WHEN** user has filled in variables for template A and switches to template B
- **THEN** all form input values are reset to empty strings
