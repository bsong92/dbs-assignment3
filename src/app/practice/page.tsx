"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useVocab, VocabEntry } from "@/context/VocabContext";

type Mode = "quiz" | "match" | "reconstruct";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function EmptyState({ message, cta }: { message: string; cta?: boolean }) {
  return (
    <div className="text-center py-20">
      <p className="font-display italic text-2xl text-foreground">{message}</p>
      {cta && (
        <Link
          href="/discover"
          className="inline-block mt-4 text-lg font-semibold text-primary hover:text-primary-dark underline-offset-4 hover:underline"
        >
          Add more words →
        </Link>
      )}
    </div>
  );
}

function ResultCard({
  score,
  total,
  onRetry,
  label,
}: {
  score: number;
  total: number;
  onRetry: () => void;
  label: string;
}) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const message =
    score === total
      ? "Perfect."
      : score >= total * 0.7
      ? "Well done."
      : "Keep going.";
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <p className="eyebrow mb-4">Result</p>
      <p className="font-display text-8xl font-bold text-foreground">
        {percent}%
      </p>
      <p className="font-display italic text-3xl text-foreground mt-4">
        {message}
      </p>
      <p className="text-lg text-foreground mt-3">
        You {label} {score} of {total}.
      </p>
      <button
        onClick={onRetry}
        className="mt-8 py-4 px-10 rounded-sm text-base font-semibold tracking-wide uppercase bg-primary hover:bg-primary-dark text-surface transition-all"
      >
        Try Again
      </button>
    </div>
  );
}

function QuizMode({ entries }: { entries: VocabEntry[] }) {
  const [questions, setQuestions] = useState<
    { entry: VocabEntry; options: { text: string; correct: boolean }[] }[]
  >([]);

  useEffect(() => {
    if (entries.length < 4) {
      setQuestions([]);
      return;
    }
    const shuffled = shuffle(entries).slice(0, 10);
    setQuestions(
      shuffled.map((entry) => {
        const wrongOptions = shuffle(
          entries.filter((e) => e.id !== entry.id)
        ).slice(0, 3);
        const options = shuffle([
          { text: entry.english, correct: true },
          ...wrongOptions.map((w) => ({ text: w.english, correct: false })),
        ]);
        return { entry, options };
      })
    );
  }, [entries]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (entries.length < 4)
    return <EmptyState message="Need at least 4 words for quiz mode." cta />;
  if (questions.length === 0)
    return <EmptyState message="Loading questions…" />;

  if (finished) {
    return (
      <ResultCard
        score={score}
        total={questions.length}
        label="answered"
        onRetry={() => {
          setCurrentQ(0);
          setSelected(null);
          setScore(0);
          setFinished(false);
        }}
      />
    );
  }

  const q = questions[currentQ];
  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (q.options[i].correct) setScore((s) => s + 1);
  };
  const handleNext = () => {
    if (currentQ + 1 >= questions.length) setFinished(true);
    else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="w-full h-[3px] bg-border mb-5 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentQ + 1) / questions.length) * 100}%`,
          }}
        />
      </div>
      <p className="text-center mb-6 text-base font-semibold text-foreground tracking-wide">
        Question {currentQ + 1} of {questions.length}
      </p>

      <div className="bg-surface rounded-sm border-2 border-foreground p-10 text-center mb-8">
        <p className="font-cjk text-6xl sm:text-7xl font-medium text-foreground mb-3">
          {q.entry.chinese}
        </p>
        <p className="font-mono text-lg text-primary">{q.entry.pinyin}</p>
      </div>

      <p className="eyebrow mb-4">What does this mean?</p>

      <div className="grid gap-3">
        {q.options.map((option, i) => {
          let style =
            "bg-surface border-border hover:border-foreground";
          if (selected !== null) {
            if (option.correct) {
              style = "bg-jade-light border-jade text-jade-dark";
            } else if (i === selected && !option.correct) {
              style = "bg-primary-light border-primary text-primary-dark";
            } else {
              style = "bg-surface border-border opacity-40";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-5 rounded-sm border-2 text-lg font-semibold transition-all cursor-pointer disabled:cursor-default ${style}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full mt-6 py-4 px-5 rounded-sm text-base font-semibold tracking-wide uppercase bg-primary hover:bg-primary-dark text-surface transition-all"
        >
          {currentQ + 1 >= questions.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

function WordMatch({ entries }: { entries: VocabEntry[] }) {
  const [rounds, setRounds] = useState<
    { target: VocabEntry; options: VocabEntry[] }[]
  >([]);

  useEffect(() => {
    if (entries.length < 4) {
      setRounds([]);
      return;
    }
    const shuffled = shuffle(entries).slice(0, 10);
    setRounds(
      shuffled.map((entry) => {
        const distractors = shuffle(
          entries.filter((e) => e.id !== entry.id)
        ).slice(0, 3);
        const options = shuffle([entry, ...distractors]);
        return { target: entry, options };
      })
    );
  }, [entries]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (entries.length < 4)
    return <EmptyState message="Need at least 4 words for matching." cta />;
  if (rounds.length === 0) return <EmptyState message="Loading rounds…" />;

  if (finished) {
    return (
      <ResultCard
        score={score}
        total={rounds.length}
        label="matched"
        onRetry={() => {
          setCurrent(0);
          setSelected(null);
          setScore(0);
          setFinished(false);
        }}
      />
    );
  }

  const round = rounds[current];
  const handleSelect = (id: string) => {
    if (selected) return;
    setSelected(id);
    if (id === round.target.id) setScore((s) => s + 1);
  };
  const handleNext = () => {
    if (current + 1 >= rounds.length) setFinished(true);
    else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="w-full h-[3px] bg-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((current + 1) / rounds.length) * 100}%` }}
        />
      </div>
      <p className="text-center text-base font-semibold text-foreground tracking-wide">
        Round {current + 1} of {rounds.length}
      </p>

      <div className="bg-surface rounded-sm border-2 border-foreground p-8 text-center">
        <p className="eyebrow mb-3">Find the Chinese word for</p>
        <p className="font-display italic text-4xl text-foreground">
          {round.target.english}
        </p>
        <p className="font-mono text-lg text-primary mt-2">
          {round.target.pinyin}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {round.options.map((option) => {
          let style = "bg-surface border-border hover:border-foreground";
          if (selected) {
            if (option.id === round.target.id) {
              style = "bg-jade-light border-jade text-jade-dark";
            } else if (option.id === selected && option.id !== round.target.id) {
              style = "bg-primary-light border-primary text-primary-dark";
            } else {
              style = "bg-surface border-border opacity-40";
            }
          }
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={selected !== null}
              className={`p-6 rounded-sm border-2 text-center transition-all cursor-pointer disabled:cursor-default ${style}`}
            >
              <span className="font-cjk text-4xl block mb-1 font-medium">
                {option.chinese}
              </span>
              {selected && (
                <span className="text-sm text-foreground block mt-2">
                  {option.english}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-sm text-base font-semibold tracking-wide uppercase bg-primary hover:bg-primary-dark text-surface transition-all"
        >
          {current + 1 >= rounds.length ? "See Results" : "Next →"}
        </button>
      )}
    </div>
  );
}

function ReconstructGame({ entries }: { entries: VocabEntry[] }) {
  // ALL hooks must be called unconditionally at the top of the component
  const [sentenceEntries, setSentenceEntries] = useState<VocabEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [scrambled, setScrambled] = useState<string[]>([]);

  useEffect(() => {
    setSentenceEntries(shuffle(entries.filter((e) => e.example)).slice(0, 10));
  }, [entries]);

  const current: VocabEntry | undefined = sentenceEntries[index];

  // Re-scramble when we move to a new sentence
  useEffect(() => {
    if (current?.example) {
      const chars = current.example.replace(/[。！？，、]/g, "").split("");
      setScrambled(shuffle([...chars]));
      setSelected([]);
      setChecked(false);
    }
  }, [index, current]);

  if (sentenceEntries.length === 0)
    return <EmptyState message="No example sentences available." />;

  if (finished) {
    return (
      <ResultCard
        score={score}
        total={total}
        label="reconstructed"
        onRetry={() => {
          setIndex(0);
          setSelected([]);
          setChecked(false);
          setScore(0);
          setTotal(0);
          setFinished(false);
        }}
      />
    );
  }

  if (!current) return <EmptyState message="Loading sentence…" />;

  const originalChars = (current.example ?? "")
    .replace(/[。！？，、]/g, "")
    .split("");

  const remaining = [...scrambled];
  selected.forEach((char) => {
    const idx = remaining.indexOf(char);
    if (idx !== -1) remaining.splice(idx, 1);
  });

  const isCorrect = selected.join("") === originalChars.join("");

  const handleAdd = (char: string) => {
    if (checked) return;
    const idx = remaining.indexOf(char);
    if (idx !== -1) setSelected((prev) => [...prev, char]);
  };

  const handleRemove = (removeIndex: number) => {
    if (checked) return;
    setSelected((prev) => prev.filter((_, i) => i !== removeIndex));
  };

  const handleDragStart = (i: number) => setDragFrom(i);
  const handleDragEnter = (i: number) => setDragOver(i);
  const handleDragEnd = () => {
    if (dragFrom !== null && dragOver !== null && dragFrom !== dragOver) {
      setSelected((prev) => {
        const arr = [...prev];
        const [moved] = arr.splice(dragFrom, 1);
        arr.splice(dragOver, 0, moved);
        return arr;
      });
    }
    setDragFrom(null);
    setDragOver(null);
  };

  const handleCheck = () => {
    setChecked(true);
    setTotal((t) => t + 1);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= sentenceEntries.length) setFinished(true);
    else {
      setIndex((i) => i + 1);
      setSelected([]);
      setChecked(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="w-full h-[3px] bg-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((index + 1) / sentenceEntries.length) * 100}%`,
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-foreground tracking-wide">
          Sentence {index + 1} of {sentenceEntries.length}
        </p>
        {total > 0 && (
          <p className="text-base font-bold text-primary">
            Score: {score}/{total}
          </p>
        )}
      </div>

      <div className="bg-surface rounded-sm border-2 border-foreground p-7 text-center">
        <p className="eyebrow mb-3">Unscramble this sentence</p>
        <p className="text-lg text-foreground">Using the word:</p>
        <p className="font-cjk text-4xl font-medium text-foreground mt-3">
          {current.chinese}
        </p>
        <p className="font-mono text-base text-primary mt-2">
          {current.pinyin} — {current.english}
        </p>
      </div>

      <div className="min-h-[90px] bg-surface rounded-sm border-2 border-dashed border-border p-4">
        {selected.length === 0 ? (
          <p className="text-foreground text-center py-4 text-base">
            Click characters below to build the sentence. Click to remove.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {selected.map((char, i) => (
              <button
                key={`${char}-${i}`}
                draggable={!checked}
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => handleRemove(i)}
                className={`px-4 py-2.5 font-cjk text-2xl font-medium rounded-sm transition-all ${
                  checked
                    ? isCorrect
                      ? "bg-jade-light text-jade-dark"
                      : "bg-primary-light text-primary-dark"
                    : dragOver === i && dragFrom !== null
                    ? "bg-primary/30 text-primary-dark scale-110"
                    : "bg-primary-light text-primary-dark hover:bg-primary/20 cursor-pointer"
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        )}
      </div>

      {checked && (
        <div
          className={`p-5 rounded-sm text-center text-lg font-semibold ${
            isCorrect
              ? "bg-jade-light text-jade-dark border border-jade"
              : "bg-primary-light text-primary-dark border border-primary"
          }`}
        >
          {isCorrect ? (
            "✓ Correct!"
          ) : (
            <>
              <p>Not quite. The correct sentence is:</p>
              <p className="font-cjk text-2xl mt-2">{current.example}</p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!checked ? (
          <>
            <button
              onClick={() => setSelected([])}
              disabled={selected.length === 0}
              className="px-6 py-3 rounded-sm text-base font-semibold tracking-wide uppercase bg-surface border border-border text-foreground hover:border-border-hover transition-all disabled:opacity-30"
            >
              Clear
            </button>
            <button
              onClick={handleCheck}
              disabled={remaining.length > 0}
              className="flex-1 py-3 rounded-sm text-base font-semibold tracking-wide uppercase bg-primary hover:bg-primary-dark text-surface transition-all disabled:opacity-30"
            >
              Check
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-sm text-base font-semibold tracking-wide uppercase bg-primary hover:bg-primary-dark text-surface transition-all"
          >
            {index + 1 >= sentenceEntries.length ? "See Results" : "Next →"}
          </button>
        )}
      </div>

      {!checked && (
        <div>
          <label className="eyebrow block mb-4">Characters</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {remaining.map((char, i) => (
              <button
                key={`${char}-${i}`}
                onClick={() => handleAdd(char)}
                className="px-5 py-3 bg-surface border-2 border-border rounded-sm font-cjk text-2xl font-medium text-foreground hover:border-foreground transition-all cursor-pointer"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  const { entries } = useVocab();
  const [mode, setMode] = useState<Mode>("quiz");
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

  const modes = [
    {
      id: "quiz" as const,
      label: "Chinese → English",
      desc: "See Chinese, pick the meaning",
    },
    {
      id: "match" as const,
      label: "English → Chinese",
      desc: "See meaning, pick the Chinese",
    },
    {
      id: "reconstruct" as const,
      label: "Reconstruction",
      desc: "Unscramble sentences",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Masthead */}
      <header className="text-center">
        <p className="eyebrow mb-3">Games</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          Practice
        </h1>
        <p className="mt-4 text-lg text-foreground max-w-xl mx-auto">
          Test your knowledge. Ten rounds at a time.
        </p>
      </header>

      <div className="rule" />

      {/* Mode toggle */}
      <div>
        <label className="eyebrow block mb-4 text-center">Mode</label>
        <div className="grid sm:grid-cols-3 gap-3">
          {modes.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  setKey((k) => k + 1);
                }}
                className={`p-5 rounded-sm text-left transition-all ${
                  active
                    ? "bg-foreground text-surface"
                    : "bg-surface border border-border text-foreground hover:border-border-hover"
                }`}
              >
                <p className="font-display text-lg font-semibold leading-tight">
                  {m.label}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    active ? "text-surface/80" : "text-foreground"
                  }`}
                >
                  {m.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

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

      {mode === "quiz" && <QuizMode key={`qz-${key}`} entries={filtered} />}
      {mode === "match" && <WordMatch key={`wm-${key}`} entries={filtered} />}
      {mode === "reconstruct" && (
        <ReconstructGame key={`rg-${key}`} entries={filtered} />
      )}
    </div>
  );
}
