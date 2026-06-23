/**
 * Static pricing data for the pricing page.
 * UK is priced in GBP, Ireland in EUR. No backend — prices live here.
 */

export type Region = "uk" | "ireland";

export const regions: {
  id: Region;
  label: string;
  code: "GBP" | "EUR";
  symbol: "£" | "€";
  locale: string;
}[] = [
  {
    id: "uk",
    label: "United Kingdom",
    code: "GBP",
    symbol: "£",
    locale: "en-GB",
  },
  {
    id: "ireland",
    label: "Ireland",
    code: "EUR",
    symbol: "€",
    locale: "en-IE",
  },
];

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: Record<Region, number>;
  popular?: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "essential-start",
    name: "Essential Start",
    tagline: "Core support to get your application moving.",
    price: { uk: 99, ireland: 99 },
    features: [
      "Appointment scheduling",
      "Appointment fee payment",
      "Assistance in document preparation",
      "Document review",
    ],
  },
  {
    id: "smart-travel-plan",
    name: "Smart Travel Plan",
    tagline: "Everything you need for a smooth application.",
    price: { uk: 130, ireland: 150 },
    popular: true,
    features: [
      "Appointment scheduling",
      "Appointment fee payment",
      "Assistance in filling visa application form",
      "Travel medical insurance",
      "Cover letter",
    ],
  },
  {
    id: "platinum-complete-plan",
    name: "Platinum Complete Plan",
    tagline: "Full end-to-end concierge service.",
    price: { uk: 200, ireland: 220 },
    features: [
      "Appointment scheduling",
      "Appointment fee payment",
      "Assistance in filling visa application form",
      "Hotel reservation (reservation only)",
      "Flight reservation (reservation only)",
      "Travel medical insurance (1 year valid)",
      "Cover letter",
      "Application tracking service",
    ],
  },
];

/** Format a plan price for the given region using its locale + currency. */
export function formatPrice(amount: number, region: Region): string {
  const r = regions.find((x) => x.id === region)!;
  return new Intl.NumberFormat(r.locale, {
    style: "currency",
    currency: r.code,
    maximumFractionDigits: 0,
  }).format(amount);
}
