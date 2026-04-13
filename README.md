# Wordkeep

A full-stack Chinese vocabulary journal built for **Assignment 3 — Design, Build, Ship (MPCS 51238, Spring 2026)**. Collect Chinese words you want to keep, return to them deliberately, and build a vocabulary that stays. Duolingo teaches new words every day but doesn't help you retain them — Wordkeep fills that gap.

**Live URL:** https://dbs-assignment3-nine.vercel.app

## What it does

- **Discover** — Type an English or Chinese word, get the translation from the [MyMemory Translation API](https://mymemory.translated.net/), auto-generated pinyin with tones (via `pinyin-pro`), and real native example sentences from the [Tatoeba API](https://tatoeba.org/).
- **Save** — One click saves the entry to your Supabase-backed vocabulary, tagged with your Clerk user ID so it stays private to you.
- **Vocabulary** — Browse your collection and a shared 120-word HSK1–5 starter dictionary. Filter by category, search by Chinese / pinyin / English. Hide seed words you don't need; fully delete your own additions.
- **Review** — Flashcards shuffled from your deck, flip to reveal pinyin + meaning + example.
- **Practice** — Three game modes (Chinese → English quiz, English → Chinese match, sentence reconstruction), 10 rounds each.
- **Progress** — Mastery percentage, per-category breakdown, and a running list of every word you've mastered.

## Architecture

```
Browser (React / Tailwind)
  ├── Clerk Components      → identity (sign up, log in, user button)
  ├── Supabase JS Client    → reads/writes rows; Clerk JWT attached via accessToken callback
  └── /api/* (Next route handlers)
        ├── /api/translate  → proxies MyMemory (en↔zh translation)
        └── /api/examples   → proxies Tatoeba (native example sentences)
                │
                ▼
         Clerk Cloud          Supabase Postgres
         (users, sessions)    (vocab_entries, user_hidden_entries — RLS scoped)
```

- **Clerk** validates who the user is and hands back a signed JWT.
- **Supabase** trusts the JWT via its Third-Party Auth integration, extracts `auth.jwt()->>'sub'` (the Clerk user id), and applies row-level security policies that only let users read/write their own rows (plus shared seed rows that are read-only for everyone).
- **API routes** run server-side so external-API keys (if any) stay off the client, and so we can shape the response before it hits the browser.

## Data model

```sql
vocab_entries
  id UUID pk, chinese text, pinyin text, english text, example text?,
  category text (enum: greetings, food, travel, shopping, numbers,
                 daily, work, other),
  mastered boolean default false,
  created_at timestamptz default now(),
  user_id text   -- Clerk user id; NULL = shared seed row

user_hidden_entries
  id UUID pk, user_id text, entry_id UUID fk → vocab_entries.id,
  hidden_at timestamptz default now(),
  unique (user_id, entry_id)
```

RLS policies on `vocab_entries`:
- SELECT — rows where `user_id = auth.jwt()->>'sub'` OR `user_id IS NULL` (seed).
- INSERT / UPDATE / DELETE — only on rows where `user_id = auth.jwt()->>'sub'`.

RLS policies on `user_hidden_entries`: all operations limited to the signed-in user's own rows.

## Tech stack

- **Framework** — Next.js 16 (App Router), React 19, TypeScript
- **Styling** — Tailwind CSS 4, Fraunces (display serif), Geist Sans (body), Noto Serif SC (Chinese characters)
- **Auth** — Clerk (`@clerk/nextjs`) with `clerkMiddleware` route protection
- **Database** — Supabase Postgres (`@supabase/supabase-js`) with Row-Level Security
- **External APIs** — MyMemory Translation, Tatoeba
- **Agentic tooling** — Supabase MCP server for schema/query/debug directly from Claude Code
- **Hosting** — Vercel (auto-deploy on every push to `main`)

## Running locally

```bash
# 1. Install deps
npm install

# 2. Set up env vars
#    Copy these to a new .env.local in the project root:
#      NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
#      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...
#      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
#      CLERK_SECRET_KEY=sk_test_...

# 3. Start the dev server
npm run dev
# → http://localhost:3000
```

For Clerk ↔ Supabase to work, connect the two services once in their dashboards:
1. Clerk Dashboard → Integrations → **Connect with Supabase** (adds the `role` claim to session tokens).
2. Supabase Dashboard → Auth → **Third-Party Auth** → Add Clerk, paste your Clerk domain.

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── translate/route.ts      MyMemory proxy
│   │   └── examples/route.ts       Tatoeba proxy
│   ├── sign-in/ + sign-up/         Clerk drop-in pages
│   ├── discover/page.tsx           Search + save flow (uses both APIs)
│   ├── add/page.tsx                Manual entry form
│   ├── vocab/page.tsx + [id]/      Browse + word detail
│   ├── review/page.tsx             Flashcard mode
│   ├── practice/page.tsx           Three game modes
│   ├── progress/page.tsx           Mastery dashboard
│   ├── navigation.tsx              Top nav with Clerk UserButton
│   ├── layout.tsx                  ClerkProvider + font loaders
│   └── globals.css                 Design tokens + typography
├── context/VocabContext.tsx        Supabase-backed CRUD + RLS-aware delete
├── lib/
│   ├── supabase-client.ts          useSupabase() hook; Clerk token via accessToken
│   └── supabase-server.ts          Server-side client for route handlers
└── proxy.ts                        Clerk middleware (route protection)
```

## Design

Editorial scholar aesthetic — warm paper background, near-black ink, terracotta primary, sage jade for mastery, butter gold accents. Fraunces display serif pairs with Geist sans-serif for body; Noto Serif SC gives Chinese characters calligraphic weight. All headings and rulings follow an editorial masthead pattern so every page shares the same voice.
