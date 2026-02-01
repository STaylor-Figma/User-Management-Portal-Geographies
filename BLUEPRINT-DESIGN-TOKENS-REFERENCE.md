# Blueprint Design System - Tokens Reference
**Version:** 4.0.0  
**Last Updated:** February 1, 2026  
**Purpose:** Complete reference for Blueprint Design System CSS variables and tokens  
**Status:** ✅ PRODUCTION-READY

---

## 🎯 Quick Start

**Import this CSS file in your HTML:**
```html
<link rel="stylesheet" href="blueprint-workflow-styles.css">
```

**All tokens are defined in `:root` and available globally as CSS custom properties.**

---

## 📊 Color Tokens

### Primary Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-10` | `#feffff` | Lightest primary (white) |
| `--primary-100` | `#f2fafe` | Selected state backgrounds |
| `--primary-200` | `#ccecf9` | Light blue accents |
| `--primary-300` | `#91d3ed` | Medium blue |
| `--primary-400` | `#00a1e0` | Interactive blue (hover states, links) |
| `--primary-500` | `#0c79a8` | Primary brand blue |
| `--primary-600` | `#185a7d` | Dark brand blue |
| `--primary-700` | `#01304a` | Darkest brand blue (header background) |

### Neutral Grays
| Token | Hex | Usage |
|-------|-----|-------|
| `--neutral-0` | `#ffffff` | Pure white |
| `--neutral-50` | `#ffffff` | White (duplicate for semantic naming) |
| `--neutral-100` | `#f4f4f4` | Light gray backgrounds (hover states) |
| `--neutral-200` | `#e7e6e5` | Medium light gray (pill backgrounds, borders) |
| `--neutral-300` | `#dad8d7` | Medium gray (borders, dividers) |
| `--neutral-400` | `#88888e` | Dark gray (badges, icons) |
| `--neutral-450` | `#4a4f55` | Darker gray (text, icons) |
| `--neutral-500` | `#4a4f55` | Dark gray (same as 450) |
| `--neutral-600` | `#1c1f22` | Darkest gray (primary text, headers) |

### Status Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--status-success` | `#459d13` | Success states, PRO badges |
| `--status-error` | `#b70900` | Error states, destructive actions |
| `--status-warning` | `#ed7800` | Warning states, alerts |
| `--error-500` | `#b70900` | Error (duplicate for semantic naming) |

---

## 📏 Spacing Tokens

### Micro Spacing (0-8px)
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-micro-000` | `0px` | No spacing |
| `--spacing-micro-025` | `1px` | Hairline spacing |
| `--spacing-micro-050` | `2px` | Minimal spacing |
| `--spacing-micro-100` | `4px` | Tiny spacing |
| `--spacing-micro-150` | `6px` | Small gaps |
| `--spacing-micro-200` | `8px` | Standard micro spacing |
| `--spacing-micro-250` | `5px` | Alternative micro spacing |

### Small Spacing (10-16px)
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-small-250` | `10px` | Small padding/margins |
| `--spacing-small-300` | `12px` | Standard small spacing |
| `--spacing-small-400` | `16px` | Medium-small spacing |
| `--spacing-small-500` | `16px` | Alternative medium-small |

### Medium Spacing (20-30px)
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-medium-600` | `20px` | Medium gaps |
| `--spacing-medium-700` | `24px` | Standard medium spacing |
| `--spacing-medium-800` | `24px` | Alternative medium |
| `--spacing-medium-900` | `30px` | Large medium spacing |

### Large Spacing (24-32px)
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-large-700` | `24px` | Large gaps |
| `--spacing-large-1000` | `32px` | Extra large spacing |

---

## 🔤 Typography Tokens

### Font Families
| Token | Value |
|-------|-------|
| `--font-family-blueprintfont` | `Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| `--font-family-blueprinticon` | `Font Awesome 6 Pro, sans-serif` |

### Font Sizes
| Token | Value | Usage |
|-------|-------|-------|
| `--font-size-100` | `11px` | Smallest text |
| `--font-size-200` | `12px` | **Table headers, captions, small labels** |
| `--font-size-300` | `14px` | **Body text, table cells, standard UI text** |
| `--font-size-400` | `16px` | Large body text |
| `--font-size-500` | `18px` | Headings |
| `--font-size-600` | `20px` | Large headings |
| `--font-size-700` | `22px` | Extra large headings |
| `--font-size-800` | `24px` | Display headings |

### Font Weights
| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-text-extra-light` | `250` | Extra light text |
| `--font-weight-text-thin` | `250` | Thin text |
| `--font-weight-text-light` | `300` | Light text |
| `--font-weight-text-regular` | `400` | Regular/normal text |
| `--font-weight-text-medium` | `500` | **Medium weight (table body text)** |
| `--font-weight-text-semibold` | `600` | **SemiBold (table headers)** |
| `--font-weight-text-semi-bold` | `600` | Alternative SemiBold |
| `--font-weight-text-bold` | `700` | **Bold (links, emphasis)** |
| `--font-weight-text-extra-bold` | `800` | Extra bold |
| `--font-weight-text-black` | `900` | Black weight |

### Icon Font Weights
| Token | Value |
|-------|-------|
| `--font-weight-icon-thin` | `100` |
| `--font-weight-icon-light` | `300` |
| `--font-weight-icon-regular` | `400` |
| `--font-weight-icon-solid` | `900` |

### Line Heights
| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-xsmall` | `12px` | Compact text |
| `--line-height-small` | `14px` | **Table headers (12px font)** |
| `--line-height-medium` | `16px` | **Table body (14px font)** |
| `--line-height-large` | `18px` | Larger text |
| `--line-height-xlarge` | `24px` | Display text |

### Letter Spacing
| Token | Value |
|-------|-------|
| `--letter-spacing-small` | `0.04px` |

---

## 🎨 Component-Specific Tokens

### Table Components
| Token | Hex | Usage |
|-------|-----|-------|
| `--table-components-background` | `#feffff` | Table container background |
| `--table-components-row-background` | `#feffff` | Default row background |
| `--table-components-row-background-hover` | `#f4f4f4` | Row hover state |
| `--table-components-row-background-selected` | `#f2fafe` | Row selected state |
| `--table-components-header-background-hover` | `#f4f4f4` | Header cell hover |
| `--table-components-text` | `#1c1f22` | Table text color |
| `--table-components-text-link` | `#0c79a8` | Link text in tables |
| `--tabs-underline-group` | `#dad8d7` | Row separator borders |

**Table Typography:**
- **Header cells:** `--font-size-200` (12px), `--font-weight-text-semibold` (600), `--line-height-small` (14px)
- **Body cells:** `--font-size-300` (14px), `--font-weight-text-medium` (500), `--line-height-medium` (16px)
- **Header border:** `2px solid #4a4f55`
- **Body row border:** `1px solid var(--tabs-underline-group)` (#dad8d7)
- **Cell padding:** `10px`
- **Row height:** `42px`

### Tab Components
| Token | Reference |
|-------|-----------|
| `--tab-font-family` | `var(--font-family-blueprintfont)` |
| `--tab-font-size` | `var(--font-size-300)` |
| `--tab-font-weight` | `var(--font-weight-text-medium)` |
| `--tab-line-height` | `var(--line-height-medium)` |
| `--tab-text-color` | `var(--neutral-600)` |
| `--tab-font-weight-selected` | `var(--font-weight-text-bold)` |
| `--tab-text-color-selected` | `var(--neutral-600)` |
| `--tab-text-color-hover` | `var(--primary-400)` |
| `--tab-text-color-selected-hover` | `var(--primary-400)` |
| `--tab-count-font-family` | `var(--font-family-blueprintfont)` |
| `--tab-count-font-size` | `var(--font-size-200)` |
| `--tab-count-font-weight` | `var(--font-weight-text-semibold)` |
| `--tab-count-line-height` | `var(--line-height-small)` |
| `--tab-count-text-color` | `var(--neutral-600)` |
| `--tab-count-text-color-selected` | `var(--neutral-0)` |
| `--tab-count-background-selected` | `var(--primary-500)` |
| `--tab-count-background-selected-hover` | `var(--primary-400)` |
| `--tab-count-padding-horizontal` | `var(--spacing-micro-150)` |
| `--tab-count-padding-vertical` | `var(--spacing-micro-050)` |
| `--tab-count-radius` | `var(--radius-pill)` |
| `--tab-count-background` | `var(--neutral-200)` |
| `--tab-count-background-hover` | `var(--neutral-300)` |
| `--tab-padding-horizontal` | `var(--spacing-micro-050)` |
| `--tab-padding-vertical` | `var(--spacing-small-250)` |
| `--tab-gap` | `var(--spacing-micro-150)` |
| `--tab-radius` | `var(--radius-sm)` |
| `--tab-border-width-selected` | `var(--spacing-micro-100)` |
| `--tab-border-color-active` | `var(--neutral-600)` |
| `--tab-border-width-focus` | `var(--spacing-micro-050)` |
| `--tab-border-color-focus` | `var(--primary-100)` |
| `--tab-group-underline` | `var(--neutral-300)` |
| `--tab-group-border-width` | `2px` |
| `--tab-group-gap-desktop` | `var(--spacing-medium-600)` |
| `--tab-group-gap-mobile` | `var(--spacing-small-250)` |
| `--tab-hover-duration` | `0.2s` |
| `--tab-hover-easing` | `ease-out` |

### Navigation Components
| Token | Hex |
|-------|-----|
| `--header-organism-background-default` | `#01304a` |
| `--nav-menu-container-background` | `#185a7d` |
| `--nav-menu-button-text-default` | `#ccecf9` |
| `--nav-menu-button-text-selected` | `#ffffff` |
| `--nav-menu-button-background-selected` | `#01304a` |
| `--nav-menu-button-background-opacity-selected` | `0.6` |

### Username Button
| Token | Value |
|-------|-------|
| `--username-button-background-default` | `#01304a` |
| `--username-button-avatar-background-default` | `#ffffff` |
| `--username-button-avatar-text-color-default` | `#4a4f55` |
| `--username-button-initials-font-family-default` | `'Montserrat', sans-serif` |
| `--username-button-initials-font-size-default` | `18px` |
| `--username-button-initials-line-height-default` | `16px` |
| `--username-button-initials-font-weight-default` | `700` |
| `--username-button-name-text-color-default` | `#ffffff` |
| `--username-button-name-font-family-default` | `'Montserrat', sans-serif` |
| `--username-button-name-font-size-default` | `18px` |
| `--username-button-name-line-height-default` | `16px` |
| `--username-button-name-font-weight-default` | `500` |

---

## 🔘 Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | `2px` | Minimal rounding |
| `--radius-sm` | `4px` | Small rounding (buttons, badges) |
| `--radius-md` | `8px` | Medium rounding (cards) |
| `--radius-pill` | `30px` | Pill-shaped (tags, chips) |
| `--radius-circle` | `50%` | Perfect circle |

---

## 💊 Pills & Badges - Complete Specification

### Standard Pills
```css
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #e7e6e5;  /* --neutral-200 */
  border-radius: 30px;  /* --radius-pill */
  font-size: 12px;      /* --font-size-200 */
  font-weight: 600;     /* --font-weight-text-semibold */
  color: #1c1f22;       /* --neutral-600 */
  height: 26px;
  line-height: 14px;    /* --line-height-small */
}
```

**Examples:**
- `Full Access`
- `Modified`
- `BM - Team Member`
- `Not Assigned`

### Pill Counter (White Circular Badge Inside Pills)
```css
.pill-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  background: #feffff;  /* --primary-10 or --neutral-0 */
  border-radius: 30px;  /* --radius-pill */
  font-size: 12px;      /* --font-size-200 */
  font-weight: 600;     /* --font-weight-text-semibold */
  color: #1c1f22;       /* --neutral-600 */
  min-width: 20px;
  height: 20px;
  line-height: 14px;    /* --line-height-small */
}
```

**Examples:**
- `Full Access PRO` → pill with "PRO" in pill-counter
- `Modified PRO` → pill with "PRO" in pill-counter
- `Estimator 123` → pill with "123" in pill-counter

**CRITICAL:** PRO badges use `.pill-counter` class (white circular), NOT `.pro-badge` (green)

### User Badge (Role Indicators)
```css
.user-badge {
  display: inline-flex;
  padding: 4px 8px;
  background: #88888e;  /* --neutral-400 */
  color: #fff;          /* white */
  border-radius: 4px;   /* --radius-sm */
  font-size: 12px;      /* --font-size-200 */
  font-weight: 600;     /* --font-weight-text-semibold */
  margin-left: 8px;
}
```

**Examples:**
- `OWNER`
- `ADMIN`

### Pro Badge (GREEN - Use Sparingly)
```css
.pro-badge {
  background: #459d13;  /* --status-success */
  color: white;
  padding: 2px 6px;
  border-radius: 4px;   /* --radius-sm */
  font-size: 10px;
  font-weight: 600;     /* --font-weight-text-semibold */
  margin-left: 4px;
}
```

**⚠️ NOTE:** As of Feb 1, 2026, PRO indicators in pills should use `.pill-counter` (white circular) instead of `.pro-badge` (green). The green badge is kept for legacy support only.

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default styles: Mobile (320px - 767px) */

/* Tablet Small */
@media (min-width: 600px) { }

/* Tablet Portrait */
@media (min-width: 768px) { }

/* Tablet Landscape */
@media (min-width: 1024px) { }

/* Desktop */
@media (min-width: 1440px) { }

/* Large Desktop */
@media (min-width: 1920px) { }
```

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG - Invalid CSS Variable Names
```css
/* NEVER use slashes in CSS custom property names */
font-size: var(--table-components/text);  /* INVALID */
color: var(--content/body/font-family);   /* INVALID */
```

### ✅ CORRECT - Valid CSS Variables
```css
/* Use hyphens only */
font-size: var(--font-size-200);
color: var(--table-components-text);
font-family: var(--font-family-blueprintfont);
```

### ❌ WRONG - Undefined Variables
```css
font-size: var(--font-size-150);  /* Does NOT exist */
```

### ✅ CORRECT - Use Defined Tokens
```css
font-size: var(--font-size-200);  /* 12px - exists */
font-size: var(--font-size-300);  /* 14px - exists */
```

### ❌ WRONG - Hardcoded Values Everywhere
```css
color: #1c1f22;        /* Hard to maintain */
background: #f4f4f4;   /* Not themeable */
```

### ✅ CORRECT - Use CSS Variables
```css
color: var(--neutral-600);
background: var(--neutral-100);
```

**Exception:** Direct values are acceptable when:
- The variable doesn't exist yet
- You're prototyping and will tokenize later
- The value is truly one-off and won't be reused

---

## 🎯 Usage Examples

### Table Header
```css
th {
  font-family: var(--font-family-blueprintfont);
  font-size: var(--font-size-200);           /* 12px */
  font-weight: var(--font-weight-text-semibold); /* 600 */
  line-height: var(--line-height-small);     /* 14px */
  color: var(--table-components-text);       /* #1c1f22 */
}
```

### Table Body Cell
```css
td {
  font-family: var(--font-family-blueprintfont);
  font-size: var(--font-size-300);           /* 14px */
  font-weight: var(--font-weight-text-medium);  /* 500 */
  line-height: var(--line-height-medium);    /* 16px */
  color: var(--table-components-text);       /* #1c1f22 */
}
```

### Interactive States
```css
.row:hover {
  background: var(--table-components-row-background-hover);  /* #f4f4f4 */
}

.row.selected {
  background: var(--table-components-row-background-selected);  /* #f2fafe */
}

.link:hover {
  color: var(--primary-400);  /* #00a1e0 */
}
```

---

## 📋 Quick Reference Card

**Most Used Tokens:**
```css
/* Text */
--font-size-200: 12px        /* Headers, small text */
--font-size-300: 14px        /* Body text */
--font-weight-text-semibold: 600
--font-weight-text-medium: 500
--neutral-600: #1c1f22       /* Primary text */

/* Backgrounds */
--neutral-0: #ffffff         /* White */
--neutral-100: #f4f4f4      /* Hover states */
--neutral-200: #e7e6e5      /* Pill backgrounds */
--primary-100: #f2fafe      /* Selected states */

/* Borders */
--neutral-300: #dad8d7      /* Standard borders */

/* Interactive */
--primary-400: #00a1e0      /* Links, hover */
--primary-500: #0c79a8      /* Primary actions */
```

---

## 🔗 Related Documentation

- [Blueprint Table Assembly Instructions](Blueprint-Table-Assembly-AI-Instructions.md)
- [Responsive Design AI Instructions](RESPONSIVE-DESIGN-AI-INSTRUCTIONS.md)
- [Navigation Specification](NAVIGATION-SPEC.md)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 4.0.0 | Feb 1, 2026 | Complete token reference created. Fixed table typography tokens, added pill/badge specifications, documented all CSS variables. |

---

**💡 Pro Tip:** When in doubt, search this file for the component name or property you're styling. All tokens are documented with usage examples.

**🎨 Design System:** Blueprint Component Library  
**📦 Source File:** `blueprint-workflow-styles.css`  
**🌐 Repository:** User-Management-Portal-Geographies

---

*This document is the single source of truth for Blueprint Design System tokens. Keep it updated when adding new tokens to `blueprint-workflow-styles.css`.*
