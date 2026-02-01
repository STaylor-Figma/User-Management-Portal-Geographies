# Project Intelligence User Management - Geographic Assignment Workflow

## Overview
This prototype allows administrators to manage user subscriptions and geographic access for Project Intelligence. Users can have Full Access (all zones), Modified access (specific counties), or No Access.

## Data Structure

### User Object Properties
Each user in `data.users[]` has:
- `id` - Unique identifier
- `name` - User's full name
- `role` - Job title
- `zones` - Display string (e.g., "Full Access", "Modified", "No Access")
- `accessType` - **Critical for logic**: `'full'`, `'modified'`, or `'none'`
- `zoneCount` - Number of zones for modified users (null for full/none)
- `assignedCounties` - Object mapping county keys to boolean (e.g., `{'1-0': true, '1-2': true}`)
- `login` - Last login date
- `subscription` - Subscription tier
- `disabled` - Boolean

### County Key Format
County selections use the format: `'zoneId-countyIndex'`
- Zone IDs are **1-based** (matching COMPLETE_ZONE_DATA)
- Example: `'1-0'` = Alabama Plus, first county
- Example: `'3-5'` = Arizona Statewide, sixth county

## Key Design Specifications (Figma)

### Pill/Badge Styling
```css
.zone-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #e7e6e5;
  border-radius: 30px;
  height: 26px;
  line-height: 14px;
}
```

### Counter Styling
```css
.zone-counter {
  display: inline-flex;
  background: #feffff; /* white */
  border-radius: 30px;
  padding: 2px 6px;
  height: 20px;
  min-width: 20px;
}
```

## Business Logic Rules

### Full Access
- User has access to ALL zones in the subscription
- No counter displayed in pill (just "Full Access")
- `accessType: 'full'`, `zoneCount: null`, `assignedCounties: {}`

### Modified Access
- User has access to specific counties only
- Counter displays number of zones (e.g., "Modified 5")
- `accessType: 'modified'`, `zoneCount: <number>`, `assignedCounties: {county-keys}`

### No Access
- User has no subscription assigned
- Displays "No Access" in gray
- `accessType: 'none'`, `zoneCount: 0`, `assignedCounties: {}`
- Shows "+ Add" button instead of "✕ Remove"

## Right Panel - Two States

### State 1: Default View (`#defaultView`)
**Structure:**
- Subscription card (fixed at top)
- `.content-wrapper` (scrollable)
  - Selected user info (`#selectedUserInfo`)
  - Default info text (`#defaultInfoText`)
- `.actions` (sticky footer with buttons)

**Behavior:**
- Shows when no zone selection is active
- Displays info about selected users
- **Special Note for No Access Users:** Shows blue info box: "Adding user(s) with No Access will give them Full Access to the application. They can be modified later."

**Buttons:**
- "Add Selected User(s)" - Enabled when No Access users selected
- "Modify Selected Users" - Enabled when Full/Modified users selected

### State 2: Zone Selection View (`#zoneSelectionView`)
**Structure:**
- Subscription card (fixed at top)
- Zone controls (Select All checkbox, search)
- `.zone-content` (scrollable zone list)
- `.actions` (sticky footer with Cancel/Save buttons)

**Behavior:**
- Shows when "Modify Selected Users" clicked
- Pre-populates counties from selected modified users
- Checkboxes show indeterminate state when partially selected
- Save button only enabled when counties are selected

## Critical Functions

### `render()`
- Main rendering function for user table
- **Must check `u.accessType`** not `u.zones` string for conditionals
- Renders appropriate badge based on accessType
- Shows correct action button (Add vs Remove)

### `addUserFromTable(userId)` 
Called by individual "+ Add" buttons next to each user.
**Must update ALL properties:**
```javascript
user.zones = 'Full Access';
user.accessType = 'full';
user.zoneCount = null;
user.assignedCounties = {};
```

### `addSelectedUsers()`
Called by "Add Selected User(s)" button in right panel.
- Loops through selected users with `accessType === 'none'`
- Updates all properties to Full Access
- Clears selections and re-renders

### `showModifyView()`
Called by "Modify Selected Users" button.
**Critical pre-population logic:**
```javascript
sel.counties = {}; // Clear first
// Then merge counties from all selected modified users
for(var i = 0; i < data.users.length; i++) {
  var u = data.users[i];
  if(sel.users[u.id] && u.accessType === 'modified' && u.assignedCounties) {
    for(var key in u.assignedCounties) {
      if(u.assignedCounties[key]) {
        sel.counties[key] = true;
      }
    }
  }
}
```

### `renderZones()`
Renders zone checkboxes with proper indeterminate states.
**Critical:** Indeterminate state CANNOT be set via HTML attributes - must use JavaScript:
```javascript
// After innerHTML is set:
var checkbox = document.querySelector('input[data-zone-id="' + zoneId + '"]');
checkbox.indeterminate = true;
```

### `updateSelectAllZonesState()`
Updates "Select All Zones" checkbox to show:
- Unchecked: no counties selected
- Checked: all counties selected  
- Indeterminate: some counties selected

### `updateRightPanel()`
Updates right panel based on user selections:
- Counts selected users by type
- Shows/hides selected user info
- Enables/disables Add and Modify buttons
- Displays blue info box when No Access users selected

### `updateSaveButton()`
Enables "Save Updates" button only when counties are selected in zone view.

## Sticky Footer Implementation

Both panel states use:
```css
#defaultView, #zoneSelectionView {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-wrapper, .zone-content {
  flex: 1;
  overflow-y: auto;
}

.actions {
  position: sticky;
  bottom: 0;
  background: #fafafa;
  border-top: 2px solid #e0e0e0;
  padding: 16px;
  z-index: 10;
}
```

## Bug Fixes Applied

### 1. Syntax Error - Extra Closing Brace
Line 587 had duplicate `}}` causing "Uncaught SyntaxError"

### 2. Conditional Checks Using Wrong Property
Changed from checking `u.zones === 'No Access'` string to `u.accessType === 'none'`

### 3. Zone IDs Were 0-Based Instead of 1-Based
Changed `{'0-0': true}` to `{'1-0': true}` to match COMPLETE_ZONE_DATA

### 4. Indeterminate Checkbox State Not Working
Cannot set `indeterminate` via HTML - must use JavaScript after DOM creation

### 5. `addUserFromTable()` Only Updated `zones` String
Fixed to update all four properties: `zones`, `accessType`, `zoneCount`, `assignedCounties`

## Files Modified
- `v2-modify-users-workflow.html` - Main workflow file
- `v2-subscription-overview.html` - Pill styling consistency

## Key Takeaways for Future Development

1. **Always update all user properties together** when changing access levels
2. **Check `accessType` not `zones`** for conditional logic
3. **Zone IDs are 1-based** to match the zone data structure
4. **Indeterminate checkbox states require JavaScript** after DOM insertion
5. **Pre-populate zones** when modifying users who already have access
6. **Both add functions** (`addUserFromTable` and `addSelectedUsers`) must be kept in sync
7. **Sticky footers** use flexbox with overflow on content area

## User Flows

### Add User Flow (No Access → Full Access)
1. User clicks "+ Add" next to No Access user OR selects multiple and clicks "Add Selected User(s)"
2. Function updates: `accessType='full'`, `zones='Full Access'`, `zoneCount=null`, `assignedCounties={}`
3. Table re-renders showing "Full Access" badge
4. Action button changes from "+ Add" to "✕ Remove"

### Modify User Flow (Full/Modified → Change Access)
1. User selects Full or Modified users
2. Clicks "Modify Selected Users"
3. Right panel switches to zone selection view
4. If modified users selected, their counties are pre-populated as checked
5. Zone checkboxes show indeterminate if partially selected
6. User modifies county selections
7. Clicks "Save Updates" to apply changes

---

*This documentation ensures future prompts can work with this prototype correctly and consistently.*
