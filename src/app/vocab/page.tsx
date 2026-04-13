"use client";

import { useState } from "react";
import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

const ALL_CATEGORIES = ["all", "greetings", "food", "travel", "shopping", "numbers", "daily", "work", "other"];

export default function VocabPage() {
  const { entries } = useVocab();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Strip tone marks so "bukeqi" matches "bú kè qi"
  const stripTones = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");

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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Vocabulary</h1>
        <p className="text-muted text-lg">
          {entries.length} word{entries.length !== 1 ? "s" : ""} in your journal
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by Chinese, pinyin, or English..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer capitalize ${
                category === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Word List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted font-medium">No words found.</p>
          <p className="text-sm text-muted mt-2">
            {entries.length === 0 ? (
              <Link href="/add" className="text-primary hover:underline font-semibold">
                Add your first word →
              </Link>
            ) : (
              "Try adjusting your search or filter."
            )}
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {filtered.map((entry) => (
            <Link
              key={entry.id}
              href={`/vocab/${entry.id}`}
              className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold w-20 text-center group-hover:text-primary transition-colors">
                  {entry.chinese}
                </span>
                <div>
                  <p className="text-sm text-muted">{entry.pinyin}</p>
                  <p className="font-medium">{entry.english}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-muted capitalize">
                  {entry.category}
                </span>
                {entry.mastered && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-light text-primary-dark">
                    ✓ mastered
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
