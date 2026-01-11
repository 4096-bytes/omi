---
name: omi-brand-guidelines
description: Applies OMI's Studio Dark brand palette (cold neutral dark + gold accent) and UI usage rules to any artifact that should match OMI's look-and-feel. Use it when brand colors, styling tokens, visual formatting, or product design consistency apply.
license: Complete terms in repository LICENSE
---

# OMI Brand Styling

## Overview

This skill defines OMI's brand identity for a B2B design/workspace product: **cold neutral “studio dark” surfaces** with a **single gold accent** that never competes with generated imagery.

**Keywords**: branding, visual identity, design system, tokens, dark mode, studio, gallery, portfolio, interior design, image-first UI, Tailwind, shadcn/ui

## Brand Guidelines

### Colors

**Core Palette (Hex):**

- Background: `#0B0B0C` - App background
- Surface: `#111113` - Cards, panels, modals
- Elevated: `#161618` - Hovered/active surfaces, secondary panels
- Border/Input: `#27272A` - Borders and input outlines
- Text: `#FAFAFA` - Primary text on dark surfaces
- Muted Text: `#A1A1AA` - Secondary text, hints, captions

**Accent Palette:**

- Primary (Gold): `#D4AF37` - CTA, selection, key progress states, focus ring
- Primary Foreground: `#0B0B0C` - Text/icon color on gold
- Destructive: `#EF4444` - Errors and destructive actions

**Hard Rules (Non-negotiable):**

- **Single-accent discipline**: Gold is the *only* brand accent. Do not introduce extra accent colors.
- **Gold text contrast**: Do **not** place white text on gold. Use `#0B0B0C` on `#D4AF37`.
- **Image-first UI**: Avoid saturated backgrounds/gradients in content areas that contain user images or generated previews.

### Typography

- **UI Headings & Body**: Geist Sans (via `next/font/google`), with system fallbacks
- **Code/Technical** (optional): Geist Mono (only if a code surface is introduced)

## Features

### Image-First Surfaces

- Default surfaces are neutral and low-chroma to preserve color fidelity in generated images.
- Gallery tiles use subtle elevation and borders; hover uses border/overlay, not color shifts.

### Interaction & Focus

- Focus ring is always gold (`#D4AF37`) and visible on dark backgrounds.
- Selected state uses `primary` sparingly (e.g., border `primary/30`, background `primary/10`).

### Component Styling Defaults

- Primary buttons: gold background + near-black text.
- Outline buttons: neutral border + transparent background (ideal for “Continue with Google”).
- Inputs: background uses `background`, border uses `input`, placeholder uses muted foreground.

## Technical Details

### Tailwind v4 Tokens (Project Source of Truth)

OMI tokens are defined in:

- `src/styles/globals.css` (`@theme --color-*`)

Use semantic utilities instead of hard-coded colors:

- Background: `bg-background`
- Text: `text-foreground`, `text-muted-foreground`
- Surfaces: `bg-card`, `bg-secondary`, `bg-popover`
- Borders: `border-border`, `border-input`
- Accents: `bg-primary`, `text-primary`, `outline-ring`

### Dark-Only Mode

- Do not add a light theme yet.
- Keep `color-scheme: dark` and prefer neutral contrast over decorative color.

