"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabase } from "@/lib/supabase-client";

export default function TestAuthPage() {
  const { user, isLoaded } = useUser();
  const supabase = useSupabase();
  const [status, setStatus] = useState<string>("");
  const [rows, setRows] = useState<unknown[]>([]);

  async function insertTestRow() {
    if (!user) return;
    setStatus("Inserting...");
    const { data, error } = await supabase
      .from("vocab_entries")
      .insert({
        chinese: "测试",
        pinyin: "cè shì",
        english: "test",
        example: "这是一个测试。",
        category: "other",
        user_id: user.id,
      })
      .select();
    if (error) {
      setStatus(`❌ Error: ${error.message}`);
    } else {
      setStatus(`✅ Inserted! ID: ${(data?.[0] as { id: string })?.id}`);
    }
  }

  async function fetchMyRows() {
    if (!user) return;
    setStatus("Fetching...");
    const { data, error } = await supabase
      .from("vocab_entries")
      .select("id, chinese, english, user_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setStatus(`❌ Error: ${error.message}`);
    } else {
      setRows(data ?? []);
      setStatus(`✅ Fetched ${data?.length ?? 0} rows owned by you`);
    }
  }

  if (!isLoaded) return <p>Loading...</p>;
  if (!user) return <p>Please sign in first.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Clerk ↔ Supabase Auth Test</h1>

      <div className="rounded-2xl border border-border p-5 space-y-2">
        <p className="text-sm text-muted">Your Clerk User ID:</p>
        <code className="block text-sm font-mono bg-stone-100 p-2 rounded">{user.id}</code>
        <p className="text-sm text-muted mt-3">Email:</p>
        <code className="block text-sm font-mono bg-stone-100 p-2 rounded">
          {user.primaryEmailAddress?.emailAddress ?? "(no email)"}
        </code>
      </div>

      <div className="flex gap-3">
        <button
          onClick={insertTestRow}
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-green-700"
        >
          Insert Test Row
        </button>
        <button
          onClick={fetchMyRows}
          className="px-4 py-2 rounded-lg bg-stone-200 text-foreground font-medium hover:bg-stone-300"
        >
          Fetch My Rows
        </button>
      </div>

      {status && (
        <div className="rounded-2xl border border-border p-4 font-mono text-sm">
          {status}
        </div>
      )}

      {rows.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-100">
              <tr>
                <th className="text-left p-3">Chinese</th>
                <th className="text-left p-3">English</th>
                <th className="text-left p-3 font-mono text-xs">user_id</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const row = r as { id: string; chinese: string; english: string; user_id: string };
                return (
                  <tr key={row.id} className="border-t border-border">
                    <td className="p-3">{row.chinese}</td>
                    <td className="p-3">{row.english}</td>
                    <td className="p-3 font-mono text-xs text-muted">{row.user_id}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
