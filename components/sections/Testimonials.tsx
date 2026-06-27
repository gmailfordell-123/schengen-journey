"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";

function FbIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const REVIEWS = [
  {
    name: "Xette Macayan",
    date: "4 Jun",
    initials: "XM",
    quote:
      "Highly recommend this service! They made getting my Spain visa so easy and straightforward. Super thankful for the quick communication and smooth process.",
  },
  {
    name: "Sri Kanth",
    date: "15 Jun",
    initials: "SK",
    quote:
      "Thank you so much for your help in getting my VFS Global appointment. I truly appreciate your kindness and support.",
  },
  {
    name: "Anonymous",
    date: "14 Jun",
    initials: "AP",
    quote:
      "I recently got my Denmark visa appointment within 24 hours of request. Highly recommend the team. Great response by them. Thank You.",
  },
  {
    name: "Anu Michael",
    date: "14 Jun",
    initials: "AM",
    quote:
      "Great service! Approachable, dedicated, and professional throughout the entire experience. They were always willing to help and made the process smooth and stress-free. I highly recommend their services and would gladly use them again.",
  },
  {
    name: "Liberty Valencia",
    date: "16 Jun",
    initials: "LV",
    quote:
      "Excellent service from start to finish. The staff was responsive, knowledgeable, and helped me secure a visa appointment quickly and efficiently. Highly recommended.",
  },
  {
    name: "Adv Ehtasham Malik",
    date: "17 Jun",
    initials: "EM",
    quote:
      "Excellent service! They helped me secure a Schengen visa appointment quickly and smoothly. Communication was clear throughout the process, and everything was handled professionally. Highly recommended for anyone looking for assistance with Schengen visa appointments.",
  },
  {
    name: "Sharvil Dave",
    date: "17 Jun",
    initials: "SD",
    quote:
      "I had a great experience using their service for my Schengen visa appointment. The entire process was straightforward, and they kept me informed at every stage. What impressed me most was their prompt responses and attention to detail, which made the application process much less stressful.",
  },
];

const FB_GROUP = "https://www.facebook.com/share/g/1GyKtaGyrm/?mibextid=wwXIfr";
const PER_PAGE = 2;
const TOTAL_PAGES = Math.ceil(REVIEWS.length / PER_PAGE);

export function Testimonials() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (next: number) => {
      setDir(next > page ? 1 : -1);
      setPage(next);
    },
    [page]
  );

  const prev = () => go((page - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  const next = () => go((page + 1) % TOTAL_PAGES);

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setTimeout(() => go((page + 1) % TOTAL_PAGES), 5000);
    return () => clearTimeout(t);
  }, [page, go]);

  const visible = REVIEWS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section id="testimonials" className="relative overflow-hidden section-pad section-subtle">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--navy-600)" }}>
            What clients say
          </p>
          <h2 className="text-h2 mt-2 text-white">
            Real clients, real results
          </h2>
          <p className="text-subhead mt-3 mx-auto max-w-lg" style={{ color: "rgba(240,244,255,0.65)" }}>
            Every review below is from our Facebook community — click to verify yourself.
          </p>

          <Link
            href={FB_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all hover:scale-105"
            style={{
              background: "rgba(24,119,242,0.10)",
              border: "1px solid rgba(24,119,242,0.25)",
              color: "#1877F2",
            }}
          >
            <FbIcon size={13} />
            Verified on Facebook Group — Click to see
            <ExternalLink size={12} strokeWidth={2} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-5 sm:grid-cols-2"
            >
              {visible.map((r) => (
                <div
                  key={r.name + r.date}
                  className="flex flex-col rounded-2xl p-6"
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={13} fill="#3aab80" style={{ color: "#3aab80" }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="flex-1 text-sm leading-relaxed text-slate-700">
                    &ldquo;{r.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                        style={{ background: "var(--navy-600)" }}
                      >
                        {r.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.date} · Facebook Group</p>
                      </div>
                    </div>

                    <Link
                      href={FB_GROUP}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Verify on Facebook"
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition hover:opacity-80"
                      style={{
                        background: "rgba(24,119,242,0.08)",
                        color: "#1877F2",
                        border: "1px solid rgba(24,119,242,0.18)",
                      }}
                    >
                      <FbIcon size={10} />
                      Verify
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
          <div className="mt-7 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous reviews"
              className="flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105"
              style={{
                background: "#ffffff",
                border: "1.5px solid rgba(0,0,0,0.10)",
                color: "var(--navy-600)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Page ${i + 1}`}
                  className="rounded-full transition-all"
                  style={{
                    width: i === page ? "20px" : "8px",
                    height: "8px",
                    background: i === page ? "var(--navy-600)" : "rgba(0,0,0,0.18)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next reviews"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105"
              style={{
                background: "var(--navy-600)",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(34,111,84,0.35)",
              }}
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Bottom link */}
        <div className="mt-8 text-center">
          <Link
            href={FB_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
            style={{ color: "#1877F2" }}
          >
            <FbIcon size={14} />
            Join our Facebook community to see more client experiences
            <ExternalLink size={13} strokeWidth={2} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
