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
      <div className="text-center py-20">
        <p className="font-display italic text-2xl text-foreground">
          No words to review.
        </p>
        <Link
          href="/discover"
          className="inline-block mt-4 text-lg font-semibold text-primary hover:text-primary-dark underline-offset-4 hover:underline"
        >
          Add some words first →
        </Link>
      </div>
    );
  }

  const current = deck[index % deck.length];
  const progress = index + 1;
  const total = deck.length;

  return (
    <div className="max-w-xl mx-auto">
      <p className="text-center mb-6 text-base font-semibold text-foreground tracking-wide">
        Card {(index % total) + 1} of {total}
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[340px] bg-surface rounded-sm border-2 border-foreground transition-all duration-300 p-10 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl group"
      >
        {!flipped ? (
          <>
            <p className="font-cjk text-7xl sm:text-8xl font-medium text-foreground mb-6 group-hover:scale-105 transition-transform">
              {current.chinese}
            </p>
            <p className="text-base font-semibold text-foreground tracking-[0.15em] uppercase">
              Tap to reveal
            </p>
          </>
        ) : (
          <>
            <p className="font-cjk text-5xl font-medium text-foreground mb-3">
              {current.chinese}
            </p>
            <p className="font-mono text-xl text-primary mb-2">
              {current.pinyin}
            </p>
            <p className="font-display text-2xl italic text-foreground">
              {current.english}
            </p>
            {current.example && (
              <p className="font-cjk text-lg text-foreground mt-6 leading-relaxed text-center max-w-md">
                {current.example}
              </p>
            )}
          </>
        )}
      </button>

      <div className="flex gap-3 mt-8">
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((i) => Math.max(0, i - 1));
          }}
          disabled={index === 0}
          className="flex-1 py-4 px-5 rounded-sm text-base font-semibold tracking-wide uppercase bg-surface border border-border text-foreground hover:border-border-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((i) => i + 1);
          }}
          className="flex-1 py-4 px-5 rounded-sm text-base font-semibold tracking-wide uppercase bg-primary hover:bg-primary-dark text-surface transition-all"
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

  const categories = ["all", ...new Set(entries.map((e) => e.category))].filter(
    Boolean
  );

  const filtered =
    category === "all"
      ? entries
      : entries.filter((e) => e.category === category);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setKey((k) => k + 1);
  };

  return (
    <div className="space-y-12">
      {/* Masthead */}
      <header className="text-center">
        <p className="eyebrow mb-3">Flashcards</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          Review
        </h1>
        <p className="mt-4 text-lg text-foreground max-w-xl mx-auto">
          Flip through your vocabulary and keep the words close.
        </p>
      </header>

      <div className="rule" />

      {/* Category filter */}
      <div>
        <label className="eyebrow block mb-4 text-center">
          Filter by category
        </label>
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((cat) => {
            const selected = category === cat;
            const count =
              cat === "all"
                ? entries.length
                : entries.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-sm text-base font-semibold tracking-wide capitalize transition-colors ${
                  selected
                    ? "bg-foreground text-surface"
                    : "bg-surface border border-border text-foreground hover:border-border-hover"
                }`}
              >
                {cat === "all" ? `All (${count})` : `${cat} (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      <FlashcardMode key={`fc-${key}`} entries={filtered} />
    </div>
  );
}
