"use client";

import { useState } from "react";
import { useVocab } from "@/context/VocabContext";

const CATEGORIES = ["greetings", "food", "travel", "shopping", "numbers", "daily", "work", "other"];

export default function AddWordPage() {
  const { addEntry } = useVocab();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    chinese: "",
    pinyin: "",
    english: "",
    example: "",
    category: "other",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.chinese.trim() || !form.pinyin.trim() || !form.english.trim()) return;

    addEntry({
      chinese: form.chinese.trim(),
      pinyin: form.pinyin.trim(),
      english: form.english.trim(),
      example: form.example.trim() || undefined,
      category: form.category,
    });

    setForm({ chinese: "", pinyin: "", english: "", example: "", category: "other" });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Add New Word</h1>
        <p className="text-muted text-lg">
          Add a Chinese word or phrase you want to remember.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-primary-light border border-primary/20 rounded-2xl text-primary-dark font-semibold text-center animate-[fadeIn_0.2s_ease-out]">
          ✓ Word added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
        <div>
          <label htmlFor="chinese" className="block text-sm font-bold mb-2 tracking-wide">
            Chinese Characters <span className="text-accent">*</span>
          </label>
          <input
            id="chinese"
            name="chinese"
            type="text"
            value={form.chinese}
            onChange={handleChange}
            placeholder="e.g. 你好"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-xl font-medium placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pinyin" className="block text-sm font-bold mb-2 tracking-wide">
              Pinyin <span className="text-accent">*</span>
            </label>
            <input
              id="pinyin"
              name="pinyin"
              type="text"
              value={form.pinyin}
              onChange={handleChange}
              placeholder="e.g. nǐ hǎo"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label htmlFor="english" className="block text-sm font-bold mb-2 tracking-wide">
              English Meaning <span className="text-accent">*</span>
            </label>
            <input
              id="english"
              name="english"
              type="text"
              value={form.english}
              onChange={handleChange}
              placeholder="e.g. hello"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="example" className="block text-sm font-bold mb-2 tracking-wide">
            Example Sentence <span className="text-xs font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="example"
            name="example"
            value={form.example}
            onChange={handleChange}
            placeholder="e.g. 你好，我叫Brian。"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-bold mb-2 tracking-wide">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
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
          type="submit"
          className="w-full py-3.5 px-6 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-200 text-lg cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          Add Word
        </button>
      </form>
    </div>
  );
}
