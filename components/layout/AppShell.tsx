import type { ReactNode } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import type { UserProfile } from "@/lib/supabase/types";

/**
 * Layout shell for authenticated areas (dashboard, admin).
 * Premium navy background with a translucent dark sidebar/header; the page
 * content (white cards) sits on the navy canvas. Accepts the current user's
 * profile so each layout can pass it in after verifying the session.
 */
export function AppShell({
  title,
  nav,
  profile,
  children,
}: {
  title: string;
  nav: NavItem[];
  profile: UserProfile;
  children: ReactNode;
}) {
  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "U";

  const displayName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "Account";

  return (
    <div className="premium-bg relative flex min-h-screen overflow-hidden">
      <div aria-hidden className="premium-grid" />

      {/* Sidebar */}
      <aside
        className="relative z-10 hidden w-64 shrink-0 flex-col border-r md:flex"
        style={{
          background: "rgba(8,20,40,0.72)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <div
          className="flex h-16 items-center gap-2 border-b px-6"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              SJ
            </span>
            {siteConfig.name}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(240,244,255,0.4)" }}>
            {title}
          </p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{ color: "rgba(240,244,255,0.72)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="border-t p-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {displayName}
              </p>
              {profile.is_admin && (
                <p className="text-xs font-medium" style={{ color: "var(--gold-500)" }}>Admin</p>
              )}
            </div>
          </div>
          <form action="/auth/signout" method="POST" className="mt-2">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: "rgba(240,244,255,0.55)" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-16 items-center justify-between border-b px-6"
          style={{
            background: "rgba(8,20,40,0.55)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <div className="flex items-center gap-4">
            {profile.is_admin && (
              <Link
                href={title === "Admin" ? "/dashboard" : "/admin"}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--gold-500)" }}
              >
                {title === "Admin" ? "Customer view" : "Admin panel"}
              </Link>
            )}
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: "rgba(240,244,255,0.6)" }}
            >
              Back to site
            </Link>
          </div>
        </header>
        <main className="animate-page-in flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
