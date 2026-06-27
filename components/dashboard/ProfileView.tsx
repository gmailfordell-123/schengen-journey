"use client";

import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/BlurFade";
import type { UserProfile } from "@/lib/supabase/types";

function fmt(value: string | null | undefined, fallback = "—"): string {
  return value?.trim() || fallback;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-44 shrink-0 text-sm" style={{ color: "rgba(240,244,255,0.48)" }}>
        {label}
      </span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export function ProfileView({
  profile,
  email,
}: {
  profile: UserProfile;
  email: string;
}) {
  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();

  const sections = [
    {
      title: "Personal details",
      rows: [
        { label: "First name",    value: fmt(profile.first_name) },
        { label: "Last name",     value: fmt(profile.last_name) },
        { label: "Date of birth", value: fmt(profile.dob) },
        { label: "Nationality",   value: fmt(profile.nationality) },
        { label: "Address",       value: fmt(profile.address) },
      ],
    },
    {
      title: "Contact information",
      rows: [
        { label: "Email", value: fmt(email) },
        { label: "Phone", value: fmt(profile.phone) },
      ],
    },
    {
      title: "Passport",
      rows: [
        { label: "Passport number",   value: fmt(profile.passport_no) },
        { label: "Passport country",  value: fmt(profile.passport_country) },
        { label: "Issue date",        value: fmt(profile.passport_issue_date) },
        { label: "Expiry date",       value: fmt(profile.passport_expiry) },
      ],
    },
  ];

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
            style={{
              background: "var(--navy-600)",
              boxShadow: "0 4px 16px rgba(4,12,26,0.40), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {initials || "?"}
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-sm" style={{ color: "rgba(240,244,255,0.55)" }}>
              {email}
            </p>
          </div>
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
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wide"
              style={{ color: "rgba(240,244,255,0.42)" }}
            >
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.rows.map((row, ri) => (
                <div
                  key={row.label}
                  className={ri > 0 ? "pt-4" : ""}
                  style={ri > 0 ? { borderTop: "1px solid rgba(255,255,255,0.07)" } : undefined}
                >
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
