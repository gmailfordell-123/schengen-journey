import type { Metadata } from "next";
import { PlanFlow } from "@/components/flow/PlanFlow";

export const metadata: Metadata = {
  title: "Plan your journey",
  description:
    "Tell us where you're flying from and we'll show your Schengen destinations.",
};

export default function PlanPage() {
  return <PlanFlow />;
}
