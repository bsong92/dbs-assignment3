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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Discover Words
        </h1>
        <p className="text-muted text-lg">
          Type an English or Chinese word. Get the translation, pinyin with
          tones, and real example sentences.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. hello, 歌手, happiness, 茶"
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-lg placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Translate"}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-sm text-muted mb-1">
              You searched for{" "}
              <span className="text-xs bg-stone-200 px-2 py-0.5 rounded-full ml-1">
                {result.direction === "en-zh"
                  ? "English → Chinese"
                  : "Chinese → English"}
              </span>
            </p>
            <p className="text-xl font-bold">{result.query}</p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              Chinese Characters
            </label>
            <input
              type="text"
              value={chineseValue}
              onChange={(e) => setChineseValue(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              English Meaning
            </label>
            <input
              type="text"
              value={englishValue}
              onChange={(e) => setEnglishValue(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {result.alternatives.length > 1 && result.direction === "zh-en" && (
              <div className="mt-3">
                <p className="text-xs text-muted mb-2">Alternatives from API:</p>
                <div className="flex flex-wrap gap-2">
                  {result.alternatives.map((alt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEnglishValue(alt)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        englishValue === alt
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border hover:bg-stone-100"
                      }`}
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {result.alternatives.length > 1 && result.direction === "en-zh" && (
              <div className="mt-3">
                <p className="text-xs text-muted mb-2">
                  Alternative Chinese translations:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.alternatives.map((alt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setChineseValue(alt)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        chineseValue === alt
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border hover:bg-stone-100"
                      }`}
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              Pinyin (auto-generated with tones)
            </label>
            <input
              type="text"
              value={pinyinValue}
              onChange={(e) => setPinyinValue(e.target.value)}
              placeholder="e.g. nǐ hǎo"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <p className="text-xs text-muted mt-1">
              Generated from pinyin-pro. Edit if needed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              Example Sentences{" "}
              <span className="text-xs font-normal text-muted">
                (from Tatoeba)
              </span>
            </label>
            {examplesLoading && (
              <p className="text-sm text-muted">Loading examples...</p>
            )}
            {!examplesLoading && examples.length === 0 && (
              <p className="text-sm text-muted">
                No example sentences found. You can write your own below.
              </p>
            )}
            {examples.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {examples.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setExample(s.chinese)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      example === s.chinese
                        ? "border-primary bg-primary-light"
                        : "border-border bg-background hover:bg-stone-100"
                    }`}
                  >
                    <p className="text-base font-medium">{s.chinese}</p>
                    {s.english && (
                      <p className="text-sm text-muted mt-1">{s.english}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              Selected Example{" "}
              <span className="text-xs font-normal text-muted">(optional)</span>
            </label>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              rows={2}
              placeholder="Click an example above, or write your own"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

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
            className="w-full py-3.5 px-6 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-200 text-lg cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved
              ? "✓ Saved to your vocabulary"
              : saving
              ? "Saving..."
              : "Save to My Vocabulary"}
          </button>
        </div>
      )}
    </div>
  );
}
