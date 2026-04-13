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
      const { data, error } = await supabase
        .from("vocab_entries")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("Failed to load vocab entries:", error);
      } else {
        setEntries((data as DbRow[]).map(fromDb));
      }
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

      const { error } = await supabase
        .from("vocab_entries")
        .update(dbUpdates)
        .eq("id", id);
      if (error) {
        console.error("Failed to update entry:", error);
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
      const { error } = await supabase
        .from("vocab_entries")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Failed to delete entry:", error);
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [supabase]
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
