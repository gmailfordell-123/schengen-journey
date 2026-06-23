import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

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

    // Respect ?next param if it points to a valid internal path
    if (next && next.startsWith("/")) {
      redirect(next);
    }

    // Role-based default redirect
    redirect(profile?.is_admin ? "/admin" : "/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Sign in to your Schengen Journey account.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={login} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
          Register
        </Link>
      </p>
    </div>
  );
}
