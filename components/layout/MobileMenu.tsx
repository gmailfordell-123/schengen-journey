"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, LayoutDashboard, LogIn, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import type { NavItem } from "@/lib/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function MobileMenu({
  nav,
  isAuthenticated,
}: {
  nav: NavItem[];
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  // Close when route changes
  useEffect(() => { setOpen(false); }, [pathname]);

  // Pause Lenis smooth scroll while drawer is open (prevents background scroll)
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as Record<string, { stop?: () => void; start?: () => void }>).__lenis;
    lenis?.stop?.();
    return () => { lenis?.start?.(); };
  }, [open]);

  const isLight = theme === "light";

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95"
        style={{
          background: isLight ? "rgba(10,22,40,0.07)" : "rgba(255,255,255,0.10)",
          color: isLight ? "rgba(10,22,40,0.75)" : "rgba(240,244,255,0.90)",
        }}
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.55)" }}
            />

            {/* Drawer — fully opaque, matte */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed right-0 top-0 z-50 flex h-[100dvh] w-[82vw] max-w-[320px] flex-col"
              style={{
                background: isLight ? "#ffffff" : "#0d1520",
                borderLeft: `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: "-8px 0 40px rgba(0,0,0,0.40)",
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex h-[4.25rem] shrink-0 items-center justify-between px-4"
                style={{ borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)"}` }}
              >
                <span
                  className="text-[0.6875rem] font-semibold uppercase tracking-widest"
                  style={{ color: isLight ? "rgba(10,22,40,0.38)" : "rgba(240,244,255,0.38)" }}
                >
                  Navigation
                </span>

                <div className="flex items-center gap-2">
                  {/* Night / Day toggle */}
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={isLight ? "Switch to night mode" : "Switch to day mode"}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                    style={{
                      background: isLight ? "rgba(10,22,40,0.06)" : "rgba(255,255,255,0.09)",
                      color: isLight ? "rgba(10,22,40,0.60)" : "rgba(240,244,255,0.65)",
                    }}
                  >
                    {isLight ? <Moon size={16} /> : <Sun size={16} />}
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                    style={{
                      background: isLight ? "rgba(10,22,40,0.06)" : "rgba(255,255,255,0.09)",
                      color: isLight ? "rgba(10,22,40,0.70)" : "rgba(240,244,255,0.80)",
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* ── Nav links ── */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {nav.map((item, i) => {
                    const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ x: 18, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.06 + i * 0.04, ease: EASE }}
                      >
                        <Link
                          href={item.href}
                          className="mobile-nav-link flex items-center rounded-full px-4 py-2.5 text-[0.9375rem] font-medium"
                          data-active={active ? "true" : undefined}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* ── Auth section ── */}
              <div
                className="shrink-0 space-y-2 p-4"
                style={{ borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)"}` }}
              >
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex w-full items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{
                        background: isLight ? "rgba(30,58,138,0.06)" : "rgba(255,255,255,0.07)",
                        color: isLight ? "var(--navy-700)" : "rgba(240,244,255,0.82)",
                        border: `1px solid ${isLight ? "rgba(30,58,138,0.12)" : "rgba(255,255,255,0.10)"}`,
                      }}
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <form action="/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.18)",
                        }}
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{
                        background: isLight ? "rgba(30,58,138,0.06)" : "rgba(255,255,255,0.07)",
                        color: isLight ? "var(--navy-700)" : "rgba(240,244,255,0.82)",
                        border: `1px solid ${isLight ? "rgba(30,58,138,0.14)" : "rgba(255,255,255,0.10)"}`,
                      }}
                    >
                      <LogIn size={15} />
                      Login
                    </Link>
                    <Link
                      href="/book"
                      className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(180deg, var(--gold-400) 0%, var(--gold-500) 100%)",
                        color: "var(--navy-900)",
                        boxShadow: "0 2px 14px rgba(201,168,76,0.38)",
                      }}
                    >
                      <Calendar size={15} />
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
