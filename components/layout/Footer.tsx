import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

const footerLinks = [
  {
    title: "Services",
    items: [
      { label: "Appointment Scheduling", href: "/#services" },
      { label: "Document Review", href: "/#services" },
      { label: "Cover Letter", href: "/#services" },
      { label: "Travel Insurance", href: "/#services" },
      { label: "Flight Reservation", href: "/#services" },
      { label: "Hotel Reservation", href: "/#services" },
    ],
  },
  {
    title: "Apply From",
    items: [
      { label: "United Kingdom", href: "/#countries" },
      { label: "Ireland", href: "/#countries" },
      { label: "London", href: "/book" },
      { label: "Manchester", href: "/book" },
      { label: "Birmingham", href: "/book" },
      { label: "Dublin", href: "/book" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Pricing", href: "/pricing" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--navy-950)", color: "var(--ink-white)" }}>
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand col */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold text-white"
                style={{ background: "var(--navy-600)" }}
              >
                SJ
              </span>
              <span className="text-base font-semibold text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,255,0.55)" }}>
              Premium Schengen visa appointment support and documentation services
              for UK and Ireland applicants.
            </p>
            <div className="flex flex-col gap-1.5 text-sm" style={{ color: "rgba(240,244,255,0.45)" }}>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} /> United Kingdom
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} /> Republic of Ireland
              </span>
            </div>
            {/* Gold accent bar */}
            <div className="w-10 h-0.5 rounded-full" style={{ background: "var(--gold-500)" }} />
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold tracking-wide text-white mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "rgba(240,244,255,0.50)" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-7 sm:flex-row"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs" style={{ color: "rgba(240,244,255,0.35)" }}>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(240,244,255,0.35)" }}>
            Schengen visa consultancy for UK &amp; Ireland applicants
          </p>
        </div>
      </Container>
    </footer>
  );
}
