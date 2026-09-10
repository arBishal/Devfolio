# Terminal Devfolio

A dual-mode developer portfolio built with React, TypeScript, Vite and Tailwind CSS v4. Explore the interactive **Terminal Mode** by typing commands just like a real terminal, or switch to the clean, graphical **Minimal View** for a more traditional, and simpler reading experience.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

> 📖 For a layer-by-layer tour of the architecture—how the dual views, theme system, command dispatcher, and effects all fit together—see the **[Technical Walkthrough](WALKTHROUGH.md)**.

---

## Features

- **Dual UI Modes**—toggle seamlessly between a command-driven Terminal emulation and a clean Minimal UI
- **Command-driven Terminal**—navigate the portfolio entirely through typed commands
- **Inline ghost-text autocomplete**—first matching suggestion appears as you type; accept it with `Tab` or double-tap
- **Command history**—navigate previous commands with `↑` / `↓`
- **Visual effects**—ambient canvas animations triggered via `fun <effect>`; three effects available: `fireflies`, `matrix-rain` (Bangla + Katakana glyphs), and `starfield` (3D perspective); each effect has a status (`done` / `planning`) so only ready effects can be activated
- **Eight themes**—`dark` (default), `light`, `windows-cmd`, `ubuntu-gnome`, `sublime-monokai`, `atom-one-dark`, `github-dark`, and `dracula`—switch live with `theme <name>`
- **Mobile-friendly**—touch-optimised keyboard UX, commands panel auto-collapses on focus
- **Responsive layout**—works from small to widescreen

---

## Commands

| Command | Description |
|---|---|
| `about` | Personal bio, location, and education |
| `skills` | Technical skills by category |
| `experience` | Work history and achievements |
| `projects` | Project showcase with tech stack and links |
| `publications` | Research publications and papers |
| `interests` | Research focus and creative pursuits |
| `resume` | Download resume as PDF |
| `contact` | Email, phone, GitHub, LinkedIn |
| `blog` | Links to blog platforms |
| `theme` | List available themes |
| `fun` | List visual effects |
| `fun fireflies` | Ambient firefly particle effect |
| `fun matrix-rain` | Bangla/Katakana digital rain |
| `fun starfield` | 3D perspective warp-speed starfield |
| `fun <effect> clear` | Clear an active effect |
| `help` | Show all commands |
| `clear` | Clear terminal output |
| `history` | Show command history |

Hidden / easter-egg commands: `ls`, `pwd`, `whoami`, `date`, `sudo`, `hack`, `hello`, `exit`, `hide`, `show`, `meow`, and more.

`echo <text>` echoes the text back. `cat <filename>` reads a virtual file (e.g. `cat about.txt`, `cat experience.log`, `cat resume.pdf`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 + CSS custom properties |

---

## Project Structure

```
src/
├── main.tsx           # React entry point—mounts <App />
├── App.tsx            # Orchestrator: owns viewMode + theme/effect/meow state, routes views
│
├── __tests__/
│   ├── setup.ts                         # jest-dom matchers + jsdom stubs
│   ├── commands/
│   │   ├── help.test.tsx
│   │   ├── misc.test.tsx
│   │   ├── portfolio.test.tsx
│   │   └── visuals.test.tsx
│   ├── hooks/
│   │   ├── useActiveEffect.test.ts
│   │   ├── useAutocomplete.test.ts
│   │   ├── useCommandExecutor.test.tsx
│   │   ├── useHistoryNavigation.test.ts
│   │   ├── useTerminalHistory.test.ts
│   │   └── useTheme.test.ts
│   ├── components/
│   │   ├── CommandLine.test.tsx
│   │   └── TerminalOutput.test.tsx
│   └── utils/
│       └── viewMode.test.ts
│
├── commands/          # One file per command group
│   ├── portfolio.tsx  # about, skills, projects, experience, publications, interests, resume, contact, blog
│   ├── help.tsx       # help
│   ├── visuals.tsx    # theme, fun
│   └── misc.tsx       # ls, pwd, whoami, date, sudo, hack, exit, hello, history, cat, echo, meow …
│
├── components/
│   ├── minimal/              # The traditional/minimal UI mode
│   │   ├── MinimalView.tsx
│   │   ├── MinimalNav.tsx    # Sidebar: section links + theme/effect pickers
│   │   ├── MinimalSection.tsx# Reusable section wrapper
│   │   └── sections/         # One component per area (About, Projects, etc.)
│   ├── terminal/             # The terminal emulator UI mode
│   │   ├── Terminal.tsx      # Terminal root layout
│   │   ├── TerminalHeader.tsx
│   │   ├── TerminalOutput.tsx
│   │   ├── CommandLine.tsx
│   │   ├── WelcomeScreen.tsx
│   │   └── TerminalFooter.tsx
│   ├── CatCompanion.tsx      # Easter egg pet companion
│   ├── FirefliesCanvas.tsx   # Canvas: ambient firefly particle animation
│   ├── MatrixRainCanvas.tsx  # Canvas: Bangla + Katakana digital rain
│   └── StarfieldCanvas.tsx   # Canvas: 3D perspective warp-speed starfield
│
├── hooks/
│   ├── useCommandExecutor.tsx  # Command dispatch (composes useTerminalHistory)
│   ├── useTerminalHistory.ts   # history, commandHistory, historyIndex state
│   ├── useTheme.ts             # currentThemeName state (persisted)
│   ├── useActiveEffect.ts      # currentEffect + isMeowActive state
│   ├── useAutocomplete.ts      # ghost-text suggestion logic
│   └── useHistoryNavigation.ts # ↑/↓ command-history navigation
│
├── data/
│   ├── portfolioData.ts    # All portfolio content
│   ├── commandRegistry.ts  # Single source of truth for all commands
│   ├── staticData.ts       # Visual effects list
│   └── asciiArt.ts         # Welcome-banner ASCII art
│
├── types/
│   ├── portfolio.ts  # PortfolioData shape
│   └── terminal.ts   # OutputLine, CommandContext, CommandHandler
│
├── themes/
│   └── themes.ts  # themeNames array + ThemeName type + defaultTheme
│
├── utils/
│   ├── download.ts  # Generic file download utility
│   └── viewMode.ts  # Device-aware initial view + persistence
│
└── index.css   # Tailwind v4 @theme tokens + per-theme data-theme overrides
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
git clone https://github.com/arBishal/Terminal-Devfolio.git
cd Terminal-Devfolio
npm install
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser (the dev server port is set in `vite.config.ts` and opens automatically).

### Build for production

```bash
npm run build
```

Output is written to `dist/`.

---

## Customisation

**All content is in one place:** [`src/data/portfolioData.ts`](src/data/portfolioData.ts)

Update the exported `portfolioData` object:

```ts
personal:     { fullName, shortName, title, username, location, education, bio, portfolioVersion }
resume:       { filePath, downloadFilename }
skills:       { programming, webStack, databases, tools, aiWorkflows, practices }
projects:     [{ name, description, tech, github?, live? }]
experience:   [{ title, company, period, achievements }]
publications: [{ title, status, year, journal, authors }]
interests:    { researchFocus, creativePursuits }
contact:      { email, links, note }
blog:         { tagline, links }
```

Place your resume PDF in the `public/` folder and update `resume.filePath` accordingly.

### Adding a new theme

1. Add a `[data-theme="mytheme"]` block in `src/index.css` using the existing tokens (`--color-t-bg`, `--color-t-accent`, etc.)
2. Add `"mytheme"` to the `themeNames` array in `src/themes/themes.ts`

> **Note on colors:** The built-in themes reproduce well-known editor/terminal palettes
> (Dracula, Monokai, One Dark, GitHub Dark, etc.), but a few individual colors were nudged
> brighter from their originals to meet WCAG AA contrast (4.5:1 for text).

### Adding a new command

1. Create or update a renderer function in `src/commands/`
2. Add an entry to the `HANDLERS` registry in `src/hooks/useCommandExecutor.tsx`
3. Add it to `COMMAND_REGISTRY` in `src/data/commandRegistry.ts` to surface it in autocomplete, help, and the welcome screen

### Adding a new visual effect

1. Create a canvas component in `src/components/` (see `FirefliesCanvas.tsx` as a reference)
2. Add a new entry to `AVAILABLE_EFFECTS` in `src/data/staticData.ts` with `status: "done"`
3. Add a lazy-loaded conditional render in `App.tsx` for the new effect name (alongside the existing effect overlays)
4. Set `status: "planning"` while in development—the UI will show it as "under development" and prevent activation

---

## Testing

The project uses [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

```bash
npm run test            # run all tests once
npm run test:watch      # watch mode (re-runs on file save)
npm run test:coverage   # generate coverage report in coverage/
```

163 tests across 13 files covering command renderers, custom hooks, UI components, and utilities.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `↑` / `↓` | Navigate command history |
| `Tab` | Accept inline autocomplete suggestion |
| `Enter` | Execute command |
| Double-tap *(mobile)* | Accept inline autocomplete suggestion |

---

## License

MIT—feel free to fork and make it your own.

---

## Credits

| Effect | Reference |
|---|---|
| **Starfield** (3D perspective projection) | [Starfield graphic effect—sunshine2k.de](https://www.sunshine2k.de/coding/javascript/graphiceffects/02_starfield/02_starfield.html) |