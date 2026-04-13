import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Returns a Supabase client authenticated with the current Clerk session
 * on the server. Passes the Clerk session token via the accessToken callback
 * so that Supabase RLS policies can read auth.jwt() and enforce per-user access.
 */
export async function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      async accessToken() {
        const { getToken } = await auth();
        return (await getToken()) ?? null;
      },
    }
  );
}
