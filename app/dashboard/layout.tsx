import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { dashboardNav } from "@/lib/navigation";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Redirects to /login if not authenticated
  const profile = await requireAuth();

  return (
    <AppShell title="Dashboard" nav={dashboardNav} profile={profile}>
      {children}
    </AppShell>
  );
}
