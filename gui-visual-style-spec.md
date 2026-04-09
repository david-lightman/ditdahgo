# Dit Dah Go GUI Visual Style Spec

## Purpose

This document defines the visual style system for Dit Dah Go.

It should be used alongside [design-spec.md](/Users/a220018178/Documents/personal/dit-dah-go/design-spec.md) and [gui-wireframe-spec.md](/Users/a220018178/Documents/personal/dit-dah-go/gui-wireframe-spec.md).

The goal is to make the GUI feel:

- intuitive
- modern
- aesthetic
- flexible

When those goals conflict, clarity wins.

## Visual Direction Summary

The interface should feel like a calm communication workspace with subtle signal-inspired character.

It should not look like:

- a toy learning app
- a neon cyberpunk terminal
- a generic bootstrap dashboard
- a ham radio control wall with too many panels

It should feel closer to:

- a modern writing or collaboration tool
- a focused messaging workspace
- a tactile utility with light analog references

## Core Visual Principles

### 1. Calm First

The UI should reduce anxiety while users are connecting, sending, and debugging timing.

Use restrained contrast, clear spacing, and stable layouts.

### 2. Signal, Not Noise

The Morse identity should come through in rhythm, spacing, pattern, and subtle linework.

Avoid decorative signal motifs that make the interface harder to scan.

### 3. Strong Hierarchy

Users should instantly understand:

- where to connect
- whether the session is healthy
- what message just arrived
- how to send the next one

### 4. Layered Complexity

The default state should feel simple.

Analysis, coaching, timing detail, and future AI features should feel like layers added on top, not the main visual weight.

### 5. Tactile Interaction

The send surface should feel responsive and grounded, with visual treatment that suggests pressure, timing, and rhythm.

## Style Personality

Keywords:

- focused
- grounded
- precise
- warm-modern
- trustworthy
- restrained

Secondary cues:

- signal
- cadence
- pulse
- paper-notes meets digital workspace

## Color System

### Overall Approach

Use a dark-first interface for phase 0 because it suits long sessions, contrast control, and signal-focused visuals.

But avoid the common dark-theme traps:

- flat black backgrounds
- harsh neon accents
- purple-on-charcoal defaults
- low-contrast gray-on-gray text

The palette should be deep, slightly warm, and readable.

## Proposed Base Palette

### Surfaces

- `bg-app`: `#11161A`
- `bg-panel`: `#182027`
- `bg-panel-raised`: `#202A33`
- `bg-input`: `#0F1418`
- `bg-timeline-alt`: `#141B20`

### Text

- `text-primary`: `#F3F5F4`
- `text-secondary`: `#B9C2BD`
- `text-muted`: `#7E8A86`
- `text-disabled`: `#5C6663`

### Lines And Structure

- `border-subtle`: `#27323A`
- `border-strong`: `#39505A`
- `divider`: `rgba(255,255,255,0.08)`

### Accents

- `accent-primary`: `#D6A54A`
- `accent-primary-strong`: `#F0BC59`
- `accent-secondary`: `#6FC3B2`
- `accent-secondary-soft`: `#427E74`

### States

- `state-success`: `#67C587`
- `state-warning`: `#E0A94B`
- `state-danger`: `#D96C6C`
- `state-info`: `#5FA8E8`

### Timeline Roles

- `message-local`: `#223A32`
- `message-remote`: `#22313F`
- `message-system`: `#2A2A2A`
- `message-selected`: `#314654`

## Color Usage Rules

### Backgrounds

- use `bg-app` for the full application background
- use `bg-panel` for cards and primary containers
- use `bg-panel-raised` for elevated or selected regions
- use `bg-input` for fields and keying surfaces

### Accent Use

- `accent-primary` is for primary actions and rhythm-oriented emphasis
- `accent-secondary` is for supportive indicators and secondary highlights
- success, warning, danger, and info are reserved for status meaning, not decoration

### Do Not Do

- do not use bright color on large background fills
- do not color-code every component aggressively
- do not use success green as the main brand color everywhere

## Typography

## Strategy

Use a two-font system:

- one expressive but highly readable sans serif for interface text
- one monospace family for Morse, technical values, session IDs, and timing-related content

## Recommended Font Pairing

Primary UI font:

- `Averta`, `Manrope`, or `IBM Plex Sans`

Monospace / signal font:

- `IBM Plex Mono` or `JetBrains Mono`

Implementation-safe fallback stacks:

```text
font-ui: "IBM Plex Sans", "Aptos", "Segoe UI", sans-serif
font-mono: "IBM Plex Mono", "JetBrains Mono", monospace
```

If custom fonts are used later, they should still preserve a calm, serious tone.

## Type Scale

- App title: 24px / semibold
- Section title: 18px / semibold
- Card title: 16px / semibold
- Body primary: 14px to 16px / regular
- Body secondary: 13px to 14px / regular
- Caption/meta: 12px / medium
- Morse or session code: 13px to 15px / mono medium

## Typography Rules

- use sentence case, not all caps, for most labels
- avoid overly tiny metadata text
- use the mono face only where it adds semantic value
- keep line length moderate in the timeline and status messages

## Spacing System

Use a 4px base grid.

Recommended spacing scale:

- 4
- 8
- 12
- 16
- 20
- 24
- 32

Usage guidance:

- 8 for tight internal gaps
- 12 to 16 for control grouping
- 20 to 24 for panel padding
- 32 for major layout separation

The interface should feel breathable, not sparse.

## Layout Style

### Container Behavior

- maintain generous outer padding around the app shell
- use clear card boundaries for connection and timeline regions
- prefer one dominant column for the main communication flow

### Corner Radius

- primary panels: 16px
- inputs and buttons: 12px
- pills and badges: 999px

### Shadows

Use restrained shadows.

Recommended approach:

- soft, low-opacity shadow for raised panels
- slightly stronger shadow only for key interactive surfaces

Do not make the interface look glossy or skeuomorphic.

## Component Style Rules

### Top Bar

Visual role:

- quiet structural anchor

Styling:

- compact height
- translucent or slightly raised background
- subtle bottom border
- clear separation between app identity and status controls

### Connection Card

Visual role:

- first-action surface

Styling:

- elevated card treatment
- strongest initial contrast after launch
- action buttons visibly grouped with URL and session controls
- status line should use state color sparingly and readable text first

Behavior when connected:

- card compresses in height
- less padding
- reduced prominence
- status becomes summary rather than call to action

### Timeline

Visual role:

- central focus of the app

Styling:

- messages appear as stacked cards or soft bubbles within a structured feed
- generous vertical spacing between different event groups
- sent and received items differentiated by tone and alignment, not just color
- system items should be visually quieter than conversational items

### Message Card Treatment

Local message:

- warm-dark surface using `message-local`
- aligned to one side consistently

Remote message:

- cool-dark surface using `message-remote`
- aligned opposite the local message

System message:

- centered or lightly inset
- muted styling
- no bubble-heavy treatment

Selected message:

- raised or outlined with `message-selected`
- reveal additional detail beneath or in a drawer

### Input Dock

Visual role:

- action area
- tactile and reliable

Styling:

- fixed visual anchor at the bottom
- slightly stronger elevation than the timeline background
- clear separation of live keying controls and assisted text controls

### Key / Paddle Surface

This is the most important high-affordance control in the app.

It should feel:

- pressable
- stable
- responsive

Recommended treatment:

- large rounded rectangle or pill-like pad
- darker base with slightly lighter active state
- subtle inner highlight or border when idle
- visible press state with scale, brightness, or glow shift

Do not over-animate it.

### Buttons

Primary button:

- use `accent-primary`
- dark text if contrast allows, otherwise light text
- clear hover and pressed states

Secondary button:

- tonal fill with subtle border
- lower contrast than the primary action

Danger button:

- reserve for destructive actions only

### Inputs

Styling:

- dark inset surface
- medium border contrast
- high contrast placeholder and text
- generous horizontal padding

Focus state:

- use accent ring or border glow
- must be visible and accessible

### Status Indicators

Examples:

- disconnected
- hosting
- joining
- connected
- error

Styling rules:

- pair color with plain text, never color alone
- use pill badges or concise inline labels
- keep these compact

## Motion And Interaction

Animation should be meaningful, not decorative.

## Recommended Motion

- soft panel reveal on initial load
- collapse/expand transition for the connection card
- subtle message arrival animation in the timeline
- tactile press feedback on the key surface

## Avoid

- bouncing controls
- overly elastic movement
- constant pulsing accents
- animation on every hover target

## Morse-Specific Visual Language

The GUI should express Morse identity through rhythm more than decoration.

### Good Ways To Show Morse Identity

- segmented pulse bars
- mono typography for raw code
- spacing rhythm between short and long marks
- subtle line motifs inspired by timing rails

### Bad Ways To Show Morse Identity

- wallpaper-like dot-dash backgrounds
- decorative code everywhere
- novelty telegraph illustrations as primary UI structure

## Raw Morse Presentation

When Morse is shown directly:

- use the mono font
- give it slightly looser letter spacing than normal body text
- keep line height readable
- separate raw Morse from decoded English visually

Example treatment:

- primary row: raw Morse in mono
- secondary row: decoded English in subdued UI font

## Accessibility Guidance

### Contrast

- maintain strong contrast for primary text
- ensure status colors remain readable on dark backgrounds
- avoid relying on hue alone for meaning

### Input Clarity

- all interactive controls need strong focus states
- the keying surface must remain obvious even when idle
- status messages must use plain language

### Motor Simplicity

- large hit targets for paddle/button input
- enough spacing between host/join controls
- no tiny icon-only essential actions

## Visual Priority By State

### Disconnected

Most visual emphasis:

- connection card

Reduced emphasis:

- timeline
- input dock

### Hosting / Joining

Most visual emphasis:

- session state and waiting/joining feedback

Secondary emphasis:

- timeline system events

### Connected

Most visual emphasis:

- timeline
- input dock

Reduced emphasis:

- compact connection summary

### Error

Most visual emphasis:

- concise recovery message near the affected controls

Avoid:

- flooding the main screen with technical debug text

## Visual Hooks For Future Teaching Mode

Teaching visuals should reuse the main style system.

Future additions can include:

- confidence chips
- timing hint panels
- subtle highlighted segments within Morse output
- expandable coaching notes

These should feel like overlays on the communication workspace, not a different application.

## Visual Hooks For Future LLM Partner

The future AI partner should visually reuse the same message model.

Recommended distinction:

- a subtle partner badge or label
- distinct but not disruptive message tone
- same timeline format as human chat

Do not introduce a separate chatbot-style UI panel unless the product direction changes.

## Suggested CSS Token Set

These names are intended as implementation guidance:

```text
--bg-app
--bg-panel
--bg-panel-raised
--bg-input
--bg-timeline-alt

--text-primary
--text-secondary
--text-muted
--text-disabled

--border-subtle
--border-strong
--divider

--accent-primary
--accent-primary-strong
--accent-secondary
--accent-secondary-soft

--state-success
--state-warning
--state-danger
--state-info

--message-local
--message-remote
--message-system
--message-selected

--radius-panel
--radius-control
--radius-pill

--shadow-panel
--shadow-raised

--space-1
--space-2
--space-3
--space-4
--space-5
--space-6
--space-7

--font-ui
--font-mono
```

## Implementation Guidance

When the frontend work starts, build the visual system in this order:

1. app shell background and text tokens
2. panel and card styles
3. top bar and connection card
4. timeline message styles
5. input dock and key surface states
6. status badges and motion details

Do not jump directly into one-off styles for individual components.

## Continuation Note For Future Work

If a future LLM or developer resumes design from this file, preserve these assumptions unless explicitly changed:

- communication-first UI
- dark-first but calm palette
- warm metallic primary accent rather than generic neon or purple
- modern productivity-app structure
- Morse identity expressed through rhythm and typography
- restrained motion
- teaching and AI features layered into the same visual system