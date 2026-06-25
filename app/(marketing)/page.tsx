import { PageLoader } from "@/components/ui/PageLoader";
import { AOSInit } from "@/components/providers/AOSInit";
import { GsapScroll } from "@/components/providers/GsapScroll";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { CountrySelector } from "@/components/sections/CountrySelector";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Destinations } from "@/components/sections/Destinations";
import { DocumentChecklist } from "@/components/sections/DocumentChecklist";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <PageLoader />
      <AOSInit />
      <GsapScroll />

      <Hero />
      <CountrySelector />
      <Services />
      <HowItWorks />
      <Destinations />
      <DocumentChecklist />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </>
  );
}
