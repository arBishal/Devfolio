# Theme Contrast Audit

WCAG 2.1 contrast audit of every theme defined in `src/index.css`. Ratios computed
with the standard relative-luminance formula.

- **Text pairs** are held to **AA normal text = 4.5:1** (most body/label text in the
  app is < 18px, so the 3:1 large-text allowance does not apply).
- **Border-on-bg** is held to **3:1** (WCAG 1.4.11 non-text contrast). Borders here are
  mostly decorative dividers, so these are **low priority / likely by-design** — see note.

## Tension: theme fidelity vs. accessibility

Most dark themes (`dracula`, `sublime-monokai`, `atom-one-dark`, `github-dark`,
`windows-cmd`) are faithful reproductions of real editor/terminal palettes. Their
`muted` values are the original "comment gray", which are intentionally low-contrast in
the source themes. Raising them improves readability but drifts from the authentic
palette. **Decide per theme whether fidelity or AA wins** before applying the `muted` fixes.
The `error` fixes are lower-risk (error text should always be legible) and the suggested
values stay within the same hue family.

Suggested hex values below are the minimum nudge that clears 4.5:1 while staying close to
the original.

---

## Summary of failures

| Theme | Failing pair | Ratio | Need | Priority |
|-------|-------------|-------|------|----------|
| dark | border on bg | 1.73:1 | 3:1 | Low (decorative) |
| light | border on bg | 1.47:1 | 3:1 | Low (decorative) |
| windows-cmd | muted on bg | 4.31:1 | 4.5:1 | Medium |
| windows-cmd | error on bg | 3.23:1 | 4.5:1 | **High** |
| ubuntu-gnome | error on bg | 4.20:1 | 4.5:1 | **High** |
| ubuntu-gnome | btnText on accent-bg | 3.65:1 | 4.5:1 | **High** |
| ubuntu-gnome | border on bg | 1.20:1 | 3:1 | Low (decorative) |
| dracula | muted on bg | 3.03:1 | 4.5:1 | Medium (fidelity) |
| dracula | border on bg | 1.56:1 | 3:1 | Low (decorative) |
| sublime-monokai | muted on bg | 3.03:1 | 4.5:1 | Medium (fidelity) |
| sublime-monokai | error on bg | 3.93:1 | 4.5:1 | **High** |
| sublime-monokai | border on bg | 1.36:1 | 3:1 | Low (decorative) |
| atom-one-dark | muted on bg | 2.32:1 | 4.5:1 | Medium (fidelity) |
| atom-one-dark | error on bg | 4.38:1 | 4.5:1 | **High** |
| atom-one-dark | border on bg | 1.43:1 | 3:1 | Low (decorative) |
| github-dark | muted on bg | 4.12:1 | 4.5:1 | Medium (fidelity) |
| github-dark | border on bg | 1.55:1 | 3:1 | Low (decorative) |

`--t-muted` is used in **53 places** for real secondary text (timestamps, hints, section
subtitles), so its contrast genuinely matters. `--t-error` is used for error output.

---

## Checklist

### High priority — error / button text legibility

- [x] **windows-cmd · error on bg** — fixed: `#C50F1F` → `#E74856` (Win10+ bright red), now 5.09:1.
- [x] **ubuntu-gnome · error on bg** — fixed: `#EF2929` → `#F66151` (Tango light red), now 5.65:1.
- [x] **ubuntu-gnome · btnText on accent-bg** — fixed: `--color-t-btn-text` `#FFFFFF` → `#000000`, now 5.75:1.
- [x] **sublime-monokai · error on bg** — fixed: `#F92672` → `#FF4C8B`, now 4.71:1.
- [x] **atom-one-dark · error on bg** — fixed: `#e06c75` → `#e17077`, now 4.52:1 (just clears 4.5:1 as requested).

### Medium priority — muted secondary text (weigh against theme fidelity)

> **Note on hierarchy:** "muted" is the *separation* between muted and normal text, not an
> absolute low contrast against bg. Each muted value is set to *just barely* clear 4.5:1 — the
> minimum that satisfies AA — so the muted tier stays as de-emphasized as possible while normal
> text (12–17:1 in most themes) remains clearly dominant. atom-one-dark is the constrained case:
> normal text is only 6.57:1, so its muted at ~4.5:1 still gives the largest separation available.

- [x] **windows-cmd · muted on bg** — fixed: `#767676` → `#7a7a7a`, now 4.56:1.
      (`--t-border` keeps `#767676` — still passes 3:1.)
- [x] **dracula · muted on bg** — fixed: `#6272a4` → `#8090c4`, now 4.55:1.
- [x] **sublime-monokai · muted on bg** — fixed: `#75715E` → `#938f6e`, now 4.53:1.
- [x] **atom-one-dark · muted on bg** — fixed: `#5c6370` → `#8b93a1`, now 4.52:1.
- [x] **github-dark · muted on bg** — fixed: `#6e7681` → `#757d87`, now 4.54:1.

### Low priority — decorative borders (3:1 non-text)

Borders fail 3:1 in nearly every theme (`dark`, `light`, `ubuntu-gnome`, `dracula`,
`sublime-monokai`, `atom-one-dark`, `github-dark`). These are used as subtle section
dividers, not as the sole indicator of an interactive component's boundary/state, so WCAG
1.4.11 does not strictly require 3:1. **Recommend leaving as-is** unless a border ever
becomes the only affordance for a control (e.g. an outline-only button/input).

- [ ] Confirm no border is the *sole* visual indicator of an interactive control. If one is,
      raise that theme's `--color-t-border` to ≥ 3:1 against `--color-t-bg`.

---

## Passing themes (no text-contrast action needed)

- **dark** — all text pairs pass (border decorative only).
- **light** — all text pairs pass; `muted` (4.83:1) and `accent2` (5.02:1) are close to the
  line, so avoid darkening the background or lightening these further.

---

## Full results

```
=== dark ===
  text on bg                 16.44:1   PASS
  muted on bg                 7.11:1   PASS
  accent on bg               10.29:1   PASS
  accent2 on bg               7.05:1   PASS
  error on bg                 6.48:1   PASS
  warning on bg              10.74:1   PASS
  headerText on headerBg     12.01:1   PASS
  btnText on accent-bg       12.05:1   PASS
  border on bg (3:1)          1.73:1   FAIL (decorative)

=== light ===
  text on bg                 17.74:1   PASS
  muted on bg                 4.83:1   PASS
  accent on bg                5.17:1   PASS
  accent2 on bg               5.02:1   PASS
  error on bg                 6.47:1   PASS
  warning on bg               5.18:1   PASS
  headerText on headerBg     16.12:1   PASS
  btnText on accent-bg        5.17:1   PASS
  border on bg (3:1)          1.47:1   FAIL (decorative)

=== windows-cmd ===
  text on bg                 12.18:1   PASS
  muted on bg                 4.31:1   FAIL
  accent on bg               17.47:1   PASS
  accent2 on bg              12.18:1   PASS
  error on bg                 3.23:1   FAIL
  warning on bg              17.47:1   PASS
  headerText on headerBg     12.18:1   PASS
  btnText on accent-bg       17.47:1   PASS
  border on bg (3:1)          4.31:1   PASS

=== ubuntu-gnome ===
  text on bg                 17.58:1   PASS
  muted on bg                 5.34:1   PASS
  accent on bg                4.82:1   PASS
  accent2 on bg              10.89:1   PASS
  error on bg                 4.20:1   FAIL
  warning on bg              14.15:1   PASS
  headerText on headerBg     18.65:1   PASS
  btnText on accent-bg        3.65:1   FAIL
  border on bg (3:1)          1.20:1   FAIL (decorative)

=== dracula ===
  text on bg                 13.36:1   PASS
  muted on bg                 3.03:1   FAIL
  accent on bg                5.90:1   PASS
  accent2 on bg              10.29:1   PASS
  error on bg                 4.53:1   PASS
  warning on bg              12.74:1   PASS
  headerText on headerBg     14.81:1   PASS
  btnText on accent-bg        5.90:1   PASS
  border on bg (3:1)          1.56:1   FAIL (decorative)

=== sublime-monokai ===
  text on bg                 13.94:1   PASS
  muted on bg                 3.03:1   FAIL
  accent on bg                9.58:1   PASS
  accent2 on bg               9.01:1   PASS
  error on bg                 3.93:1   FAIL
  warning on bg               6.81:1   PASS
  headerText on headerBg     15.54:1   PASS
  btnText on accent-bg        9.58:1   PASS
  border on bg (3:1)          1.36:1   FAIL (decorative)

=== atom-one-dark ===
  text on bg                  6.57:1   PASS
  muted on bg                 2.32:1   FAIL
  accent on bg                5.92:1   PASS
  accent2 on bg               4.75:1   PASS
  error on bg                 4.38:1   FAIL
  warning on bg               8.10:1   PASS
  headerText on headerBg      7.22:1   PASS
  btnText on accent-bg        5.92:1   PASS
  border on bg (3:1)          1.43:1   FAIL (decorative)

=== github-dark ===
  text on bg                 12.26:1   PASS
  muted on bg                 4.12:1   FAIL
  accent on bg                7.49:1   PASS
  accent2 on bg               7.45:1   PASS
  error on bg                 5.65:1   PASS
  warning on bg               7.50:1   PASS
  headerText on headerBg     11.21:1   PASS
  btnText on accent-bg        7.49:1   PASS
  border on bg (3:1)          1.55:1   FAIL (decorative)
```

_Generated audit — thresholds: text 4.5:1 (AA normal), non-text/border 3:1 (WCAG 1.4.11)._
