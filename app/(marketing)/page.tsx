"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

// Defer GSAP providers — they don't affect initial render
const SmoothScroll = dynamic(
  () => import("@/components/providers/SmoothScroll").then((m) => ({ default: m.SmoothScroll })),
  { ssr: false }
);
const GsapScroll = dynamic(
  () => import("@/components/providers/GsapScroll").then((m) => ({ default: m.GsapScroll })),
  { ssr: false }
);

// Lazy-load all below-fold sections
const CountrySelector   = dynamic(() => import("@/components/sections/CountrySelector").then((m) => ({ default: m.CountrySelector })));
const Services          = dynamic(() => import("@/components/sections/Services").then((m) => ({ default: m.Services })));
const HowItWorks        = dynamic(() => import("@/components/sections/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const Destinations      = dynamic(() => import("@/components/sections/Destinations").then((m) => ({ default: m.Destinations })));
const DocumentChecklist = dynamic(() => import("@/components/sections/DocumentChecklist").then((m) => ({ default: m.DocumentChecklist })));
const WhyChooseUs       = dynamic(() => import("@/components/sections/WhyChooseUs").then((m) => ({ default: m.WhyChooseUs })));
const Testimonials      = dynamic(() => import("@/components/sections/Testimonials").then((m) => ({ default: m.Testimonials })));
const FAQ               = dynamic(() => import("@/components/sections/FAQ").then((m) => ({ default: m.FAQ })));
const ContactCTA        = dynamic(() => import("@/components/sections/ContactCTA").then((m) => ({ default: m.ContactCTA })));
const AppointmentProofs = dynamic(() => import("@/components/sections/AppointmentProofs").then((m) => ({ default: m.AppointmentProofs })));

export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <GsapScroll />

      <Hero />
      <Testimonials />
      <AppointmentProofs />
      <CountrySelector />
      <Services />
      <HowItWorks />
      <Destinations />
      <DocumentChecklist />
      <WhyChooseUs />
      <FAQ />
      <ContactCTA />
    </>
  );
}
