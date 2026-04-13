# Wordkeep

A personal Chinese vocabulary learning journal built to solve a real problem: Duolingo teaches new words daily but doesn't help you retain them. Wordkeep lets you collect, organize, review, and practice your Chinese vocabulary with multiple game modes.

## Pages & Routes (7 pages + 1 dynamic route)

### `/` — Dashboard
- Welcome message with quick stats: total words, mastered count, added today, category count
- Quick action cards linking to Add Word and Review
- Recent words list with links to detail pages

### `/add` — Add Word
- Form with fields: Chinese characters, pinyin, English meaning, example sentence (optional), category select
- Success feedback on submit, form resets for adding another
- Categories: greetings, food, travel, shopping, numbers, daily, work, other

### `/vocab` — Vocabulary Browse
- Full list of all 120 vocabulary words in a card-based layout
- Search bar with fuzzy pinyin matching (typing "bukeqi" matches "bú kè qi")
- Category pill filters to narrow by topic
- Each word links to its detail page

### `/vocab/[id]` — Word Detail (dynamic route)
- Large character display with gradient header
- Pinyin, English meaning, example sentence, category, mastery status
- "Mark as Mastered" toggle and Delete button
- Back navigation to vocabulary list

### `/review` — Flashcard Review
- Flip-card interface: see Chinese characters, tap to reveal pinyin + English + example
- Previous/Next navigation through shuffled deck
- Category filter pills to review only specific topics (e.g. just Food or Travel)

### `/practice` — Practice Games
Three game modes, all with category filter and 10-round sessions:
- **Chinese → English**: See Chinese characters + pinyin, pick the correct English meaning from 4 choices
- **English → Chinese**: See English meaning + pinyin, pick the correct Chinese characters from 4 choices
- **Reconstruction**: Unscramble characters to form a sentence. Click characters in the build area to send them back, drag to reorder positions.

### `/progress` — Progress Tracking
- Overall mastery percentage with visual progress bar
- Mastered vs. Learning stat cards
- Per-category breakdown with clickable progress bars — expand any category to see its mastered and learning words
- Full list of all mastered words with links to detail pages

## Data Model

```typescript
interface VocabEntry {
  id: string;          // unique identifier
  chinese: string;     // Chinese characters (e.g. "你好")
  pinyin: string;      // romanized pronunciation (e.g. "nǐ hǎo")
  english: string;     // English meaning (e.g. "hello")
  example?: string;    // example sentence (e.g. "你好，我叫Brian。")
  category: string;    // "greetings" | "food" | "travel" | "shopping" | "numbers" | "daily" | "work" | "other"
  mastered: boolean;   // whether the user has mastered this word
  createdAt: string;   // ISO date string
}
```

Data is stored in React Context (client-side state only — resets on page refresh). 120 seed words from HSK1 through HSK5 are pre-loaded across all 8 categories.

## Style
Warm, polished design with stone/cream backgrounds, green (#16a34a) and orange (#ea580c) accents. Bold extrabold typography with tight tracking. Rounded 2xl cards with hover shadows and press animations. Backdrop-blur navigation with active link highlighting. Inspired by modern web apps like Linear and Notion.

## Tech Stack
- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v4
- React Context for shared state management
- Geist font family (sans + mono)

## Project Structure
- `src/app/` — Pages and layouts (App Router)
- `src/app/navigation.tsx` — Client-side nav with active link detection
- `src/app/providers.tsx` — Client wrapper for React Context
- `src/context/VocabContext.tsx` — Vocabulary state management (CRUD + toggle mastered)
- `src/context/seedData.ts` — 120 pre-loaded Chinese vocabulary words (HSK1-5)
- `public/wordkeep-logo.jpeg` — Wordkeep logo (lock + book icon)
