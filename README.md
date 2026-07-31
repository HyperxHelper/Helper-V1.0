<p align="center">
  <img src="public/favicon.svg" alt="Helper Logo" width="120" />
</p>

<h1 align="center">Helper Hummingbird v1.0</h1>

<p align="center">
  <strong>A full-screen, timestamp-linked video notebook with an AI academic tutor, bilingual (English / Arabic) RTL support, and community study wikis.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> · <a href="#quick-start">Quick Start</a> · <a href="#project-structure">Structure</a> · <a href="#github-pages">GitHub Pages</a> · <a href="#desktop-app">Desktop App</a> · <a href="#optional-backend">Backend</a>
</p>

---

## What is Helper Hummingbird?

**Helper Hummingbird v1.0** is a self-contained, full-screen interactive learning workspace. Load any YouTube lesson and turn it into a rich study notebook — annotate timestamps, draft notes, generate AI summaries, chat with an AI tutor, and publish public study wikis.

Built on **TypeScript + React 19** with a clean, single-component architecture. No authentication is required to use it, and it runs **entirely in the browser** — including on static hosts such as GitHub Pages — thanks to an offline demo-mode API.

---

## Features

- **Full-Screen Workspace** — Immersive, distraction-free study environment with a one-click fullscreen toggle
- **YouTube Video Player** — Load any YouTube video with integrated playback controls and timeline
- **AI Academic Tutor** — Ask questions about the current lecture and get context-aware answers
- **Timestamp-Linked Annotations** — Add notes, highlights, and study questions at exact video timestamps
- **Interactive Notepad** — Rich notepad with automatic timestamp linking and AI-drafted notes
- **Multiple Notebooks** — Create and manage separate study notebooks per video
- **Linked Resources** — Attach PDFs, links, images, and files to specific timestamps
- **System Wikis** — Browse, search, and publish public study wikis to the community
- **AI Summary Generation** — Generate concise AI-powered summaries of video lectures
- **Bilingual & RTL** — Full English and Arabic with proper right-to-left layout and the Thmanyah typeface
- **Offline Demo Mode** — Works without a backend via a built-in mock API (ideal for GitHub Pages)

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (or [Bun](https://bun.sh/))

### 1. Install

```bash
npm install
```

### 2. Run in development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173). Without a backend, the app automatically boots into **demo mode** (offline mock API).

### 3. Production build & preview

```bash
npm run build
npm run preview
```

The build emits a fully static site in `dist/` that can be hosted anywhere.

---

## Project Structure

```
helper-v1.0/
├── index.html                    # HTML entry (Helper Hummingbird v1.0)
├── vite.config.ts                # Vite + React + Tailwind config (relative base for sub-path hosting)
├── tsconfig.json                 # TypeScript config
├── package.json                  # Scripts & dependencies
├── public/
│   ├── favicon.svg               # Helper logo
│   └── fonts/                    # Thmanyah typeface (Arabic-first typography)
└── src/
    ├── main.tsx                  # Bootstrap: render Product (offline demo mode needs no backend)
    ├── product.tsx               # The single app page — full-screen "Helper Hummingbird v1.0" shell
    ├── index.css                 # Tailwind + custom CSS + RTL rules
    ├── mockApi.ts                # Client-side mock API (every feature works offline)
    ├── data/
    │   └── catalog.ts            # Typed video catalog (YouTube lectures by category)
    └── components/
        └── HummingbirdWorkspace.tsx   # Canonical video notebook workspace (player, notes, AI, wikis)
```

The codebase is deliberately small and single-purpose:

- **`product.tsx`** is the *only* page. It provides the full-screen shell, the EN/AR language toggle wiring, the document-level fullscreen button, and the demo-mode badge, then renders the canonical workspace.
- **`HummingbirdWorkspace.tsx`** is the *only* Video Notebook implementation. It owns the YouTube player, annotations, notepad, notebooks, resources, AI tutor, summaries, and wikis.
- **`mockApi.ts`** intercepts `/api/*` fetch calls so every feature works without a server.
- **`catalog.ts`** centralizes the seeded lecture catalog with TypeScript types.

> Previous iterations (the marketing landing page, `InteractiveNotebook`, `AdminPanel`, and the duplicated `Product/HummingbirdProduct`) were removed to keep a single clean Video Notebook code path.

---

## GitHub Pages

Hosting is automatic via the included workflow (`.github/workflows/deploy.yml`):

1. Push to the `main` branch — or trigger **Actions → Deploy to GitHub Pages → Run workflow**.
2. The site builds with `vite build` (relative asset base, so it works under `/Helper-V1.0/`).
3. Enable GitHub Pages in **repo Settings → Pages** with the **GitHub Actions** source if not already set.

Live demo: `https://<username>.github.io/Helper-V1.0/`

Because the app uses a relative base and an offline mock API, it renders identically locally and on Pages.

---

## Desktop App

The source in this repository is a headless, server-free web app, making it trivial to wrap as a desktop application (Electron, Tauri, Capacitor, etc.):

```bash
# Example: build the static bundle, then point your desktop shell at dist/index.html
npm run build
```

The desktop shell only needs to:

- Load `dist/index.html` in a full-screen WebView/BrowserWindow
- Expose the document fullscreen API (already used by the in-app fullscreen button)

No server or network is required — the demo-mode API keeps every feature working offline.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript |
| **Frontend** | React 19, Vite 6 |
| **Styling** | Tailwind CSS 4, Framer Motion (`motion`) |
| **Icons** | lucide-react |
| **Video Player** | YouTube IFrame API |
| **Typography** | Thmanyah typeface (Arabic), Inter (English) |

The repository is fully headless and server-free: there is no backend, no database, and no environment variables required to build or run it.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server (demo mode) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` / `npm start` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |

---

## License

This project is private. All rights reserved.

---

<p align="center">
  Built with care for students and educators everywhere.
</p>
