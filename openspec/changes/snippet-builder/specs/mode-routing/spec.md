## ADDED Requirements

### Requirement: Mode toggle tabs in toolbar
The system SHALL display two navigation tabs in the top toolbar — "Template File" and "Snippet Builder" — allowing users to switch between the two modes.

#### Scenario: Switch to Snippet Builder mode
- **WHEN** user clicks the "Snippet Builder" tab
- **THEN** the workspace renders the Snippet Builder layout and the tab shows active state

#### Scenario: Switch to Template mode
- **WHEN** user clicks the "Template File" tab
- **THEN** the workspace renders the Template File layout and the tab shows active state

### Requirement: Mode-isolated state
The system SHALL maintain completely separate reactive stores for each mode (`templateStore` for template mode, `snippetStore` for snippet mode), with no shared state between them.

#### Scenario: Template mode state unaffected by snippet mode
- **WHEN** user switches from Template mode to Snippet mode and back
- **THEN** the previously loaded template, its variables, and form values are preserved unchanged

#### Scenario: Snippet state unaffected by template mode
- **WHEN** user switches from Snippet mode to Template mode and back
- **THEN** the previously selected snippets, combined template, and form values are preserved unchanged

### Requirement: Mode-specific toolbar actions
The system SHALL show mode-appropriate actions in the toolbar: template selector, upload, and delete when in Template mode; snippet upload and import when in Snippet mode.

#### Scenario: Template mode toolbar
- **WHEN** Template File mode is active
- **THEN** the toolbar shows the template dropdown selector, delete button, and file upload zone

#### Scenario: Snippet mode toolbar
- **WHEN** Snippet Builder mode is active
- **THEN** the toolbar shows the "New Snippet" button and snippet import zone

### Requirement: Default mode on app load
The system SHALL default to Template File mode when the application first loads.

#### Scenario: Fresh app load
- **WHEN** the application loads for the first time in a session
- **THEN** Template File mode is active and the existing template upload interface is displayed
