import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PremiumPageShell } from "@/components/layout/PremiumPageShell";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PremiumPageShell>
      <Container className="py-24">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--gold-500)" }}>
            Get in touch
          </p>
          <h1 className="text-h1 mt-3 text-white">
            Contact us
          </h1>
          <p className="text-subhead mt-4" style={{ color: "rgba(240,244,255,0.65)" }}>
            Have a question about your Schengen application? Reach out and our
            UK &amp; Ireland team will get back to you.
          </p>
        </div>

        <form className="mx-auto mt-10 max-w-xl space-y-6 rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Send message
          </button>
        </form>
      </Container>
    </PremiumPageShell>
  );
}
