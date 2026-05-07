## Requirements

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
The system SHALL allow users to edit a user-created snippet's raw template text in a Monaco Editor modal dialog. Tree snippets are read-only and SHALL NOT expose edit controls.

#### Scenario: Open snippet editor
- **WHEN** user clicks the edit icon on a user snippet
- **THEN** a modal opens with a Monaco Editor pre-filled with the snippet's current content

#### Scenario: Save snippet edits
- **WHEN** user modifies the content in the modal and clicks save
- **THEN** the snippet is updated in IndexedDB and the reactive pipeline re-evaluates the combined template

#### Scenario: Cancel snippet edits
- **WHEN** user clicks cancel in the edit modal
- **THEN** the modal closes without saving and the snippet content is unchanged

### Requirement: Delete snippet
The system SHALL allow users to delete a user-created snippet with a confirmation dialog.

#### Scenario: Confirm and delete
- **WHEN** user clicks delete on a user snippet and confirms
- **THEN** the snippet is removed from IndexedDB and deselected from the active set if it was checked

#### Scenario: Cancel deletion
- **WHEN** user clicks delete on a user snippet but cancels the confirmation
- **THEN** the snippet remains unchanged in the store

### Requirement: List all snippets
The system SHALL display snippets in two sections: tree snippets (from hardcoded `snippetTree`, filtered by selected vendor and series) in the upper section, and user-created snippets (from IndexedDB `snippets` store) in a lower "My Custom Snippets" section separated by a divider. Tree snippets SHALL be shown without edit/delete controls. User snippets SHALL retain their edit/delete controls.

#### Scenario: Display with vendor and series selected
- **WHEN** Snippet Builder mode is active and a vendor+series is selected
- **THEN** tree snippets for that vendor+series are displayed in the upper section, and all user snippets are displayed below the divider

#### Scenario: No vendor selected
- **WHEN** Snippet Builder mode is active and no vendor is selected
- **THEN** the tree section is empty and user snippets are displayed below

#### Scenario: No user snippets exist
- **WHEN** no user snippets have been created
- **THEN** the "My Custom Snippets" section is empty with a hint to upload
