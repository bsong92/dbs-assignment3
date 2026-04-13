"use client";

import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

export default function DashboardPage() {
  const { entries } = useVocab();

  const totalWords = entries.length;
  const masteredWords = entries.filter((e) => e.mastered).length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const addedToday = entries.filter(
    (e) => e.createdAt.slice(0, 10) === todayStr
  ).length;
  const recentEntries = entries.slice(0, 5);
  const categories = [...new Set(entries.map((e) => e.category))];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-lg text-muted">
          Keep building your Chinese vocabulary, one word at a time.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Words", value: totalWords, color: "text-primary" },
          { label: "Mastered", value: masteredWords, color: "text-primary" },
          { label: "Added Today", value: addedToday, color: "text-accent" },
          { label: "Categories", value: categories.length, color: "text-foreground" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-2xl border border-border p-6 hover:shadow-md hover:border-border-hover transition-all duration-200"
          >
            <p className={`text-4xl font-extrabold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm text-muted mt-1.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/add"
          className="group flex items-center gap-4 p-5 bg-primary text-white rounded-2xl hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-2xl group-hover:scale-110 transition-transform">
            +
          </span>
          <div>
            <p className="font-bold text-lg">Add Word</p>
            <p className="text-sm text-white/80">Add a new Chinese word or phrase</p>
          </div>
        </Link>
        <Link
          href="/review"
          className="group flex items-center gap-4 p-5 bg-accent text-white rounded-2xl hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
        >
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-2xl group-hover:scale-110 transition-transform">
            ✦
          </span>
          <div>
            <p className="font-bold text-lg">Start Review</p>
            <p className="text-sm text-white/80">Flashcards and quiz practice</p>
          </div>
        </Link>
      </div>

      {/* Recent Words */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold tracking-tight">Recent Words</h2>
          <Link
            href="/vocab"
            className="text-sm text-primary font-semibold hover:underline underline-offset-4"
          >
            View all →
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border">
            <p className="text-muted text-lg">No words yet.</p>
            <Link
              href="/add"
              className="text-primary hover:underline text-sm font-semibold mt-1 inline-block"
            >
              Add your first word
            </Link>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-border divide-y divide-border overflow-hidden">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/vocab/${entry.id}`}
                className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold w-16 text-center group-hover:text-primary transition-colors">
                    {entry.chinese}
                  </span>
                  <div>
                    <p className="text-sm text-muted">{entry.pinyin}</p>
                    <p className="font-medium">{entry.english}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-muted capitalize">
                  {entry.category}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
