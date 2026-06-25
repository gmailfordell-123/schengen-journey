import type { Metadata } from "next";
import { Inter, Manrope, Fragment_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

/**
 * Premium type system:
 *   - Manrope       → display headings (H1–H3)
 *   - Inter         → body, subheadings, UI labels
 *   - Fragment Mono → monospace accents (reference numbers, figures)
 * Loaded via next/font and exposed as CSS variables that globals.css maps
 * onto the Tailwind font tokens.
 */
const inter = Inter({
  variable: "--ff-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--ff-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking script: applies saved theme class before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sj-theme')||'dark';document.documentElement.classList.add(t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full font-sans">
        <ThemeProvider>
          {children}
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
