import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { PremiumPageShell } from "@/components/layout/PremiumPageShell";
import { AnimatedAuthCard } from "@/components/auth/AnimatedAuthCard";
import { Meteors } from "@/components/ui/Meteors";

/**
 * Auth layout: a minimal, centered shell for login/register.
 * Premium navy background with a white auth card. No marketing navbar/footer.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PremiumPageShell>
      <Meteors number={16} />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <Link
          href="/"
          className="animate-page-in mb-8 flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white"
        >
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: "var(--navy-600)" }}
          >
            SJ
          </span>
          {siteConfig.name}
        </Link>
        {/* Animated card */}
        <AnimatedAuthCard>{children}</AnimatedAuthCard>
      </div>
    </PremiumPageShell>
  );
}
