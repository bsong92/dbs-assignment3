"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Returns a Supabase client authenticated with the current Clerk session.
 * Passes the Clerk session token via the accessToken callback so that
 * Supabase RLS policies can read auth.jwt() and enforce per-user access.
 */
export function useSupabase() {
  const { session } = useSession();

  return useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      }
    );
  }, [session]);
}
