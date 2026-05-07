## REMOVED Requirements

### Requirement: Seed built-in snippets on first run
**Reason**: Replaced by hardcoded `snippetTree` JS object. Built-in snippets are now source code, not database records.
**Migration**: Remove `seedIfEmpty()` from `snippetDb.js`. Remove `initSnippetStore()` seeding call. Import `snippetTree` directly into `snippetStore.js`.

## MODIFIED Requirements

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
