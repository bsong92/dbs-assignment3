"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabase } from "@/lib/supabase-client";

export interface VocabEntry {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  example?: string;
  category: string;
  mastered: boolean;
  createdAt: string;
  userId?: string | null;
}

interface DbRow {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  example: string | null;
  category: string;
  mastered: boolean;
  created_at: string;
  user_id: string | null;
}

function fromDb(row: DbRow): VocabEntry {
  return {
    id: row.id,
    chinese: row.chinese,
    pinyin: row.pinyin,
    english: row.english,
    example: row.example ?? undefined,
    category: row.category,
    mastered: row.mastered,
    createdAt: row.created_at,
    userId: row.user_id,
  };
}

interface VocabContextType {
  entries: VocabEntry[];
  loading: boolean;
  addEntry: (
    entry: Omit<VocabEntry, "id" | "mastered" | "createdAt" | "userId">
  ) => Promise<void>;
  updateEntry: (id: string, updates: Partial<VocabEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  toggleMastered: (id: string) => Promise<void>;
  getEntry: (id: string) => VocabEntry | undefined;
}

const VocabContext = createContext<VocabContextType | undefined>(undefined);

export function VocabProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabase();
  const { user, isLoaded } = useUser();
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      setEntries([]);
      return;
    }

    let cancelled = false;
    async function load() {
      // Fetch vocab entries and the user's hidden-entry list in parallel.
      const [vocabResult, hiddenResult] = await Promise.all([
        supabase
          .from("vocab_entries")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("user_hidden_entries").select("entry_id"),
      ]);
      if (cancelled) return;
      if (vocabResult.error) {
        console.error("Failed to load vocab entries:", vocabResult.error);
        setLoading(false);
        return;
      }
      const hiddenIds = new Set<string>(
        (hiddenResult.data ?? []).map(
          (r: { entry_id: string }) => r.entry_id
        )
      );
      const visible = (vocabResult.data as DbRow[])
        .filter((r) => !hiddenIds.has(r.id))
        .map(fromDb);
      setEntries(visible);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, user, isLoaded]);

  const addEntry = useCallback(
    async (
      entry: Omit<VocabEntry, "id" | "mastered" | "createdAt" | "userId">
    ) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("vocab_entries")
        .insert({
          chinese: entry.chinese,
          pinyin: entry.pinyin,
          english: entry.english,
          example: entry.example || null,
          category: entry.category,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) {
        console.error("Failed to add entry:", error);
        return;
      }
      setEntries((prev) => [fromDb(data as DbRow), ...prev]);
    },
    [supabase, user]
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<VocabEntry>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.chinese !== undefined) dbUpdates.chinese = updates.chinese;
      if (updates.pinyin !== undefined) dbUpdates.pinyin = updates.pinyin;
      if (updates.english !== undefined) dbUpdates.english = updates.english;
      if (updates.example !== undefined)
        dbUpdates.example = updates.example || null;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.mastered !== undefined) dbUpdates.mastered = updates.mastered;

      // Use .select() so we can tell whether RLS actually allowed the update.
      // Seed rows (user_id IS NULL) are read-only to all users — RLS silently
      // affects 0 rows, so without this check the UI would fake a successful
      // edit until the next refresh.
      const { data, error } = await supabase
        .from("vocab_entries")
        .update(dbUpdates)
        .eq("id", id)
        .select();
      if (error) {
        console.error("Failed to update entry:", error);
        return;
      }
      if (!data || data.length === 0) {
        // RLS blocked the update — likely a shared seed row.
        console.warn("Cannot modify seed words (they are shared across users).");
        return;
      }
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    [supabase]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      if (!user) return;
      // Figure out whether this is the user's own row or a shared seed row.
      // Shared seed rows (user_id IS NULL) can't actually be deleted under RLS,
      // so we record a per-user "hide" in user_hidden_entries instead. From
      // the user's point of view the word disappears from their lists, but
      // it remains visible to everyone else.
      const entry = entries.find((e) => e.id === id);
      const isSeedRow = !entry?.userId;

      if (isSeedRow) {
        const { error } = await supabase
          .from("user_hidden_entries")
          .insert({ user_id: user.id, entry_id: id });
        if (error) {
          console.error("Failed to hide seed entry:", error);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from("vocab_entries")
          .delete()
          .eq("id", id)
          .select();
        if (error) {
          console.error("Failed to delete entry:", error);
          return;
        }
        if (!data || data.length === 0) {
          console.warn("Delete blocked by RLS — row was not deleted.");
          return;
        }
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [supabase, user, entries]
  );

  const toggleMastered = useCallback(
    async (id: string) => {
      const entry = entries.find((e) => e.id === id);
      if (!entry) return;
      await updateEntry(id, { mastered: !entry.mastered });
    },
    [entries, updateEntry]
  );

  const getEntry = useCallback(
    (id: string) => entries.find((e) => e.id === id),
    [entries]
  );

  return (
    <VocabContext.Provider
      value={{
        entries,
        loading,
        addEntry,
        updateEntry,
        deleteEntry,
        toggleMastered,
        getEntry,
      }}
    >
      {children}
    </VocabContext.Provider>
  );
}

export function useVocab() {
  const context = useContext(VocabContext);
  if (!context) {
    throw new Error("useVocab must be used within a VocabProvider");
  }
  return context;
}
