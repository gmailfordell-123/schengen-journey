import type { Metadata } from "next";
import { PricingPlans } from "@/components/sections/PricingPlans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Schengen Journey packages — Essential Start, Smart Travel Plan, and Platinum Complete Plan. GBP for the UK, EUR for Ireland.",
};

export default function PricingPage() {
  return <PricingPlans />;
}
