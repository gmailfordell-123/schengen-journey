/**
 * Server-side auth helpers.
 * All functions are async and must be called from Server Components,
 * Server Actions, or Route Handlers only — never from Client Components.
 */
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/supabase/types";

/** Returns the authenticated Supabase user, or null. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the user_profiles row for the authenticated user, or null.
 * Uses the anon client (respects RLS — users can only read their own row).
 */
export async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

/**
 * Asserts the request is authenticated.
 * Redirects to /login (with ?next=<current path>) if not.
 * Returns the user profile on success.
 */
export async function requireAuth(next?: string): Promise<UserProfile> {
  const profile = await getProfile();
  if (!profile) {
    const path = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
    redirect(path);
  }
  return profile;
}

/**
 * Asserts the request is authenticated AND the user is an admin.
 * Redirects to /dashboard if authenticated but not admin.
 * Redirects to /login if not authenticated at all.
 */
export async function requireAdmin(): Promise<UserProfile> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (!profile.is_admin) redirect("/dashboard");
  return profile;
}

/**
 * Returns is_admin for a given user ID using the service-role client
 * (bypasses RLS). Used in middleware where we need to check role
 * without a full session context.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", userId)
    .single<{ is_admin: boolean }>();
  return data?.is_admin === true;
}
