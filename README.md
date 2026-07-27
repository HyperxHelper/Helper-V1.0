<p align="center">
  <img src="public/favicon.svg" alt="Helper Logo" width="120" />
</p>

<h1 align="center">Helper</h1>

<p align="center">
  <strong>A collaborative, timestamp-linked video notebook and study wiki with an AI-powered academic co-pilot and bilingual translations.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> · <a href="#quick-start">Quick Start</a> · <a href="#tech-stack">Tech Stack</a> · <a href="#project-structure">Structure</a> · <a href="#deployment">Deployment</a> · <a href="#environment-variables">Env Vars</a>
</p>

---

## What is Helper?

Helper is a full-stack educational platform that turns any YouTube video lesson into a **collaborative notebook workspace**. Students and teachers can annotate timestamps, attach resources, build shared playlists, generate AI transcripts, and publish public study wikis — all backed by Firebase Firestore and Google Gemini AI.

Built bilingually (English / Arabic) with full RTL support, Helper is designed for academic communities that need a structured, searchable knowledge layer on top of video lectures.

---

## Features

- **Timestamp-Linked Notes** — Attach study notes to exact video playback seconds
- **AI Academic Assistant** — Ask questions about the current lecture and get context-aware answers via Gemini
- **AI Transcript Generation** — Auto-generate structured transcripts for any YouTube video
- **AI Note Drafting** — Generate synchronized study notes aligned to the current playback timestamp
- **Bilingual Translation** — Translate notes between English and Arabic with one click
- **Study Diaries & Public Wikis** — Write personal study diaries or publish them as community wikis
- **Shareable Playlists** — Build and share video playlists with unique URLs
- **Resource Attachments** — Link PDFs, spreadsheets, images, and external URLs to specific timestamps
- **Community Discussions** — Create topic-threaded discussion posts with upvotes and threaded replies
- **Real-Time Activity Logs** — Track all academic interactions across the platform
- **Admin Dashboard** — Manage users, videos, categories, and system settings
- **Role-Based Auth** — Student, Teacher, and Admin roles with Firebase Auth
- **Full RTL Support** — Arabic-first typography using the Thmanyah typeface family
- **Responsive Design** — Works beautifully on desktop, tablet, and mobile

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (or [Bun](https://bun.sh/))
- A [Firebase](https://firebase.google.com/) project with Firestore enabled
- A [Google AI Studio](https://aistudio.google.com/) Gemini API key

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/helper-v1.0.git
cd helper-v1.0
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

### 3. Configure Firebase

Replace the contents of `firebase-applet-config.json` with your own Firebase project config:

```json
{
  "projectId": "your-project-id",
  "appId": "your-app-id",
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "firestoreDatabaseId": "your-database-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "your-sender-id"
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

The production build serves from `dist/` on port 3000.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| **Backend** | Express.js, Node.js |
| **Database** | Cloud Firestore (Firebase Client SDK) |
| **Authentication** | Firebase Auth (email/password) |
| **AI Engine** | Google Gemini via `@google/genai` |
| **Video Player** | YouTube IFrame API |
| **Build** | Vite, esbuild |
| **Typography** | Thmanyah typeface (Arabic), Inter (English) |

---

## Project Structure

```
helper-v1.0/
├── public/
│   ├── favicon.svg              # Helper logo (SVG)
│   └── fonts/                   # Thmanyah typeface files
├── src/
│   ├── App.tsx                  # Main application (4200+ lines)
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Tailwind + custom CSS + RTL styles
│   └── components/
│       ├── AdminPanel.tsx       # Admin dashboard (users, videos, settings)
│       ├── HummingbirdWorkspace.tsx  # Standalone notebook workspace
│       └── InteractiveNotebook.tsx   # Playlist & note management UI
├── server.ts                    # Express backend (API routes + Gemini)
├── firebase-applet-config.json  # Firebase client config
├── firebase-blueprint.json      # Firestore schema definition
├── firestore.rules              # Firestore security rules
├── index.html                   # Vite HTML entry
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies & scripts
└── .env.example                 # Environment variable template
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/videos` | List all videos |
| `POST` | `/api/videos` | Add a YouTube video |
| `GET` | `/api/videos/:id/notes` | Get timestamped notes |
| `POST` | `/api/videos/:id/notes` | Add a note |
| `POST` | `/api/notes/:id/pin` | Pin/unpin a note |
| `GET` | `/api/videos/:id/resources` | Get attached resources |
| `POST` | `/api/videos/:id/resources` | Attach a resource |
| `GET` | `/api/videos/:id/comments` | Get comments |
| `POST` | `/api/videos/:id/comments` | Add a comment |
| `GET/POST` | `/api/videos/:id/activities` | Activity logs |
| `POST` | `/api/ai/ask` | Ask AI about the video |
| `POST` | `/api/ai/transcript` | Generate AI transcript |
| `POST` | `/api/ai/draft-note` | AI note drafting |
| `POST` | `/api/ai/translate` | Translate text |
| `GET/POST` | `/api/playlists` | Manage playlists |
| `GET/POST` | `/api/diaries` | Study diaries |
| `GET` | `/api/wikis` | Public community wikis |
| `GET/POST` | `/api/community-posts` | Community discussions |
| `POST` | `/api/community-posts/:id/vote` | Upvote/downvote |
| `POST` | `/api/community-posts/:id/responses` | Reply to post |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/admin/stats` | Admin dashboard stats |
| `GET` | `/api/admin/users` | List all users |
| `POST` | `/api/admin/users/:uid/role` | Change user role |
| `DELETE` | `/api/admin/users/:uid` | Delete user |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |
| `APP_URL` | No | Application URL (defaults to `http://localhost:3000`) |

---

## Default Admin Access

Use these credentials to access the Admin Panel:

- **Email:** `Admin`
- **Password:** `Admin`

---

## Deployment

### Local Development

```bash
npm run dev    # Starts Express + Vite dev server on port 3000
```

### Production Build

```bash
npm run build  # Builds frontend to dist/ and bundles server
npm start      # Runs production server on port 3000
```

### Paid Web Hosting (VPS / PaaS)

For deployment on a paid web host (e.g., DigitalOcean, Railway, Render, or a VPS):

1. **Build the project** on the server: `npm run build`
2. **Set environment variables** (`GEMINI_API_KEY`, `APP_URL`)
3. **Run with a process manager**: `pm2 start dist/server.cjs --name helper`
4. **Point your domain** and enable HTTPS via Nginx/Caddy reverse proxy
5. **Ensure Firestore access** — the Firebase Client SDK connects over HTTPS; no special firewall rules needed

The production build is a single Node.js process (Express serving static files) that can run on any $5–$10/month VPS.

---

## Firestore Collections

| Collection | Description |
|------------|-------------|
| `users` | User profiles (uid, email, role, displayName) |
| `videos` | YouTube video catalog |
| `playlists` | Shareable video playlists |
| `notes` | Timestamp-linked study notes |
| `resources` | Attached files and links |
| `comments` | Discussion comments per video |
| `activities` | Real-time activity audit log |
| `diaries` | Personal study diaries & public wikis |
| `community_posts` | Community discussion threads |
| `settings` | Global system configuration |

---

## License

This project is private. All rights reserved.

---

<p align="center">
  Built with care for students and educators everywhere.
</p>
