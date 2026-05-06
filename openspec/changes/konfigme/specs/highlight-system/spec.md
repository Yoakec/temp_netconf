## ADDED Requirements

### Requirement: Red highlight for unfilled placeholders
The system SHALL apply red background decorations to all `{{ variable }}` placeholders that remain unreplaced in the rendered output, using Monaco Editor's `deltaDecorations` API.

#### Scenario: Template has unfilled variables
- **WHEN** rendered output contains `hostname leaf-01\nip {{ ip }}`
- **THEN** the text `{{ ip }}` is highlighted with a red background decoration

#### Scenario: All variables are filled
- **WHEN** rendered output contains no `{{ }}` placeholders
- **THEN** no red decorations are applied

#### Scenario: Partially filled values cause red highlight for unfilled only
- **WHEN** template has 3 variables and user fills 2 of them
- **THEN** only the 1 unfilled `{{ var }}` placeholder receives a red highlight

### Requirement: Green highlight for filled values
The system SHALL apply green background decorations to the rendered text segments that correspond to user-filled variable values, using Monaco Editor's `deltaDecorations` API.

#### Scenario: Single filled variable
- **WHEN** user enters `"leaf-01"` for variable `hostname` and rendered output contains `hostname leaf-01`
- **THEN** the text `leaf-01` (the filled value) is highlighted with a green background decoration

#### Scenario: Multiple filled variables
- **WHEN** user fills 3 variables with distinct values
- **THEN** each filled value occurrence in the rendered output receives a green background decoration

#### Scenario: Variable value appears multiple times
- **WHEN** a filled variable `vlan` with value `"100"` appears in 3 places in the rendered output
- **THEN** all 3 occurrences of `100` that resulted from that variable replacement are highlighted green

### Requirement: Decoration update on render
The system SHALL recalculate and reapply all decorations every time the rendered output changes.

#### Scenario: User fills a previously unfilled variable
- **WHEN** user fills a value for a variable that was previously unfilled (red)
- **THEN** the red highlight for that variable is removed and green highlights for the new value are added

#### Scenario: User clears a previously filled variable
- **WHEN** user clears the value of a previously filled (green) variable
- **THEN** the green highlights for that value are removed and the `{{ variable }}` placeholder returns to red

### Requirement: Green highlight placement accuracy
The system SHALL search for filled values in the rendered output using Monaco's text search API and place green decorations only on the exact text matches that resulted from Nunjucks variable substitution.

#### Scenario: Filled value collides with literal template text
- **WHEN** template contains literal text `100` and user also fills variable `vlan` with value `100`
- **THEN** the system SHALL highlight all occurrences of the filled value in the rendered output, preferring correctness over precision for simple cases
