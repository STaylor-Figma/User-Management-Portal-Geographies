# Platform Services Portal - Layout & Navigation Specifications

**Version:** 1.0  
**Date:** February 2, 2026  
**Status:** FINALIZED - Do not modify without approval

---

## Overview

This document defines the complete specifications for the header, navigation, layout, and content spacing for Platform Services portals. These specifications are MANDATORY and must be followed exactly to avoid implementation issues.

---

## 1. HEADER (Top Bar)

### Desktop (>1024px)
- **Height:** 60px
- **Background:** `#01304A` (var(--header-organism-background-default))
- **Display:** flex
- **Align items:** center
- **Justify content:** flex-start (NOT space-between)

### Mobile/Tablet (≤1024px)
- **Height:** 44px
- **All other properties:** Same as desktop

### Header Structure

```html
<div class="top-bar">
  <div class="top-bar-left">
    <button class="hamburger-menu">
      <div class="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
    <div class="logo">ConstructConnect</div>
  </div>
  <div class="top-bar-user-section">
    <div class="user-menu">
      <div class="avatar">CD</div>
      <span>Christopher Donaldson</span>
    </div>
  </div>
</div>
```

### Header Components

#### Logo
- **Font family:** Montserrat
- **Font size:** 16px (var(--font-size-400))
- **Font weight:** 600 (SemiBold)
- **Color:** `#FFFFFF` (var(--neutral-0))
- **Padding desktop:** 10px 10px 10px 20px
- **Padding mobile (≤1024px):** 10px (when hamburger visible)
- **White-space:** nowrap
- **Flex-shrink:** 0

#### Hamburger Menu
- **Display desktop:** none
- **Display mobile (≤1024px):** flex
- **Size:** 44px × 44px
- **Padding:** 10px
- **Align/Justify:** center

#### Menu Icon Container
- **Size:** 16px × 15px
- **Display:** flex
- **Flex direction:** column
- **Justify content:** space-between

#### Menu Icon Bars
- **Width:** 16px
- **Height:** 3px
- **Border radius:** 4px
- **Background:** `#FFFFFF`
- **Spacing:** flex space-between in 15px container

#### Avatar
- **Size:** 34px × 34px (NOT 40px)
- **Border radius:** 50%
- **Background:** `#0C79A8`
- **Color:** `#FFFFFF`
- **Font:** Montserrat, 14px, 600 weight
- **Display:** flex, center aligned

#### User Menu
- **Display:** flex
- **Gap:** 10px (NOT 16px)
- **Align items:** center

#### Username
- **Font:** Montserrat, 14px, 500 weight
- **Color:** `#FFFFFF`
- **White-space:** nowrap
- **Display mobile (≤600px):** none

---

## 2. LAYOUT STRUCTURE

### HTML Structure

```html
<body>
  <!-- Header -->
  <div class="top-bar">...</div>
  
  <!-- Compact Navigation (Mobile) -->
  <div class="compact-overlay"></div>
  <nav class="compact-nav">...</nav>
  
  <!-- Layout Container -->
  <div class="layout">
    <!-- Sidebar Navigation (Desktop) -->
    <nav class="sidebar-nav">...</nav>
    
    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Page content here -->
      </div>
    </div>
  </div>
</body>
```

### Layout Container

```css
.layout {
  display: flex;
  min-height: calc(100vh - 60px);
}
```

**CRITICAL:** 
- Layout uses `flex` display
- Sidebar and main-content are flex children (side by side)
- Sidebar is NOT fixed or sticky - it scrolls with the page
- Min-height accounts for 60px header

---

## 3. SIDEBAR NAVIGATION (Desktop >1024px)

### Container Specifications

```css
.sidebar-nav {
  width: 75px;
  min-height: calc(100vh - 60px);
  background: #185a7d;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  z-index: 100;
}
```

**CRITICAL:**
- NO `position: fixed` - sidebar scrolls with page
- NO `position: sticky`
- Width is fixed at 75px
- Uses flex column for vertical button stacking

### Visibility
- **Desktop (>1024px):** Visible
- **Mobile/Tablet (≤1024px):** `display: none !important`

### Button Specifications

```css
.sidebar-button {
  width: 75px;
  min-height: 48px;
  max-height: 60px;
  margin: 0 auto;
  display: flex;
  flex-direction: column; /* VERTICAL layout */
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  border-left: 4px solid transparent;
  cursor: pointer;
  text-align: center;
}
```

### Button Structure

```html
<button class="sidebar-button selected">
  <i class="sidebar-button__icon fa-light fa-building"></i>
  <span class="sidebar-button__label">Company</span>
</button>
```

### Icon Specifications
- **Size:** 24px × 24px
- **Font Awesome:** fa-light (Light weight)
- **Color default:** `#CCECF9`
- **Color selected:** `#FFFFFF`

### Label Specifications
- **Font family:** Montserrat
- **Font size:** 11px
- **Font weight:** 600
- **Line height:** 12px
- **Color default:** `#CCECF9`
- **Color selected:** `#FFFFFF`
- **Text align:** center
- **Max lines:** 2 (uses -webkit-line-clamp)
- **Line breaks:** Allowed (use `<br>` for intentional breaks)

### Button States

#### Hover
```css
background: rgba(1, 48, 74, 0.35);
border-left-color: #0c79a8;
```

#### Selected
```css
background: rgba(1, 48, 74, 0.6);
border-left-color: #00a1e0;
icon/label color: #ffffff;
```

#### Focus
```css
outline: none;
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: inset 0 0 4px 0 #f2fafe;
```

---

## 4. COMPACT NAVIGATION (Mobile/Tablet ≤1024px)

### Container Specifications

```css
.compact-nav {
  display: none; /* Hidden by default */
  position: fixed;
  left: 0;
  top: 44px;
  width: 320px;
  max-width: 320px;
  height: calc(100vh - 44px);
  background: #185a7d;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  z-index: 3000;
  overflow-y: auto;
}

.compact-nav.open {
  display: flex;
}
```

### Visibility
- **Desktop (>1024px):** `display: none !important`
- **Mobile/Tablet (≤1024px):** Shown when `.open` class added (hamburger clicked)

### Overlay

```css
.compact-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2999;
}

.compact-overlay.open {
  display: block;
}
```

### Button Specifications

```css
.compact-button {
  width: 100%; /* FULL WIDTH - REQUIRED */
  min-height: 44px;
  display: flex;
  flex-direction: row; /* HORIZONTAL layout */
  align-items: center;
  gap: 14px;
  padding: 4px 10px 4px 20px;
  background: transparent;
  border: none;
  border-left: 4px solid transparent;
  cursor: pointer;
  text-align: left;
}
```

### Button Structure

```html
<button class="compact-button selected">
  <i class="compact-button__icon fa-light fa-building"></i>
  <span class="compact-button__label">Company</span>
</button>
```

### Icon Specifications
- **Size:** 24px × 24px
- **Font Awesome:** fa-light (Light weight)
- **Color default:** `#CCECF9`
- **Color selected:** `#FFFFFF`
- **Flex-shrink:** 0

### Label Specifications
- **Font family:** Montserrat
- **Font size:** 18px
- **Font weight:** 600
- **Line height:** 12px
- **Color default:** `#CCECF9`
- **Color selected:** `#FFFFFF`
- **White-space:** nowrap (1 LINE ONLY - NO WRAPPING)

### Button States
- Same hover/selected/focus states as sidebar buttons
- All colors match sidebar

---

## 5. MAIN CONTENT SPACING

### Desktop (>1024px)

```css
.main-content {
  flex: 1;
  margin-left: 20px; /* Gap from sidebar */
  margin-right: 20px;
  padding: var(--spacing-medium-900) var(--spacing-medium-900) var(--spacing-medium-900) 0;
}
```

**CRITICAL:**
- Margin-left 20px creates gap from 75px sidebar
- Padding-left is 0 (no extra padding next to sidebar)
- Padding top/right/bottom uses normal spacing token

### Mobile/Tablet (≤1024px)

```css
@media (max-width: 1024px) {
  .main-content {
    margin-left: 10px;
    margin-right: 10px;
  }
}
```

**CRITICAL:**
- 10px margins on both sides
- Sidebar is hidden, so no sidebar gap needed

---

## 6. RESPONSIVE BREAKPOINTS

### Breakpoint Definitions

| Breakpoint | Width | Description | Primary Use Case |
|------------|-------|-------------|------------------|
| Mobile Small | 375px | iPhone SE, small phones | Minimum supported width |
| Mobile Large | 600px | Large phones, phablets | Username hidden, compact layout |
| Tablet Portrait | 768px | iPad portrait, tablets | Content stacks, tables scroll |
| Tablet Landscape | 1024px | iPad landscape, small laptops | **CRITICAL**: Navigation switches |
| Desktop | 1440px+ | Desktop monitors | Full layout with sidebar |

### Media Query Strategy

The layout uses **mobile-first** approach with `max-width` media queries:
- Base styles are for desktop (>1024px)
- Media queries progressively adapt for smaller screens
- Critical breakpoint is `1024px` where navigation changes

---

## 6.1. BREAKPOINT: 1024px (CRITICAL - Navigation Switch)

**Trigger:** `@media (max-width: 1024px)`

This is the MOST IMPORTANT breakpoint where the navigation system completely changes.

### Changes at ≤1024px

#### Navigation
```css
/* Hide desktop sidebar */
.sidebar-nav { display: none !important; }

/* Show hamburger menu */
.hamburger-menu { display: flex; }

/* Compact nav ready to toggle */
.compact-nav { /* Shows when .open class added */ }
```

#### Header
```css
/* Reduce header height */
.top-bar { height: 44px; } /* Was 60px */

/* Adjust logo padding */
.logo { padding: 10px; } /* Was 20px left padding */

/* Compact nav positioned below header */
.compact-nav { top: 44px; } /* Matches new header height */
```

#### Content Spacing
```css
/* Reduce side margins */
.main-content {
  margin-left: 10px; /* Was 20px */
  margin-right: 10px; /* Was 20px */
}
```

#### Layout Impact
- **Sidebar:** No longer visible, full width available for content
- **Navigation:** User clicks hamburger to open slide-out menu
- **Content area:** Gains 75px + 20px = 95px of width (sidebar + gap)

---

## 6.2. BREAKPOINT: 768px (Tablet Portrait)

**Trigger:** `@media (max-width: 768px)`

**Applies to:** iPad portrait, Android tablets, large phones in landscape

### Changes at ≤768px

#### Content Layout
```css
/* Stack cards vertically */
.cards-grid { 
  grid-template-columns: 1fr; /* Was repeat(3, 1fr) */
  gap: 16px; /* Was 24px */
}

/* Add padding to content wrapper */
.content { padding: 0 10px; }
```

#### Tables
```css
/* Enable horizontal scroll */
.table-section { 
  padding: 12px; /* Was 24px */
  overflow-x: auto; 
}

/* Set minimum width for tables */
.data-table { min-width: 800px; }
.user-table { min-width: 800px; }
```

#### Tabs
```css
/* Allow tabs to wrap */
.tabs { flex-wrap: wrap; }

/* Reduce tab size */
.tab { 
  font-size: 13px; /* Was 14px */
  padding: 6px 12px; /* Was 8px 16px */
}
```

#### Username Display
```css
/* Hide username in header */
.user-menu span { display: none; }
```

**Why:** Save horizontal space, username not critical on tablets

---

## 6.3. BREAKPOINT: 600px (Mobile Large)

**Trigger:** `@media (max-width: 600px)`

**Applies to:** Large phones (iPhone 14 Pro Max, Galaxy S23+), phablets

### Changes at ≤600px

#### Tables
```css
/* Further reduce table padding */
.table-section { padding: 8px; /* Was 12px */ }

/* Reduce table cell spacing */
.user-table th,
.user-table td { 
  padding: 8px 6px; /* Was 12px 10px */
  font-size: 12px; /* Was 14px */
}

/* Hide non-essential columns */
.user-table th:nth-child(n+5),
.user-table td:nth-child(n+5) { 
  display: none; 
}
```

**Why:** On small screens, show only critical columns (name, role, status, actions)

#### Cards & Content
```css
/* Reduce card padding */
.subscription-card { padding: 12px; /* Was 20px */ }

/* Smaller card headers */
.card-header { font-size: 14px; /* Was 16px */ }

/* Compact alerts */
.alert { 
  font-size: 12px; /* Was 13px */
  padding: 8px 10px; /* Was 10px 12px */
}
```

#### UI Elements
```css
/* Smaller seat information */
.seat-row { font-size: 12px; /* Was 13px */ }

/* Compact zone badges */
.zone-badge { 
  font-size: 11px; /* Was 12px */
  padding: 3px 8px; /* Was 4px 10px */
}
```

#### Footer
```css
/* Stack footer elements */
.table-footer { 
  flex-direction: column; 
  align-items: stretch; 
  gap: 12px; 
}

/* Center pagination controls */
.rows-per-page { justify-content: center; }
.page-nav { justify-content: center; }
```

---

## 6.4. BREAKPOINT: 375px (Mobile Small - Minimum)

**Trigger:** Implicit (base mobile styles apply)

**Applies to:** iPhone SE, older Android phones, smallest supported devices

### Characteristics
- **Minimum supported width:** 375px
- **Below this:** Layout may break, not officially supported
- **All mobile styles apply:** From 600px and 768px breakpoints
- **Content priority:** Show only essential information
- **Interaction:** Large touch targets (min 44px)

### Critical Considerations
- Tables MUST scroll horizontally
- No content should be narrower than 375px
- Touch targets minimum 44px × 44px
- Font size minimum 12px for readability
- Adequate spacing between interactive elements

---

## 6.5. COMPLETE RESPONSIVE CSS

### Full Media Query Structure

```css
/* ===== BASE STYLES (Desktop >1024px) ===== */
.sidebar-nav { display: flex; } /* Visible */
.compact-nav { display: none; } /* Hidden */
.hamburger-menu { display: none; } /* Hidden */
.top-bar { height: 60px; }
.main-content { margin-left: 20px; margin-right: 20px; }
.cards-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }

/* ===== TABLET LANDSCAPE & BELOW (≤1024px) ===== */
@media (max-width: 1024px) {
  .sidebar-nav { display: none !important; }
  .hamburger-menu { display: flex; }
  .top-bar { height: 44px; }
  .compact-nav { top: 44px; }
  .logo { padding: 10px; }
  .main-content { margin-left: 10px; margin-right: 10px; }
}

/* ===== TABLET PORTRAIT & BELOW (≤768px) ===== */
@media (max-width: 768px) {
  .cards-grid { grid-template-columns: 1fr; gap: 16px; }
  .content { padding: 0 10px; }
  .user-menu span { display: none; }
  .table-section { padding: 12px; overflow-x: auto; }
  .data-table { min-width: 800px; }
  .user-table { min-width: 800px; }
  .tabs { flex-wrap: wrap; }
  .tab { font-size: 13px; padding: 6px 12px; }
}

/* ===== MOBILE LARGE & BELOW (≤600px) ===== */
@media (max-width: 600px) {
  .table-section { padding: 8px; }
  .subscription-card { padding: 12px; }
  .card-header { font-size: 14px; }
  .alert { font-size: 12px; padding: 8px 10px; }
  .seat-row { font-size: 12px; }
  .zone-badge { font-size: 11px; padding: 3px 8px; }
  .user-table th,
  .user-table td { padding: 8px 6px; font-size: 12px; }
  .user-table th:nth-child(n+5),
  .user-table td:nth-child(n+5) { display: none; }
  .table-footer { flex-direction: column; align-items: stretch; gap: 12px; }
  .rows-per-page { justify-content: center; }
  .page-nav { justify-content: center; }
}
```

---

## 6.6. BREAKPOINT TESTING CHECKLIST

Test each breakpoint to ensure layout behaves correctly:

### At 1440px (Desktop Large)
- [ ] Sidebar visible at 75px width
- [ ] Content has 20px margins left/right
- [ ] Header is 60px height
- [ ] Cards display in 3 columns
- [ ] All content fits without horizontal scroll

### At 1024px (Tablet Landscape)
- [ ] Sidebar disappears
- [ ] Hamburger menu appears
- [ ] Header changes to 44px
- [ ] Content margins reduce to 10px
- [ ] Compact nav slides in when hamburger clicked

### At 768px (Tablet Portrait)
- [ ] Cards stack in single column
- [ ] Tables scroll horizontally
- [ ] Tabs wrap if needed
- [ ] Username hidden in header
- [ ] Content padding adjusts to 10px

### At 600px (Mobile Large)
- [ ] Card padding reduces to 12px
- [ ] Font sizes reduce for compact display
- [ ] Table columns hide (show only first 4)
- [ ] Footer stacks vertically
- [ ] All interactive elements remain accessible

### At 375px (Mobile Small - Minimum)
- [ ] All content visible (scrollable if needed)
- [ ] No horizontal overflow
- [ ] Touch targets minimum 44px
- [ ] Text remains readable (min 12px)
- [ ] Layout doesn't break

---

## 7. COMPLETE CSS IMPLEMENTATION

This section contains ALL the CSS and JavaScript code needed to implement the header, navigation, and layout. Copy this code into your project.

### 7.0. Font Awesome Setup (REQUIRED)

**Add this script tag in your HTML `<head>` section BEFORE any CSS files:**

```html
<script src="https://kit.fontawesome.com/3d14c46c3e.js" crossorigin="anonymous"></script>
```

**Font Awesome Version:** 6 Pro  
**Icon Weight:** Light (`fa-light`)  
**Kit ID:** 3d14c46c3e

**Navigation Icons:**
```html
<i class="fa-light fa-building"></i>                  <!-- Company -->
<i class="fa-light fa-users"></i>                     <!-- Users & Groups -->
<i class="fa-light fa-users-gear"></i>                <!-- Roles -->
<i class="fa-light fa-file-invoice"></i>              <!-- Subscriptions & Licenses -->
<i class="fa-light fa-money-check-edit-alt"></i>      <!-- Billing -->
```

**CRITICAL:** You MUST use Font Awesome 6 Pro Light weight. Font Awesome 5 or different weights will not match the design specifications.

---

### 7.1. HTML Head Setup

**Complete `<head>` section with correct load order:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>
  
  <!-- Font Awesome 6 Pro - LOAD FIRST -->
  <script src="https://kit.fontawesome.com/3d14c46c3e.js" crossorigin="anonymous"></script>
  
  <!-- Google Fonts - Montserrat -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Your CSS files -->
  <link rel="stylesheet" href="your-styles.css">
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

---

### 7.2. Header CSS (Complete)

```css
/* ===== HEADER / TOP BAR ===== */
.top-bar { 
  background: #01304A;
  padding: 0 !important; 
  display: flex !important; 
  justify-content: flex-start !important; 
  align-items: center; 
  height: 60px;
}

.top-bar-left {
  display: flex !important;
  align-items: center;
  justify-content: flex-start !important;
}

.top-bar-user-section {
  display: flex !important;
  align-items: center;
  padding: 0 10px;
  margin-left: auto !important;
}

.logo { 
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 10px 10px 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* User Menu */
.user-menu { 
  display: flex; 
  align-items: center; 
  gap: 10px;
  color: #FFFFFF;
}

.user-menu span {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: #FFFFFF;
  white-space: nowrap;
}

.avatar { 
  width: 34px;
  height: 34px;
  background: #0C79A8;
  border-radius: 50%;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding: 10px;
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
}

/* Hamburger Menu Button */
.hamburger-menu { 
  display: none;
  width: 44px;
  height: 44px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  background: #01304A;
  border: none;
  border-right: 1px solid #185a7d;
  cursor: pointer;
}

.menu-icon { 
  width: 16px;
  height: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-menu span { 
  display: block;
  width: 16px;
  height: 3px;
  background: #FFFFFF;
  border-radius: 4px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

/* Mobile Header Adjustments */
@media (max-width: 1024px) {
  .top-bar {
    height: 44px;
  }
  
  .hamburger-menu {
    display: flex;
  }
  
  .logo {
    padding: 10px;
  }
}

@media (max-width: 600px) {
  .user-menu span {
    display: none;
  }
}
```

---

### 7.3. Navigation CSS (Complete)

```css
/* ============================================================================
   SIDEBAR NAVIGATION (Desktop >1024px)
   ============================================================================ */

.sidebar-nav {
  width: 75px;
  min-height: calc(100vh - 60px);
  background: #185a7d;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  z-index: 100;
}

@media (max-width: 1024px) {
  .sidebar-nav {
    display: none !important;
  }
}

/* Sidebar Button */
.sidebar-button {
  width: 75px;
  min-height: 48px;
  max-height: 60px;
  margin: 0 auto;
  display: flex;
  flex-direction: column; /* VERTICAL: icon top, label below */
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  border-left: 4px solid transparent;
  cursor: pointer;
  text-align: center;
}

.sidebar-button__icon {
  font-size: 24px;
  line-height: 24px;
  color: #ccecf9;
}

.sidebar-button__label {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 12px;
  color: #ccecf9;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Max 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Sidebar Button States */
.sidebar-button:hover {
  background: rgba(1, 48, 74, 0.35);
  border-left-color: #0c79a8;
}

.sidebar-button.selected {
  background: rgba(1, 48, 74, 0.6);
  border-left-color: #00a1e0;
}

.sidebar-button.selected .sidebar-button__icon,
.sidebar-button.selected .sidebar-button__label {
  color: #ffffff;
}

.sidebar-button:focus {
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 4px 0 #f2fafe;
}

/* ============================================================================
   COMPACT NAVIGATION (Mobile/Tablet ≤1024px)
   ============================================================================ */

.compact-nav {
  display: none;
  position: fixed;
  left: 0;
  top: 44px;
  width: 320px;
  max-width: 320px;
  height: calc(100vh - 44px);
  background: #185a7d;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  z-index: 3000;
  overflow-y: auto;
}

.compact-nav.open {
  display: flex;
}

@media (min-width: 1025px) {
  .compact-nav {
    display: none !important;
  }
}

/* Compact Overlay */
.compact-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2999;
}

.compact-overlay.open {
  display: block;
}

/* Compact Button */
.compact-button {
  width: 100%;
  min-height: 44px;
  display: flex;
  flex-direction: row; /* HORIZONTAL: icon left, label right */
  align-items: center;
  gap: 14px;
  padding: 4px 10px 4px 20px;
  background: transparent;
  border: none;
  border-left: 4px solid transparent;
  cursor: pointer;
  text-align: left;
}

.compact-button__icon {
  font-size: 24px;
  line-height: 24px;
  color: #ccecf9;
  flex-shrink: 0;
}

.compact-button__label {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 12px;
  color: #ccecf9;
  white-space: nowrap; /* Single line only */
}

/* Compact Button States */
.compact-button:hover {
  background: rgba(1, 48, 74, 0.35);
  border-left-color: #0c79a8;
}

.compact-button.selected {
  background: rgba(1, 48, 74, 0.6);
  border-left-color: #00a1e0;
}

.compact-button.selected .compact-button__icon,
.compact-button.selected .compact-button__label {
  color: #ffffff;
}

.compact-button:focus {
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 4px 0 #f2fafe;
}
```

---

### 7.4. Layout CSS (Complete)

```css
/* ===== BASE BOX MODEL ===== */
* { 
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body { 
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0; 
  background: #f4f4f4;
}

/* ===== LAYOUT STRUCTURE ===== */
.layout { 
  display: flex;
  min-height: calc(100vh - 60px);
}

/* Main Content */
.main-content { 
  flex: 1;
  margin-left: 20px; /* 20px gap from sidebar */
  margin-right: 20px;
  padding: 30px 0 30px 0; /* Top/bottom padding only */
  box-sizing: border-box;
  min-width: 0; /* Allow flex item to shrink */
}

.container { 
  max-width: 1600px;
  width: 100%;
  margin: 0 auto; 
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

.content {
  padding: 0 20px;
}

/* Header within container */
.header { 
  padding: 24px 20px;
}

.header-top { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 16px;
}

h1 { 
  margin: 0; 
  font-family: 'Montserrat', sans-serif;
  font-size: 22px;
  font-weight: 500;
  line-height: normal;
  color: #1c1f22;
}

/* ===== RESPONSIVE LAYOUT ===== */

/* Tablet Landscape (≤1024px) */
@media (max-width: 1024px) {
  .layout {
    min-height: calc(100vh - 44px);
  }
  
  .main-content {
    margin-left: 10px;
    margin-right: 10px;
  }
}

/* Tablet Portrait (≤768px) */
@media (max-width: 768px) {
  .content {
    padding: 0 10px;
  }
}

/* Mobile (≤600px) */
@media (max-width: 600px) {
  .header {
    padding: 16px 12px;
  }
  
  h1 {
    font-size: 18px;
  }
}
```

---

## 8. FONT AWESOME SETUP

### Required Kit

```html
<script src="https://kit.fontawesome.com/3d14c46c3e.js" crossorigin="anonymous"></script>
```

**Version:** Font Awesome 6 Pro  
**Weight used:** Light (`fa-light`)

### Icon Classes

```html
<i class="fa-light fa-building"></i>         <!-- Company -->
<i class="fa-light fa-users"></i>            <!-- Users & Groups -->
<i class="fa-light fa-users-gear"></i>       <!-- Roles -->
<i class="fa-light fa-file-invoice"></i>     <!-- Subs & Licenses -->
<i class="fa-light fa-money-check-edit-alt"></i> <!-- Billing -->
```

---

## 8. CSS FILE STRUCTURE

### Required Files
1. `blueprint-workflow-styles.css` - Main layout and content styles
2. `blueprint-navigation.css` - Navigation-specific styles

### Load Order

```html
<head>
  <script src="https://kit.fontawesome.com/3d14c46c3e.js" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="blueprint-workflow-styles.css">
  <link rel="stylesheet" href="blueprint-navigation.css">
</head>
```

---

## 9. JAVASCRIPT REQUIREMENTS

### Toggle Mobile Navigation

```javascript
function toggleMobileNav() {
  const nav = document.querySelector('.compact-nav');
  const overlay = document.querySelector('.compact-overlay');
  const hamburger = document.querySelector('.hamburger-menu');
  
  nav.classList.toggle('open');
  overlay.classList.toggle('open');
  hamburger.classList.toggle('active');
}
```

### Hamburger Click Handler

```html
<button class="hamburger-menu" onclick="toggleMobileNav()" aria-label="Toggle navigation">
```

### Overlay Click Handler

```html
<div class="compact-overlay" onclick="toggleMobileNav()"></div>
```

---

## 10. ACCESSIBILITY REQUIREMENTS

### ARIA Attributes

| Element | Attribute | Value | Purpose |
|---------|-----------|-------|---------|
| `<nav>` | `aria-label` | "Main navigation" | Identifies nav landmark |
| Hamburger button | `aria-label` | "Toggle navigation" | Describes button purpose |
| Buttons with submenus | `aria-haspopup` | "true" | Indicates submenu exists |
| Buttons with submenus | `aria-expanded` | "true/false" | Indicates submenu state |

### Focus States

All interactive elements MUST have visible focus states:
- Buttons: `border: 1px solid rgba(255,255,255,0.1)` + `box-shadow: inset 0 0 4px 0 #f2fafe`
- Links: Same as buttons

### Keyboard Navigation
- Tab: Move between interactive elements
- Enter/Space: Activate buttons
- Escape: Close mobile navigation

---

## 11. COMMON MISTAKES TO AVOID

### ❌ DO NOT
1. Make sidebar `position: fixed` or `position: sticky`
2. Make sidebar buttons horizontal layout
3. Make compact buttons vertical layout
4. Allow compact button labels to wrap
5. Use wrong breakpoint for showing/hiding navigation
6. Add padding-left to main-content (uses margin-left instead)
7. Use Font Awesome 5 (must use FA6)
8. Use emoji icons instead of Font Awesome
9. Set avatar to 40px (must be 34px)
10. Set user menu gap to 16px (must be 10px)

### ✅ DO
1. Let sidebar scroll with page content
2. Use flex layout for sidebar and content
3. Maintain exact 20px gap from sidebar to content on desktop
4. Maintain exact 10px margins on mobile/tablet
5. Keep sidebar width at exactly 75px
6. Use fa-light for all icons
7. Test at all breakpoints (375px, 600px, 768px, 1024px, 1440px)
8. Verify hamburger menu toggles compact nav
9. Verify compact nav overlay blocks page clicks
10. Test keyboard navigation and focus states

---

## 12. TESTING CHECKLIST

### Desktop (>1024px)
- [ ] Header is 60px height
- [ ] Sidebar is visible and 75px wide
- [ ] Sidebar scrolls with page content (not fixed)
- [ ] Compact navigation is hidden
- [ ] Hamburger menu is hidden
- [ ] Content has 20px margin-left from sidebar
- [ ] Content has 20px margin-right
- [ ] Logo has 20px left padding
- [ ] Avatar is 34px × 34px
- [ ] User menu gap is 10px
- [ ] Username is visible

### Tablet/Mobile (≤1024px)
- [ ] Header is 44px height
- [ ] Sidebar is hidden
- [ ] Hamburger menu is visible
- [ ] Compact navigation opens when hamburger clicked
- [ ] Compact navigation is 320px wide
- [ ] Overlay appears when compact nav open
- [ ] Clicking overlay closes compact nav
- [ ] Content has 10px margin-left
- [ ] Content has 10px margin-right
- [ ] Logo has 10px left padding
- [ ] Username is hidden (≤600px)

### All Breakpoints
- [ ] All icons are Font Awesome Light (fa-light)
- [ ] Sidebar buttons are vertical (icon top, label bottom)
- [ ] Compact buttons are horizontal (icon left, label right)
- [ ] Hover states work on all buttons
- [ ] Focus states are visible on all interactive elements
- [ ] Selected state shows correctly
- [ ] No horizontal scrollbar appears
- [ ] Page content is fully accessible

---

## 13. REFERENCE VALUES

### Colors
```css
--header-background: #01304A
--sidebar-background: #185a7d
--icon-default: #CCECF9
--icon-selected: #FFFFFF
--button-hover-bg: rgba(1, 48, 74, 0.35)
--button-selected-bg: rgba(1, 48, 74, 0.6)
--border-hover: #0C79A8
--border-selected: #00A1E0
--overlay-bg: rgba(0, 0, 0, 0.5)
```

### Spacing
```css
--header-height-desktop: 60px
--header-height-mobile: 44px
--sidebar-width: 75px
--compact-width: 320px
--content-gap-desktop: 20px
--content-gap-mobile: 10px
--avatar-size: 34px
--user-menu-gap: 10px
--logo-padding-desktop: 20px
--logo-padding-mobile: 10px
--sidebar-gap: 10px
--compact-gap: 10px
```

### Typography
```css
--font-family: 'Montserrat', sans-serif
--sidebar-label-size: 11px
--sidebar-label-weight: 600
--sidebar-label-line-height: 12px
--compact-label-size: 18px
--compact-label-weight: 600
--compact-label-line-height: 12px
--icon-size: 24px
```

---

## VERSION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-02 | Initial finalized specification | Platform Team |

---

## NOTES

This specification document captures the finalized implementation after extensive testing and refinement. All values have been validated and should not be changed without thorough testing and approval.

For questions or clarification, contact the Platform Team.

---

**END OF SPECIFICATION**
