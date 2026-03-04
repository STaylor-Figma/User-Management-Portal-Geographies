# Project Intelligence & Geographies — Workflow Map

*Prototype reference for the UMP external admin portal*
*Covers: Entry points, user flows, interactions, and persona differences*

---

## Page Inventory

| Page | File | When to use |
|------|------|-------------|
| Landing (Home) | `v2-landing.html` | Single-subscription entry point |
| Organization Overview (Single) | `v2-subscription-overview.html` | Single CCPI subscription |
| Organization Overview (Multi) | `v2-subscription-overview-multi.html` | Multiple CCPI subscriptions (Starter + Pro) |
| PI Geographies (Single) | `v2-modify-users-workflow.html` | Manage geographic entitlements, single subscription |
| PI Geographies (Multi) | `v2-modify-users-workflow-multi.html` | Manage geographic entitlements, multiple subscriptions |

---

## How Users Get There

```
version-two.html (Entry Chooser)
├── Single Subscription ─────► v2-landing.html (Home)
│                                   │
│                                   ├── Sidebar: "Subs & Licenses"
│                                   │         │
│                                   │         ▼
│                                   │   v2-subscription-overview.html
│                                   │         │
│                                   │         ├── PI tab or PI card click
│                                   │         │         │
│                                   │         │         ▼
│                                   │         │   v2-modify-users-workflow.html
│                                   │         │
│                                   │         ├── Bid Management tab ──► v2-bid-management-subscriptions.html
│                                   │         └── Takeoff tab ──────────► v2-takeoff-estimating.html
│                                   │
│                                   └── Agent bar ─► contextual help
│
├── Multiple Subscriptions ──► v2-subscription-overview-multi.html
│                                   │
│                                   ├── PI tab or PI card click
│                                   │         │
│                                   │         ▼
│                                   │   v2-modify-users-workflow-multi.html
│                                   │
│                                   ├── Bid Management tab ──► v2-bid-management-subscriptions-multi.html
│                                   └── Takeoff tab ──────────► v2-takeoff-estimating-multi.html
│
└── Team Member ─────────────► v2-team-member.html (no admin pages)
```

---

## Organization Overview Page

### What the user sees

**Subscription cards (top section):**
- Project Intelligence card showing seat usage (e.g., 7/20), geographic access summary (counties, states), category access, and renewal date
- Bid Management and Takeoff & Estimating cards (separate subscriptions)

**User table (below cards):**
- Columns: User Name, Project Intelligence access, Bid Management access, Takeoff & Estimating access, Last Access Date
- Filter dropdowns: Subscriptions, Roles, Groups
- Pagination controls

### Actions available

| Action | What happens |
|--------|-------------|
| Click **Project Intelligence** tab | Navigates to PI Geographies page |
| Click **PI subscription card** | Navigates to PI Geographies page |
| Click **Invite User** (header) | Opens the Invite Users drawer |
| Click a **user name** | Opens User Profile drawer |
| Change **filter dropdowns** | Filters the user table |

### Multi-subscription difference
- PI card shows **two seat groups**: Starter (7/20) and Pro (7/7, out of seats)
- PI card shows **Market Zone badges** (Alaska, IL-Chicago, CA-Northern)
- User table PI column shows subscription tier badges (PRO, 123)

---

## PI Geographies Page — Layout

### Split-panel design

```
┌──────────────────────────────────────────────────────────────────┐
│  Header: "Subscriptions & Licenses"   [Invite] [History] [Help] │
├──────────────────────────────────────────────────────────────────┤
│  Tabs: Org Overview | PROJECT INTELLIGENCE | Bid Mgmt | Takeoff │
├────────────────────────────┬─────────────────────────────────────┤
│                            │                                     │
│   LEFT PANEL               │   RIGHT PANEL                       │
│   User Table               │   (changes based on context)        │
│                            │                                     │
│   ☐ Select All             │   STATE 1: Default Info View        │
│   ────────────────         │   - Subscription card (seats)       │
│   ☐ Malcolm Reynolds       │   - "Add Selected User(s)"          │
│     Full Access  [✕]       │   - "Modify Selected Users"         │
│   ☐ River Tam              │                                     │
│     Modified (3) [✕]       │   STATE 2: Zone Selection View      │
│   ☐ Zoe Washburne          │   - Zone search                     │
│     Modified (5) [✕]       │   - ☐ Select All Zones              │
│   ☐ Kaylee Frye            │   - Zone accordions with counties   │
│     No Access    [+]       │   - [Cancel] [Save Updates]         │
│   ☐ Simon Tam              │                                     │
│     No Access    [+]       │                                     │
│                            │                                     │
└────────────────────────────┴─────────────────────────────────────┘
```

---

## Workflow 1: View Current Access

**Goal:** See which users have geographic access and what zones/counties they can see.

1. Navigate to PI Geographies page (via tab or card)
2. User table shows each user with their access level:
   - **Full Access** — user can see all zones and counties
   - **Modified (N)** — user has access to N specific counties
   - **No Access** — user has no geographic entitlement
3. Right panel shows subscription seat summary (seats used vs available)

---

## Workflow 2: Add a User (Full Access)

**Goal:** Give a user who currently has No Access full geographic access.

### Option A — Single user via row action
1. Find the user with "No Access" in the table
2. Click the **"+ Add"** button on their row
3. User is assigned Full Access
4. **Confirmation Modal** appears: "User Added Successfully"
5. Table updates to show "Full Access" for that user

### Option B — Multiple users via selection
1. Check the boxes next to one or more "No Access" users
2. Right panel enables the **"Add Selected User(s)"** button
3. Click "Add Selected User(s)"
4. All selected users receive Full Access
5. Table updates

---

## Workflow 3: Modify Geographic Access

**Goal:** Change a user's access from Full Access to specific zones/counties, or change which zones/counties a Modified user can see.

1. Check the box next to one or more users who have Full Access or Modified access
2. Right panel enables the **"Modify Selected Users"** button
3. Click "Modify Selected Users"
4. Right panel switches to **Zone Selection View**:

```
┌─────────────────────────────────────┐
│  PI Starter Seats: 7/20 used        │
│                                     │
│  "Select one or more zones below…"  │
│                                     │
│  ☐ Select All Zones                 │
│  🔍 Search zones...                 │
│                                     │
│  ▶ Alaska (3 counties)          ☐   │
│  ▼ IL-Chicago (5 counties)      ☑   │
│    ├── ☑ Cook County (IL)           │
│    ├── ☑ DuPage County (IL)         │
│    ├── ☐ Kane County (IL)           │
│    ├── ☐ Lake County (IL)           │
│    └── ☑ Will County (IL)           │
│       Show all 5 counties           │
│  ▶ CA-Northern (4 counties)     ☐   │
│  ▶ TX-Dallas (6 counties)       ☐   │
│  ...                                │
│                                     │
│  [Cancel]          [Save Updates]   │
└─────────────────────────────────────┘
```

5. Expand zone accordions to see individual counties
6. Check/uncheck zones (selects all counties in that zone) or individual counties
7. Use **"Select All Zones"** checkbox for bulk selection
8. **Zone checkbox states:**
   - ☐ Unchecked — no counties selected
   - ☑ Checked — all counties selected
   - ▣ Indeterminate — some counties selected
9. Click **"Save Updates"**
10. **Success Modal** appears: "Geography Updated!" with summary
11. Right panel returns to Default Info View
12. Table updates: user shows "Modified (N)" with county count

**To cancel:** Click "Cancel" — returns to Default Info View with no changes.

---

## Workflow 4: Remove Geographic Access

**Goal:** Revoke a user's geographic entitlement entirely.

1. Find the user with Full Access or Modified access
2. Click the **"✕ Remove"** button on their row
3. Confirm the removal
4. User is set to "No Access"
5. Table updates, and the row action changes from "✕ Remove" to "+ Add"

---

## Workflow 5: Invite a New User

**Goal:** Add a new person to the organization and optionally assign them subscriptions.

1. Click **"Invite User"** in the page header (available on any page)
2. **Invite Users Drawer** opens from the right
3. Toggle between **Individual Mode** and **Bulk Mode**

**Individual Mode:**
- Enter: First Name, Last Name, Email, Job Title
- Select Organizational Role (dropdown)
- Assign licenses via checkboxes:
  - Project Intelligence (Starter/Pro)
  - Takeoff & Estimating (OST, OST with AI, Planviewer, QuickBid)
  - Bid Management
- Click "Send Invitation" (disabled in prototype)

**Bulk Mode:**
- Upload a CSV file
- Preview/confirm users

4. Close drawer to return to current page

---

## Multi-Subscription Differences

### Default Info View (right panel)

**Single subscription:**
```
┌─────────────────────────────────────┐
│  PI Starter Seats                   │
│  7/20 used · 13 available          │
│                                     │
│  [Add Selected User(s)]            │
│  [Modify Selected Users]           │
└─────────────────────────────────────┘
```

**Multiple subscriptions:**
```
┌─────────────────────────────────────┐
│  PI Pro Seats                       │
│  7/7 used · 0 available            │
│                                     │
│  [Add Selected to Pro]             │
│  [Modify Pro Users]                │
│                                     │
│  ─────────────────────             │
│                                     │
│  PI Starter Seats                   │
│  7/20 used · 13 available          │
│                                     │
│  [Add Selected to Starter]         │
│  [Modify Starter Users]            │
└─────────────────────────────────────┘
```

### User table access badges

| Single | Multi |
|--------|-------|
| Full Access | Full Access PRO |
| Modified (3) | Modified PRO (3) |
| No Access | No Access |
| — | Full Access 123 (Starter) |
| — | Modified 123 (2) |

---

## Persona Differences (Admin vs Owner)

| Element | Admin | Owner |
|---------|-------|-------|
| **Billing** nav item | Hidden | Visible |
| **Billing Info** on landing | Hidden | Visible |
| All PI/Geographies functionality | Full access | Full access |
| Invite users | Yes | Yes |
| Modify geographies | Yes | Yes |
| Remove access | Yes | Yes |

Both Admin and Owner have **identical access** to all PI/Geographies workflows. The only difference is Billing visibility, which is outside the PI section.

---

## Interactive Components Reference

### Zone Accordions
- Click the zone header row to expand/collapse
- Shows county list with checkboxes when expanded
- "Show all N counties" link to reveal full list if truncated
- Zone-level checkbox: toggles all counties in that zone

### Checkboxes (Blueprint spec)
- ☐ Unchecked: `fa-regular fa-square`, neutral-400
- ☑ Checked: `fa-solid fa-square-check`, primary-400 (blue)
- ▣ Indeterminate: `fa-solid fa-square-minus`, primary-400 (blue)

### Select All Logic
- **Select All Users** (left panel): toggles all user row checkboxes
- **Select All Zones** (right panel): toggles all zone and county checkboxes
- Both use indeterminate state when partially selected

### Button Enable/Disable Rules
- **Add Selected User(s):** Enabled when at least one "No Access" user is selected
- **Modify Selected Users:** Enabled when at least one "Full Access" or "Modified" user is selected
- **Save Updates:** Enabled when at least one county is selected in zone view
- **Cancel:** Always enabled in zone view

---

## Data Sources

| Data | Source |
|------|--------|
| Zone and county data | `complete-zone-data.js` (first 10 zones used) |
| User mock data | Inline JavaScript arrays in each page |
| Invite drawer | `invite-drawer.js` (shared) |
| Persona state | `persona-toggle.js` (localStorage) |

---

## Known Prototype Limitations

1. **Zone search** input has no handler — visual only
2. **User search** input on overview pages has no handler — visual only
3. **Send Invitation** button is always disabled — no backend
4. **Multi-subscription Add/Modify** buttons pass subscription type but the underlying JS does not differentiate — both operate on the same zone set
5. **Pagination** controls are visual only — no actual paging
6. **User Profile Drawer** is a placeholder — no detailed content

---

*Document prepared for presentation. Based on the prototype at `platform-services-portals/version-two/`.*
