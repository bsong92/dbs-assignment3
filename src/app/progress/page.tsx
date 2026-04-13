"use client";

import { useState } from "react";
import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

export default function ProgressPage() {
  const { entries } = useVocab();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const totalWords = entries.length;
  const masteredWords = entries.filter((e) => e.mastered).length;
  const learningWords = totalWords - masteredWords;
  const masteryPercent =
    totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  const categories = [...new Set(entries.map((e) => e.category))].sort();
  const categoryStats = categories.map((cat) => {
    const words = entries.filter((e) => e.category === cat);
    const mastered = words.filter((e) => e.mastered);
    const learning = words.filter((e) => !e.mastered);
    return {
      name: cat,
      total: words.length,
      masteredCount: mastered.length,
      mastered,
      learning,
      percent:
        words.length > 0
          ? Math.round((mastered.length / words.length) * 100)
          : 0,
    };
  });

  const allMastered = entries.filter((e) => e.mastered);

  const toggleCategory = (name: string) => {
    setExpandedCategory((prev) => (prev === name ? null : name));
  };

  return (
    <div className="space-y-12">
      {/* Masthead */}
      <header className="text-center">
        <p className="eyebrow mb-3">Journey</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          Progress
        </h1>
        <p className="mt-4 text-lg text-foreground max-w-xl mx-auto">
          Track where you&apos;ve been. Celebrate what you&apos;ve learned.
        </p>
      </header>

      <div className="rule" />

      {/* Overall mastery — big editorial numbers */}
      <section className="text-center">
        <p className="eyebrow mb-4">Overall Mastery</p>
        <p className="font-display text-[clamp(5rem,15vw,9rem)] leading-none font-bold text-foreground">
          {masteryPercent}
          <span className="text-5xl align-top text-primary ml-1">%</span>
        </p>
        <div className="mt-8 max-w-xl mx-auto">
          <div className="h-[4px] w-full bg-border overflow-hidden">
            <div
              className="h-full bg-jade transition-all duration-700 ease-out"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-10 text-base">
          <div>
            <p className="font-display text-3xl font-bold text-jade">
              {masteredWords}
            </p>
            <p className="eyebrow mt-1">Mastered</p>
          </div>
          <span className="text-border text-3xl">·</span>
          <div>
            <p className="font-display text-3xl font-bold text-primary">
              {learningWords}
            </p>
            <p className="eyebrow mt-1">Learning</p>
          </div>
          <span className="text-border text-3xl">·</span>
          <div>
            <p className="font-display text-3xl font-bold text-foreground">
              {totalWords}
            </p>
            <p className="eyebrow mt-1">Total</p>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* By category */}
      <section>
        <p className="eyebrow mb-6">By category</p>
        {categoryStats.length === 0 ? (
          <p className="font-display italic text-xl text-foreground text-center py-12">
            No categories yet.
          </p>
        ) : (
          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div
                key={cat.name}
                className="border-b border-border pb-4 last:border-b-0"
              >
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm text-foreground transition-transform duration-200 ${
                          expandedCategory === cat.name ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                      <span className="font-display text-xl font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-base font-semibold text-foreground">
                      {cat.masteredCount}/{cat.total}{" "}
                      <span className="text-foreground">
                        · {cat.percent}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-[3px] bg-border overflow-hidden ml-6">
                    <div
                      className="h-full bg-jade transition-all duration-700 ease-out"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </button>

                {expandedCategory === cat.name && (
                  <div className="ml-6 mt-5 space-y-5">
                    {cat.mastered.length > 0 && (
                      <div>
                        <p className="eyebrow mb-3 text-jade-dark">
                          Mastered ({cat.mastered.length})
                        </p>
                        <ul>
                          {cat.mastered.map((entry) => (
                            <li
                              key={entry.id}
                              className="border-b border-border last:border-b-0"
                            >
                              <Link
                                href={`/vocab/${entry.id}`}
                                className="flex items-center justify-between gap-4 py-3 hover:bg-surface transition-colors"
                              >
                                <div className="flex items-center gap-5 min-w-0">
                                  <span className="font-cjk text-2xl font-medium text-foreground whitespace-nowrap">
                                    {entry.chinese}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-mono text-sm text-foreground">
                                      {entry.pinyin}
                                    </p>
                                    <p className="text-base font-semibold text-foreground truncate">
                                      {entry.english}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cat.learning.length > 0 && (
                      <div>
                        <p className="eyebrow mb-3 text-primary">
                          Learning ({cat.learning.length})
                        </p>
                        <ul>
                          {cat.learning.map((entry) => (
                            <li
                              key={entry.id}
                              className="border-b border-border last:border-b-0"
                            >
                              <Link
                                href={`/vocab/${entry.id}`}
                                className="flex items-center justify-between gap-4 py-3 hover:bg-surface transition-colors"
                              >
                                <div className="flex items-center gap-5 min-w-0">
                                  <span className="font-cjk text-2xl font-medium text-foreground whitespace-nowrap">
                                    {entry.chinese}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-mono text-sm text-foreground">
                                      {entry.pinyin}
                                    </p>
                                    <p className="text-base font-semibold text-foreground truncate">
                                      {entry.english}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All mastered words */}
      {allMastered.length > 0 && (
        <section>
          <div className="rule mb-8" />
          <p className="eyebrow mb-6">All mastered words ({allMastered.length})</p>
          <ul className="border-t-2 border-foreground">
            {allMastered.map((entry) => (
              <li key={entry.id} className="border-b border-border">
                <Link
                  href={`/vocab/${entry.id}`}
                  className="flex items-center justify-between gap-6 py-5 group hover:bg-surface/50 transition-colors"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <span className="font-cjk text-3xl sm:text-4xl font-medium text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
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
                  <span className="eyebrow text-jade-dark shrink-0 hidden sm:inline">
                    ✓ {entry.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
