/**
 * Server-side Supabase client.
 * Use in Server Components, Route Handlers, and Server Actions.
 * Reads/writes cookies through Next.js headers() so the session is
 * automatically forwarded from the browser.
 */
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll called from a Server Component — cookies are read-only.
            // The middleware below handles session refresh instead.
          }
        },
      },
    }
  );
}

/**
 * Admin client using the service role key.
 * Bypasses RLS — only use in trusted server-side code (e.g. admin actions).
 * Never expose to the browser.
 *
 * This is a sessionless client: it does NOT read cookies. If it did, the
 * @supabase/ssr layer would hydrate the *caller's* user session and PostgREST
 * would send the user's access token as the bearer — re-enabling RLS and
 * tripping the recursive user_profiles policy ("infinite recursion", 42P17).
 * By using the bare service-role client, the service-role key is always the
 * bearer, so RLS is reliably bypassed for trusted, already-authorized reads.
 */
export async function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
