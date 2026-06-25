"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import type { UserProfile } from "@/lib/supabase/types";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "U";

  const displayName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Account";

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <div className="premium-bg relative flex min-h-screen overflow-hidden">
      <div aria-hidden className="premium-grid" />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass-sidebar relative z-10 hidden w-64 shrink-0 flex-col border-r md:flex"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div
          className="flex h-16 items-center gap-2 border-b px-6"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white group"
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="bg-brand-600 inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
            >
              SJ
            </motion.span>
            {siteConfig.name}
          </Link>
        </div>

        {/* Nav items with stagger */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "rgba(240,244,255,0.4)" }}>
            {title}
          </p>
          {nav.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ x: -12 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={item.href}
                className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/8 hover:text-white"
                style={{ color: "rgba(240,244,255,0.72)" }}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User + sign out */}
        <motion.div
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="border-t p-4"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-brand-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            >
              {initials}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              {profile.is_admin && (
                <p className="text-gold-500 text-xs font-medium">Admin</p>
              )}
            </div>
          </div>
          <form action="/auth/signout" method="POST" className="mt-2">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 hover:bg-white/5 hover:text-white"
              style={{ color: "rgba(240,244,255,0.55)" }}
            >
              Sign out
            </button>
          </form>
        </motion.div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="app-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 md:hidden"
              style={{ background: "rgba(4,12,26,0.6)", backdropFilter: "blur(2px)" }}
            />
            <motion.aside
              key="app-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="glass-sidebar fixed left-0 top-0 z-50 flex h-[100dvh] w-[78vw] max-w-xs flex-col md:hidden"
              style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}
            >
              {/* Drawer header */}
              <div
                className="flex h-16 shrink-0 items-center justify-between border-b px-5"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white">
                  <span
                    className="bg-brand-600 inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                  >
                    SJ
                  </span>
                  {siteConfig.name}
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: "rgba(240,244,255,0.9)" }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(240,244,255,0.4)" }}>
                  {title}
                </p>
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/8 hover:text-white"
                    style={{ color: "rgba(240,244,255,0.72)" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Drawer user + sign out */}
              <div className="border-t p-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <div
                    className="bg-brand-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{displayName}</p>
                    {profile.is_admin && (
                      <p className="text-gold-500 text-xs font-medium">Admin</p>
                    )}
                  </div>
                </div>
                <form action="/auth/signout" method="POST" className="mt-2">
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:bg-white/5 hover:text-white"
                    style={{ color: "rgba(240,244,255,0.55)" }}
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header
          className="glass-navbar flex h-16 items-center justify-between gap-3 border-b px-4 sm:px-6"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/10 md:hidden"
              style={{ color: "rgba(240,244,255,0.9)" }}
            >
              <Menu size={22} />
            </button>
            <h1 className="truncate text-lg font-semibold text-white">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {profile.is_admin && (
              <Link
                href={title === "Admin" ? "/dashboard" : "/admin"}
                className="text-gold-500 text-sm font-medium transition-colors hover:opacity-80"
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

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
