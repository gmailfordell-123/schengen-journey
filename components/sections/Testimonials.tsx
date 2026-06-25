"use client";

import { Star, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MotionCard } from "@/components/ui/MotionCard";
import { BlurFade } from "@/components/ui/BlurFade";
import { testimonials } from "@/lib/home-content";

export function Testimonials() {
  return (
    <section id="testimonials" className="section-pad section-light">
      <Container>
        <BlurFade delay={0.05}>
          <SectionHeading
            eyebrow="Client Testimonials"
            title="Trusted by applicants across the UK & Ireland"
            subtitle="Real clients, real outcomes. Hear from people who navigated the Schengen process with our support."
          />
        </BlurFade>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <MotionCard key={t.name} index={i} className="flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={15}
                    style={{ color: "var(--gold-500)", fill: "var(--gold-500)" }}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--ink-muted)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div
                className="mt-6 flex items-center gap-3 pt-5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform duration-300 hover:scale-110"
                  style={{ background: "var(--navy-700)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--ink-light)" }}>{t.role}</p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--gold-500)" }}>
                    <MapPin size={11} /> {t.location}
                  </p>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
