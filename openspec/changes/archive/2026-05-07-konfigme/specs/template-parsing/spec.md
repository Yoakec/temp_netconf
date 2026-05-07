## ADDED Requirements

### Requirement: Extract variables from template
The system SHALL scan template text using a regular expression to extract all `{{ variable }}` placeholders and produce a deduplicated list of variable names.

#### Scenario: Template contains multiple distinct variables
- **WHEN** template text is `hostname {{ host }} ip {{ ip }} mask {{ ip }}`
- **THEN** the parser SHALL return `["host", "ip"]` (deduplicated, preserving order of first occurrence)

#### Scenario: Template contains no variables
- **WHEN** template text contains no `{{ }}` placeholders
- **THEN** the parser SHALL return an empty list

#### Scenario: Template has whitespace in variable syntax
- **WHEN** template text contains `{{  hostname  }}`
- **THEN** the parser SHALL extract `"hostname"` (trimming whitespace inside the braces)

#### Scenario: Template with multi-line content
- **WHEN** template text spans multiple lines with variables on different lines
- **THEN** the parser SHALL extract all variables regardless of line position

### Requirement: Parse on template load
The system SHALL automatically parse the template when a template is selected or uploaded.

#### Scenario: User uploads a new template
- **WHEN** a new template file is uploaded
- **THEN** the parser immediately extracts variables and populates the form

#### Scenario: User switches to a different template
- **WHEN** user selects a different template from the dropdown
- **THEN** the parser re-runs on the new template, clears previous form values, and generates fresh input fields
