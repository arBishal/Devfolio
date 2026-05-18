# Minimal Portfolio View — Implementation Checklist

A traditional, scroll-based portfolio page as an alternative to the terminal interface.
**Design:** flat, monospace, no shadows, thin 1px borders, generous whitespace.

---

## Phase 1: Lift Shared State to App.tsx

- `[x]` Move `useTheme()` call from `useCommandExecutor` → `App.tsx`
- `[x]` Move `useActiveEffect()` call from `useCommandExecutor` → `App.tsx`
- `[x]` Add `viewMode` state (`"terminal" | "minimal"`) to `App.tsx`
- `[x]` Persist `viewMode` to `localStorage`
- `[x]` Move visual effects overlay (Suspense + lazy canvases) to `App.tsx`
- `[x]` Update `useCommandExecutor` to accept theme/effect/meow state as props
- `[x]` Update `Terminal.tsx` to accept shared state + `onToggleView` as props
- `[ ]` Verify terminal still works identically after the state lift

---

## Phase 2: Terminal View Toggle Button

- `[x]` Add `onToggleView` prop to `TerminalHeader`
- `[x]` Add layout/grid icon button (inline SVG) to the header bar
- `[x]` Wire the button to `onToggleView`
- `[ ]` Verify clicking it switches `viewMode` in `App.tsx`

---

## Phase 3: Minimal View — Scaffolding

- `[x]` Create `src/components/minimal/MinimalView.tsx` (root component)
- `[x]` Create `src/components/minimal/MinimalNav.tsx` (sticky top bar)
- `[x]` Create `src/components/minimal/MinimalSection.tsx` (reusable section wrapper)
- `[x]` Wire `MinimalView` into `App.tsx` conditional render
- `[ ]` Verify toggling between views renders the correct root component

---

## Phase 4: Minimal Nav

- `[x]` Section anchor links (About, Skills, Projects, Experience, Contact, Blog)
- `[x]` Desktop: icons + text labels
- `[x]` Mobile: icons only
- `[x]` Theme picker dropdown (reads `themeNames`)
- `[x]` Effect picker dropdown (reads `AVAILABLE_EFFECTS`)
- `[x]` "Switch to Terminal" toggle icon button
- `[x]` Sticky positioning with `border-b border-t-border`
- `[ ]` Smooth scroll on anchor click

---

## Phase 5: Minimal View — Sections

- `[x]` `sections/HeroSection.tsx` — name, title, location, education, resume download
- `[x]` `sections/AboutSection.tsx` — bio paragraphs
- `[x]` `sections/SkillsSection.tsx` — skill categories with inline items
- `[x]` `sections/ProjectsSection.tsx` — project list with thin-line separators
- `[x]` `sections/ExperienceSection.tsx` — timeline with left border
- `[x]` `sections/ContactSection.tsx` — label + clickable links
- `[x]` `sections/BlogSection.tsx` — tagline + links

---

## Phase 6: Polish & Verify

- `[ ]` Theme persists across view switches
- `[ ]` Effects persist across view switches (overlay renders in both)
- `[ ]` CatCompanion persists across view switches
- `[ ]` All section content matches terminal command output
- `[ ]` Mobile responsiveness (nav collapse, section stacking)
- `[ ]` Anchor scroll works on both desktop and mobile
- `[ ]` `localStorage` view preference works on reload
- `[ ]` Run `npm run test` — all existing tests pass
