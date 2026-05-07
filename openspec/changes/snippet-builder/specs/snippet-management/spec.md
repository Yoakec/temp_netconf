## ADDED Requirements

### Requirement: Seed built-in snippets on first run
The system SHALL seed the snippets store with predefined config blocks (Base_Config, BGP_Config, M-LAG_Config, ACL_Config, SNMP_Config) when the snippets IndexedDB store is empty on first access.

#### Scenario: First-time snippet mode access
- **WHEN** user opens Snippet Builder mode for the first time
- **THEN** the snippets store is populated with 5 built-in snippets marked `category: 'built-in'`

#### Scenario: Subsequent snippet mode access
- **WHEN** user opens Snippet Builder mode after snippets already exist in the store
- **THEN** the system loads existing snippets without re-seeding

### Requirement: Upload new snippet
The system SHALL allow users to upload local `.j2` or `.txt` files as new snippets via file picker or drag-and-drop, saving to the `snippets` IndexedDB store.

#### Scenario: Successful snippet upload
- **WHEN** user selects a valid `.j2` file via file picker or drops it onto the upload zone
- **THEN** the file content is saved as a new snippet with `category: 'user'` and appears in the snippet list

#### Scenario: Invalid file type rejection
- **WHEN** user attempts to upload a file that is not `.j2` or `.txt`
- **THEN** the system displays an error message and does not save the file

#### Scenario: File size exceeds limit
- **WHEN** user attempts to upload a file larger than 1MB
- **THEN** the system displays an error message and does not save the file

### Requirement: Edit snippet content
The system SHALL allow users to edit a snippet's raw template text in a Monaco Editor modal dialog.

#### Scenario: Open snippet editor
- **WHEN** user clicks the edit icon on a snippet
- **THEN** a modal opens with a Monaco Editor pre-filled with the snippet's current content

#### Scenario: Save snippet edits
- **WHEN** user modifies the content in the modal and clicks save
- **THEN** the snippet is updated in IndexedDB and the reactive pipeline re-evaluates the combined template

#### Scenario: Cancel snippet edits
- **WHEN** user clicks cancel in the edit modal
- **THEN** the modal closes without saving and the snippet content is unchanged

### Requirement: Delete snippet
The system SHALL allow users to delete a snippet with a confirmation dialog.

#### Scenario: Confirm and delete
- **WHEN** user clicks delete on a snippet and confirms
- **THEN** the snippet is removed from IndexedDB and deselected from the active set if it was checked

#### Scenario: Cancel deletion
- **WHEN** user clicks delete on a snippet but cancels the confirmation
- **THEN** the snippet remains unchanged in the store

### Requirement: List all snippets
The system SHALL display all snippets from the `snippets` store in a scrollable list with name, category badge, and action icons (edit, delete).

#### Scenario: Display snippet list
- **WHEN** Snippet Builder mode is active
- **THEN** all stored snippets are displayed with their names and category indicators
