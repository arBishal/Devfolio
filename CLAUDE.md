# Terminal-Devfolio - Project Intelligence

## Conventions
- Use `@/` path alias for imports (maps to `src/`).
- Command renderers are pure functions returning JSX.
- Static data hoisted to module scope (pre-sorted arrays, static JSX).
- Theming via CSS custom properties scoped with `data-theme` attribute.
- Unidirectional data flow: Terminal owns state, passes callbacks down.
- Version lives in 3 places—keep them in sync on every bump: `version` in `package.json`, `version` (root + `packages[""]`) in `package-lock.json`, and `portfolioVersion` in `src/data/portfolioData.ts`.

## Instructions
- Ensure SOLID, DRY, KISS, YAGNI.
- Always ask and confirm first before a decision.
- Run tests when explicitly asked, not for every changes.
- Update the README.md and WALKTHROUGH.md upon feature changes.