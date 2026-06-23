import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PremiumPageShell } from "@/components/layout/PremiumPageShell";

export const metadata: Metadata = {
  title: "Blog",
};

const placeholderPosts = [
  {
    title: "Understanding the 90/180-day rule",
    excerpt: "A plain-language guide to how Schengen stay limits actually work.",
  },
  {
    title: "Documents you need for a Schengen visa",
    excerpt: "A checklist to prepare before your appointment.",
  },
  {
    title: "Top mistakes that delay visa approval",
    excerpt: "Avoid these common pitfalls in your application.",
  },
];

export default function BlogPage() {
  return (
    <PremiumPageShell>
      <Container className="py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--gold-500)" }}>
          Insights
        </p>
        <h1 className="text-h1 mt-3 text-white">Blog</h1>
        <p className="text-subhead mt-4" style={{ color: "rgba(240,244,255,0.65)" }}>
          Guides and updates. Placeholder structure only.
        </p>

        <div className="reveal-stagger mt-12 grid gap-8 md:grid-cols-3">
          {placeholderPosts.map((post) => (
            <article
              key={post.title}
              className="card card-hover rounded-2xl p-6"
            >
              <div className="aspect-video rounded-lg bg-slate-100" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </Container>
    </PremiumPageShell>
  );
}
