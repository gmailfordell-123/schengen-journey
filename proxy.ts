/**
 * Next.js proxy (formerly "middleware") — refreshes the Supabase session on
 * every request and enforces route protection + role-based access control.
 *
 * Rules:
 *  /dashboard/*  → must be authenticated (any role)
 *  /admin/*      → must be authenticated + is_admin = true
 *  /login        → redirect to /dashboard if already logged in
 *  /register     → redirect to /dashboard if already logged in
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const ADMIN_PREFIX     = "/admin";
const DASHBOARD_PREFIX = "/dashboard";
const AUTH_PAGES       = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Anon client — used to refresh the session cookie
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Always refresh the session — required by @supabase/ssr
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Redirect logged-in users away from auth pages ──────────────────────────
  if (user && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Dashboard: must be authenticated ───────────────────────────────────────
  if (pathname.startsWith(DASHBOARD_PREFIX) && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // ── Admin: must be authenticated + admin role ───────────────────────────────
  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Use service-role client to bypass RLS and read is_admin.
    // Return NO cookies so @supabase/ssr does not hydrate the user session —
    // otherwise PostgREST would use the user's token (RLS on) and trip the
    // recursive user_profiles policy. With no session, the service-role key
    // stays the bearer and RLS is reliably bypassed.
    const adminSupabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );

    const { data: profile } = await adminSupabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single<{ is_admin: boolean }>();

    if (!profile?.is_admin) {
      // Authenticated but not admin — send to their dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
