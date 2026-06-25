"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const field = {
  hidden: { y: 14 },
  show:   (i: number) => ({
    y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.42, ease: EASE },
  }),
};

export function RegisterForm({
  action,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  error?: string;
}) {
  return (
    <motion.div initial={{ y: 8 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
      <motion.h1
        variants={field} custom={0} initial="hidden" animate="show"
        className="text-2xl font-bold tracking-tight text-slate-900"
      >
        Create your account
      </motion.h1>
      <motion.p
        variants={field} custom={1} initial="hidden" animate="show"
        className="mt-1 text-sm text-slate-600"
      >
        Start your Schengen journey today.
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
        {/* Name row */}
        <motion.div
          variants={field} custom={2} initial="hidden" animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {[
            { id: "first_name", label: "First name", autoComplete: "given-name" },
            { id: "last_name",  label: "Last name",  autoComplete: "family-name" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-medium text-slate-700">
                {f.label}
              </label>
              <input
                id={f.id} name={f.id} type="text" required autoComplete={f.autoComplete}
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          ))}
        </motion.div>

        <motion.div variants={field} custom={3} initial="hidden" animate="show">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </motion.div>

        <motion.div variants={field} custom={4} initial="hidden" animate="show">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password" name="password" type="password" required minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-xs text-slate-400">Minimum 8 characters</p>
        </motion.div>

        <motion.button
          variants={field} custom={5} initial="hidden" animate="show"
          whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--navy-700)" }}
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
          <span className="relative z-10">Create account</span>
        </motion.button>
      </form>

      <motion.p
        variants={field} custom={6} initial="hidden" animate="show"
        className="mt-6 text-center text-sm text-slate-600"
      >
        Already have an account?{" "}
        <Link href="/login" className="font-medium transition-colors hover:opacity-70"
          style={{ color: "var(--navy-600)" }}>
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
