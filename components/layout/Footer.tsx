import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { LogoImage } from "@/components/ui/LogoImage";
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
            <Link href="/" className="flex items-center gap-3">
              <LogoImage size={48} />
              <span className="text-base font-bold text-white leading-tight">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,255,0.55)" }}>
              Premium Schengen visa appointment support and documentation services
              for UK and Ireland applicants.
            </p>

            {/* Locations */}
            <div className="flex flex-col gap-1.5 text-sm" style={{ color: "rgba(240,244,255,0.45)" }}>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} /> United Kingdom
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} /> Republic of Ireland
              </span>
            </div>

            {/* Contact links */}
            <div className="flex flex-col gap-2.5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/447832619302"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-medium transition-colors hover:text-white"
                style={{ color: "rgba(37,211,102,0.85)" }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.25)" }}
                >
                  <svg viewBox="0 0 32 32" width="16" height="16" fill="rgba(37,211,102,0.9)" aria-hidden="true">
                    <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16.003c0 2.347.635 4.64 1.839 6.659L2.667 29.333l6.88-1.799a13.3 13.3 0 0 0 6.456 1.668h.003C23.363 29.202 29.333 23.23 29.333 16c0-3.565-1.388-6.916-3.91-9.435A13.27 13.27 0 0 0 16.003 2.667zm0 2.4c2.927 0 5.678 1.14 7.745 3.21a10.9 10.9 0 0 1 3.185 7.723c0 6.02-4.898 10.918-10.93 10.918a10.88 10.88 0 0 1-5.543-1.512l-.394-.233-4.085 1.07 1.09-3.978-.257-.41A10.86 10.86 0 0 1 5.067 16c0-6.032 4.903-10.933 10.936-10.933zm-3.07 5.38c-.22-.49-.45-.5-.659-.51-.17-.009-.366-.008-.562-.008s-.512.074-.78.37c-.267.294-1.024.999-1.024 2.437s1.048 2.83 1.194 3.026c.147.195 2.04 3.24 5.018 4.41.7.27 1.247.43 1.673.55.703.2 1.343.172 1.849.104.564-.076 1.735-.708 1.98-1.394.243-.686.243-1.274.17-1.394-.073-.122-.268-.195-.562-.342-.293-.148-1.735-.856-2.003-.953-.27-.098-.465-.147-.66.147-.195.293-.757.953-.927 1.148-.17.195-.342.22-.635.074-.293-.148-1.238-.456-2.358-1.455-.872-.778-1.46-1.738-1.631-2.031-.17-.294-.018-.453.128-.6.13-.13.292-.34.44-.51.146-.17.195-.293.293-.488.097-.195.048-.367-.025-.514-.073-.147-.644-1.579-.888-2.047z" />
                  </svg>
                </span>
                +44 7832 619302
              </a>

              {/* Email */}
              <a
                href="mailto:schengenjourney021@gmail.com"
                className="inline-flex items-center gap-2.5 text-sm font-medium transition-colors hover:text-white"
                style={{ color: "rgba(240,244,255,0.55)" }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
                >
                  <Mail size={13} style={{ color: "rgba(240,244,255,0.65)" }} />
                </span>
                schengenjourney021@gmail.com
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/18x64EaFSS/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-medium transition-colors hover:text-white"
                style={{ color: "rgba(240,244,255,0.55)" }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(24,119,242,0.15)", border: "1px solid rgba(24,119,242,0.25)" }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="rgba(100,160,255,0.9)" aria-hidden="true">
                    <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073c0 6.025 4.388 11.016 10.125 11.927V15.56H7.078v-3.488h3.047V9.34c0-3.014 1.792-4.678 4.533-4.678 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.928-1.956 1.879v2.344h3.328l-.532 3.488h-2.796v8.44C19.612 23.089 24 18.098 24 12.073z"/>
                  </svg>
                </span>
                Facebook Page
              </a>
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
