## ADDED Requirements

### Requirement: Nunjucks browser-side rendering
The system SHALL use the Nunjucks library to merge template text with form values in the browser, producing the final rendered configuration text.

#### Scenario: All variables have values
- **WHEN** template is `hostname {{ name }}` and form value `name: "leaf-01"`
- **THEN** rendered output is `hostname leaf-01`

#### Scenario: Some variables are unfilled
- **WHEN** template is `hostname {{ name }}\nip {{ ip }}` and only `name` is filled with `"leaf-01"`
- **THEN** rendered output is `hostname leaf-01\nip {{ ip }}` (unfilled variable preserved as literal `{{ }}` text)

#### Scenario: Invalid input prevents Nunjucks rendering
- **WHEN** any form field contains `{{` or `}}`
- **THEN** Nunjucks rendering is skipped; the raw template text is displayed in the preview instead

### Requirement: Monaco Editor read-only preview
The system SHALL display the rendered configuration text in a read-only Monaco Editor instance.

#### Scenario: Preview updates after form change
- **WHEN** user modifies a form value
- **THEN** the Monaco Editor content updates to show the new rendered output

#### Scenario: Editor is read-only
- **WHEN** user clicks into the Monaco Editor and tries to type
- **THEN** no modifications are accepted (read-only mode)

### Requirement: Rendering debounce
The system SHALL debounce rendering updates to avoid excessive DOM manipulation during rapid typing, with a maximum delay of 50ms.

#### Scenario: User types rapidly
- **WHEN** user types multiple characters in quick succession
- **THEN** the preview updates at most once every 50ms

### Requirement: Monaco Editor offline
The Monaco Editor and its worker files SHALL be bundled with the application build, requiring no runtime CDN downloads.

#### Scenario: Page loads without internet
- **WHEN** the application is loaded in offline mode
- **THEN** Monaco Editor initializes successfully from local bundled assets
