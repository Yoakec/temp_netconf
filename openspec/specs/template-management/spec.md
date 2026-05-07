## ADDED Requirements

### Requirement: Upload template file
The system SHALL allow users to upload local template files (`.j2` or `.txt`) via a file picker or drag-and-drop, reading the file content into browser memory without uploading to any server.

#### Scenario: User uploads a .j2 file via button
- **WHEN** user clicks "Upload Template" button and selects a `.j2` file from the local filesystem
- **THEN** the file content is read into memory using the FileReader API and stored in IndexedDB

#### Scenario: User drags and drops a .txt file
- **WHEN** user drags a `.txt` file onto the upload zone
- **THEN** the file content is read into memory using the FileReader API and stored in IndexedDB

#### Scenario: User uploads an unsupported file type
- **WHEN** user selects a file that is not `.j2` or `.txt`
- **THEN** the system SHALL display an error message and reject the file

### Requirement: Template list and selection
The system SHALL display all stored templates in a dropdown selector and allow the user to switch between them.

#### Scenario: User selects a template from the dropdown
- **WHEN** user chooses a template from the dropdown list
- **THEN** the selected template content is loaded into the parser and the form resets with new variables

#### Scenario: No templates available
- **WHEN** no templates have been uploaded yet
- **THEN** the system SHALL display a placeholder message guiding the user to upload a template

### Requirement: Delete template
The system SHALL allow users to delete a stored template from IndexedDB.

#### Scenario: User deletes the currently selected template
- **WHEN** user clicks "Delete" on the active template and confirms
- **THEN** the template is removed from IndexedDB, the form and preview are cleared, and the dropdown refreshes

### Requirement: Template storage capacity
The system SHALL support storing at least 20 templates, each up to 1MB in size, using IndexedDB for persistence.

#### Scenario: Storage near capacity
- **WHEN** user attempts to upload a template that would exceed the per-template 1MB limit
- **THEN** the system SHALL reject the upload with a descriptive error message

### Requirement: Offline operation
The system SHALL function without any network connectivity. No external CDN requests SHALL be made during page load or normal operation.

#### Scenario: User loads the page while offline
- **WHEN** user opens the application with no internet connection
- **THEN** the application loads successfully, previously stored templates are available, and all features function normally
