# UMP Prototype — Session Summary

**Project:** User Management Portal (External UMP) Prototype  
**Location:** `~/Desktop/ConstructConnect-Projects/platform-services-portals/version-two/`  
**Live URL:** https://platform-services-portals.vercel.app  
**GitHub:** https://github.com/STaylor-Figma/User-Management-Portal-Geographies  
**Team Playground:** https://github.com/squigs-design/Prototype-playground  

---

## What We Built

### Elasticsearch AI Task Assistant
The core concept: instead of treating Elasticsearch as "just search," we reimagined it as an intelligent task assistant embedded directly in the UMP. Users land on the portal and can ask in plain language what they're trying to accomplish — the assistant guides them to the right place or pulls up the right information.

- Built a conversational agent UI on the landing page (`v2-landing.html`) and team member page (`v2-team-member.html`)
- Agent responds contextually based on the user's persona (Owner, Admin, Team Member)
- Designed to be powered by Elasticsearch agent tool definitions fed by ORCA data — no heavy custom code
- Changed agent avatar branding from "ES" to "CC" for ConstructConnect
- Added an info modal on the assistant page explaining how the AI assistant was built (for presentation purposes)

### Three Entry Points
Simplified `version-two.html` to only three clear paths:
1. **Single Subscription** — org with one Project Intelligence subscription
2. **Multi Subscription** — org with multiple subscriptions
3. **Team Member** — limited view, no side navigation, agent-first experience

### Full Prototype Pages
- Landing pages (single + multi subscription, team member)
- My Profile (single + multi)
- Company Overview
- Subscription Overview (single + multi)
- Users & Groups
- User Roles (single + multi)
- Project Intelligence / Geographies (single + multi) — with full modify-users workflow
- Takeoff & Estimating (single + multi)
- Bid Management (single + multi)

---

## Data Foundation

Before any design work, we built a comprehensive data foundation:

### ORCA Tables Collected
- External UMP Complete ORCA
- Internal Admin Portal Complete ORCA
- Geographic Entitlements ORCA (Project Intelligence only)
- Takeoff & Estimating ORCA + Roles
- Bid Management ORCA + Roles
- Users ORCA
- Groups ORCA

### Mock Data Specs Created
- Project Intelligence subscriptions and zone data (3 CSV files of MarketZone-to-county mappings)
- Takeoff & Estimating subscriptions and licensing
- Bid Management subscriptions and seat management
- Users (47 normalized users across the org)
- Groups

### Elasticsearch Research
- KB Platform Research for External UMP Agent
- Agent Architecture and API Research
- Elasticsearch agent tool definitions aligned with ORCA data
- Three-Layer Agent Pattern: Proactive/Watcher, Intelligent Search/ESRE, Conversational Agent

---

## Blueprint Design System Compliance

Systematically audited and updated every component to match the Blueprint design system specs.

### Components Standardized

| Component | What was fixed |
|---|---|
| **Header** | Matched Blueprint header spec — correct background, icon buttons sized per IconButton spec, proper spacing |
| **Checkboxes** | All checkboxes across the prototype use Blueprint `.bp-checkbox` styling. Fixed Font Awesome SVG rendering issue where FA Kit replaces `<i>` with `<svg>`, breaking className updates. Solution: rebuild the `<i>` element on every state change. |
| **Tabs** | Removed 6 files of inline tab CSS overrides. Consolidated all tab styling to `blueprint-workflow-styles.css`. Fixed `.tab-count` vs `.tab-counter` class mismatch. All states (default, hover, active) now match Blueprint Tab Molecule spec. |
| **Input Fields** | Unified 6+ different input class patterns (`.form-input`, `.field-input`, `.agent-input`, `.invite-form-input`, `.bp-input`) to a single Blueprint Input Field Molecule spec. Fixed border color (neutral-400), background (primary-10), hover (primary-100 bg + primary-500 border), focus (primary-100 border + shadow), placeholder (italic, weight 300, neutral-500). |
| **Labels** | Aligned to Label Atom spec: 11px, weight 600, neutral-600 |
| **Dropdown Buttons** | Filter dropdowns above tables updated to Blueprint dropdown button spec |
| **Pills** | Standardized all subscription/access level pills to consistent height (26px) and Blueprint pill styling |
| **Badges** | Fixed doubled role badge text caused by CSS `::after` pseudo-elements. Kept role badges (Owner, Admin) separate from subscription pills. |
| **Accordions** | Updated to Blueprint accordion default style with user counts |
| **Icon Buttons** | Header icon buttons sized per Blueprint IconButton spec |
| **Cards** | All card borders set to `neutral-300` for consistency |
| **Modals & Drawers** | Fixed `.active` vs `.show` CSS class mismatch that broke modal/drawer visibility |

### Shared Stylesheet
`blueprint-workflow-styles.css` is now the single source of truth for all Blueprint component styling across the prototype.

---

## Functional Workflows Implemented

### Project Intelligence / Geographies
- Select/deselect users with header "select all" (includes indeterminate state)
- Select/deselect geographic zones with "select all zones"
- Add users from available pool with confirmation modal
- Remove users with confirmation
- Save changes with summary modal showing what was modified
- "Modified" badge with tooltip showing what the user had in that subscription
- Works for both single and multi-subscription variants

### Takeoff & Estimating
- Dual license support: users can have Web, Desktop, or both
- Add license action correctly shows when user is missing either license type
- Remove license modal with radio picker when user has both licenses (choose Desktop, Web, or Both)
- Bulk actions for selected users

### Bid Management
- Seat activation/deactivation toggles
- Select all / individual user selection
- Bulk actions

### Users & Groups
- Invite user modal with form fields
- Edit user drawer
- Create/edit group modals
- User table with selection and actions

### Persona Toggle
- Dynamic switching between Owner, Admin, and Team Member views
- Repositioned to top-right of header (was bottom-right, obstructing actions)
- Admin view correctly hides Billing navigation
- Affects visible content, navigation, and available actions across all pages

---

## Data Normalization

- Normalized all mock user data across 10+ HTML files for consistency
- Standardized to 47 users across the org
- Fixed persistent email inconsistencies (e.g., `christopher.donaldson@acmebpm.com`)
- All dates formatted as three-letter month abbreviations (e.g., "Jan 15, 2025")
- Admin contact information consistent across all pages

---

## Documents Created

| Document | Purpose |
|---|---|
| `ELASTICSEARCH_AGENT_PROPOSAL.md` | Technical proposal for the dev team explaining how to use Elasticsearch agents in the UMP without heavy custom code |
| `TASK_ASSISTANT_BUILD_GUIDE.md` | Explains how the AI assistant was built, what data was used, how agents were set up — for presentation |
| `FIGMA_AI_READY_GUIDE.md` | Checklist and template guide for structuring Figma files for optimal AI readability |
| `WORKFLOW_MAP.md` | Detailed workflow map of the Project Intelligence / Geographies section |
| `SESSION_SUMMARY.md` | This document |

---

## Cursor Skill Created

### `es-task-assistant-builder`
A Cursor skill to help other team members create their own Elasticsearch AI task assistants.
- 8-phase guided process: Define Section → Define Personas → Collect ORCA Data → Map to APIs → Write Tool Definitions → Design Proactive Alerts → Craft Agent Responses → Build Prototype
- Includes `examples.md` with concrete examples from the UMP implementation
- Zipped and placed on Desktop at `~/Desktop/es-task-assistant-builder.zip`

---

## FigJam Diagrams Created

1. **Detailed Workflow Diagram** — Full flow of the Project Intelligence / Geographies section including user entry points, actions, modals, drawers, single/multi-subscription differences, and persona differences
2. **Simplified Storyboard** — User-focused workflow view for presentation

---

## Deployments

### Vercel (Primary)
- **Production URL:** https://platform-services-portals.vercel.app
- Every change committed, pushed to GitHub, and deployed with `npx vercel --prod`

### Team Prototype Playground
- Synced to `squigs-design/Prototype-playground` on request
- Separate repository — does not auto-sync with the primary repo

### GitHub
- All code version-controlled at https://github.com/STaylor-Figma/User-Management-Portal-Geographies
- Full commit history available for the dev team

---

## Blueprint Skill Updates

- Installed `blueprint-02` skill initially for design system reference
- Updated to `blueprint-04` skill with latest component specifications (Tab Molecule, Input Field Molecule, etc.)
- Located at `~/.claude/skills/blueprint01/`

---

## Key Technical Decisions

1. **Static HTML prototype** — Chose static HTML/CSS/JS over a framework to keep it lightweight and immediately deployable. Future production would use Next.js/React.
2. **Font Awesome Kit SVG rendering** — FA Kit replaces `<i>` elements with `<svg>`, breaking standard DOM manipulation. Solution: always remove and recreate the `<i>` element rather than trying to update classes on existing elements.
3. **Single shared stylesheet** — `blueprint-workflow-styles.css` as the central source of truth prevents inconsistencies across pages.
4. **Persona toggle via CSS classes** — Body-level classes (`persona-admin`, `persona-owner`) control visibility across the entire page without JavaScript per-element logic.
5. **Modal class naming** — Standardized on supporting both `.active` and `.show` classes for modal/drawer visibility to prevent future mismatches.

---

## What's Next (Potential)

- Internal Admin Portal (Glean agent integration)
- Billing section (currently links out to Zuora)
- Production React/Next.js implementation
- Real Elasticsearch agent integration with live tool definitions
- Additional subscription sections and workflows
- Responsive breakpoint refinement

---

*This summary covers work done across an extended Cursor AI session on the ConstructConnect User Management Portal prototype.*
