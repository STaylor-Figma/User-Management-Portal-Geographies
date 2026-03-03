# Figma AI-Ready File Guide

A practical checklist and template guide for structuring Figma files so AI tools (Cursor + Figma MCP) can accurately read and implement layouts with minimal rework.

---

## Why this matters

The Figma MCP tools (`get_design_context`, `get_screenshot`) return a structured representation of your Figma frames — layer names, auto layout properties, component references, variable bindings, and annotations. The cleaner and more intentional the file structure, the more accurately AI translates the design into production code using the Blueprint design system.

**Well-structured file → near-direct CSS/React translation**
**Loosely structured file → AI guesses at structure, spacing, and hierarchy**

---

## Quick checklist

Use this before handing off any page or frame for AI implementation.

### Layer naming
- [ ] All frames and groups have **semantic names** describing purpose (e.g., "Header", "Subscription Card", "User Table", "Action Bar")
- [ ] No generic names left behind ("Frame 1", "Group 5", "Rectangle 12")
- [ ] Nested components use a **slash-separated naming convention** where helpful (e.g., "card/subscription", "nav/sidebar", "modal/invite-user")
- [ ] Boolean/visibility layers are named to describe what they toggle (e.g., "Show Icon", "Has Badge")

### Auto Layout
- [ ] Every section that can use auto layout **does** use auto layout
- [ ] **Gap** values are set explicitly (not approximated with spacer rectangles)
- [ ] **Padding** values are set explicitly on the frame (top, right, bottom, left)
- [ ] Sizing uses **Fill container** or **Hug contents** intentionally — not fixed widths unless truly fixed
- [ ] Direction (horizontal/vertical) matches the intended CSS flex direction
- [ ] Alignment (top-left, center, space-between) is set on the auto layout frame, not faked with margins

### Design tokens & variables
- [ ] **Colors** are bound to Blueprint variables (e.g., `neutral-300`), not hardcoded hex values
- [ ] **Spacing** uses Blueprint spacing tokens where possible
- [ ] **Border radius** uses Blueprint radius tokens (e.g., `radius-pill`, `radius-medium`)
- [ ] **Typography** uses Blueprint text styles, not manually set font/size/weight
- [ ] If a value doesn't map to an existing token, note it with an annotation so the developer knows it's intentional

### Component usage
- [ ] Blueprint library components are used wherever a matching component exists
- [ ] Components are **not detached** — detaching breaks the component name and Code Connect link
- [ ] If a component needs customization, use **overrides** (swap instance, change text, toggle properties) instead of detaching
- [ ] Custom/one-off elements that don't exist in Blueprint are clearly named and annotated as "custom"

### Page & frame organization
- [ ] A dedicated **"Ready for Dev"** page (or section) contains only the final frames to implement
- [ ] Explorations, old versions, and experiments live on a **separate page** (e.g., "Exploration", "Archive")
- [ ] Each ready-for-dev frame is **sized to a target breakpoint** (XL/Desktop, Tablet, Mobile) when responsive behavior matters
- [ ] Frames read **top-to-bottom or left-to-right** in the intended implementation order
- [ ] No hidden layers that shouldn't be part of the implementation are left visible in the layer panel

### Annotations
- [ ] **Behavioral notes** use Figma's built-in annotation feature (these come through the MCP tools)
- [ ] Conditional logic is annotated directly (e.g., "Only visible for Owner role", "Collapsed on mobile", "Shows when count > 0")
- [ ] Interaction notes describe what happens on click/hover if not obvious from the design
- [ ] Sticky notes and comment threads are **not** relied on for implementation details (these don't come through MCP)

---

## Template structure

Use this as a starting point when creating a new Figma file for AI implementation.

```
📄 Figma File
│
├── 📑 Cover
│   └── Thumbnail, project name, status, last updated
│
├── 📑 Ready for Dev
│   ├── 🖼 [Feature/Page] — XL (1440px)
│   │   ├── Header
│   │   ├── Main Content
│   │   │   ├── Section A
│   │   │   ├── Section B
│   │   │   └── Section C
│   │   └── Footer
│   ├── 🖼 [Feature/Page] — Tablet (768px)
│   └── 🖼 [Feature/Page] — Mobile (375px)
│
├── 📑 Components (local)
│   └── Any project-specific components not in Blueprint
│
├── 📑 Exploration
│   └── Work-in-progress, alternatives, discarded ideas
│
└── 📑 Archive
    └── Previous versions kept for reference
```

### Frame setup for each breakpoint

When creating a "Ready for Dev" frame:

1. **Set the frame width** to the target breakpoint
2. **Use auto layout** on the outermost frame (vertical, gap matching your page spacing)
3. **Name the frame** with the feature and breakpoint: `UMP Landing — XL`, `User Table — Tablet`
4. **Build top-to-bottom** in the order content should appear in the DOM
5. **Bind all values to tokens** — colors, spacing, typography, radii

### Naming convention reference

| Layer type | Naming pattern | Example |
|---|---|---|
| Page sections | PascalCase or descriptive | `Header`, `Main Content`, `Footer` |
| Cards / containers | category/name | `card/subscription`, `card/user-profile` |
| Navigation | nav/location | `nav/sidebar`, `nav/breadcrumb` |
| Modals / drawers | modal/purpose | `modal/invite-user`, `drawer/filters` |
| Tables | table/data-type | `table/users`, `table/subscriptions` |
| Form fields | field/name | `field/email`, `field/role-select` |
| Buttons / actions | action/purpose | `action/save`, `action/cancel`, `action/delete` |
| Status indicators | status/state | `status/active`, `status/pending` |

---

## What AI can and cannot read from Figma

### Comes through clearly
- Layer names and hierarchy
- Auto layout properties (direction, gap, padding, alignment, sizing)
- Variable/token bindings (colors, spacing, typography)
- Component names and Code Connect mappings
- Built-in Figma annotations
- Text content
- Frame dimensions and constraints
- Asset export settings

### Does NOT come through
- Prototype interactions (click targets, transitions, overlays)
- Comments and comment threads
- Sticky notes placed outside frames
- Cursor/selection state
- Version history
- Detached component origins (once detached, the link to the source component is gone)

---

## Common mistakes to avoid

| Mistake | Why it's a problem | Fix |
|---|---|---|
| Unnamed layers | AI can't determine purpose, guesses from position | Name every frame and group semantically |
| Absolute positioning instead of auto layout | AI gets x/y coordinates but no layout intent — responsive behavior is guesswork | Use auto layout; set direction, gap, padding |
| Hardcoded hex colors | AI can't map to design tokens, may pick the wrong variable | Bind to Blueprint color variables |
| Detached components | Component name and Code Connect link are lost | Use overrides instead of detaching |
| Spacer rectangles for spacing | AI sees them as visual elements, not whitespace | Use auto layout gap and padding |
| Hidden layers left in the tree | AI may pull them into the implementation | Delete or move to a separate page |
| Design notes as sticky notes | MCP tools don't read sticky notes | Use Figma's built-in annotation feature |
| Multiple states in one frame | AI can't tell which is the "default" | Use component variants or separate frames, clearly named |
| Explorations mixed with final designs | AI implements the wrong version | Keep a clean "Ready for Dev" page |

---

## Handoff prompt template

When asking AI to implement a design, provide this context:

```
Implement the [feature name] from our Figma file.

Figma link: [paste link with node-id]
Breakpoints needed: [XL only / XL + Tablet + Mobile]
Page type: [new page / update to existing page]
Personas/roles affected: [Owner / Admin / Team Member / all]
Conditional logic: [describe any show/hide or role-based behavior]
Data source: [static mock / API endpoint / existing mock data in prototype]
```

This gives AI everything it needs to pull the design context, write the layout spec, and implement accurately on the first pass.

---

## Keeping this guide updated

As the Blueprint design system evolves and new components are added, update this guide to reflect:

- New component naming conventions
- New token categories
- Changes to the "Ready for Dev" workflow
- Lessons learned from AI implementation rounds

---

*Created for the ConstructConnect design team. Based on practical experience with Cursor AI + Figma MCP integration and the Blueprint design system.*
