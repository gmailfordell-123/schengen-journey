import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  async function login(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (authError || !data.user) {
      redirect(`/login?error=${encodeURIComponent(authError?.message ?? "Login failed")}`);
    }

    // Check role using service-role client (bypasses RLS)
    const adminClient = await createAdminClient();
    const { data: profile } = await adminClient
      .from("user_profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single<{ is_admin: boolean }>();

    // Respect ?next only for safe internal paths — block open-redirect attacks
    // (e.g. //evil.com or /\evil.com would bypass a simple startsWith("/") check)
    const SAFE_PREFIXES = ["/dashboard", "/admin", "/book", "/plan", "/pricing"];
    const isSafeNext = next && /^\/[a-zA-Z0-9/_-]/.test(next) && SAFE_PREFIXES.some((p) => next.startsWith(p));
    if (isSafeNext) {
      redirect(next!);
    }

    // Role-based default redirect
    redirect(profile?.is_admin ? "/admin" : "/dashboard");
  }

  return <LoginForm action={login} error={error} nextPath={next} />;
}
