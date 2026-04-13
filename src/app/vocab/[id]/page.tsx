"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVocab } from "@/context/VocabContext";

export default function VocabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getEntry, toggleMastered, deleteEntry } = useVocab();
  const router = useRouter();
  const entry = getEntry(id);

  if (!entry) {
    return (
      <div className="text-center py-24">
        <p className="text-3xl font-extrabold mb-3">Word not found</p>
        <p className="text-muted mb-6">This word may have been deleted.</p>
        <Link
          href="/vocab"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all"
        >
          ← Back to vocabulary
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.push("/vocab");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/vocab"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-foreground transition-colors mb-8 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        Back to vocabulary
      </Link>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {/* Big character display */}
        <div className="bg-gradient-to-br from-primary-light to-stone-50 p-10 text-center">
          <p className="text-7xl font-extrabold mb-3 text-foreground">{entry.chinese}</p>
          <p className="text-xl text-muted font-medium">{entry.pinyin}</p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1.5">
              Meaning
            </p>
            <p className="text-xl font-medium">{entry.english}</p>
          </div>

          {entry.example && (
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1.5">
                Example
              </p>
              <p className="text-lg text-foreground/80 italic">&ldquo;{entry.example}&rdquo;</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1.5">
                Category
              </p>
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-stone-100 text-muted capitalize">
                {entry.category}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1.5">
                Status
              </p>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                entry.mastered
                  ? "bg-primary-light text-primary-dark"
                  : "bg-accent-light text-accent"
              }`}>
                {entry.mastered ? "✓ Mastered" : "Learning"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={() => toggleMastered(entry.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                entry.mastered
                  ? "bg-stone-100 text-foreground hover:bg-stone-200"
                  : "bg-primary hover:bg-primary-dark text-white hover:shadow-lg hover:shadow-primary/20"
              }`}
            >
              {entry.mastered ? "Unmark Mastered" : "Mark as Mastered"}
            </button>
            <button
              onClick={handleDelete}
              className="py-3 px-5 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer active:scale-[0.98]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
