# Terminal Devfolio—Technical Walkthrough

A layer-by-layer tour of the codebase: what each file does, how the pieces connect, and how a
**dual-mode** portfolio—an interactive terminal *and* a traditional minimal view—is built on a
single shared data source and state layer.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [Entry Points](#2-entry-points)
3. [`App.tsx`—the orchestrator](#3-apptsxthe-orchestrator)
4. [The Theme System](#4-the-theme-system)
5. [Component Tree](#5-component-tree)
6. [Shared State Hooks](#6-shared-state-hooks)
7. [The Terminal View](#7-the-terminal-view)
8. [`CommandLine` + autocomplete & history hooks](#8-commandline--autocomplete--history-hooks)
9. [`useCommandExecutor`—the dispatcher](#9-usecommandexecutorthe-dispatcher)
10. [Command Files—renderers & handlers](#10-command-filesrenderers--handlers)
11. [The Minimal View](#11-the-minimal-view)
12. [Data Layer](#12-data-layer)
13. [Types & Utilities](#13-types--utilities)
14. [How a Command Flows End-to-End](#14-how-a-command-flows-end-to-end)
15. [View Switching & Device-Aware Loading](#15-view-switching--device-aware-loading)
16. [Mobile UX](#16-mobile-ux)
17. [Visual Effects System](#17-visual-effects-system)
18. [Testing](#18-testing)

---

## 1. The Big Picture

The project is a **single-page React application** with no backend—everything runs in the browser.
It ships **two ways to read the same portfolio**:

- **Terminal view**—a command-line interface. You type a command, press Enter, and the output
  appears above the input, just like a real shell. Each "command" is a plain function that returns
  JSX; the result is pushed into a history array and rendered.
- **Minimal view**—a conventional scroll-based layout (sidebar + sections) for readers who'd
  rather not type.

Both views read from the **same `portfolioData` source** and share the **same theme/effect state**,
so switching between them preserves your theme, active visual effect, and cat companion.

```
                         ┌── Terminal view ──┐
User picks a view  ──▶   │  type commands    │   ┐
(auto by device,         └───────────────────┘   │  both render from
 remembered after        ┌── Minimal view ───┐   │  src/data/portfolioData.ts
 an explicit choice)     │  scroll sections  │   ┘
                         └───────────────────┘
```

A terminal command's lifecycle:

```
User types "about" → Enter
        ↓
useCommandExecutor receives the string
        ↓
Dispatches to renderAbout() in commands/portfolio.tsx
        ↓
Returns JSX → pushed into the history array
        ↓
TerminalOutput renders the history array
        ↓
User sees the output
```

---

## 2. Entry Points

### `index.html`
The HTML shell. Contains a single `<div id="root">`. Vite injects the compiled JS bundle here and
React mounts into this div.

### `src/main.tsx`
Bootstraps React and pulls in the global stylesheet:
```tsx
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### `src/App.tsx`
The **top-level orchestrator**—not a thin wrapper. It owns everything that must survive a view
switch and routes to the active view. See the next section.

---

## 3. `App.tsx`—the orchestrator

`App` owns all state that must persist across a Terminal ↔ Minimal toggle, then passes it down to
whichever view is active.

### State it owns

| State | Source | What it tracks |
|---|---|---|
| `viewMode` | `useState(getInitialViewMode)` | `"terminal"` or `"minimal"` |
| theme | `useTheme()` | `currentThemeName` (+ ref + setter) |
| effect / meow | `useActiveEffect()` | `currentEffect`, `isMeowActive` (+ refs/setters) |

### Why state lives here, not in a view

Theme, active effect, and the cat companion must **not reset** when you switch views. If `Terminal`
owned them, toggling to `Minimal` would unmount `Terminal` and lose that state. By lifting it into
`App`, both views receive it as props and it persists.

### Shared visual overlays survive switches

Canvas effects and the cat are rendered **at the `App` level**, above the view routing, so they
keep running across a toggle:

```tsx
<div data-theme={currentThemeName}>
  <Suspense fallback={null}>
    {currentEffect === "fireflies"   && <FirefliesCanvas  onComplete={clearEffect} />}
    {currentEffect === "matrix-rain" && <MatrixRainCanvas onComplete={clearEffect} />}
    {currentEffect === "starfield"   && <StarfieldCanvas  onComplete={clearEffect} />}
    {isMeowActive && <CatCompanion />}
  </Suspense>

  {viewMode === "terminal" && <Terminal … />}
  {viewMode === "minimal"  && <MinimalView … />}
</div>
```

The effect canvases and `CatCompanion` are **lazy-loaded** (`React.lazy`) so their code doesn't block
the initial render—they're only fetched when first activated.

### `data-theme` at the root

`data-theme={currentThemeName}` sits on the outermost `<div>`. Every nested element in both views
inherits the right CSS variables through the cascade—**no prop drilling of colors**.

---

## 4. The Theme System

Themes are **CSS custom properties**, not JavaScript objects. Switching a theme flips one attribute;
no component re-renders to repaint colors.

### Tailwind v4 `@theme` + `data-theme` overrides—`src/index.css`

The palette tokens are declared once under Tailwind's `@theme`, which generates matching utility
classes. Each theme then overrides those same variables, scoped to a `data-theme` value:

```css
@theme {
  --color-t-bg: #171717;
  --color-t-text: #f5f5f5;
  --color-t-accent: #4ade80;
  /* … */
}

[data-theme="dark"]   { --color-t-bg: #171717; --color-t-accent: #4ade80; /* … */ }
[data-theme="dracula"]{ --color-t-bg: #282a36; --color-t-accent: #bd93f9; /* … */ }
/* …one block per theme… */
```

### The eight themes

`dark` (default), `light`, `windows-cmd`, `ubuntu-gnome`, `sublime-monokai`, `atom-one-dark`,
`github-dark`, `dracula`. Several faithfully reproduce well-known editor/terminal palettes; a few
individual colors were brightened from their originals to meet WCAG AA contrast—see
[`CONTRAST_AUDIT.md`](CONTRAST_AUDIT.md).

### The token set

Each theme defines: `t-bg`, `t-text`, `t-accent`, `t-accent2`, `t-muted`, `t-error`, `t-warning`,
`t-border`, `t-header-bg`, `t-header-text`, `t-btn-text`.

### Utility classes

Because the tokens are declared under `@theme`, components use ordinary Tailwind utilities that
resolve through the variables—e.g. `bg-t-bg`, `text-t-text`, `text-t-accent`, `text-t-accent2`,
`border-t-border`. There is no hand-written `.theme-*` class layer.

### `themes.ts`—the source of truth for names

```ts
export const themeNames = [
  "dark", "light", "windows-cmd", "ubuntu-gnome",
  "sublime-monokai", "atom-one-dark", "github-dark", "dracula",
] as const;
export type ThemeName = typeof themeNames[number];
export const defaultTheme: ThemeName = "dark";
```

`ThemeName` is derived from the array, so adding a theme is: add the CSS block, add the name here.

---

## 5. Component Tree

```
App                              ← owns viewMode + theme/effect/meow state
├── [Canvas Effects]?            ← Fireflies / MatrixRain / Starfield (lazy, survive switches)
├── CatCompanion?                ← interactive pet (lazy, conditional)
│
├── Terminal                     ← when viewMode === "terminal"
│   ├── TerminalHeader           ← title bar + close button
│   ├── WelcomeScreen            ← ASCII banner + collapsible command grid
│   ├── [scrollable body]
│   │   ├── TerminalOutput       ← renders command history
│   │   └── CommandLine          ← input + ghost autocomplete + ▊ cursor
│   └── TerminalFooter           ← hints + "switch to minimal mode"
│
└── MinimalView                  ← when viewMode === "minimal"
    ├── MinimalNav               ← sidebar: section links, theme/effect pickers, "switch to terminal"
    └── MinimalSection × N       ← About, Experience, Skills, Projects, Publications,
        └── <XxxSection />           Interests, Blog, Contact
```

---

## 6. Shared State Hooks

Three small single-responsibility hooks, **called by `App`** and their values threaded down.

| Hook | File | Owns | Notes |
|---|---|---|---|
| `useTheme` | `hooks/useTheme.ts` | `currentThemeName` | Persists to `localStorage` (`themeName`); validates stored value against `themeNames` |
| `useActiveEffect` | `hooks/useActiveEffect.ts` | `currentEffect`, `isMeowActive` | Provides `clearEffect()` |
| `useTerminalHistory` | `hooks/useTerminalHistory.ts` | `history`, `commandHistory`, `historyIndex` | Called *inside* `useCommandExecutor`, not `App` |

### The ref-mirror pattern

`useTheme`, `useActiveEffect`, and `useTerminalHistory` each mirror their state into a `ref` that is
updated on every render:

```ts
const currentThemeNameRef = useRef(currentThemeName);
currentThemeNameRef.current = currentThemeName; // refreshed each render
```

This lets `executeCommand` (a `useCallback` with an empty dependency array) read the **latest** value
via `ref.current` without listing it as a dependency. The result: `executeCommand` keeps a **stable
identity**, so child components that receive it don't re-render needlessly.

---

## 7. The Terminal View

### `Terminal.tsx`—layout, scroll, mobile focus

`Terminal` receives the shared theme/effect state from `App` as props and forwards them into
`useCommandExecutor`. It owns only **view-local** state:

| State | What it tracks |
|---|---|
| `isClosed` | Whether the ✕ "closed / Reopen" screen is showing |
| `isCommandsOpen` | Whether the WelcomeScreen command grid is expanded |

**Auto-scroll.** A `useEffect` on `history` scrolls the *last* command line to the **top** of the
pane so output reads from its beginning. It finds command lines via the `[data-cmd]` markers that
`TerminalOutput` sets:

```tsx
useEffect(() => {
  const cmds = pane.querySelectorAll("[data-cmd]");
  if (cmds.length > 0) cmds[cmds.length - 1].scrollIntoView({ block: "start", behavior: "smooth" });
  else pane.scrollTop = 0;
}, [history]);
```

**Mobile focus handling (ref pattern).** On touch devices the commands grid collapses when the input
is focused (keyboard opening) and restores on blur. The handler must read `isCommandsOpen` without
being re-created on every toggle, so it reads a **ref mirror** and keeps empty `useCallback` deps—see
[Mobile UX](#16-mobile-ux) for the full story including the chevron edge case.

### `TerminalHeader.tsx`
Presentational title bar. One prop, `onClose()`, wired to set `isClosed = true`.

### `WelcomeScreen.tsx`
ASCII banner (`src/data/asciiArt.ts`), a version line, and a **collapsible grid of clickable
commands**. Clicking a command name calls `onCommandClick(name)` → `executeCommand`.

- `SORTED_COMMANDS` is computed **at module scope** from `COMMANDS` (the public entries of the
  registry), so the sort runs once, not on every render.
- The grid collapses via a `max-height` transition (`max-h-96` ↔ `max-h-0`).

### `TerminalOutput.tsx`
Renders the `history` array. Each entry is `{ type, content }` where `type` is
`"command" | "result" | "error"`:

```tsx
{line.type === "command" && (
  <div data-cmd className="flex items-center gap-2">
    <span className="text-t-accent">guest@portfolio:~$</span>
    <span className="text-t-text">{line.content}</span>
  </div>
)}
```

`data-cmd` is the marker attribute the auto-scroll `querySelectorAll` targets. Result/error entries
don't carry it.

### `TerminalFooter.tsx`
Keyboard hints and the **"switch to minimal mode"** button, which calls `onToggleView` (threaded up
to `App`'s `toggleView`).

---

## 8. `CommandLine` + autocomplete & history hooks

`CommandLine.tsx` is kept strictly about UI; its logic lives in two focused hooks.

### How it looks

```
guest@portfolio:~$ ab|out                                              ▊
                    ^^ ^^^                                             ^
                  typed  ghost text (muted)               fixed cursor
```

- The `<input>` width is `{input.length}ch`—`ch` is exactly one character wide in `font-mono`.
- Ghost text is the remaining characters of the best match.
- ▊ is `position: absolute; right: 0`—it never moves.

### `useAutocomplete(input, setInput)`—`hooks/useAutocomplete.ts`
Computes suggestions as **derived state** (no extra `useState`): filters `ALL_COMMAND_NAMES` (from
the registry) by prefix, exposes `ghostText` and `applyFirstSuggestion()` (bound to `Tab` and mobile
double-tap).

### `useHistoryNavigation(...)`—`hooks/useHistoryNavigation.ts`
Owns the `ArrowUp`/`ArrowDown` logic that cycles through `commandHistory`, updating both the input
text and `historyIndex` (which resets to `-1` past the newest entry).

### Desktop always-focused
On pointer-fine (mouse) devices, the input grabs focus on mount and re-grabs it on blur, mimicking a
real terminal's ever-blinking cursor.

---

## 9. `useCommandExecutor`—the dispatcher

`src/hooks/useCommandExecutor.tsx` is the terminal's brain. It composes `useTerminalHistory` and
receives the shared theme/effect state from `App` (via `Terminal`) as options. It owns the
`executeCommand` dispatch logic.

### Signature

```tsx
useCommandExecutor({
  setIsCommandsOpen,
  currentThemeNameRef, setCurrentThemeName,
  currentEffectRef,    setCurrentEffect,
  setIsMeowActive,
}): { history, commandHistory, historyIndex, setHistoryIndex, executeCommand }
```

Note it **returns only terminal history + the executor**—theme/effect are inputs now, owned by
`App`, not outputs of this hook. Current values are read through the refs; the setters apply
changes from handlers.

### The handlers registry (derived from the command registry)

Instead of a giant `switch`, the executor dispatches through a `HANDLERS` map. That map is no
longer hand-maintained here—it is **derived** from the single `COMMAND_REGISTRY` in
`data/commandRegistry.tsx` (each entry carries its own `handler` + optional `aliases`), so the hook
just imports it:

```tsx
import { HANDLERS } from "@/data/commandRegistry";
```

This makes name↔handler drift impossible: a command can't be advertised without a handler, or
handled while invisible, because help, autocomplete, and dispatch all flow from one array.

### The `CommandContext`

Every handler receives `(args, ctx, rawArgs)`. `ctx` (typed as `CommandContext` in
`types/terminal.ts`) is the unified API handlers use to touch terminal state—`push`,
`executeCommand`, `setHistory`, `setIsCommandsOpen`, `commandHistory`, `currentThemeName` /
`setCurrentThemeName`, `currentEffect` / `setCurrentEffect`, `setIsMeowActive`.
This keeps handlers pure and decoupled from React.

- `args`—space-split, lowercased arguments (e.g. `["light"]` for `theme light`).
- `rawArgs`—the unparsed remainder, preserving case/spacing (used by `echo`).

### Dispatch flow

```tsx
const trimmedCmd = cmd.trim().toLowerCase();
// record for display + ↑/↓ history, reset historyIndex …

const [commandName, ...argsArray] = trimmedCmd.split(/\s+/);

if (HANDLERS[trimmedCmd])       HANDLERS[trimmedCmd]([], ctx, "");     // exact (multi-word) match
else if (HANDLERS[commandName]) HANDLERS[commandName](argsArray, ctx, rawArgs);
else ctx.push("error", `Command not found: ${cmd}. Type 'help' for available commands.`);
```

Adding a command = add one entry to `COMMAND_REGISTRY` in `data/commandRegistry.tsx`; `HANDLERS`, `COMMANDS`, and `ALL_COMMAND_NAMES` all derive from it.

### Guardrails

- `push` uses the functional update form (`setHistory(prev => …)`) so it always builds on the latest
  state, even inside the `[]`-deps closure.
- History is capped at `MAX_HISTORY = 400` lines; older lines are trimmed.
- Side effects stay out of renderers: `resume` calls `downloadFile(...)` (from `utils/download.ts`)
  **before** pushing the pure `renderResume()` JSX.

---

## 10. Command Files—renderers & handlers

Each command group lives in `src/commands/`. Renderers are **pure functions returning JSX**; the two
stateful groups (`theme`, `fun`) export `CommandHandler` functions instead.

| File | Exports |
|---|---|
| `portfolio.tsx` | `renderAbout`, `renderSkills`, `renderProjects`, `renderExperience`, `renderPublications`, `renderInterests`, `renderResume`, `renderContact`, `renderBlog` |
| `help.tsx` | `renderHelp` |
| `visuals.tsx` | `handleTheme`, `handleFun` (+ their list renderers) |
| `misc.tsx` | `renderLs`, `renderPwd`, `renderWhoami`, `renderDate`, `renderSudo`, `renderHack`, `renderExit`, `renderHello`, `renderHistory`, `handleCat`, `handleEcho`, `handleMeow` |

### Color classes in renderers

Renderers never import a theme object—they use the token-backed Tailwind utilities:

| Class | Usage |
|---|---|
| `text-t-warning` | The `$` command echo at the top of each block |
| `text-t-accent` | Primary highlights, clickable command names |
| `text-t-accent2` | Sub-headings—labels, category names, titles |
| `text-t-text` | Body content |
| `text-t-muted` | Tech stacks, notes, timestamps, meta |
| `text-t-error` | Error messages |

### `theme` / `fun` as handlers

`handleTheme` with no arg renders a clickable theme list; with a valid name it calls
`ctx.setCurrentThemeName` and confirms; otherwise it errors. `handleFun` mirrors this for effects,
additionally supporting `fun <name> clear`, an "already active" branch, and `status: "planning"`
gating ("under development"). Both read/write the shared state through `ctx`.

---

## 11. The Minimal View

A traditional, scroll-based layout reading from the **same `portfolioData`** as the terminal.

### `MinimalView.tsx`
- Fixed sidebar (`MinimalNav`) on `md+`; full-width content on mobile.
- A sticky GitHub-style header with the name/title and a **Download Resume** button
  (`downloadFile(...)`).
- The body is a sequence of `MinimalSection` wrappers, one per portfolio area, in this order:
  **About → Experience → Skills → Projects → Publications → Interests → Blog → Contact.**

### `MinimalNav.tsx`
The sidebar: anchor links to each section (with icons), a **theme picker** and **effect picker**
(`<select>`s driving the same shared state), a **Summon/Dismiss Cat** toggle, and a **"switch to
terminal"** button. On mobile it's an off-canvas drawer opened by a chevron tab at the screen edge.

### `MinimalSection.tsx`
Reusable wrapper giving each section an `id` (for anchor scrolling), a consistent heading
(title + a rule filling the row), and `scroll-mt-16` so the sticky header doesn't overlap targets.

### `sections/*.tsx`
One presentational component per area (`AboutSection`, `ExperienceSection`, `SkillsSection`,
`ProjectsSection`, `PublicationsSection`, `InterestsSection`, `BlogSection`, `ContactSection`). Each
imports `portfolioData` and renders its slice—e.g. `AboutSection` maps `personal.bio` and shows
location/education.

> Because both views render from `portfolioData`, editing that one file updates the terminal
> commands **and** the minimal sections simultaneously.

---

## 12. Data Layer

### `src/data/portfolioData.ts`—portfolio content
The single source of truth for all personal content, consumed by both views. **To update the
portfolio, you only edit this file.** Shape:

```ts
export const portfolioData = {
  personal:     { fullName, shortName, title, username, location, education, bio, portfolioVersion },
  resume:       { filePath, downloadFilename },
  skills:       { programming, webStack, databases, tools, aiWorkflows, practices },
  projects:     [{ name, description, tech, github?, live? }],
  experience:   [{ title, company, period, achievements }],
  publications: [{ title, status, year, journal, authors }],
  interests:    { researchFocus, creativePursuits },
  contact:      { email, links, note },
  blog:         { tagline, links },
};
```

### `src/data/commandRegistry.tsx`—command definitions
The single source of truth for every command. Each entry carries `name`, an optional
`description` (public commands only), `hidden`, its `handler`, and optional `aliases`. Three
derived exports flow from it:

```ts
export const COMMANDS: CommandInfo[]         // public (help + welcome grid)
export const ALL_COMMAND_NAMES: string[]     // every name + alias, sorted (autocomplete)
export const HANDLERS: Record<string, CommandHandler> // name/alias → handler (executor dispatch)
```

Adding one entry to the registry surfaces the command in help, the welcome grid, and autocomplete **and** wires up its handler at once — there is no separate dispatch table to keep in sync.

### `src/data/staticData.ts`—visual effects list
```ts
export const AVAILABLE_EFFECTS: EffectInfo[] = [
  { name: "fireflies",   status: "done" },
  { name: "matrix-rain", status: "done" },
  { name: "starfield",   status: "done" },
];
```
`status` gates activation (`"done"` vs `"planning"`).

### `src/data/asciiArt.ts`—the welcome banner string.

---

## 13. Types & Utilities

Shared types live under `src/types/`; view-name and helper logic under `src/themes/` and
`src/utils/`.

### `src/types/terminal.ts`
`OutputLine` (`type` + `content: ReactNode`), plus `CommandContext` and the `CommandHandler`
signature that decouple handlers from the executor.

### `src/types/portfolio.ts`
`PortfolioData` and its member interfaces—the compile-time contract for `portfolioData.ts`.

### `src/themes/themes.ts`
`themeNames` (const tuple), the derived `ThemeName` union, and `defaultTheme`.

### `src/utils/viewMode.ts`
`ViewMode` type plus `getInitialViewMode()` and `persistViewMode()`—see the next section.

### `src/utils/download.ts`
`downloadFile(path, filename)`—creates a hidden `<a download>` and clicks it. Kept out of
renderers so JSX functions stay pure.

---

## 14. How a Command Flows End-to-End

Tracing **`skills`** + Enter in the terminal view:

```
1. CommandLine.tsx
   handleSubmit() → onExecute("skills") → clears input

2. Terminal.tsx
   onExecute is executeCommand from useCommandExecutor("skills")

3. useCommandExecutor.tsx
   trimmedCmd = "skills"
   → setHistory(prev => [...prev, { type: "command", content: "skills" }])   // echoes the input
   → setCommandHistory(prev => [...prev, "skills"])                           // for ↑/↓
   → setHistoryIndex(-1)
   → builds CommandContext (reading current theme/effect via refs)
   → HANDLERS["skills"] → push("result", renderSkills())

4. commands/portfolio.tsx
   renderSkills() reads portfolioData.skills → returns JSON-like JSX

5. useCommandExecutor.tsx
   push() → setHistory(prev => [...prev, { type: "result", content: <JSX> }])

6. Terminal.tsx
   history changed → scroll useEffect brings the "skills" line to the top

7. TerminalOutput.tsx
   re-renders history → the result JSX appears under the command echo
```

---

## 15. View Switching & Device-Aware Loading

The initial view is chosen by device, then remembered **only after an explicit choice**—implemented
in `src/utils/viewMode.ts`.

```ts
export function getInitialViewMode(): ViewMode {
  try {
    const saved = localStorage.getItem("viewMode");
    if (saved === "terminal" || saved === "minimal") return saved;   // explicit prior choice wins
  } catch { /* localStorage may be unavailable */ }
  return window.matchMedia("(max-width: 767px)").matches ? "minimal" : "terminal";  // else by device
}

export function persistViewMode(mode: ViewMode): void {
  try { localStorage.setItem("viewMode", mode); } catch { /* ignore write failures */ }
}
```

- **Breakpoint:** `max-width: 767px` matches viewports below Tailwind's `md` (768px)—i.e. mobile →
  minimal, desktop → terminal. This aligns with the `md:` breakpoints the minimal layout uses.
- **Persistence is deliberate:** `App`'s `toggleView` calls `persistViewMode(next)` **only on an
  explicit user toggle**. The auto-detected default is *not* persisted, so detection re-runs each
  visit until the user actually picks a side (a user who first loads in a narrow desktop window isn't
  locked into minimal forever).
- **Robustness:** both read and write are wrapped in `try/catch`, so a throwing `localStorage`
  (e.g. some private-browsing modes) can't crash the app.

Detection runs at **load time only**—there's no in-session `matchMedia` listener; resizing doesn't
auto-switch, which is intentional.

---

## 16. Mobile UX

Touch devices bring two problems the terminal solves.

### Problem 1—the keyboard + commands panel crowd the screen

`CommandLine` reports focus via `onFocusChange`; `Terminal.handleFocusChange` collapses the panel on
focus and restores it on blur—**only on touch** (`pointer: coarse`):

```tsx
const handleFocusChange = useCallback((focused: boolean) => {
  if (!window.matchMedia("(pointer: coarse)").matches) return; // desktop: do nothing
  if (focused) {
    prevCommandsOpenRef.current = isCommandsOpenRef.current;    // remember
    setIsCommandsOpen(false);                                   // collapse
  } else {
    if (togglePressedRef.current) { togglePressedRef.current = false; return; } // chevron case
    setIsCommandsOpen(prevCommandsOpenRef.current);             // restore
  }
}, []); // stable identity—state read via refs
```

### The chevron edge case

If the user taps the ▲/▼ chevron, the input **blurs first** (which would "restore" the panel), then
the click toggles it—undoing the intent. The fix: a `togglePressedRef` set on the chevron's
`pointerdown` (which fires *before* blur). The blur handler sees the flag, skips the restore, and
lets the click's toggle win.

### Problem 2—no Tab key

`CommandLine` tracks tap timestamps in `lastTapRef`; two taps within 300 ms call
`applyFirstSuggestion()`—the same autocomplete action as `Tab`.

---

## 17. Visual Effects System

The `fun` command (terminal) and the effect picker (minimal) activate ambient canvas overlays. Because
they're rendered in `App`, an active effect **persists across a view switch**.

### Architecture

```
staticData.ts            ← AVAILABLE_EFFECTS (name + status)
    ↓
handleFun / effect picker← validates name & status, sets currentEffect (shared state in App)
    ↓
App.tsx                  ← conditionally renders the matching lazy canvas (pointer-events: none)
    ↓
FirefliesCanvas / MatrixRainCanvas / StarfieldCanvas
```

### Status gating

Each effect's `status` is `"done"` (activatable) or `"planning"` (listed as "under development",
can't be activated). All three current effects are `"done"`.

### The canvases

Self-contained components rendering via the Canvas API, each calling `onComplete` (→ `clearEffect`)
when finished, and each set `pointer-events: none` so the UI underneath stays interactive:

- **`FirefliesCanvas`**—drifting, pulsing fireflies with a glow; constants ported from the
  [Fireflies](https://github.com/arBishal/Fireflies) project.
- **`MatrixRainCanvas`**—Bangla + Katakana digital rain.
- **`StarfieldCanvas`**—3D-perspective warp-speed starfield.

### `CatCompanion.tsx` (the `meow` easter egg)

An interactive pet summoned by `meow` (terminal) or the Summon Cat toggle (minimal). To track the
cursor at 60fps without lagging the app, it **bypasses React state**: a `requestAnimationFrame` loop
with linear interpolation mutates the DOM directly through refs. It detects inactivity to fall
asleep and reacts to `pointerdown` "petting."

---

## 18. Testing

**Vitest** (runner) + **React Testing Library** (rendering/assertions) +
**@testing-library/user-event** (realistic interaction). Config lives in `vite.config.ts` under
`test`:

```ts
test: {
  environment: "jsdom",   // simulated browser DOM in Node
  globals: true,          // describe/it/expect without imports
  setupFiles: ["./src/__tests__/setup.ts"],
  alias: { "@": path.resolve(__dirname, "./src") },
}
```

`setup.ts` loads jest-dom matchers and stubs `window.matchMedia` (jsdom doesn't implement it).

### Layout—13 files

```
src/__tests__/
├── setup.ts
├── commands/                 # pure renderer functions
│   ├── help.test.tsx
│   ├── misc.test.tsx
│   ├── portfolio.test.tsx
│   └── visuals.test.tsx
├── hooks/                    # custom hooks
│   ├── useActiveEffect.test.ts
│   ├── useAutocomplete.test.ts
│   ├── useCommandExecutor.test.tsx
│   ├── useHistoryNavigation.test.ts
│   ├── useTerminalHistory.test.ts
│   └── useTheme.test.ts
├── components/               # UI components
│   ├── CommandLine.test.tsx
│   └── TerminalOutput.test.tsx
└── utils/
    └── viewMode.test.ts      # device detection + persistence
```

### What each layer tests

| Layer | Focus |
|---|---|
| `commands/*` | Renderer output—content, link attributes, edge cases |
| `hooks/useTheme`, `useActiveEffect`, `useTerminalHistory` | State init, updates, ref-mirror sync |
| `hooks/useAutocomplete`, `useHistoryNavigation` | Ghost-text filtering; ↑/↓ index logic |
| `hooks/useCommandExecutor` | Dispatch, prefix handlers, theme/effect/history wiring (harness composes `useTheme`+`useActiveEffect` like `App`) |
| `components/CommandLine` | Input, submit, autocomplete, history nav, focus callbacks |
| `components/TerminalOutput` | Entry types, `data-cmd`, JSX content, empty state |
| `utils/viewMode` | Device branch, saved-choice precedence, auto-default *not* persisted, throwing `localStorage` |

### Running

```bash
npm run test            # single run (163 tests across 13 files)
npm run test:watch      # watch mode
npm run test:coverage   # coverage report → coverage/
```

### Not covered

- The effect canvases (`FirefliesCanvas`, `MatrixRainCanvas`, `StarfieldCanvas`)—canvas animation
  needs a canvas mock or visual-regression tooling.
- `Terminal` / `MinimalView` full integration (scroll, keyboard routing, view switching)—better
  suited to an e2e tool like Playwright.
- Presentational pieces (`WelcomeScreen`, minimal `sections/*`)—low risk, low priority.

### Adding a new effect

1. Create a canvas component that calls `onComplete` when the animation ends.
2. Add `{ name: "…", status: "done" }` to `AVAILABLE_EFFECTS` in `src/data/staticData.ts`.
3. Add a conditional render in `App.tsx`:
   `{currentEffect === "…" && <YourCanvas onComplete={clearEffect} />}` (lazy-import it alongside the
   others).
