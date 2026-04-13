"use client";

import { useState, useMemo, useEffect } from "react";
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

function QuizMode({ entries }: { entries: VocabEntry[] }) {
  const [questions, setQuestions] = useState<{ entry: VocabEntry; options: { text: string; correct: boolean }[] }[]>([]);

  useEffect(() => {
    if (entries.length < 4) { setQuestions([]); return; }
    const shuffled = shuffle(entries).slice(0, 10);
    setQuestions(shuffled.map((entry) => {
      const wrongOptions = shuffle(entries.filter((e) => e.id !== entry.id)).slice(0, 3);
      const options = shuffle([
        { text: entry.english, correct: true },
        ...wrongOptions.map((w) => ({ text: w.english, correct: false })),
      ]);
      return { entry, options };
    }));
  }, [entries]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (entries.length < 4) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">Need at least 4 words for quiz mode.</p>
        <Link href="/add" className="text-primary hover:underline font-semibold mt-2 inline-block">
          Add more words →
        </Link>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center py-16 text-muted"><p className="text-xl font-medium">Loading...</p></div>;
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-extrabold text-primary">{percent}%</span>
        </div>
        <p className="text-2xl font-extrabold mb-2">
          {score === questions.length ? "Perfect!" : score >= questions.length * 0.7 ? "Great job!" : "Keep practicing!"}
        </p>
        <p className="text-muted mb-8">
          You got {score} out of {questions.length} correct.
        </p>
        <button
          onClick={() => { setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); }}
          className="py-3 px-8 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
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
    else { setCurrentQ((c) => c + 1); setSelected(null); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="w-full h-1.5 bg-stone-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-sm text-muted text-center mb-5 font-medium">
        Question {currentQ + 1} of {questions.length}
      </p>

      <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-6">
        <p className="text-5xl font-extrabold mb-2">{q.entry.chinese}</p>
        <p className="text-muted font-medium">{q.entry.pinyin}</p>
      </div>

      <p className="text-sm font-bold text-muted uppercase tracking-widest mb-3">
        What does this mean?
      </p>

      <div className="grid gap-2.5">
        {q.options.map((option, i) => {
          let style = "bg-surface border-border hover:border-primary/30 hover:shadow-sm";
          if (selected !== null) {
            if (option.correct) {
              style = "bg-green-50 border-green-500 text-green-800 shadow-sm";
            } else if (i === selected && !option.correct) {
              style = "bg-red-50 border-red-500 text-red-800 shadow-sm";
            } else {
              style = "bg-surface border-border opacity-40";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border-2 font-semibold transition-all duration-200 cursor-pointer disabled:cursor-default ${style}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full mt-5 py-3 px-4 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          {currentQ + 1 >= questions.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

function WordMatch({ entries }: { entries: VocabEntry[] }) {
  const [rounds, setRounds] = useState<{ target: VocabEntry; options: VocabEntry[] }[]>([]);

  useEffect(() => {
    if (entries.length < 4) { setRounds([]); return; }
    const shuffled = shuffle(entries).slice(0, 10);
    setRounds(shuffled.map((entry) => {
      const distractors = shuffle(entries.filter((e) => e.id !== entry.id)).slice(0, 3);
      const options = shuffle([entry, ...distractors]);
      return { target: entry, options };
    }));
  }, [entries]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (entries.length < 4) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">Need at least 4 words for matching.</p>
        <Link href="/add" className="text-primary hover:underline font-semibold mt-2 inline-block">
          Add more words →
        </Link>
      </div>
    );
  }

  if (rounds.length === 0) {
    return <div className="text-center py-16 text-muted"><p className="text-xl font-medium">Loading...</p></div>;
  }

  if (finished) {
    const percent = Math.round((score / rounds.length) * 100);
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-extrabold text-primary">{percent}%</span>
        </div>
        <p className="text-2xl font-extrabold mb-2">
          {score === rounds.length ? "Perfect!" : score >= rounds.length * 0.7 ? "Great job!" : "Keep practicing!"}
        </p>
        <p className="text-muted mb-8">
          You matched {score} out of {rounds.length} correctly.
        </p>
        <button
          onClick={() => { setCurrent(0); setSelected(null); setScore(0); setFinished(false); }}
          className="py-3 px-8 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          Play Again
        </button>
      </div>
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
    else { setCurrent((c) => c + 1); setSelected(null); }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Progress */}
      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / rounds.length) * 100}%` }}
        />
      </div>
      <p className="text-sm text-muted text-center font-medium">
        Round {current + 1} of {rounds.length}
      </p>

      {/* Prompt */}
      <div className="bg-surface rounded-2xl border border-border p-8 text-center">
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
          Find the Chinese word for
        </p>
        <p className="text-2xl font-extrabold">{round.target.english}</p>
        <p className="text-sm text-muted mt-1">{round.target.pinyin}</p>
      </div>

      {/* Options — show Chinese characters */}
      <div className="grid grid-cols-2 gap-3">
        {round.options.map((option) => {
          let style = "bg-surface border-border hover:border-primary/30 hover:shadow-sm";
          if (selected) {
            if (option.id === round.target.id) {
              style = "bg-green-50 border-green-500 text-green-800 shadow-sm";
            } else if (option.id === selected && option.id !== round.target.id) {
              style = "bg-red-50 border-red-500 text-red-800 shadow-sm";
            } else {
              style = "bg-surface border-border opacity-40";
            }
          }
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={selected !== null}
              className={`p-5 rounded-xl border-2 text-center font-bold transition-all duration-200 cursor-pointer disabled:cursor-default ${style}`}
            >
              <span className="text-3xl block mb-1">{option.chinese}</span>
              {selected && (
                <span className="text-xs text-muted block">{option.english}</span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          {current + 1 >= rounds.length ? "See Results" : "Next →"}
        </button>
      )}
    </div>
  );
}

function ReconstructGame({ entries }: { entries: VocabEntry[] }) {
  const [sentenceEntries, setSentenceEntries] = useState<VocabEntry[]>([]);

  useEffect(() => {
    setSentenceEntries(shuffle(entries.filter((e) => e.example)).slice(0, 10));
  }, [entries]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  if (sentenceEntries.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-xl font-medium">No example sentences available.</p>
        <p className="text-sm mt-2">Add words with example sentences to play.</p>
      </div>
    );
  }

  if (finished) {
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-extrabold text-primary">{percent}%</span>
        </div>
        <p className="text-2xl font-extrabold mb-2">
          {score === total ? "Perfect!" : score >= total * 0.7 ? "Great job!" : "Keep practicing!"}
        </p>
        <p className="text-muted mb-8">
          You reconstructed {score} out of {total} sentences correctly.
        </p>
        <button
          onClick={() => { setIndex(0); setSelected([]); setChecked(false); setScore(0); setTotal(0); setFinished(false); }}
          className="py-3 px-8 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          Play Again
        </button>
      </div>
    );
  }

  const current = sentenceEntries[index];
  const originalChars = current.example!.replace(/[。！？，、]/g, "").split("");
  const [scrambled, setScrambled] = useState<string[]>([]);

  useEffect(() => {
    if (current?.example) {
      const chars = current.example.replace(/[。！？，、]/g, "").split("");
      setScrambled(shuffle([...chars]));
      setSelected([]);
      setChecked(false);
    }
  }, [index, current]);

  const remaining = [...scrambled];
  selected.forEach((char) => {
    const idx = remaining.indexOf(char);
    if (idx !== -1) remaining.splice(idx, 1);
  });

  const isCorrect = selected.join("") === originalChars.join("");

  // Add character from pool to build area
  const handleAdd = (char: string) => {
    if (checked) return;
    const idx = remaining.indexOf(char);
    if (idx !== -1) setSelected((prev) => [...prev, char]);
  };

  // Click a character in build area to send it back to pool
  const handleRemove = (removeIndex: number) => {
    if (checked) return;
    setSelected((prev) => prev.filter((_, i) => i !== removeIndex));
  };

  // Drag-to-reorder in build area
  const handleDragStart = (i: number) => {
    setDragFrom(i);
  };

  const handleDragEnter = (i: number) => {
    setDragOver(i);
  };

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
    if (index + 1 >= sentenceEntries.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected([]);
      setChecked(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Progress */}
      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / sentenceEntries.length) * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted font-medium">
          Sentence {index + 1} of {sentenceEntries.length}
        </p>
        {total > 0 && (
          <p className="text-sm font-bold text-primary">
            Score: {score}/{total}
          </p>
        )}
      </div>

      {/* Prompt */}
      <div className="bg-surface rounded-2xl border border-border p-6 text-center">
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
          Unscramble this sentence
        </p>
        <p className="text-lg font-semibold text-muted">
          The scrambled characters below form a sentence using:
        </p>
        <p className="text-2xl font-extrabold mt-2">{current.chinese}</p>
        <p className="text-sm text-muted mt-1">
          {current.pinyin} — {current.english}
        </p>
      </div>

      {/* Build area — click to remove, drag to reorder */}
      <div className="min-h-[80px] bg-surface rounded-2xl border-2 border-dashed border-border p-4">
        {selected.length === 0 ? (
          <p className="text-muted text-center py-4 font-medium">
            Click characters below to build the sentence. Click here to remove. Drag to reorder.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {selected.map((char, i) => (
              <button
                key={`${char}-${i}`}
                draggable={!checked}
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => handleRemove(i)}
                className={`px-3 py-2 text-xl font-bold rounded-lg transition-all ${
                  checked
                    ? isCorrect
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                    : dragOver === i && dragFrom !== null
                      ? "bg-primary/30 text-primary-dark scale-110"
                      : "bg-primary-light text-primary-dark hover:bg-red-50 hover:text-red-600 cursor-pointer active:scale-95"
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
          className={`p-4 rounded-2xl text-center font-bold ${
            isCorrect
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isCorrect ? "✓ Correct!" : (
            <>
              <p>Not quite. The correct sentence is:</p>
              <p className="text-xl mt-1">{current.example}</p>
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
              className="px-5 py-2.5 rounded-xl font-bold bg-stone-100 text-foreground hover:bg-stone-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
            >
              Clear All
            </button>
            <button
              onClick={handleCheck}
              disabled={remaining.length > 0}
              className="flex-1 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
            >
              Check
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            {index + 1 >= sentenceEntries.length ? "See Results" : "Next Sentence →"}
          </button>
        )}
      </div>

      {!checked && (
        <div>
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Characters</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {remaining.map((char, i) => (
              <button
                key={`${char}-${i}`}
                onClick={() => handleAdd(char)}
                className="px-4 py-2.5 bg-surface border border-border rounded-xl text-xl font-semibold hover:border-primary/40 hover:bg-primary-light/50 transition-all cursor-pointer active:scale-95"
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
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Practice</h1>
        <p className="text-muted text-lg">Test your knowledge with games.</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 justify-center flex-wrap">
        {([
          { id: "quiz" as const, label: "Chinese → English", desc: "See Chinese, pick the meaning" },
          { id: "match" as const, label: "English → Chinese", desc: "See meaning, pick the Chinese" },
          { id: "reconstruct" as const, label: "Reconstruction", desc: "Unscramble sentences" },
        ]).map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setKey((k) => k + 1); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
              mode === m.id
                ? "bg-primary text-white shadow-sm"
                : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover"
            }`}
          >
            <span className="block">{m.label}</span>
            <span className={`text-xs font-medium ${mode === m.id ? "text-white/70" : "text-muted"}`}>
              {m.desc}
            </span>
          </button>
        ))}
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

      {mode === "quiz" && <QuizMode key={`qz-${key}`} entries={filtered} />}
      {mode === "match" && <WordMatch key={`wm-${key}`} entries={filtered} />}
      {mode === "reconstruct" && <ReconstructGame key={`rg-${key}`} entries={filtered} />}
    </div>
  );
}
