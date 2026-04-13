"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useVocab, VocabEntry } from "@/context/VocabContext";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function FlashcardMode({ entries }: { entries: VocabEntry[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deck, setDeck] = useState(entries);

  useEffect(() => {
    setDeck(shuffle(entries));
  }, [entries]);

  if (deck.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">No words to review.</p>
        <Link href="/add" className="text-primary hover:underline font-semibold mt-2 inline-block">
          Add some words first →
        </Link>
      </div>
    );
  }

  const current = deck[index % deck.length];
  const progress = index + 1;
  const total = deck.length;

  return (
    <div className="max-w-md mx-auto">
      <p className="text-sm text-muted text-center mb-5 font-medium">
        Card {((index % total) + 1)} of {total}
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[300px] bg-surface rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg group"
      >
        {!flipped ? (
          <>
            <p className="text-6xl font-extrabold mb-4 group-hover:scale-105 transition-transform">
              {current.chinese}
            </p>
            <p className="text-sm text-muted font-medium">Tap to reveal</p>
          </>
        ) : (
          <>
            <p className="text-4xl font-extrabold mb-2">{current.chinese}</p>
            <p className="text-lg text-muted mb-1">{current.pinyin}</p>
            <p className="text-xl font-medium">{current.english}</p>
            {current.example && (
              <p className="text-sm text-muted mt-4 italic">&ldquo;{current.example}&rdquo;</p>
            )}
          </>
        )}
      </button>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => { setFlipped(false); setIndex((i) => Math.max(0, i - 1)); }}
          disabled={index === 0}
          className="flex-1 py-3 px-4 rounded-xl font-bold bg-stone-100 text-foreground hover:bg-stone-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
        >
          ← Previous
        </button>
        <button
          onClick={() => { setFlipped(false); setIndex((i) => i + 1); }}
          className="flex-1 py-3 px-4 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          {progress >= total ? "Restart" : "Next →"}
        </button>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const { entries } = useVocab();
  const [category, setCategory] = useState("all");
  const [key, setKey] = useState(0);

  const categories = ["all", ...new Set(entries.map((e) => e.category))].filter(Boolean);

  const filtered = category === "all"
    ? entries
    : entries.filter((e) => e.category === category);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setKey((k) => k + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Review</h1>
        <p className="text-muted text-lg">Flip through your vocabulary flashcards.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer capitalize ${
              category === cat
                ? "bg-accent text-white shadow-sm"
                : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover"
            }`}
          >
            {cat === "all" ? `All (${entries.length})` : `${cat} (${entries.filter((e) => e.category === cat).length})`}
          </button>
        ))}
      </div>

      <FlashcardMode key={`fc-${key}`} entries={filtered} />
    </div>
  );
}
