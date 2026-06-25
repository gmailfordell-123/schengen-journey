"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const field = {
  hidden: { y: 14 },
  show:   (i: number) => ({
    y: 0,
    transition: { delay: 0.1 + i * 0.09, duration: 0.42, ease: EASE },
  }),
};

export function LoginForm({
  action,
  error,
  nextPath,
}: {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  nextPath?: string;
}) {
  return (
    <motion.div initial={{ y: 8 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
      <motion.h1
        variants={field} custom={0} initial="hidden" animate="show"
        className="text-2xl font-bold tracking-tight text-slate-900"
      >
        Welcome back
      </motion.h1>
      <motion.p
        variants={field} custom={1} initial="hidden" animate="show"
        className="mt-1 text-sm text-slate-600"
      >
        Sign in to your Schengen Journey account.
      </motion.p>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
        >
          {decodeURIComponent(error)}
        </motion.div>
      )}

      <form action={action} className="mt-8 space-y-5">
        {nextPath && <input type="hidden" name="next" value={nextPath} />}

        {[
          { id: "email",    label: "Email",    type: "email",    autoComplete: "email" },
          { id: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ].map((f, i) => (
          <motion.div key={f.id} variants={field} custom={i + 2} initial="hidden" animate="show">
            <div className="flex items-center justify-between">
              <label htmlFor={f.id} className="block text-sm font-medium text-slate-700">
                {f.label}
              </label>
              {f.id === "password" && (
                <Link href="/forgot-password" className="text-brand-600 text-xs transition-colors hover:opacity-70">
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id={f.id} name={f.id} type={f.type} required autoComplete={f.autoComplete}
              className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </motion.div>
        ))}

        <motion.button
          variants={field} custom={4} initial="hidden" animate="show"
          whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-brand-700 w-full relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
          <span className="relative z-10">Sign in</span>
        </motion.button>
      </form>

      <motion.p
        variants={field} custom={5} initial="hidden" animate="show"
        className="mt-6 text-center text-sm text-slate-600"
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-600 font-medium transition-colors hover:opacity-70">
          Register
        </Link>
      </motion.p>
    </motion.div>
  );
}
