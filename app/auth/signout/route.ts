import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST only — GET would allow CSRF via <img src="/auth/signout">
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
