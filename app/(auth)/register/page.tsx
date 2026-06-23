import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function register(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const firstName = (formData.get("first_name") as string).trim();
    const lastName = (formData.get("last_name") as string).trim();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Passed to the handle_new_user trigger so the profile is pre-filled
        data: { first_name: firstName, last_name: lastName },
      },
    });

    if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Start your Schengen journey today.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={register} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-slate-700">
              First name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              autoComplete="given-name"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-slate-700">
              Last name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              autoComplete="family-name"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
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
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <p className="mt-1 text-xs text-slate-400">Minimum 8 characters</p>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
