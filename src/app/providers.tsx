"use client";

import { VocabProvider } from "@/context/VocabContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <VocabProvider>{children}</VocabProvider>;
}
