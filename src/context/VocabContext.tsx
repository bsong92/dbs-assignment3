"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { SEED_DATA } from "./seedData";

export interface VocabEntry {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  example?: string;
  category: string;
  mastered: boolean;
  createdAt: string;
}

interface VocabContextType {
  entries: VocabEntry[];
  addEntry: (entry: Omit<VocabEntry, "id" | "mastered" | "createdAt">) => void;
  updateEntry: (id: string, updates: Partial<VocabEntry>) => void;
  deleteEntry: (id: string) => void;
  toggleMastered: (id: string) => void;
  getEntry: (id: string) => VocabEntry | undefined;
}

const VocabContext = createContext<VocabContextType | undefined>(undefined);

export function VocabProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<VocabEntry[]>(SEED_DATA);

  const addEntry = (entry: Omit<VocabEntry, "id" | "mastered" | "createdAt">) => {
    const newEntry: VocabEntry = {
      ...entry,
      id: Date.now().toString(),
      mastered: false,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<VocabEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleMastered = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, mastered: !e.mastered } : e))
    );
  };

  const getEntry = (id: string) => entries.find((e) => e.id === id);

  return (
    <VocabContext.Provider
      value={{ entries, addEntry, updateEntry, deleteEntry, toggleMastered, getEntry }}
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
