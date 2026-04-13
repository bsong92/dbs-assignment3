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
  const masteryPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

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
      percent: words.length > 0 ? Math.round((mastered.length / words.length) * 100) : 0,
    };
  });

  const allMastered = entries.filter((e) => e.mastered);

  const toggleCategory = (name: string) => {
    setExpandedCategory((prev) => (prev === name ? null : name));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Progress</h1>
        <p className="text-muted text-lg">Track your Chinese learning journey.</p>
      </div>

      {/* Overall mastery */}
      <div className="bg-surface rounded-2xl border border-border p-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-1">
              Overall Mastery
            </p>
            <p className="text-5xl font-extrabold text-primary">{masteryPercent}%</p>
          </div>
          <div className="text-right text-sm text-muted space-y-0.5">
            <p><span className="font-bold text-foreground">{masteredWords}</span> mastered</p>
            <p><span className="font-bold text-foreground">{learningWords}</span> learning</p>
            <p><span className="font-bold text-foreground">{totalWords}</span> total</p>
          </div>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl border border-border p-6 text-center hover:shadow-md hover:border-border-hover transition-all">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light mb-3">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-3xl font-extrabold text-primary">{masteredWords}</p>
          <p className="text-sm text-muted font-medium mt-1">Mastered</p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-6 text-center hover:shadow-md hover:border-border-hover transition-all">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-light mb-3">
            <span className="text-2xl">✎</span>
          </div>
          <p className="text-3xl font-extrabold text-accent">{learningWords}</p>
          <p className="text-sm text-muted font-medium mt-1">Still Learning</p>
        </div>
      </div>

      {/* Category breakdown — clickable */}
      <div className="bg-surface rounded-2xl border border-border p-8">
        <p className="text-sm font-bold text-muted uppercase tracking-widest mb-6">
          By Category
        </p>
        {categoryStats.length === 0 ? (
          <p className="text-muted text-center py-8 font-medium">No categories yet.</p>
        ) : (
          <div className="space-y-3">
            {categoryStats.map((cat) => (
              <div key={cat.name}>
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs transition-transform duration-200 ${expandedCategory === cat.name ? "rotate-90" : ""}`}>
                        ▶
                      </span>
                      <span className="text-sm font-bold capitalize group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted font-medium">
                      {cat.masteredCount}/{cat.total} mastered · {cat.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden ml-5">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </button>

                {/* Expanded word list */}
                {expandedCategory === cat.name && (
                  <div className="ml-5 mt-3 mb-4 bg-stone-50 rounded-xl border border-border overflow-hidden">
                    {cat.mastered.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest px-4 pt-3 pb-1">
                          Mastered ({cat.mastered.length})
                        </p>
                        <div className="divide-y divide-border">
                          {cat.mastered.map((entry) => (
                            <Link
                              key={entry.id}
                              href={`/vocab/${entry.id}`}
                              className="flex items-center justify-between px-4 py-2.5 hover:bg-stone-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold w-12 text-center">{entry.chinese}</span>
                                <span className="text-xs text-muted">{entry.pinyin}</span>
                              </div>
                              <span className="text-sm">{entry.english}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                    {cat.learning.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-accent uppercase tracking-widest px-4 pt-3 pb-1">
                          Learning ({cat.learning.length})
                        </p>
                        <div className="divide-y divide-border">
                          {cat.learning.map((entry) => (
                            <Link
                              key={entry.id}
                              href={`/vocab/${entry.id}`}
                              className="flex items-center justify-between px-4 py-2.5 hover:bg-stone-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold w-12 text-center">{entry.chinese}</span>
                                <span className="text-xs text-muted">{entry.pinyin}</span>
                              </div>
                              <span className="text-sm">{entry.english}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All mastered words */}
      {allMastered.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-6 pb-0">
            <p className="text-sm font-bold text-muted uppercase tracking-widest">
              All Mastered Words ({allMastered.length})
            </p>
          </div>
          <div className="divide-y divide-border mt-4">
            {allMastered.map((entry) => (
              <Link
                key={entry.id}
                href={`/vocab/${entry.id}`}
                className="flex items-center justify-between p-4 px-6 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold w-14 text-center">{entry.chinese}</span>
                  <span className="text-sm text-muted">{entry.pinyin}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{entry.english}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-muted capitalize">
                    {entry.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
