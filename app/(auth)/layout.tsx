import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { PremiumPageShell } from "@/components/layout/PremiumPageShell";

/**
 * Auth layout: a minimal, centered shell for login/register.
 * Premium navy background with a white auth card. No marketing navbar/footer.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PremiumPageShell>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            SJ
          </span>
          {siteConfig.name}
        </Link>
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </PremiumPageShell>
  );
}
