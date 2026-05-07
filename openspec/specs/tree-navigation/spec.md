## ADDED Requirements

### Requirement: Cascading vendor and series dropdowns
The system SHALL render two cascading select dropdowns at the top of the snippet panel — Vendor and Series. Selecting a vendor SHALL populate the series dropdown with that vendor's available series. Selecting a series SHALL display that series' snippets in the checkbox list below.

#### Scenario: Select vendor
- **WHEN** user selects "华为 (Huawei)" from the Vendor dropdown
- **THEN** the Series dropdown is populated with ["CE系列 (VRP8)", "S系列 (VRP5)", "USG系列 (防火墙)"]

#### Scenario: Select series
- **WHEN** user selects "CE系列 (VRP8)" from the Series dropdown
- **THEN** the snippet checkbox list shows only snippets under Huawei → CE系列

#### Scenario: No vendor selected
- **WHEN** no vendor is selected (default state)
- **THEN** the series dropdown is disabled and the snippet checkbox list is empty

### Requirement: Tree snippets are read-only in UI
The system SHALL render tree snippets without edit or delete action icons. Only user-created snippets in "My Custom Snippets" SHALL show edit and delete icons.

#### Scenario: Tree snippet row
- **WHEN** a tree snippet is displayed in the checkbox list
- **THEN** the row shows only a checkbox and the snippet name — no edit or delete icons

#### Scenario: User snippet row
- **WHEN** a user-created snippet is displayed in "My Custom Snippets"
- **THEN** the row shows checkbox, name, category badge, edit icon, and delete icon

### Requirement: Visual separation of tree and user snippets
The system SHALL display a horizontal divider with a "My Custom Snippets" label between the tree snippet list and the user snippet list.

#### Scenario: Both tree and user snippets exist
- **WHEN** tree snippets are shown and user snippets exist in IndexedDB
- **THEN** a divider separates the two sections with the label "My Custom Snippets"
