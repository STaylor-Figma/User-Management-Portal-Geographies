# Responsive Design - AI Assistant Instructions

> **For Teams Using Claude, Cursor, or Similar AI Assistants**  
> Add this to your `.cursorrules`, `.clinerules`, or project instructions file

---

## Core Principles

When implementing responsive design, AI assistants MUST:

1. **Never assume breakpoints** - Always ask for or retrieve design system specifications
2. **Use Figma integration when available** - Retrieve actual design context from provided links
3. **Control mobile stacking with CSS** - Use flexbox `order` property, not DOM order
4. **Apply responsive rules to ALL breakpoints** - Not just the smallest one
5. **Match exact specifications** - Don't use "close enough" values

---

## Required Workflow

### Step 1: Gather Design System Specifications

**BEFORE implementing any responsive design, ask:**
- "What are your design system's breakpoints?"
- "Do you have Figma links for the responsive specifications?"
- "What should the mobile stacking order be?"

**If Figma links provided:**
- Use Figma integration tools to retrieve actual design context
- Extract exact values: header heights, drawer widths, breakpoint values
- Don't guess or use industry standards (Bootstrap, Tailwind, etc.)

### Step 2: Understand Layout Priority

**Always clarify:**
- Desktop layout structure (sidebar? split-view? single column?)
- Mobile content priority (what should appear first when stacked?)
- Navigation pattern changes (sidebar → hamburger menu?)

**Key question:** "On mobile/tablet, what content should users see FIRST?"

### Step 3: Implementation Pattern

```css
/* Base styles - Desktop first */
.container { display: flex; }
.left-panel { width: 50%; }
.right-panel { width: 50%; }

/* Largest breakpoint first */
@media (max-width: 1024px) {
  .container { flex-direction: column; }
  .left-panel { 
    width: 100%; 
    order: 2;  /* ← Control stacking order */
  }
  .right-panel { 
    width: 100%; 
    order: 1;  /* ← Priority content shows first */
    min-height: 50vh; /* ← Ensure it takes meaningful space */
  }
}

/* Continue down through smaller breakpoints */
@media (max-width: 768px) {
  /* Inherit stacking from 1024px, add tablet-specific rules */
}

@media (max-width: 600px) {
  /* Inherit stacking, add small-tablet-specific rules */
}

@media (max-width: 375px) {
  /* Inherit stacking, add mobile-specific rules */
}
```

### Step 4: Verification Checklist

After implementing, verify:
- [ ] Stacking behavior works at ALL breakpoints (not just smallest)
- [ ] `order` property applied wherever content stacks
- [ ] Min-heights set for priority sections on mobile
- [ ] Header heights match design system specs
- [ ] Navigation drawer width matches design system specs
- [ ] No hardcoded industry-standard breakpoints used

---

## Common Patterns

### Pattern 1: Split-View → Stacked

**Desktop:** Side-by-side panels  
**Mobile:** Stack vertically with priority content on top

```css
/* Mobile/Tablet: Stack and reorder */
@media (max-width: 1024px) {
  .split-view { flex-direction: column; height: auto; }
  .left-panel { order: 2; width: 100%; } /* Shows second */
  .right-panel { order: 1; width: 100%; min-height: 50vh; } /* Shows first */
}
```

### Pattern 2: Sidebar → Hamburger Menu

**Desktop:** Fixed sidebar navigation  
**Mobile:** Hamburger menu with slide-out drawer

```css
@media (max-width: 1024px) {
  .sidebar { display: none; }
  .hamburger-menu { display: block; }
  .mobile-nav-drawer { display: block; }
}
```

**Required elements:**
- Hamburger button (3-line icon, animates to X)
- Slide-out drawer (width from design specs, usually 280-320px)
- Overlay backdrop (dismisses drawer when clicked)
- Smooth transitions (0.3s ease)

### Pattern 3: Card Grid → Single Column

**Desktop:** Multi-column grid  
**Mobile:** Single column, full width

```css
.cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); }

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: 1fr; }
}
```

---

## Anti-Patterns (DO NOT DO)

❌ **Using standard breakpoints without verification**
```css
/* DON'T assume Bootstrap breakpoints */
@media (max-width: 992px) { /* ← Not validated against design system */
```

❌ **Only adding `order` to one breakpoint**
```css
@media (max-width: 768px) {
  .panel { order: 2; }
}
/* Missing from 1024px breakpoint! Users at 900px won't see correct order */
```

❌ **Relying on DOM order for mobile stacking**
```html
<!-- This won't work with flexbox without CSS order property -->
<div class="split-view">
  <div class="left">I'm first in DOM</div>
  <div class="right">I should show first on mobile</div>
</div>
```

❌ **Forgetting to stack at larger tablet sizes**
```css
/* Landscape tablets (1024x768) forgotten! */
@media (max-width: 768px) {
  .split-view { flex-direction: column; }
}
```

❌ **Not setting min-heights for priority content**
```css
@media (max-width: 768px) {
  .priority-content { order: 1; }
  /* ← No min-height! Might collapse to tiny height */
}
```

---

## Cursor/Claude Specific Tips

### For `.cursorrules` / `.clinerules`

Add this block to your project rules file:

```
# Responsive Design Rules

When implementing responsive layouts:
1. Ask for design system breakpoints before implementing
2. Use Figma tools to retrieve specs when links provided
3. Apply flexbox `order` property at ALL stacking breakpoints
4. Set appropriate min-heights for priority mobile content (typically 50vh)
5. Never assume industry-standard breakpoints (768px, 992px, etc.)
6. Test stacking behavior at every breakpoint, not just mobile

Required pattern for vertical stacking:
- Container: `flex-direction: column; height: auto;`
- Priority content: `order: 1; min-height: 50vh;`
- Secondary content: `order: 2;`
```

### For Claude Projects

Add to your project instructions or custom instructions:

```
When working on responsive design:
- ALWAYS retrieve design system specifications before implementing
- If Figma links provided, use Figma integration to get exact values
- Use CSS flexbox `order` property to control mobile stacking
- Apply responsive rules to ALL relevant breakpoints (not just mobile)
- Verify header heights, drawer widths, etc. match design system exactly
```

### For Windsurf/Other AI IDEs

Create a `RESPONSIVE-STANDARDS.md` in your project root and reference it in prompts:

```
"Implement responsive design following the patterns in RESPONSIVE-STANDARDS.md"
```

---

## Quick Reference: Breakpoint Strategy

**Ask these questions:**
1. What are ALL your breakpoints? (not just mobile)
2. What should stack at each breakpoint?
3. What's the priority content order on mobile?
4. What are the exact header heights at each size?
5. What's the drawer width for mobile navigation?

**Then implement:**
- Largest breakpoint first (e.g., 1024px)
- Add stacking + order properties
- Work down to smaller breakpoints
- Each inherits from larger, adds specifics
- Verify at every breakpoint

---

## Testing Prompt

After implementation, ask AI to verify:

```
"Verify the responsive implementation:
1. Check that stacking behavior works at 1024px, 768px, 600px, and 375px
2. Confirm order properties are set at ALL stacking breakpoints
3. Verify min-heights are set for priority mobile content
4. Check header heights match design system at each breakpoint
5. Confirm no standard breakpoints (992px, etc.) were used"
```

---

## Success Criteria

✅ Content appears in correct priority order on mobile  
✅ Stacking works consistently at ALL tablet/mobile sizes  
✅ No gaps or awkward heights in stacked view  
✅ Navigation pattern changes appropriately  
✅ All values match design system specifications exactly  
✅ Hard refresh shows correct behavior (no cache issues)  

---

**Bottom line:** Responsive design is about following YOUR design system precisely, not applying generic patterns. AI assistants should gather specs first, then implement systematically.
