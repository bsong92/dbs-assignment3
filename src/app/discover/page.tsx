"use client";

import { useState, useEffect } from "react";
import { pinyin } from "pinyin-pro";
import { useVocab } from "@/context/VocabContext";

const CATEGORIES = [
  "greetings",
  "food",
  "travel",
  "shopping",
  "numbers",
  "daily",
  "work",
  "other",
];

interface TranslateResult {
  query: string;
  direction: "en-zh" | "zh-en";
  translation: string;
  alternatives: string[];
}

interface ExampleSentence {
  chinese: string;
  english: string;
}

// Detect if a string contains Chinese (CJK) characters
function containsChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

export default function DiscoverPage() {
  const { addEntry } = useVocab();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranslateResult | null>(null);

  // Example sentences from Tatoeba
  const [examples, setExamples] = useState<ExampleSentence[]>([]);
  const [examplesLoading, setExamplesLoading] = useState(false);

  // Save form state — stored in canonical "chinese + english" form regardless of search direction
  const [chineseValue, setChineseValue] = useState("");
  const [englishValue, setEnglishValue] = useState("");
  const [pinyinValue, setPinyinValue] = useState("");
  const [example, setExample] = useState("");
  const [category, setCategory] = useState("other");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto-generate pinyin whenever Chinese characters change
  useEffect(() => {
    if (chineseValue.trim()) {
      const generated = pinyin(chineseValue, { toneType: "symbol" });
      setPinyinValue(generated);
    } else {
      setPinyinValue("");
    }
  }, [chineseValue]);

  // Fetch example sentences when chineseValue changes
  useEffect(() => {
    if (!chineseValue.trim()) {
      setExamples([]);
      return;
    }
    let cancelled = false;
    async function loadExamples() {
      setExamplesLoading(true);
      try {
        const res = await fetch(
          `/api/examples?q=${encodeURIComponent(chineseValue.trim())}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setExamples(data.sentences ?? []);
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setExamplesLoading(false);
      }
    }
    const t = setTimeout(loadExamples, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [chineseValue]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    const trimmed = query.trim();
    const direction: "zh-en" | "en-zh" = containsChinese(trimmed)
      ? "zh-en"
      : "en-zh";

    try {
      const res = await fetch(
        `/api/translate?q=${encodeURIComponent(trimmed)}&dir=${direction}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const data: TranslateResult = await res.json();
      setResult(data);

      // Populate save form based on which direction we translated
      if (direction === "en-zh") {
        // English → Chinese
        setEnglishValue(data.query);
        setChineseValue(data.translation);
      } else {
        // Chinese → English
        setChineseValue(data.query);
        setEnglishValue(data.translation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (
      !chineseValue.trim() ||
      !englishValue.trim() ||
      !pinyinValue.trim() ||
      !result
    )
      return;
    setSaving(true);
    await addEntry({
      chinese: chineseValue.trim(),
      pinyin: pinyinValue.trim(),
      english: englishValue.trim(),
      example: example.trim() || undefined,
      category,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setQuery("");
      setResult(null);
      setChineseValue("");
      setEnglishValue("");
      setPinyinValue("");
      setExample("");
      setCategory("other");
      setExamples([]);
      setSaved(false);
    }, 1500);
  }

  const inputFieldClass =
    "w-full px-4 py-3 rounded-sm border border-border bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary transition-colors";
  const labelClass = "eyebrow block mb-2";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Masthead */}
      <header className="mb-12">
        <p className="eyebrow mb-3">Reference &middot; Dictionary</p>
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-tight">
          Discover <span className="italic text-primary">a new word.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-strong max-w-xl leading-relaxed">
          Type in either direction. See the translation, pinyin with tones, and
          real example sentences from native speakers.
        </p>
      </header>

      {/* Search — editorial, typographic */}
      <form
        onSubmit={handleSearch}
        className="border-t border-b border-border py-6 mb-8"
      >
        <label className="eyebrow block mb-3">Look up</label>
        <div className="flex gap-3 items-stretch">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="hello &middot; 歌手 &middot; happiness &middot; 茶"
            className="flex-1 px-0 py-2 bg-transparent text-2xl font-display border-0 border-b-2 border-border focus:border-foreground focus:outline-none transition-colors placeholder:text-muted/50 placeholder:italic"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="shrink-0 px-6 py-2 bg-foreground text-surface text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-muted-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Searching…" : "Translate"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-8 p-5 border-l-2 border-primary bg-primary-light/40">
          <p className="eyebrow text-primary mb-1">Error</p>
          <p className="text-muted-strong">{error}</p>
        </div>
      )}

      {result && (
        <article className="space-y-10">
          {/* Hero word — centered, like a dictionary entry */}
          <div className="text-center py-10 border-t-2 border-b border-foreground">
            <p className="eyebrow mb-5">
              {result.direction === "en-zh"
                ? "English → Chinese"
                : "Chinese → English"}
            </p>
            <p className="font-cjk text-[clamp(3rem,10vw,5.5rem)] leading-none font-medium text-foreground tracking-normal">
              {chineseValue || "—"}
            </p>
            <p className="font-mono text-lg text-primary mt-5">
              {pinyinValue || "—"}
            </p>
            <p className="font-display italic text-xl text-muted-strong mt-2">
              {englishValue || "—"}
            </p>
          </div>

          {/* Form fields — editable */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Chinese</label>
              <input
                type="text"
                value={chineseValue}
                onChange={(e) => setChineseValue(e.target.value)}
                className={`${inputFieldClass} font-cjk text-xl`}
              />
            </div>
            <div>
              <label className={labelClass}>English</label>
              <input
                type="text"
                value={englishValue}
                onChange={(e) => setEnglishValue(e.target.value)}
                className={inputFieldClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Pinyin <span className="normal-case tracking-normal text-muted">— auto-generated</span>
            </label>
            <input
              type="text"
              value={pinyinValue}
              onChange={(e) => setPinyinValue(e.target.value)}
              placeholder="nǐ hǎo"
              className={`${inputFieldClass} font-mono`}
            />
          </div>

          {/* Alternatives */}
          {result.alternatives.length > 1 && (
            <div>
              <label className={labelClass}>
                {result.direction === "zh-en"
                  ? "Other English translations"
                  : "Other Chinese translations"}
              </label>
              <div className="flex flex-wrap gap-2">
                {result.alternatives.map((alt, i) => {
                  const isEnglish = result.direction === "zh-en";
                  const selected = isEnglish
                    ? englishValue === alt
                    : chineseValue === alt;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        isEnglish ? setEnglishValue(alt) : setChineseValue(alt)
                      }
                      className={`px-3 py-1.5 rounded-sm text-sm border transition-colors ${
                        isEnglish ? "" : "font-cjk text-base"
                      } ${
                        selected
                          ? "bg-foreground text-surface border-foreground"
                          : "bg-surface border-border hover:border-border-hover text-muted-strong"
                      }`}
                    >
                      {alt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tatoeba examples — like a citations section */}
          <div>
            <label className={labelClass}>
              Example sentences{" "}
              <span className="normal-case tracking-normal text-muted">
                — from Tatoeba
              </span>
            </label>
            {examplesLoading && (
              <p className="italic text-muted font-display">Gathering sentences…</p>
            )}
            {!examplesLoading && examples.length === 0 && (
              <p className="italic text-muted font-display">
                No example sentences available. Write your own below.
              </p>
            )}
            {examples.length > 0 && (
              <ol className="space-y-0 max-h-80 overflow-y-auto border-y border-border">
                {examples.map((s, i) => {
                  const selected = example === s.chinese;
                  return (
                    <li
                      key={i}
                      className="border-b border-border last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => setExample(s.chinese)}
                        className={`w-full text-left px-4 py-4 transition-colors flex gap-4 items-baseline ${
                          selected
                            ? "bg-primary-light"
                            : "hover:bg-surface"
                        }`}
                      >
                        <span className="font-display text-xs text-muted shrink-0 w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-cjk text-lg leading-snug text-foreground">
                            {s.chinese}
                          </p>
                          {s.english && (
                            <p className="text-sm text-muted-strong italic mt-1 font-display leading-snug">
                              {s.english}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Example + category */}
          <div className="grid sm:grid-cols-[2fr_1fr] gap-6">
            <div>
              <label className={labelClass}>Selected example</label>
              <textarea
                value={example}
                onChange={(e) => setExample(e.target.value)}
                rows={2}
                placeholder="Click an example above, or write your own"
                className={`${inputFieldClass} font-cjk text-base resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputFieldClass}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rule" />

          <button
            type="button"
            onClick={handleSave}
            disabled={
              !chineseValue.trim() ||
              !englishValue.trim() ||
              !pinyinValue.trim() ||
              saving ||
              saved
            }
            className={`w-full py-4 px-6 text-base font-semibold tracking-wide uppercase rounded-sm transition-all duration-200 ${
              saved
                ? "bg-jade text-surface"
                : "bg-primary hover:bg-primary-dark text-surface"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {saved
              ? "✓ Saved to your journal"
              : saving
              ? "Saving…"
              : "Save to my journal"}
          </button>
        </article>
      )}
    </div>
  );
}
