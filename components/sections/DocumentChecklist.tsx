"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";

const checklist = [
  {
    item: "Valid Passport",
    detail: "Must be valid for at least 3 months beyond your return date, with at least 2 blank pages.",
  },
  {
    item: "UK or Ireland Residence Permit",
    detail: "Current valid BRP, ILR, or Irish Residence Permit proving legal residency.",
  },
  {
    item: "Bank Statements",
    detail: "Last 3–6 months of statements showing sufficient funds for the duration of travel.",
  },
  {
    item: "Employment or Student Letter",
    detail: "Official letter from your employer or institution confirming your status and approved leave.",
  },
  {
    item: "Travel Medical Insurance",
    detail: "Schengen-compliant policy with minimum €30,000 coverage, valid in all 27 member states.",
  },
  {
    item: "Flight Reservation",
    detail: "Confirmed itinerary showing entry and exit flights for the Schengen zone — not purchased tickets.",
  },
  {
    item: "Hotel Reservation",
    detail: "Accommodation bookings for the full duration of your stay with reference numbers.",
  },
  {
    item: "Cover Letter",
    detail: "A professional letter explaining travel purpose, itinerary, financial capacity, and ties to the UK or Ireland.",
  },
  {
    item: "Appointment Confirmation",
    detail: "Confirmed appointment reference from VFS Global, TLScontact, or the consulate.",
  },
  {
    item: "Previous Visa Copies",
    detail: "Copies of any previously issued Schengen or other international visas if applicable.",
  },
];

export function DocumentChecklist() {
  return (
    <section id="documents" className="section-pad section-navy">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 items-start">

          {/* Left: heading */}
          <div data-aos="fade-right">
            <p className="eyebrow mb-5" style={{ color: "var(--gold-500)" }}>
              <span className="h-px w-6 inline-block rounded" style={{ background: "var(--gold-500)", verticalAlign: "middle", marginRight: "0.75rem" }} />
              Document Checklist
              <span className="h-px w-6 inline-block rounded" style={{ background: "var(--gold-500)", verticalAlign: "middle", marginLeft: "0.75rem" }} />
            </p>
            <h2
              className="text-h2"
              style={{ color: "#fff" }}
            >
              Standard Schengen Visa
              <br />
              Documents Required
            </h2>
            <p
              className="text-subhead mt-5 max-w-md"
              style={{ color: "rgba(240,244,255,0.60)" }}
            >
              Requirements vary by destination country and applicant profile. Our team
              reviews your specific situation and provides a personalised checklist to
              ensure nothing is missed before your appointment.
            </p>

            <div
              className="mt-8 rounded-2xl p-6"
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.20)",
              }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--gold-400)" }}
              >
                Our document review service
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,255,0.60)" }}>
                With our Platinum or Smart Travel packages, our team personally reviews
                every document in your application before submission, reducing the risk
                of rejection due to missing or incorrect documentation.
              </p>
            </div>
          </div>

          {/* Right: checklist */}
          <div data-aos="fade-left" className="space-y-3">
            {checklist.map((doc, i) => (
              <motion.div
                key={doc.item}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex gap-4 rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5"
                  style={{
                    background: "rgba(201,168,76,0.15)",
                    color: "var(--gold-400)",
                    border: "1px solid rgba(201,168,76,0.30)",
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{doc.item}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(240,244,255,0.50)" }}>
                    {doc.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
