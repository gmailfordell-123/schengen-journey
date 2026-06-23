import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { adminNav } from "@/lib/navigation";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Redirects to /login if not authenticated, /dashboard if not admin
  const profile = await requireAdmin();

  return (
    <AppShell title="Admin" nav={adminNav} profile={profile}>
      {children}
    </AppShell>
  );
}
