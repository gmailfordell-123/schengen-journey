/**
 * Central site configuration.
 * Static metadata used across layouts, navbar, and footer.
 */
export const siteConfig = {
  name: "Schengen Journey",
  description:
    "Plan, track, and manage your Schengen visa journey with confidence.",
  url: "https://schengenjourney.com",
} as const;

export type SiteConfig = typeof siteConfig;
