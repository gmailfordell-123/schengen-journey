"use client";

import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/BlurFade";

const profile = {
  firstName: "Sarah",
  lastName: "O'Brien",
  email: "sarah.obrien@email.com",
  phone: "+353 87 123 4567",
  dob: "1990-03-14",
  nationality: "Irish",
  address: "12 Grafton Street, Dublin 2",
  passportNo: "P1234567",
  passportExpiry: "2030-06-01",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-40 shrink-0 text-sm" style={{ color: "rgba(240,244,255,0.48)" }}>{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

const sections = [
  {
    title: "Personal details",
    rows: [
      { label: "First name",   value: profile.firstName },
      { label: "Last name",    value: profile.lastName },
      { label: "Date of birth",value: profile.dob },
      { label: "Nationality",  value: profile.nationality },
      { label: "Address",      value: profile.address },
    ],
  },
  {
    title: "Contact information",
    rows: [
      { label: "Email", value: profile.email },
      { label: "Phone", value: profile.phone },
    ],
  },
  {
    title: "Passport",
    rows: [
      { label: "Passport number", value: profile.passportNo },
      { label: "Expiry date",     value: profile.passportExpiry },
    ],
  },
];

export default function ProfilePage() {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <BlurFade delay={0.05}>
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="glass-dark flex items-center gap-5 rounded-2xl p-6"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ background: "var(--navy-600)", boxShadow: "0 4px 16px rgba(4,12,26,0.40), inset 0 1px 0 rgba(255,255,255,0.18)" }}
          >
            {initials}
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm" style={{ color: "rgba(240,244,255,0.55)" }}>{profile.email}</p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="ml-auto rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            Edit profile
          </motion.button>
        </motion.div>
      </BlurFade>

      {/* Info sections */}
      {sections.map((section, si) => (
        <BlurFade key={section.title} delay={0.1 + si * 0.08}>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass-dark rounded-2xl p-6"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide" style={{ color: "rgba(240,244,255,0.42)" }}>
              {section.title}
            </h3>
            <div className="space-y-4" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              {section.rows.map((row, ri) => (
                <div key={row.label} className={ri > 0 ? "pt-4" : ""} style={ri > 0 ? { borderTop: "1px solid rgba(255,255,255,0.07)" } : undefined}>
                  <InfoRow label={row.label} value={row.value} />
                </div>
              ))}
            </div>
          </motion.div>
        </BlurFade>
      ))}
    </div>
  );
}
