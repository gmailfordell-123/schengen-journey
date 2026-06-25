"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { PremiumPageShell } from "@/components/layout/PremiumPageShell";
import { MotionCard } from "@/components/ui/MotionCard";
import { BlurFade } from "@/components/ui/BlurFade";
import { AnimatedGradientText } from "@/components/ui/AnimatedGradientText";
import { Meteors } from "@/components/ui/Meteors";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const placeholderPosts = [
  {
    title: "Understanding the 90/180-day Schengen Rule",
    excerpt: "A plain-language guide to how Schengen stay limits actually work — and how to avoid overstaying.",
    category: "Guide",
    readTime: "5 min",
    date: "Jun 2026",
  },
  {
    title: "Documents You Need for a Schengen Visa",
    excerpt: "A complete checklist to prepare before your appointment, covering every document consulates require.",
    category: "Checklist",
    readTime: "4 min",
    date: "Jun 2026",
  },
  {
    title: "Top Mistakes That Delay Visa Approval",
    excerpt: "Avoid these common pitfalls — from incomplete forms to wrong insurance coverage.",
    category: "Tips",
    readTime: "6 min",
    date: "May 2026",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function BlogPage() {
  return (
    <PremiumPageShell>
      {/* Header section */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Meteors number={10} />
        <Container className="py-20 pb-16">
          <BlurFade delay={0.05}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              <AnimatedGradientText>Insights &amp; Guides</AnimatedGradientText>
            </p>
            <h1 className="text-h1 text-white">Schengen Visa Blog</h1>
            <p className="text-subhead mt-4 max-w-xl" style={{ color: "rgba(240,244,255,0.65)" }}>
              Expert guides, tips, and updates to help UK &amp; Ireland applicants navigate the Schengen visa process.
            </p>
          </BlurFade>
        </Container>
      </div>

      {/* Posts grid */}
      <Container className="py-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-3"
        >
          {placeholderPosts.map((post, i) => (
            <MotionCard key={post.title} index={i} className="flex flex-col group cursor-pointer">
              {/* Thumbnail placeholder */}
              <div
                className="aspect-video rounded-xl mb-5 overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--navy-50) 0%, var(--navy-100) 100%)" }}
              >
                <div className="h-full w-full flex items-center justify-center">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
                    style={{ background: "var(--navy-600)", color: "#fff" }}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: "var(--ink-light)" }}>
                <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
              </div>

              {/* Title */}
              <h2 className="text-base font-semibold mb-2 leading-snug" style={{ color: "var(--ink)" }}>
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--ink-muted)" }}>
                {post.excerpt}
              </p>

              {/* Read more */}
              <div className="mt-5 flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:gap-2.5"
                style={{ color: "var(--navy-600)" }}>
                Read article <ArrowRight size={14} />
              </div>
            </MotionCard>
          ))}
        </motion.div>

        <BlurFade delay={0.3} className="mt-12 text-center">
          <p className="text-sm" style={{ color: "rgba(240,244,255,0.40)" }}>
            More articles coming soon. Check back for updates.
          </p>
        </BlurFade>
      </Container>
    </PremiumPageShell>
  );
}
