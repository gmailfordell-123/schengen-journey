import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Marketing/public layout: global navbar + footer wrapping the page content.
 */
export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
