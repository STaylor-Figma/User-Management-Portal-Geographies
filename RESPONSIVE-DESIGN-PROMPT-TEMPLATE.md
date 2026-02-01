# Responsive Design Implementation Prompt Template

Use this prompt template to implement responsive design that follows design system specifications and ensures proper mobile/tablet layout.

---

## Prompt Template

```
I need you to implement responsive design for [PAGE NAME] following our [DESIGN SYSTEM NAME] specifications.

DESIGN SYSTEM BREAKPOINTS:
- [XXXpx]: [Mobile/Tablet/Desktop description]
- [XXXpx]: [Mobile/Tablet/Desktop description]
- [XXXpx]: [Mobile/Tablet/Desktop description]
- [XXXpx+]: [Desktop description]

DESIGN SPECIFICATIONS LINKS (if available):
- [Figma link 1 - breakpoint spec]
- [Figma link 2 - navigation spec]
- [Figma link 3 - header spec]

LAYOUT REQUIREMENTS:

Desktop View (≥[XXX]px):
- [Describe desktop layout - e.g., "Side-by-side panels: user table on left (50%), subscription cards on right (50%)"]
- [Navigation type - e.g., "Fixed sidebar (65-75px width)"]
- [Header height - e.g., "60px header"]

Tablet/Mobile View (≤[XXX]px):
- [Describe stacking behavior - e.g., "Stack panels vertically"]
- [Content order priority - e.g., "Subscription cards on top (~50vh), user table below"]
- [Navigation type - e.g., "Hamburger menu with 320px slide-out drawer"]
- [Header height - e.g., "44-48px header"]

SPECIFIC REQUIREMENTS:
1. Use CSS flexbox `order` property to control stacking order on mobile/tablet
2. Hamburger menu should:
   - Show at [XXX]px and below
   - Use 3-line animated icon (transforms to X when active)
   - Slide-out drawer should be [XXX]px wide
   - Include overlay that dismisses menu when clicked
3. Header heights should match design system specs exactly
4. All breakpoints should be implemented with @media queries
5. DO NOT use industry-standard breakpoints - use ONLY the design system specified breakpoints
6. Test stacking behavior at ALL breakpoints, not just the smallest

IMPLEMENTATION APPROACH:
- Start by retrieving design context from Figma if links are provided
- Implement base desktop styles first
- Add responsive breakpoints from largest to smallest
- Use `order` property within media queries to control mobile stacking
- Ensure hamburger menu and navigation drawer are properly implemented
- Set appropriate min-heights for sections (e.g., 50vh for priority content on mobile)

FILES TO UPDATE:
- [filename1.html]
- [filename2.html]

After implementation, commit changes with descriptive message and push to GitHub.
```

---

## Example (Based on This Project)

```
I need you to implement responsive design for the Zone Assignment Workflow pages following our Blueprint Component Library specifications.

DESIGN SYSTEM BREAKPOINTS:
- 375px: Mobile Phone Layout
- 600px: Tablet Layout Small
- 768px: Tablet Layout (portrait)
- 1024px: Tablet Layout Landscape
- 1440px+: Large and Extra Large Layout (Desktop)

DESIGN SPECIFICATIONS LINKS:
- https://www.figma.com/design/gPXcCBbv2now1CwDx5TUGG/Blueprint-Component-Library?node-id=945-3202 (Mobile)
- https://www.figma.com/design/gPXcCBbv2now1CwDx5TUGG/Blueprint-Component-Library?node-id=768-2225 (Tablet)
- https://www.figma.com/design/gPXcCBbv2now1CwDx5TUGG/Blueprint-Component-Library?node-id=13943-2942 (Tablet Landscape)
- https://www.figma.com/design/gPXcCBbv2now1CwDx5TUGG/Blueprint-Component-Library?node-id=8885-3358 (Desktop)

LAYOUT REQUIREMENTS:

Desktop View (≥1440px):
- Side-by-side split view: user table on left (50%), subscription cards on right (50%)
- Fixed sidebar navigation (65-75px width)
- 60px header height

Tablet/Mobile View (≤1024px):
- Stack panels vertically
- Subscription cards on top (~50vh height) - this is the priority content
- User table below
- Hamburger menu with 320px slide-out navigation drawer
- 44-48px header height

SPECIFIC REQUIREMENTS:
1. Use CSS flexbox `order` property to ensure subscription cards show first on mobile
2. Hamburger menu should:
   - Show at 1024px and below
   - Use 3-line animated icon (transforms to X when active)
   - Slide-out drawer should be 320px wide from left
   - Include dark overlay (rgba(0,0,0,0.5)) that dismisses menu when clicked
3. Header heights: 44px (mobile), 44-48px (tablet), 60px (desktop)
4. Apply stacking behavior to ALL breakpoints: 1024px, 768px, 600px, 375px
5. Left panel gets `order: 2`, right panel gets `order: 1` on mobile
6. Right panel (subscription cards) should have `min-height: 50vh` on mobile

IMPLEMENTATION APPROACH:
- Retrieve design context from all Figma links
- Implement @media (max-width: 1024px) first with split-view stacking
- Add order properties: .left-panel { order: 2; } .right-panel { order: 1; }
- Continue down to smaller breakpoints (768px, 600px, 375px)
- Ensure hamburger menu and drawer are properly styled
- Test at each breakpoint to verify stacking order

FILES TO UPDATE:
- v2-modify-users-workflow-multi.html
- v2-modify-users-workflow.html

After implementation, commit with message describing the responsive changes and push to GitHub.
```

---

## Key Principles

1. **Always start with design system specs** - Never assume industry-standard breakpoints
2. **Use Figma links** - Retrieve actual design context rather than guessing
3. **Control mobile stacking with CSS `order`** - Don't rely on DOM order alone
4. **Test ALL breakpoints** - Not just the smallest, ensure behavior is consistent across ranges
5. **Match exact specifications** - Header heights, drawer widths, etc. should match design system
6. **Commit and push** - Always version control responsive changes

---

## Common Pitfalls to Avoid

❌ Using Bootstrap/Tailwind standard breakpoints (768px, 992px, 1200px) instead of design system specs  
❌ Only adding `order` to one breakpoint instead of all stacking breakpoints  
❌ Assuming DOM order will control mobile stacking (it won't with flexbox)  
❌ Forgetting to add split-view stacking behavior to tablet landscape breakpoint  
❌ Not specifying min-heights for priority content sections on mobile  
❌ Implementing hamburger menu without proper drawer width from design specs  

---

## Usage Instructions

1. Copy the prompt template above
2. Fill in the bracketed placeholders with your specific values
3. Include Figma links if your design system has them
4. Provide the prompt to your AI assistant
5. Review the implementation at each breakpoint
6. Request fixes if stacking order or behavior doesn't match requirements
