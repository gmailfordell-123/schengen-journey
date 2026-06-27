"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ZoomIn } from "lucide-react";
import { Container } from "@/components/ui/Container";

const PROOFS = [
  {
    src: "/images/proofs/proof-1.jpg",
    country: "Netherlands",
    centre: "Dublin Centre",
    category: "Tourist Visa",
    date: "Jul 2026",
  },
  {
    src: "/images/proofs/proof-2.jpg",
    country: "Austria / Switzerland",
    centre: "Dublin Centre",
    category: "All Visas",
    date: "Jul 2026",
  },
  {
    src: "/images/proofs/proof-3.jpg",
    country: "Austria / Switzerland",
    centre: "Dublin Centre",
    category: "All Visas",
    date: "Jul 2026",
  },
  {
    src: "/images/proofs/proof-4.jpg",
    country: "Netherlands",
    centre: "Dublin Centre",
    category: "Tourist Visa",
    date: "Apr 2026",
  },
  {
    src: "/images/proofs/proof-5.jpg",
    country: "Netherlands",
    centre: "Dublin Centre",
    category: "Tourist Visa",
    date: "Apr 2026",
  },
];

export function AppointmentProofs() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden section-pad section-dark">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-[0.18em]"
            style={{ background: "rgba(34,111,84,0.15)", border: "1px solid rgba(34,111,84,0.30)", color: "#3aab80" }}
          >
            <ShieldCheck size={13} strokeWidth={2.5} />
            Real Appointments · VFS Global Verified
          </div>
          <h2 className="text-h2 text-white">
            Actual VFS Appointment Confirmations
          </h2>
          <p className="text-subhead mt-3 mx-auto max-w-xl" style={{ color: "rgba(240,244,255,0.58)" }}>
            Every confirmation below is a real VFS Global appointment we secured for our clients. Names and passport details are blurred for privacy.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PROOFS.map((p, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl text-left"
              style={{
                border: "1.5px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              {/* Document preview */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <Image
                  src={p.src}
                  alt={`VFS Appointment Confirmation — ${p.country}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {/* Zoom overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(0,0,0,0.38)" }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: "rgba(34,111,84,0.85)" }}
                  >
                    <ZoomIn size={18} strokeWidth={2} className="text-white" />
                  </div>
                </div>
                {/* VFS badge top-right */}
                <div className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)" }}
                >
                  VFS
                </div>
              </div>

              {/* Caption */}
              <div className="p-3">
                <p className="text-[11px] font-bold leading-snug text-white">{p.country}</p>
                <p className="mt-0.5 text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {p.category} · {p.date}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <ShieldCheck size={10} style={{ color: "#3aab80" }} />
                  <span className="text-[9px] font-semibold" style={{ color: "#3aab80" }}>Confirmed</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-h-[90vh] max-w-lg w-full overflow-hidden rounded-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
              >
                {/* Close */}
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
                >
                  <X size={16} className="text-white" />
                </button>

                <div className="relative w-full overflow-y-auto" style={{ maxHeight: "85vh" }}>
                  <Image
                    src={PROOFS[lightbox].src}
                    alt={`VFS Confirmation — ${PROOFS[lightbox].country}`}
                    width={800}
                    height={1100}
                    className="w-full h-auto"
                    style={{ objectFit: "contain" }}
                  />
                </div>

                {/* Bottom caption */}
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ background: "rgba(10,10,10,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div>
                    <p className="text-sm font-bold text-white">{PROOFS[lightbox].country} — {PROOFS[lightbox].category}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {PROOFS[lightbox].centre} · {PROOFS[lightbox].date} · VFS Global Official
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                    style={{ background: "rgba(34,111,84,0.18)", border: "1px solid rgba(34,111,84,0.35)" }}
                  >
                    <ShieldCheck size={13} style={{ color: "#3aab80" }} />
                    <span className="text-xs font-semibold" style={{ color: "#3aab80" }}>Verified</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
