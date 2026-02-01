# Multi-Subscription Geographic Assignment Flow - Complete Documentation

## Overview
This document describes the complete implementation of the multi-subscription geographic assignment workflow for ConstructConnect's User Management Portal. This flow handles organizations that have both **Project Intelligence Pro** and **Project Intelligence Starter** subscriptions.

## File Structure
The multi-subscription flow consists of two main HTML files:

### 1. v2-subscription-overview-multi.html
**Purpose:** Overview/landing page displaying subscription status and user summary  
**Entry Point:** User lands here when clicking "Users & Groups" in sidebar  
**Primary Function:** Display subscription cards and user access summary

### 2. v2-modify-users-workflow-multi.html  
**Purpose:** Zone selection and geographic assignment interface  
**Entry Point:** User clicks "Modify" on Project Intelligence card from overview page  
**Primary Function:** Assign/modify geographic access for users across both subscription types

---

## User Data Structure

### User Object Properties
```javascript
{
  id: number,              // Unique user identifier
  name: string,           // User's full name
  role: string,           // Job title (e.g., "Chief Estimator")
  zones: string,          // Display text: "Full Access", "Modified", "No Access"
  zoneCount: number|null, // Number of assigned zones (null for Full Access)
  accessType: string,     // 'full', 'modified', 'none'
  assignedCounties: {},   // Object with county IDs as keys: {'1-1':true, '1-2':true}
  login: string,          // Last login date
  subscription: string|null, // 'Pro', 'Starter', or null
  disabled: boolean       // Whether user can be selected (future use)
}
```

### Example Data
```javascript
{
  id: 1,
  name: 'Malcom Reynolds',
  role: 'Chief Estimator',
  zones: 'Full Access',
  zoneCount: null,
  accessType: 'full',
  assignedCounties: {},
  login: 'Nov 5, 2025',
  subscription: 'Pro',
  disabled: false
}
```

---

## Page 1: Subscription Overview (v2-subscription-overview-multi.html)

### Key Components

#### Dual PI Gauge Display
- **Location:** Card header area
- **Purpose:** Visual representation of seat usage for both subscriptions
- **Design:**
  - Two circular progress indicators side-by-side
  - Pro: Green (#459d13) progress bar
  - Starter: Blue (#00a1e0) progress bar
  - Shows "X / Y" used/total seats in center
  - Percentage-based fill calculation

#### Subscription Cards (Pro & Starter)
Each subscription displays:
- **Toast Messages:** Status indicators (error/warning/info states)
- **Seat Usage Row:** "X / Y Used - Z seats available"
- **Progress Bar:** Visual seat capacity indicator
- **Available Market Zones:** Badge list showing zones with county counts
- **+8 more zones:** Expandable zone list for >3 zones

#### User Table
Displays all organization users with:
- Name (clickable link)
- Role with colored indicator dot
- Subscription columns (Pro, Starter, Takeoff, etc.)
- Access level per subscription ("Full Access", "BM - Team Member", etc.)
- Seat count badge display

#### Navigation
- **Add User Button (Top Right):** Opens "Invite User" drawer (coming soon)
- **Modify Buttons (Per Subscription):** Opens zone selection page (v2-modify-users-workflow-multi.html)
- **Filter Dropdowns:** "Show All Subscriptions", "Show All Roles", "Show All Groups"

---

## Page 2: Zone Selection Workflow (v2-modify-users-workflow-multi.html)

### Layout Architecture

#### Split-View Design (50/50)

**LEFT PANEL: User Table**
- Fixed search box at top
- Scrollable user list
- Multi-select checkboxes
- User geography display with PRO badges
- Individual Add/Remove actions per user

**RIGHT PANEL: Dynamic Two-State View**
- **State 1: Default Info View** (no users selected)
- **State 2: Zone Selection View** (users selected)

---

### State 1: Default Info View

#### Pro Subscription Card
```
Project Intelligence Pro Seats
Your current assigned seats for Project Intelligence Pro include:
• 1 Full access
• 1 Modified

By clicking 'add' you assign a seat and provide the user full access.
Once a user has been added, you can then modify their access to specific counties.

7 / 20 Seats - 13 seats available [i tooltip]
[Progress bar: 35% filled]

[Add Selected User(s) - disabled] [Modify Selected Users - disabled]
```

#### Starter Subscription Card
Same structure as Pro card with Starter branding

#### Button Enable Logic (Default View)
- **Add Selected User(s) for Pro:** 
  - Enabled when: At least one "No Access" user selected AND no Starter users selected
  - Action: Assigns Pro subscription with Full Access to all zones

- **Modify Selected Users for Pro:**
  - Enabled when: Only Pro users selected (no Starter, no No Access)
  - Action: Opens zone selection view to modify Pro users' geography

- **Add Selected User(s) for Starter:**
  - Enabled when: At least one "No Access" user selected AND no Pro users selected
  - Action: Assigns Starter subscription with Full Access to all zones

- **Modify Selected Users for Starter:**
  - Enabled when: Only Starter users selected (no Pro, no No Access)
  - Action: Opens zone selection view to modify Starter users' geography

---

### State 2: Zone Selection View

Activated when user clicks "Modify Selected Users" for either subscription type.

#### Header Section
```
Modify 2 Selected Users
Modify the specific zones for the selected users below

[← Return to Overview]
```

#### Zone Controls
- **Select All Checkbox:** 
  - Empty state: No counties selected
  - Indeterminate state (dash): Some counties selected
  - Checked state: All counties selected
  - Label: "Select all counties below to grant users access to all zones"

- **Show All Toggle:**
  - Collapsed: Shows first 3 counties per zone
  - Expanded: Shows all counties in zone
  - Persists per zone (independent toggle state)

#### Zone Accordion Cards

**Zone Header (Clickable)**
```
▼ [Checkbox] Alabama Plus          [ 11 ]
                                    ^^^^
                                    County count in white bubble
```

**Zone Body (Expanded)**
```
[✓] County 1      [ Actions: Remove ]
[✓] County 2      [ Actions: Remove ]
[ ] County 3      [ Actions: Add ]
[ ] County 4      [ Actions: Add ]

[Show all 11 counties]  ← If >3 counties exist
```

#### Zone Rendering Logic
```javascript
// For each zone:
1. Check if any counties in this zone are assigned to any selected user
2. If yes, render zone card
3. For each county:
   - If ALL selected users have this county: Show checked checkbox
   - If SOME selected users have this county: Show indeterminate checkbox
   - If NO selected users have this county: Show unchecked checkbox
```

#### County Checkbox States
- **Checked (✓):** All selected users have access to this county
- **Indeterminate (−):** Some selected users have access, others don't
- **Unchecked ( ):** No selected users have access to this county

#### Action Buttons Per County
- **Add:** Appears when checkbox is unchecked or indeterminate
- **Remove:** Appears when checkbox is checked or indeterminate
- **Behavior:** Clicking adds/removes county for ALL selected users

#### Bottom Action Bar
```
[Cancel]  [Update Geography]
          ^^^^^^^^^^^^^^^^^^
          Primary action button (blue)
```

---

### PRO Badge Implementation

#### Visual Design
- **Color:** Green background (#459d13)
- **Text:** White "PRO" in all caps
- **Location:** Inside the white zone-counter bubble
- **Border Radius:** 30px (pill shape)
- **Font:** 12px, weight 600

#### Display Rules

**User Table - Geography Column:**

1. **No Access Users:**
   ```html
   <span class="zone-badge no-access">No Access</span>
   ```

2. **Full Access Pro Users:**
   ```html
   <span class="zone-badge">
     Full Access 
     <span class="zone-counter">
       <span class="pro-badge">PRO</span>
     </span>
   </span>
   ```

3. **Full Access Starter Users:**
   ```html
   <span class="zone-badge">Full Access</span>
   <!-- No PRO badge for Starter -->
   ```

4. **Modified Access Pro Users:**
   ```html
   <span class="zone-badge">
     Modified 
     <span class="zone-counter">
       <span class="pro-badge">PRO</span> - 3
     </span>
   </span>
   ```

5. **Modified Access Starter Users:**
   ```html
   <span class="zone-badge">
     Modified 
     <span class="zone-counter">3</span>
   </span>
   <!-- PRO badge omitted, just number -->
   ```

#### CSS Classes
```css
.pro-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: #459d13;
  color: #fff;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 4px;
}

.zone-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  background: #feffff;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  color: #1c1f22;
  min-width: 20px;
  height: 20px;
  line-height: 14px;
}

.zone-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #e7e6e5;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  color: #1c1f22;
  height: 26px;
  line-height: 14px;
}
```

---

### Auto-Return to Default View

#### Trigger Condition
When the number of selected users reaches zero (all users unchecked).

#### Behavior
```javascript
function updateRightPanel() {
  var selectedUsers = [];
  
  // Count selected users...
  
  // Auto-return logic
  if(selectedUsers.length === 0) {
    var defaultView = document.getElementById('defaultView');
    var zoneView = document.getElementById('zoneSelectionView');
    defaultView.style.display = 'flex';
    zoneView.style.display = 'none';
    zoneView.classList.remove('active');
  }
}
```

#### User Experience
1. User has 2 Pro users selected
2. Zone selection view is active
3. User unchecks one user → still in zone view
4. User unchecks second user → **automatically** returns to default view
5. User sees the two subscription cards again

**Benefit:** Prevents user from being stuck in empty zone view with no users selected.

---

### Context-Aware Button Logic

#### Add Selected User(s) for Pro
```javascript
// Enable conditions:
selectedNoAccess > 0  // At least one "No Access" user
&& selectedStarter === 0  // No Starter users selected

// Prevents accidentally adding wrong subscription type
```

#### Modify Selected Users for Pro
```javascript
// Enable conditions:
selectedPro > 0  // At least one Pro user
&& selectedStarter === 0  // No Starter users
&& selectedNoAccess === 0  // No "No Access" users

// Ensures only Pro users are being modified
```

#### Add Selected User(s) for Starter
```javascript
// Enable conditions:
selectedNoAccess > 0  // At least one "No Access" user
&& selectedPro === 0  // No Pro users selected

// Prevents mixing Pro and Starter assignments
```

#### Modify Selected Users for Starter
```javascript
// Enable conditions:
selectedStarter > 0  // At least one Starter user
&& selectedPro === 0  // No Pro users
&& selectedNoAccess === 0  // No "No Access" users

// Ensures only Starter users are being modified
```

---

### Workflow Sequences

#### Scenario 1: Adding New User to Pro Subscription
1. User lands on overview page (v2-subscription-overview-multi.html)
2. Clicks "Modify" on Project Intelligence card
3. Arrives at zone selection page (v2-modify-users-workflow-multi.html)
4. Sees default info view with two subscription cards
5. Checks checkbox next to "Kylee Frye" (No Access user)
6. "Add Selected User(s)" button under Pro card becomes enabled
7. Clicks "Add Selected User(s)" for Pro
8. Confirmation modal appears: "User added successfully with Full Access to all zones"
9. User now has Pro subscription with Full Access
10. User table updates showing "Full Access" with PRO badge

#### Scenario 2: Modifying Existing Pro User Geography
1. User is on zone selection page
2. Checks checkbox next to "Malcom Reynolds" (Full Access Pro user)
3. "Modify Selected Users" button under Pro card becomes enabled
4. Clicks "Modify Selected Users" for Pro
5. Right panel switches to zone selection view
6. Header shows "Modify 1 Selected User"
7. All zones display (user has Full Access currently)
8. All county checkboxes are checked
9. User unchecks "Alabama Plus - County 1"
10. Clicks "Update Geography"
11. Success modal shows change summary
12. User now has Modified access (zone count updates to total remaining)
13. Geography column shows "Modified" with PRO badge and count: "PRO - 123"

#### Scenario 3: Mixed Selection Prevention
1. User checks "Malcom Reynolds" (Pro user)
2. User checks "Kylee Frye" (No Access user)
3. Both Pro buttons remain disabled (mixed selection not allowed)
4. User unchecks "Malcom Reynolds"
5. "Add Selected User(s)" for Pro button becomes enabled
6. Context prevents accidental subscription mixing

#### Scenario 4: Bulk Modify Multiple Users
1. User checks 3 Pro users with different access levels:
   - User A: Full Access
   - User B: Modified (5 counties)
   - User C: Modified (3 counties)
2. Clicks "Modify Selected Users" for Pro
3. Zone selection view shows zones containing ANY of the selected users' counties
4. County checkboxes show:
   - Checked: All 3 users have this county
   - Indeterminate: 1-2 users have this county
   - Unchecked: 0 users have this county
5. User unchecks a county that was indeterminate
6. Clicking "Update" removes that county from ALL 3 users
7. Success modal confirms: "Geography updated for 3 users"

---

## Modal States

### Success Modal (Geography Updated)
```
✓
Geography Updated!
User geography has been successfully updated.

[Close]
```

### Confirmation Modal (User Added)
```
✓
User Added Successfully
Malcom Reynolds has been added with Full Access to all purchased zones.

[OK]
```

### Error Handling
- No error states currently implemented
- Future: Handle API failures, validation errors, seat capacity limits

---

## Drawers

### Invite User Drawer (Coming Soon)
**Trigger:** Click "+ Invite" button in top navigation  
**Current State:** Placeholder UI

```
Invite User                                              ✕

            📝
      Invite User Workflow Coming Soon
      
For now, use the "Modify" workflow to manage geographic 
access for existing subscription users.

                    [Close]
```

### User Profile Drawer (Not Implemented)
**Trigger:** Click user name link in table  
**Status:** Placeholder for future implementation

---

## Technical Implementation Notes

### Zone Data Structure
```javascript
{
  id: "1",
  name: "Alabama Plus",
  counties: [
    {id: "1-1", name: "Autauga County"},
    {id: "1-2", name: "Baldwin County"},
    // ... more counties
  ]
}
```

### County Selection State
```javascript
sel.counties = {
  '1-1': true,  // Zone 1, County 1 selected
  '1-2': false, // Zone 1, County 2 not selected
  '2-1': true   // Zone 2, County 1 selected
  // Key format: 'zoneId-countyIndex'
}
```

### Performance Optimization
- Zone data limited to first 10 zones for performance
- County display throttled to 3 visible by default
- "Show all" toggle for full county lists
- Virtual scrolling not implemented (could be future enhancement)

### Browser Compatibility
- Uses ES5 JavaScript (no arrow functions, no const/let)
- Compatible with IE11+ and all modern browsers
- No external dependencies (vanilla JS only)

---

## Design System Adherence

### Colors
- **Pro Green:** #459d13 (PRO badges, Pro progress bars)
- **Starter Blue:** #00a1e0 (Starter progress bars, info toasts)
- **Primary Action:** #1976d2 (Update Geography button)
- **Error Red:** #b70900 (Remove actions, error toasts)
- **Neutral Gray:** #424242 (Cards, secondary elements)
- **Background:** #fafafa (Right panel background)

### Typography
- **Font Family:** Arial, sans-serif
- **Headings:** 16px-28px, weight 600
- **Body Text:** 13-14px, weight 400-500
- **Small Text:** 12px (badges, secondary info)

### Spacing
- **Card Padding:** 20px
- **Section Margins:** 24px-32px
- **Element Gaps:** 8px-16px
- **Border Radius:** 6-8px (cards), 30px (badges/pills)

### Interactive States
- **Hover:** Background color shift, transform: translateY(-2px)
- **Disabled:** opacity: 0.4, cursor: not-allowed
- **Selected:** background: #e3f2fd (light blue)
- **Indeterminate Checkbox:** Custom dash icon

---

## Known Limitations & Future Enhancements

### Current Limitations
1. **Static Data:** All user and zone data is hardcoded (no API integration)
2. **No Validation:** Seat capacity limits not enforced
3. **No Undo:** Changes are immediate with no rollback option
4. **No Search:** Search box is visual only (no functionality)
5. **Limited Zones:** Only first 10 zones loaded for performance

### Planned Enhancements
1. **Invite User Workflow:** Complete drawer implementation for adding new users
2. **API Integration:** Connect to backend for real-time data
3. **Advanced Filtering:** Working search and filter dropdowns
4. **User Profile Drawer:** Complete user detail view
5. **Audit Trail:** Track all geography changes with timestamps
6. **Bulk Actions:** CSV upload, template-based assignments
7. **Seat Enforcement:** Prevent exceeding subscription limits
8. **Zone Analytics:** Usage metrics, popular zones, user coverage

---

## File Dependencies

### External Files
- **complete-zone-data.js** (or simple_complete_zone_data.js)
  - Contains COMPLETE_ZONE_DATA object with all zones and counties
  - Used by both overview and workflow pages

### Inline Dependencies
- No jQuery
- No React/Vue/Angular
- No CSS frameworks (Bootstrap, Tailwind)
- Pure vanilla JavaScript and CSS

---

## Testing Scenarios

### Test Case 1: Add User to Pro
1. Select "No Access" user
2. Verify Pro "Add Selected User(s)" button enables
3. Click button
4. Verify confirmation modal
5. Verify user now shows "Full Access" with PRO badge
6. Verify seat count increments

### Test Case 2: Modify Pro User
1. Select Pro user with Full Access
2. Click "Modify Selected Users" for Pro
3. Uncheck 5 counties across 2 zones
4. Click "Update Geography"
5. Verify success modal
6. Verify user shows "Modified PRO - [count]"
7. Verify zone count is correct

### Test Case 3: Mixed Selection Prevention
1. Select 1 Pro user + 1 Starter user
2. Verify all buttons remain disabled
3. Deselect one user type
4. Verify appropriate buttons enable

### Test Case 4: Auto-Return to Default
1. Select 2 users
2. Enter zone selection view
3. Uncheck both users one by one
4. Verify automatic return to default view on second uncheck

### Test Case 5: Bulk County Assignment
1. Select 3 users with different access levels
2. Enter zone selection view
3. Select "Select all counties" checkbox
4. Verify all counties become checked
5. Click "Update Geography"
6. Verify all 3 users now have Full Access

---

## Accessibility Notes

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows visual layout
- Checkboxes use native input elements

### Screen Readers
- Buttons have descriptive labels
- Tooltips provide additional context
- State changes announced (future enhancement)

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Icons supplemented with text labels
- Status not conveyed by color alone

---

## Git Repository
**Repository:** STaylor-Figma/User-Management-Portal-Geographies  
**Branch:** main  
**Key Files:**
- v2-subscription-overview-multi.html
- v2-modify-users-workflow-multi.html
- complete-zone-data.js

**Recent Commits:**
- cb24553: Update Invite User drawer in overview pages
- cec2b87: Remove speculative feature list from Invite User drawer
- 7c764aa: Update drawer headline to "Invite User Workflow Coming Soon"
- feb1c7a: Change drawer title from "Add User Flow" to "Invite User"

---

## Contact & Support
For questions about this implementation or to request new features, contact the UX team or reference this documentation in your AI project prompts.

**Last Updated:** January 16, 2026  
**Version:** 2.0 (Multi-Subscription Flow)  
**Status:** ✅ Complete and Testing Ready
