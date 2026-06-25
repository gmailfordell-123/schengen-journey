import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RegisterForm } from "@/components/auth/RegisterForm";

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

  return <RegisterForm action={register} error={error} />;
}
