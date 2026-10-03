# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Calm, light, modern travel-planner UI: airy off-white surfaces, deep slate text, a restrained teal accent, and clear Inter-based typography — familiar like Linear/Stripe, made for dense day plans and budgets.

## Colors

- `--color-bg`: **#F7F8FA**
- `--color-surface`: **#FFFFFF**
- `--color-surface_muted`: **#F1F4F6**
- `--color-fg`: **#1A2233**
- `--color-muted`: **#6B7280**
- `--color-border`: **#E3E6EA**
- `--color-accent`: **#167D6F**
- `--color-accent_hover`: **#125E59**
- `--color-accent_active`: **#0F4F4B**
- `--color-accent_soft`: **#E7F0EE**
- `--color-success`: **#2E7D4F**
- `--color-danger`: **#C62828**
- `--color-warning`: **#B45309**

## Typography

- `font_family`: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif
- `heading_weight`: 600
- `body_weight`: 400
- `size_scale`: 13px / 14px body, 16px section label, 20px card title, 28px page title

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button

min-height 44px, padding 10px 20px, radius md, font-weight 600, bg accent #167D6F, color #FFFFFF, hover bg #125E59, active bg #0F4F4B, disabled opacity 0.45 cursor not-allowed, focus-visible outline 2px #167D6F offset 2px. Secondary variant: bg surface, border 1px #E3E6EA, color #1A2233, hover bg #F1F4F6. Danger variant: bg #C62828, hover #A61E1E.

### Card

bg surface, border 1px #E3E6EA, radius lg, padding 20px, box-shadow 0 1px 2px rgba(16,24,40,0.05). Interactive card: hover border #167D6F and translateY(-1px), focus-visible outline 2px #167D6F offset 2px.

### Input

label above: 14px font-weight 600 color #1A2233, margin-bottom 6px. Control: width 100%, min-height 44px, padding 10px 12px, radius md, border 1px #E3E6EA, bg surface, color #1A2233. Focus: border #167D6F, ring 3px rgba(22,125,111,0.15). Error: border #C62828, message below 13px #C62828 with role=alert.

### Dialog/Modal

overlay rgba(26,34,51,0.5), centered flex, panel max-width 480px width calc(100% - 32px), bg surface, radius lg, padding 24px, border 1px #E3E6EA. Title 20px weight 600. Actions right-aligned with 12px gap, destructive confirm button uses Button danger variant.

### Nav/Tabs

horizontal tabs, gap 8px, each item min-height 44px, padding 8px 14px, radius md, color #6B7280, hover bg #F1F4F6, active color #125E59 bg #E7F0EE font-weight 600, focus-visible outline 2px #167D6F offset 2px.

### Badge/Chip

radius pill, padding 4px 10px, font-size 13px, bg #E7F0EE, color #125E59, border 1px transparent. Neutral variant: bg #F1F4F6, color #6B7280. Warning variant: bg #FDF3E3, color #B45309.

### ProgressBar

track height 8px, radius pill, bg #E3E6EA, overflow hidden. Fill bg #167D6F, transition width 200ms ease. Over-budget fill bg #B45309. Percentage label 13px #6B7280 to the right.

### EmptyState

centered, border 1px dashed #E3E6EA, radius lg, padding 32px 24px, bg surface, title 20px weight 600, description 14px #6B7280, primary action via Button.

## Layout Principles

- Page container: max-width 1120px, margin 0 auto, padding 16px on mobile, 24px from 768px, 32px from 1024px.
- Breakpoints: 640px for two-column forms/cards, 1024px for detail layout grid 2fr/1fr (day plan + side panel).
- Sticky app header: height 60px, surface background, bottom border 1px #E3E6EA, contains brand, nav tabs and primary action.
- Vertical rhythm: section spacing 24px, card list gap 16px, form field gap 16px.
- Mobile-first: single column below 640px, no horizontal overflow, all interactive elements at least 44px touch height.
- Use flexbox for rows and CSS grid for page-level columns; charts and progress bars are pure CSS/DOM with no external libraries.
