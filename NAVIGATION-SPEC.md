# Navigation Specification - Blueprint Design System

## Overview
This file defines the complete navigation structure, styling, and responsive behavior for ConstructConnect portal pages using Blueprint Design System v4.0.0.

---

## Font Awesome Configuration

**Version:** 6.5.1  
**Weight:** Light (fal)  
**CDN:** `https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css`

### Icon Mappings
```
Company               → fal fa-building
Users & Groups        → fal fa-users
Roles                 → fal fa-user-shield
Subs & Licenses       → fal fa-file-contract
Billing               → fal fa-file-invoice-dollar
```

---

## Desktop Sidebar Navigation

### Structure
```html
<div class="sidebar">
  <div class="nav-item [selected]">
    <i class="nav-icon fal fa-[icon-name]"></i>
    <div class="nav-label">[Label]<br>[Line 2 if needed]</div>
  </div>
</div>
```

### Blueprint Specifications

**Sidebar Container:**
- Width: `75px`
- Background: `#185a7d` (var(--nav-menu-container-background))
- Display: `flex`
- Flex Direction: `column`
- Gap: `12px`
- Padding: `15px 5px`
- Align Items: `center`

**Navigation Item (.nav-item):**
- Display: `flex`
- Flex Direction: `column`
- Align Items: `center`
- Cursor: `pointer`
- Padding: `4px 10px`
- Border Radius: `4px`
- Transition: `background 0.2s`

**Navigation Icon (.nav-icon):**
- Width: `24px`
- Height: `24px`
- Font Size: `24px`
- Color: `#feffff` (var(--neutral-0))
- Display: `flex`
- Align Items: `center`
- Justify Content: `center`
- Margin Bottom: `3px`
- **NO background**
- **NO border**

**Navigation Label (.nav-label):**
- Color: `#feffff` (var(--neutral-0))
- Font Size: `9px`
- Text Align: `center`
- Line Height: `1.1`
- Font Weight: `500`
- Width: `70px`

**Selected State (.nav-item.selected):**
- Background: `rgba(1, 48, 74, 0.6)` (var(--nav-item-selected-background))
- Border Left: `4px solid #00a1e0` (var(--accent-primary))
- Border Radius: `4px 0 0 4px`

**Hover State (.nav-item:hover - NOT selected):**
- Background: `rgba(255, 255, 255, 0.1)`

---

## Mobile Navigation

### Breakpoint
`max-width: 1024px`

### Mobile Drawer Structure
```html
<!-- Hamburger Menu Button -->
<button class="hamburger-menu" onclick="toggleMobileNav()">
  <span></span>
  <span></span>
  <span></span>
</button>

<!-- Mobile Navigation Overlay -->
<div class="mobile-nav-overlay" onclick="toggleMobileNav()"></div>

<!-- Mobile Navigation Drawer -->
<div class="mobile-nav-drawer">
  <div class="mobile-nav-item [selected]">
    <i class="mobile-nav-icon fal fa-[icon-name]"></i>
    <div class="mobile-nav-label">[Label]</div>
  </div>
</div>
```

### Mobile Specifications

**Hamburger Menu (.hamburger-menu):**
- Display: `none` (desktop), `block` (mobile)
- Background: `none`
- Border: `none`
- Cursor: `pointer`
- Padding: `10px`
- Margin Right: `15px`

**Hamburger Spans:**
- Display: `block`
- Width: `24px`
- Height: `3px`
- Background: `#fff`
- Margin: `5px 0`
- Border Radius: `2px`
- Transition: `0.3s`

**Mobile Drawer (.mobile-nav-drawer):**
- Display: `none` (shows as `block` when active on mobile)
- Position: `fixed`
- Top: `0`
- Left: `-320px` (slides to `0` when active)
- Width: `320px`
- Height: `100vh`
- Background: `#2c3e50`
- Z-Index: `3000`
- Padding: `60px 20px 20px 20px`
- Overflow-Y: `auto`
- Transition: `left 0.3s ease`

**Mobile Nav Item (.mobile-nav-item):**
- Display: `flex`
- Align Items: `center`
- Gap: `15px`
- Padding: `12px 15px`
- Color: `#fff`
- Cursor: `pointer`
- Border Radius: `4px`
- Margin Bottom: `8px`

**Mobile Nav Icon (.mobile-nav-icon):**
- Font Size: `20px`
- Width: `24px`
- Text Align: `center`

**Mobile Nav Label (.mobile-nav-label):**
- Font Size: `14px`
- Font Weight: `500`

**Mobile Selected State (.mobile-nav-item.selected):**
- Background: `#1976d2`

---

## Responsive Behavior

### Desktop (> 1024px)
- Show: `.sidebar`
- Hide: `.hamburger-menu`, `.mobile-nav-drawer`

### Tablet/Mobile (≤ 1024px)
- Show: `.hamburger-menu`, `.mobile-nav-drawer`
- Hide: `.sidebar`

### CSS Media Query
```css
@media (max-width: 1024px) {
  .hamburger-menu { display: block; }
  .sidebar { display: none; }
  .mobile-nav-drawer { display: block; }
}
```

---

## Common Mistakes to Avoid

❌ **DON'T:**
- Add background to `.nav-icon`
- Use emoji icons instead of Font Awesome
- Apply width/height to icon elements
- Use Font Awesome 5 (must be FA 6.5.1)
- Use wrong Font Awesome weight (must be `fal` not `fa` or `fas`)
- Put selected state on `.nav-icon` (should be on `.nav-item`)

✅ **DO:**
- Use Font Awesome 6.5.1 Light weight (fal)
- Apply 24px font-size to icons (natural sizing)
- Put selected state on `.nav-item` container
- Include 4px left border on selected state
- Use proper Blueprint color tokens
- Test on mobile (≤1024px) to verify drawer works

---

## JavaScript Requirements

### Mobile Toggle Function
```javascript
function toggleMobileNav() {
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const hamburger = document.querySelector('.hamburger-menu');
  
  drawer.classList.toggle('show');
  overlay.classList.toggle('show');
  hamburger.classList.toggle('active');
}
```

### Active States
```javascript
// Hamburger menu active animation
.hamburger-menu.active span:nth-child(1) { 
  transform: rotate(-45deg) translate(-5px, 6px); 
}
.hamburger-menu.active span:nth-child(2) { 
  opacity: 0; 
}
.hamburger-menu.active span:nth-child(3) { 
  transform: rotate(45deg) translate(-5px, -6px); 
}

// Show mobile drawer
.mobile-nav-drawer.show { left: 0; }
.mobile-nav-overlay.show { display: block; }
```

---

## Implementation Checklist

- [ ] Font Awesome 6.5.1 CDN linked in `<head>`
- [ ] All icons using `fal` (Light) weight
- [ ] Sidebar width is 75px
- [ ] Icons are 24px with NO background
- [ ] Selected state on `.nav-item` (not `.nav-icon`)
- [ ] 4px left border on selected state
- [ ] Mobile breakpoint at 1024px
- [ ] Hamburger menu visible on mobile only
- [ ] Mobile drawer slides from left
- [ ] Toggle function implemented
- [ ] Blueprint color tokens used
- [ ] Responsive behavior tested

---

## Blueprint Design System Reference

**Primary Colors:**
- Header: `#01304a`
- Navigation: `#185a7d`
- Accent: `#00a1e0`
- Selected: `rgba(1, 48, 74, 0.6)`

**Typography:**
- Font Family: Montserrat
- Nav Label: 9px Medium (500)
- Mobile Label: 14px Medium (500)

**Spacing:**
- Sidebar gap: 12px
- Nav item padding: 4px 10px
- Icon margin-bottom: 3px

---

## Files Affected

When implementing navigation changes, update ALL these files:
- `v2-subscription-overview.html`
- `v2-subscription-overview-multi.html`
- `v2-modify-users-workflow.html`
- `v2-modify-users-workflow-multi.html`
- `blueprint-workflow-styles.css` (shared styles)

---

## Version History

**v1.0 (Feb 1, 2026)**
- Initial specification
- Font Awesome 6.5.1 Light (fal)
- Blueprint Design System v4.0.0
- 75px sidebar with 24px icons
- Mobile drawer at 1024px breakpoint
