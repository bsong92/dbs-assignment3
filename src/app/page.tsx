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
  const masteryPct =
    totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  return (
    <div className="space-y-16">
      {/* Masthead */}
      <header className="relative text-center">
        <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] tracking-tight text-foreground">
          A journal for
          <br />
          <span className="italic text-primary">patient students.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-strong max-w-2xl mx-auto leading-relaxed">
          Collect Chinese words you want to keep. Return to them deliberately.
          Build a vocabulary that stays.
        </p>
        <div className="rule mt-12" />
      </header>

      {/* Statistics — newspaper-style columns */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:divide-x lg:divide-border">
          <Stat label="Total words" value={totalWords} accent="foreground" />
          <Stat
            label="Mastered"
            value={masteredWords}
            suffix={` / ${totalWords}`}
            accent="jade"
          />
          <Stat label="Added today" value={addedToday} accent="primary" />
          <Stat
            label="Categories"
            value={categories.length}
            accent="accent"
          />
        </div>

        {/* Mastery progress — slim elegant bar */}
        {totalWords > 0 && (
          <div className="mt-10">
            <div className="flex items-baseline justify-between mb-2">
              <span className="eyebrow">Mastery</span>
              <span className="font-display text-lg text-muted-strong">
                {masteryPct}%
              </span>
            </div>
            <div className="h-[3px] w-full bg-border overflow-hidden">
              <div
                className="h-full bg-jade transition-all duration-700"
                style={{ width: `${masteryPct}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Two columns of action */}
      <section className="grid md:grid-cols-2 gap-6">
        <ActionCard
          href="/discover"
          eyebrow="Start here"
          title="Discover a word"
          body="Translate between English and Chinese, hear native example sentences, save what you love."
          tone="primary"
        />
        <ActionCard
          href="/review"
          eyebrow="Return often"
          title="Review the deck"
          body="Flashcards shuffled from your collection. Keep the words close."
          tone="ink"
        />
      </section>

      {/* Recent Words */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="eyebrow mb-2">Recent additions</p>
            <h2 className="font-display text-4xl tracking-tight text-foreground">
              Lately in your journal
            </h2>
          </div>
          <Link
            href="/vocab"
            className="text-base font-semibold text-primary hover:text-primary-dark transition-colors underline-offset-4 hover:underline"
          >
            See all →
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div className="py-16 text-center border-t border-b border-border">
            <p className="font-display italic text-xl text-muted-strong">
              The journal is waiting.
            </p>
            <Link
              href="/discover"
              className="inline-block mt-3 text-sm font-medium text-primary hover:text-primary-dark underline-offset-4 hover:underline"
            >
              Add your first word →
            </Link>
          </div>
        ) : (
          <ul className="border-t border-border">
            {recentEntries.map((entry) => (
              <li key={entry.id} className="border-b border-border">
                <Link
                  href={`/vocab/${entry.id}`}
                  className="group flex items-center justify-between gap-6 py-6 transition-colors"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <span className="font-cjk text-4xl sm:text-5xl font-medium text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                      {entry.chinese}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-base text-foreground font-medium truncate">
                        {entry.pinyin}
                      </p>
                      <p className="text-lg font-semibold text-foreground truncate">
                        {entry.english}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 hidden sm:inline text-xs font-bold tracking-[0.18em] uppercase text-foreground">
                    {entry.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent: "foreground" | "primary" | "jade" | "accent";
}) {
  const accentClass = {
    foreground: "text-foreground",
    primary: "text-primary",
    jade: "text-jade",
    accent: "text-accent",
  }[accent];

  return (
    <div className="lg:pl-8 first:lg:pl-0">
      <p
        className={`font-display text-6xl leading-none font-semibold ${accentClass}`}
      >
        {value}
        {suffix && (
          <span className="text-2xl text-muted-strong ml-1 tracking-tight font-normal">
            {suffix}
          </span>
        )}
      </p>
      <p className="eyebrow mt-3 text-muted-strong">{label}</p>
    </div>
  );
}

function ActionCard({
  href,
  eyebrow,
  title,
  body,
  tone,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  tone: "primary" | "ink";
}) {
  // Deep rust for "primary" tone — darker than terracotta but clearly
  // distinct from the near-black ink used by the "ink" tone
  const styles =
    tone === "primary"
      ? "bg-[#7a3a2d] text-surface hover:bg-[#6b3026]"
      : "bg-foreground text-surface hover:bg-muted-strong";

  return (
    <Link
      href={href}
      className={`group relative block p-8 rounded-sm transition-all duration-300 hover:-translate-y-0.5 ${styles}`}
    >
      <p className="text-[0.82rem] font-bold tracking-[0.18em] uppercase text-surface/85 mb-4">
        {eyebrow}
      </p>
      <h3 className="font-display text-3xl sm:text-4xl leading-tight mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-base text-surface/95 leading-relaxed max-w-sm">
        {body}
      </p>
      <span className="absolute top-8 right-8 text-3xl transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
