# SprintAI

Upload a PDF, get structured study notes, a quiz, flashcards, and a Q&A chat — all powered by Gemini.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sprint--ai--orpin.vercel.app-blue?style=flat-square)](https://sprint-ai-orpin.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Worker on Render](https://img.shields.io/badge/Render-Worker-46e3b7?style=flat-square&logo=render)](https://render.com)

---

## What It Does

You upload a PDF (lecture notes, a paper, a textbook chapter). SprintAI:

1. Stores the PDF on Cloudinary and queues a background job via Redis + BullMQ
2. A dedicated worker on Render downloads the PDF, extracts text, chunks it, and generates vector embeddings using `gemini-embedding-001`
3. Gemini generates structured **study notes** (with LaTeX math rendered via KaTeX) and a **multiple-choice quiz** in parallel
4. You can also ask questions — the app finds the most relevant chunks via **pgvector cosine similarity** and passes them as context to Gemini for a grounded answer

---

## Architecture

```mermaid
flowchart TD
    A([User Browser]) -->|POST /api/upload| B[Vercel — Next.js API Route]

    B -->|Upload PDF buffer| C[(Cloudinary\nPDF Storage)]
    C -->|Returns fileUrl| B

    B -->|Create Document\nConversation, Message| D[(Neon PostgreSQL\nPrisma ORM)]
    B -->|Enqueue job\ndocumentId + fileUrl| E[(Upstash Redis\nBullMQ Queue)]
    B -->|Fire-and-forget\nwake-up ping| F

    B -->|HTTP 201 + documentId| A
    A -->|Poll /api/notes/id every 3s| B

    subgraph F[Render — BullMQ Worker]
        direction TB
        W1[1. Fetch PDF from Cloudinary]
        W2[2. Extract text via pdf-parse]
        W3[3. Chunk text — 600 words, 50 overlap]
        W4[4. Generate embeddings — gemini-embedding-001]
        W5[5. Save chunks + embeddings to pgvector]
        W6[6. Generate notes + quiz in parallel via Gemini]
        W7[7. Save results, set status = READY]

        W1 --> W2 --> W3 --> W4 --> W5 --> W6 --> W7
    end

    E -->|Job picked up| F
    W7 -->|Update Document| D

    A -->|Ask a question| G[/api/qa]
    G -->|Embed question\nfind top-k chunks| D
    G -->|Grounded prompt| H[Gemini API]
    H -->|Answer| A
```

---

## Features

- **Study Notes** — structured markdown with headings, bullet points, and LaTeX math rendered by KaTeX
- **Multiple-Choice Quiz** — auto-generated questions with instant feedback and score tracking
- **Flashcards** — key term / definition cards generated from the document
- **RAG Q&A Chat** — ask anything about the document; Gemini answers using only the most relevant chunks as context
- **Google OAuth** — sign in with Google via Better Auth
- **Processing Status** — the browser polls until the worker finishes; you see a live progress indicator

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Auth | Better Auth (Google OAuth) |
| Database | Neon PostgreSQL, Prisma ORM |
| Vector Search | pgvector (`embedding vector(768)`) |
| Queue | Upstash Redis, BullMQ |
| File Storage | Cloudinary |
| AI | Google Gemini API (`gemini-3.6-flash`, `gemini-embedding-001`) |
| Math Rendering | KaTeX (`remark-math` + `rehype-katex`) |
| Worker Host | Render (Free Web Service) |
| App Host | Vercel |

---

## How It Works

### Producer (Next.js API Route — `/api/upload`)

When a user uploads a PDF, the route does the following in sequence:

1. Checks the user session via Better Auth
2. Uploads the PDF buffer to Cloudinary, gets back a `fileUrl`
3. Creates a `Document` record in PostgreSQL with `status: 'PROCESSING'`
4. Creates a `Conversation` and the user's first `Message`
5. Adds a job to the BullMQ `document-queue` with `{ documentId, fileUrl }`, configured for 3 attempts with exponential backoff
6. Sends a fire-and-forget ping to the Render worker URL to wake it up if it was sleeping
7. Returns `{ documentId }` immediately — the browser then polls `/api/notes/[id]` every 3 seconds

### Consumer (BullMQ Worker — Render)

The worker picks up the job from Redis and runs this pipeline:

| Step | What Happens |
|---|---|
| 1 | Download PDF buffer from Cloudinary |
| 2 | Extract plain text using `pdf-parse` |
| 3 | Split text into 600-word chunks with 50-word overlap |
| 4 | Delete any stale chunks and quiz from a previous attempt (idempotent) |
| 5 | Generate a 768-dimensional embedding for each chunk via `gemini-embedding-001` |
| 6 | Save each chunk to PostgreSQL; update the `embedding` column via raw SQL (`$executeRawUnsafe`) because Prisma does not support `vector` natively |
| 7 | Run `generateStudyNotes()` and `generateQuiz()` in parallel via `Promise.all` |
| 8 | Save the quiz and notes, set `status: 'READY'` |

If a step throws, BullMQ retries up to 3 times with exponential backoff. The document is only marked `FAILED` after all attempts are exhausted.

### RAG Q&A

When a user asks a question:

1. The question is embedded using `gemini-embedding-001`
2. PostgreSQL finds the top-5 most similar chunks using `<=>` (cosine distance)
3. The chunks are injected into a prompt and sent to Gemini
4. Gemini's answer is saved as a `Message` and returned to the browser

---

## Local Development

### Prerequisites

- Node.js 20+
- A PostgreSQL database with the `pgvector` extension enabled (e.g. Neon free tier)
- An Upstash Redis database
- A Cloudinary account
- A Google Cloud project with OAuth credentials
- A Google Gemini API key

### 1. Clone and install

```bash
git clone https://github.com/WAnubhavGoel/SprintAI.git
cd SprintAI
npm install
```

### 2. Set up environment variables

Copy the table below into a `.env` file at the project root and fill in your values.

### 3. Push the database schema

```bash
npx prisma db push
```

### 4. Run the Next.js app

```bash
npm run dev
```

### 5. Run the worker (in a separate terminal)

```bash
npm run worker
```

> **Note:** On Windows with WSL-installed `node_modules`, the worker must be run inside WSL or on Linux/macOS. `tsx` requires the platform-native esbuild binary. The Next.js app itself runs fine on Windows.

---

## Environment Variables

### Next.js app (Vercel)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (with `?sslmode=require` for Neon) |
| `REDIS_URL` | Upstash Redis URL (starts with `rediss://` for TLS) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `BETTER_AUTH_SECRET` | Random secret string for Better Auth session signing |
| `BETTER_AUTH_URL` | Public URL of the app (e.g. `https://your-app.vercel.app`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_WORKER_URL` | Public URL of the Render worker (e.g. `https://sprintai-uzz0.onrender.com`) |

### Worker (Render)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Same PostgreSQL connection string |
| `REDIS_URL` | Same Upstash Redis URL |
| `GEMINI_API_KEY` | Same Gemini API key |
| `CLOUDINARY_CLOUD_NAME` | Needed to fetch PDFs from Cloudinary |
| `PORT` | Set automatically by Render |

---

## Deployment

### Vercel (Next.js app)

1. Push to GitHub and import the repo in Vercel
2. Add all environment variables listed above under "Next.js app"
3. Deploy — Vercel handles builds automatically on every push

### Render (BullMQ Worker)

1. Create a new **Web Service** on Render (not a Background Worker — the free tier requires an HTTP health check)
2. Set the **Start Command** to: `npm run worker`
3. Add the worker environment variables
4. Render assigns a public URL — set that as `NEXT_PUBLIC_WORKER_URL` in Vercel

The worker runs a lightweight HTTP server on `process.env.PORT` that responds `200 OK` to all requests. This satisfies Render's health check and also serves as the wake-up endpoint that the Next.js app pings when a user uploads a document.

---

## Project Structure

```
src/
+-- app/
¦   +-- api/
¦   ¦   +-- upload/        # PDF upload, Cloudinary, BullMQ enqueue
¦   ¦   +-- notes/         # Polling endpoint, notes + quiz fetch
¦   ¦   +-- qa/            # RAG Q&A endpoint
¦   +-- dashboard/         # User's document list
¦   +-- notes/[id]/        # Notes, quiz, flashcards, chat UI
¦   +-- layout.tsx         # Root layout with WorkerWarmup
+-- components/
¦   +-- NotesContent.tsx   # ReactMarkdown + KaTeX rendering
¦   +-- WorkerWarmup.tsx   # Pings Render worker on every page load
+-- lib/
¦   +-- auth.ts            # Better Auth config
¦   +-- prisma.ts          # Prisma client
¦   +-- redis.ts           # ioredis connection + BullMQ queue
+-- services/
¦   +-- gemini.service.ts  # Notes, quiz, embeddings, Q&A via Gemini
¦   +-- chunker.service.ts # Text chunking logic
+-- workers/
    +-- document.worker.ts # BullMQ consumer — full processing pipeline
prisma/
+-- schema.prisma          # Database schema with pgvector
```

---

## Author

Anubhav Goel — B.Tech IT, USICT, GGSIPU

[GitHub](https://github.com/WAnubhavGoel) · [Live Demo](https://sprint-ai-orpin.vercel.app)
