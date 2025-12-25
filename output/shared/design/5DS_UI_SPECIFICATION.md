# UI Design Specification

> **Version**: 1.0  
> **Created**: 2025-12-24  
> **Status**: Reference Design for Implementation

---

## Executive Summary

This document provides a detailed UI/UX specification based on screenshot analysis of a reference platform design. The goal is to align our configurator implementation with this design language.

### Key Differences from Current Implementation

| Aspect | Current Implementation | Reference Design |
|--------|----------------------|------------------|
| Sidebar Width | 64px (icon-only) | ~280-320px (full accordion) |
| Sidebar Style | Minimal icons with tooltips | Full accordion with inline content |
| Navigation | Horizontal step navigation | Vertical accordion sections |
| Layout | 2-column (sidebar + main) | 3-column (sidebar + main + preview card) |
| Content Location | Main content area | Embedded INSIDE accordion sections |
| Project Cards | Standard card layout | Terminal-style header with command display |

---

## 1. Layout Structure

### 1.1 Three-Column Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Header (optional - not always visible)                          │
├─────────────────┬──────────────────────────┬────────────────────┤
│                 │                          │                    │
│   Accordion     │    Main Content          │   Preview Card     │
│   Sidebar       │    (project details,     │   (framework       │
│                 │    file tree, etc.)      │   command, status) │
│   ~300px        │    flex-1                │   ~320px           │
│                 │                          │                    │
│                 │                          │                    │
│                 │                          │                    │
│                 │                          │                    │
└─────────────────┴──────────────────────────┴────────────────────┘
```

### 1.2 Measurements

| Element | Value |
|---------|-------|
| Accordion Sidebar Width | 280-320px |
| Main Content Area | flex-1 (fills remaining space) |
| Preview Card Width | ~320px |
| Header Height | 56-64px (when present) |
| Section Padding | 16-24px |
| Accordion Item Padding | 16px horizontal, 12-16px vertical |
| Border Radius (cards) | 8-12px |
| Border Radius (buttons) | 6-8px |

### 1.3 Responsive Breakpoints

| Breakpoint | Layout Change |
|------------|---------------|
| < 768px | Single column, sidebar becomes sheet/drawer |
| 768-1024px | Two columns (sidebar + main, hide preview card) |
| > 1024px | Full three-column layout |
| > 1440px | Max-width container, centered |

---

## 2. Color Palette

### 2.1 Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#0052FF` | CTAs, active states, brand accents |
| Primary Blue Light | `#0052FF10` | Active section backgrounds |
| Primary Blue Dark | `#0041CC` | Hover states on primary buttons |

### 2.2 Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Background, cards |
| Slate 50 | `#F8FAFC` | Page background |
| Slate 100 | `#F1F5F9` | Subtle backgrounds, disabled states |
| Slate 200 | `#E2E8F0` | Borders, dividers |
| Slate 400 | `#94A3B8` | Placeholder text, icons (inactive) |
| Slate 500 | `#64748B` | Secondary text, descriptions |
| Slate 700 | `#334155` | Body text |
| Slate 900 | `#0F172A` | Headings, terminal backgrounds |

### 2.3 Status Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#10B981` | Completed states, ready badges |
| Success Green Light | `#D1FAE5` | Success backgrounds |
| Warning Amber | `#F59E0B` | Warnings, pending |
| Warning Amber Light | `#FEF3C7` | Warning backgrounds |
| Error Red | `#EF4444` | Errors, destructive |
| Error Red Light | `#FEE2E2` | Error backgrounds |

### 2.4 Semantic Color Variables (CSS)

```css
:root {
  /* Primary */
  --color-primary: #0052FF;
  --color-primary-light: #0052FF10;
  --color-primary-dark: #0041CC;
  
  /* Backgrounds */
  --bg-page: #F8FAFC;
  --bg-card: #FFFFFF;
  --bg-sidebar: #FFFFFF;
  --bg-terminal: #0F172A;
  
  /* Text */
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  
  /* Borders */
  --border-default: #E2E8F0;
  --border-active: #0052FF;
  
  /* Status */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
  --status-ready: #10B981;
}
```

---

## 3. Typography

### 3.1 Font Stack

| Type | Family | Fallback |
|------|--------|----------|
| Primary | System UI / Inter | -apple-system, BlinkMacSystemFont, "Segoe UI" |
| Monospace | JetBrains Mono / SF Mono | ui-monospace, monospace |

### 3.2 Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Page Title | 24px | 700 (bold) | 1.2 | -0.02em |
| Section Title | 16-18px | 600 (semibold) | 1.3 | -0.01em |
| Card Title | 16px | 600 | 1.4 | 0 |
| Body Text | 14px | 400 (normal) | 1.5 | 0 |
| Small Text | 13px | 400 | 1.5 | 0 |
| Label | 12px | 500 (medium) | 1.4 | 0.01em |
| Caption | 11-12px | 400 | 1.4 | 0 |
| Badge Text | 11-12px | 500 | 1 | 0.02em |
| Terminal Text | 12-13px | 400 | 1.6 | 0 |

### 3.3 Text Colors by Context

```css
.text-heading { color: var(--text-primary); }
.text-body { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-active { color: var(--color-primary); }
.text-success { color: var(--status-success); }
.text-terminal { color: #E2E8F0; }
```

---

## 4. Accordion Sidebar Component

### 4.1 Structure

The sidebar contains 8-10 accordion sections that expand to reveal inline form content.

```
┌─────────────────────────────────┐
│ [Logo/Brand]          [x/8 ✓]  │ ← Header
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ● Research                ▼ │ │ ← Expanded Section
│ │   Define your project       │ │
│ ├─────────────────────────────┤ │
│ │ [Domain Input]              │ │ ← Inline Content
│ │ [Toggle: Add Inspiration]   │ │
│ │ [URL Input]                 │ │
│ │ [+ Website URL]             │ │
│ │ [Start Research] [Show Me]  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ △ Core Features          (4)│ │ ← Collapsed Section
│ │   Select features           │ │    with count badge
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ △ Integrate AI           (2)│ │ ← Collapsed
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ✓ Cursor           ● Ready │ │ ← Completed Section
│ └─────────────────────────────┘ │
│                                 │
│ ...more sections...             │
├─────────────────────────────────┤
│ [Progress Bar]            75%  │ ← Footer (optional)
└─────────────────────────────────┘
```

### 4.2 Section States

| State | Visual Treatment |
|-------|-----------------|
| Default/Collapsed | Gray icon, slate text, chevron right |
| Active/Current | Blue left border (3-4px), blue icon background, expanded |
| Completed | Green checkmark icon, "Ready" badge |
| Pending | Gray icon, lighter text |
| Disabled | Opacity 0.5, not clickable |

### 4.3 Section Header Structure

```
┌────────────────────────────────────────────┐
│ ▮  [Icon]  [Label]            [Badge] [▼] │
│ ▮          [Description]                   │
└────────────────────────────────────────────┘
  │
  └── Left border indicator (3-4px, blue when active)
```

### 4.4 CSS Specification

```css
.accordion-sidebar {
  width: 300px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.accordion-header {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-default);
}

.accordion-section {
  border-bottom: 1px solid var(--border-default);
}

.accordion-trigger {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  position: relative;
}

.accordion-trigger.active {
  background: var(--color-primary-light);
}

.accordion-trigger.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  background: var(--color-primary);
  border-radius: 0 4px 4px 0;
}

.accordion-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accordion-icon.pending { background: #F1F5F9; color: #94A3B8; }
.accordion-icon.active { background: #0052FF10; color: #0052FF; }
.accordion-icon.completed { background: #D1FAE5; color: #10B981; }

.accordion-content {
  padding: 0 16px 16px;
  padding-left: 60px; /* Align with text, past icon */
}
```

---

## 5. Component Specifications

### 5.1 Project Card (Terminal Style)

The project cards in "My Projects" have a distinctive terminal-style header.

```
┌────────────────────────────────────────────┐
│ ┌────────────────────────────────────────┐ │
│ │ 🔵 @5ds/framework          ● Active   │ │ ← Blue terminal header
│ │────────────────────────────────────────│ │
│ │ npx @5daysprint/framework d9d8c242... 📋│ │ ← Command with copy button
│ └────────────────────────────────────────┘ │
│                                            │
│ Project                                    │
│ CardClash Arena                            │ ← Title
│                                            │
│ A digital card game platform where         │ ← Description
│ players can collect cards, build decks...  │
│                                            │
│ Aug 25, 2025 13:19                         │ ← Date
└────────────────────────────────────────────┘
```

#### CSS Specification

```css
.project-card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-default);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.project-card-terminal {
  background: var(--color-primary);
  padding: 12px 16px;
  border-radius: 8px;
  margin: 12px;
}

.project-card-terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.project-card-terminal-badge {
  font-size: 12px;
  font-weight: 500;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-card-terminal-command {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-card-body {
  padding: 16px;
}

.project-card-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.project-card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.project-card-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card-date {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 12px;
}
```

### 5.2 Feature Checkbox Group

Features are organized in expandable categories with checkboxes.

```
┌─────────────────────────────────────────────────┐
│ ≡ User Management                         (3) ▼│
├─────────────────────────────────────────────────┤
│   □ Social login                               │
│   ☑ Email registration                         │
│   ☑ Guest browsing                             │
│   □ Admin dashboard                            │
│   ↵ Clear selection                            │
└─────────────────────────────────────────────────┘
```

#### States

| State | Checkbox | Text |
|-------|----------|------|
| Unchecked | Empty square, slate border | Slate-700 text |
| Checked | Filled square, blue background, white check | Blue text |
| Disabled | Light gray background | Gray text, opacity 0.5 |

### 5.3 NPX Command Display Card

The blue terminal-style card showing the framework command.

```
┌────────────────────────────────────────────────────┐
│ 🔵 @5ds/framework                        ● Active │
├────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐ │
│ │ npx @5daysprint/framework d9d8c242-19af...  📋 │ │
│ └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

#### CSS

```css
.npx-command-card {
  background: var(--color-primary);
  border-radius: 12px;
  padding: 16px;
  color: white;
}

.npx-command-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.npx-command-brand {
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.npx-command-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.npx-command-status::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
}

.npx-command-input {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.npx-command-input button {
  background: transparent;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
}

.npx-command-input button:hover {
  opacity: 1;
}
```

### 5.4 Guided Setup Step

The numbered step instruction format.

```
┌─────────────────────────────────────────────────────┐
│ Use Supabase to manage user authentication,         │
│ database, and file storage for your app             │
│                                                     │
│  ① Go to Supabase to create an account or login    │
│                                                     │
│  ② Create a new project or ensure you have         │
│     at least one existing project                   │
│                                                     │
│  ③ Click "Connect Supabase" below to               │
│     authorize access to your projects               │
│                                                     │
│  [Show Me How]  [✨ Connect Supabase ↗]            │
└─────────────────────────────────────────────────────┘
```

#### CSS

```css
.guided-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.guided-step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guided-step-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.guided-step-content a {
  color: var(--color-primary);
  text-decoration: underline;
}
```

### 5.5 Status Badge (Ready/Active)

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.ready {
  background: #D1FAE5;
  color: #059669;
}

.status-badge.ready::before {
  content: '●';
  color: #10B981;
}

.status-badge.active {
  background: transparent;
  color: white;
}

.status-badge.active::before {
  content: '●';
  color: #10B981;
}
```

### 5.6 File Tree View

Displayed in the "Generate Prompt" final step.

```
┌──────────────────────────────────────────┐
│ 📁 .cursorrules                          │
│ 📁 .claude                               │
│ 📂 src                                   │
│    📁 app                                │
│    📂 components                         │
│       🎨 ui                              │
│       ▢ magicui                          │
│       ▢ layouts                          │
│       ⭐ features                         │
│       ↗ common                           │
│    📁 lib                                │
│       contexts                           │
│       hooks                              │
│       types                              │
│       styles                             │
│ 📂 backend                               │
│ 📁 docs                                  │
│ 🧪 tests                                 │
│ 📁 public                                │
│ 📦 package.json                          │
└──────────────────────────────────────────┘
```

### 5.7 Project Overview Box

The blue-bordered box showing project description and AI analysis.

```css
.project-overview-box {
  background: var(--color-primary-light);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  padding: 16px;
}

.project-overview-header {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.project-overview-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

### 5.8 Add Feedback Toggle

Toggle switch with inline text input that appears when enabled.

```
┌─────────────────────────────────────────────────────┐
│ 🔄 Add Feedback                            [====○] │
├─────────────────────────────────────────────────────┤
│ What specific features or changes would you like?   │
│ ┌─────────────────────────────────────────────────┐ │
│ │                                                 │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 6. Buttons

### 6.1 Button Variants

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| Primary | `#0052FF` | White | None | CTAs, main actions |
| Secondary | White | `#334155` | `#E2E8F0` | Secondary actions |
| Ghost | Transparent | `#64748B` | None | Tertiary actions, links |
| Success | `#10B981` | White | None | Completion, confirm |

### 6.2 Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 12px 16px | 13px |
| md | 40px | 12px 20px | 14px |
| lg | 48px | 14px 24px | 16px |

### 6.3 Button with Icon

```css
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-with-icon svg {
  width: 16px;
  height: 16px;
}

/* Arrow indicator for external/continue actions */
.btn-arrow-right::after {
  content: '↗';
  margin-left: 4px;
}
```

---

## 7. Forms

### 7.1 Input Fields

```css
.input-field {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.input-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}
```

### 7.2 Toggle Switch

```css
.toggle {
  width: 44px;
  height: 24px;
  background: #E2E8F0;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle.active {
  background: var(--color-primary);
}

.toggle::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle.active::after {
  transform: translateX(20px);
}
```

### 7.3 Select/Dropdown

```css
.select-field {
  width: 100%;
  height: 40px;
  padding: 0 36px 0 12px;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  font-size: 14px;
  background: white url('chevron-down.svg') no-repeat right 12px center;
  background-size: 16px;
  appearance: none;
  cursor: pointer;
}
```

---

## 8. Interaction Patterns

### 8.1 Accordion Behavior

1. **Single Active**: Only one section expanded at a time within the main flow
2. **Click to Expand**: Clicking section header expands it and collapses others
3. **Persist State**: Remember which section was last active
4. **Scroll Into View**: Auto-scroll to show expanded content

### 8.2 Section Navigation

1. **Click Section Header**: Navigate to that step AND expand it
2. **Complete to Unlock**: Some sections may require previous completion
3. **Visual Progress**: Checkmarks and "Ready" badges show completion

### 8.3 Form Validation

| State | Visual Feedback |
|-------|-----------------|
| Required field empty | Red border, error text below |
| Invalid format | Red border, inline error message |
| Valid | Green checkmark (optional) |
| Pending validation | Loading spinner |

### 8.4 Button Loading States

```css
.btn-loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 9. Animations

### 9.1 Accordion Expand/Collapse

```css
.accordion-content {
  overflow: hidden;
  transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
}

.accordion-content.collapsed {
  max-height: 0;
  opacity: 0;
}

.accordion-content.expanded {
  max-height: 500px; /* or use JS to calculate */
  opacity: 1;
}
```

### 9.2 Card Hover

```css
.project-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### 9.3 Button Hover

```css
.btn-primary {
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

---

## 10. Implementation Roadmap

### Phase 1: Core Layout (Priority: P0)

1. **AccordionSidebar** - Main navigation component
   - Dependencies: shadcn/ui Accordion, ScrollArea
   - Files: `AccordionSidebar.tsx`
   
2. **ThreeColumnLayout** - Layout wrapper
   - Dependencies: None
   - Files: `ConfiguratorLayout.tsx`

3. **NPXCommandCard** - Framework command display
   - Dependencies: Copy functionality
   - Files: `NPXCommandCard.tsx`

### Phase 2: Section Content (Priority: P1)

4. **ResearchSection** - Domain input, inspiration URLs
   - Dependencies: Input, Toggle, Button
   
5. **CoreFeaturesSection** - Feature category accordions
   - Dependencies: Checkbox, Accordion, Badge

6. **IntegrateAISection** - AI provider selection
   - Dependencies: Radio, Input, Badge

7. **ToolSetupSection** - Cursor, GitHub, Claude Code, Supabase, Vercel
   - Dependencies: GuidedSteps component

### Phase 3: Supporting Components (Priority: P2)

8. **ProjectCard** - Terminal-style project cards
   - For My Projects page
   
9. **FileTreeView** - Interactive file explorer
   - For Generate Prompt step

10. **CompletionChecklist** - Tools status summary
    - Shows all tool ready states

### Phase 4: Polish (Priority: P3)

11. Add animations and transitions
12. Implement responsive behavior
13. Add keyboard navigation
14. Performance optimization

---

## 11. File Structure

```
website/
├── app/
│   ├── components/
│   │   └── configurator/
│   │       ├── AccordionSidebar.tsx      # Main sidebar
│   │       ├── ConfiguratorLayout.tsx    # 3-column layout
│   │       ├── NPXCommandCard.tsx        # Command display
│   │       ├── sections/
│   │       │   ├── ResearchSection.tsx
│   │       │   ├── CoreFeaturesSection.tsx
│   │       │   ├── IntegrateAISection.tsx
│   │       │   └── ToolSetupSection.tsx
│   │       ├── GuidedSteps.tsx
│   │       └── FeatureCheckbox.tsx
│   ├── configure/
│   │   └── page.tsx                      # Main configurator page
│   └── projects/
│       └── page.tsx                      # My Projects page
├── components/
│   └── ui/
│       ├── terminal-card.tsx             # Project card terminal header
│       └── status-badge.tsx              # Ready/Active badges
└── styles/
    └── configurator.css                  # Component-specific styles
```

---

## 12. Summary of Key Changes Needed

| Current | Change To |
|---------|-----------|
| 64px icon sidebar | 300px accordion sidebar |
| Horizontal step nav | Vertical accordion sections |
| Content in main area | Content INSIDE accordion sections |
| Standard project cards | Terminal-style header cards |
| Separate step pages | All steps in sidebar, inline forms |
| Basic progress indicator | Section completion badges |

---

## Appendix: Screenshot Reference Index

| Screenshot | Content | Key Components |
|------------|---------|----------------|
| 1 | Claude Code section | Accordion sidebar, guided steps |
| 2 | Integrate AI section | AI provider picker, checkboxes |
| 3 | Cursor section | Guided setup steps |
| 4 | GitHub section | Repository creation steps |
| 5 | Supabase connected | Project selector dropdown |
| 6 | Research with inspiration | Domain input, URL inputs |
| 7 | My Projects dashboard | Terminal-style project cards |
| 8 | Core Features | Feature categories with counts |
| 9-12 | Feature selection details | Checkbox groups, accordions |
| 13-14 | Supabase states | Connected vs setup views |
| 15 | Generate Prompt final | File tree, command card, tool status |
| 16 | Claude Code (duplicate) | - |
| 17 | Framework landing page | Hero, comparison cards, logos |
| 18 | 404 page | Shows sidebar nav item |
| 19 | Control Room (Admin) | Three-column admin layout |
| 20 | Landing page (duplicate) | - |
| 21 | GitHub section (duplicate) | - |
| 22-23 | Live Stream Preview | Full-width streaming layout |
| 24 | My Projects (duplicate) | - |

---

*Document generated by Research Agent based on screenshot analysis.*

