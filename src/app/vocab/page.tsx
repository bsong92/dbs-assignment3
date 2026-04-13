"use client";

import { useState } from "react";
import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

const ALL_CATEGORIES = [
  "all",
  "greetings",
  "food",
  "travel",
  "shopping",
  "numbers",
  "daily",
  "work",
  "other",
];

export default function VocabPage() {
  const { entries } = useVocab();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Strip tone marks so "bukeqi" matches "bú kè qi"
  const stripTones = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");

  const filtered = entries.filter((entry) => {
    const matchesCategory = category === "all" || entry.category === category;
    const q = search.toLowerCase();
    const qStripped = stripTones(q);
    const matchesSearch =
      !q ||
      entry.chinese.includes(q) ||
      entry.pinyin.toLowerCase().includes(q) ||
      stripTones(entry.pinyin.toLowerCase()).includes(qStripped) ||
      entry.english.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Masthead */}
      <header className="text-center">
        <p className="eyebrow mb-3">Index</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          Vocabulary
        </h1>
        <p className="mt-4 text-lg text-foreground">
          {entries.length} word{entries.length !== 1 ? "s" : ""} in your journal
        </p>
      </header>

      <div className="rule" />

      {/* Filters */}
      <div className="space-y-5">
        <div>
          <label className="eyebrow block mb-3">Search</label>
          <input
            type="text"
            placeholder="Chinese, pinyin, or English"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-0 py-2 bg-transparent text-xl font-display border-0 border-b-2 border-border focus:border-foreground focus:outline-none transition-colors placeholder:text-muted placeholder:italic text-foreground"
          />
        </div>

        <div>
          <label className="eyebrow block mb-3">Filter by category</label>
          <div className="flex gap-2 flex-wrap">
            {ALL_CATEGORIES.map((cat) => {
              const selected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-sm text-base font-semibold tracking-wide capitalize transition-colors ${
                    selected
                      ? "bg-foreground text-surface"
                      : "bg-surface border border-border text-foreground hover:border-border-hover"
                  }`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Word list */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center border-t border-b border-border">
          <p className="font-display italic text-xl text-foreground">
            {entries.length === 0
              ? "The journal is waiting."
              : "No words match that search."}
          </p>
          {entries.length === 0 && (
            <Link
              href="/discover"
              className="inline-block mt-3 text-base font-semibold text-primary hover:text-primary-dark underline-offset-4 hover:underline"
            >
              Add your first word →
            </Link>
          )}
        </div>
      ) : (
        <ul className="border-t-2 border-foreground">
          {filtered.map((entry) => (
            <li key={entry.id} className="border-b border-border">
              <Link
                href={`/vocab/${entry.id}`}
                className="group flex items-center justify-between gap-6 py-6 transition-colors hover:bg-surface/50"
              >
                <div className="flex items-center gap-6 min-w-0">
                  <span className="font-cjk text-4xl sm:text-5xl font-medium text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                    {entry.chinese}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-base font-medium text-foreground truncate">
                      {entry.pinyin}
                    </p>
                    <p className="text-lg font-semibold text-foreground truncate">
                      {entry.english}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {entry.mastered && (
                    <span className="eyebrow text-jade-dark">
                      ✓ Mastered
                    </span>
                  )}
                  <span className="eyebrow text-foreground hidden sm:inline">
                    {entry.category}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
