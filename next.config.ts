import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // unsafe-eval needed by Next.js dev + Framer
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://flagcdn.com https://*.supabase.co",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        // Dev tunnel origins — only included in development
        ...(isDev
          ? ["*.devtunnels.ms", "*.ngrok.io", "*.ngrok-free.app"]
          : []),
        // Production domains
        "*.vercel.app",
        "schengenjourney.com",
        "www.schengenjourney.com",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
    // Compress and cache images aggressively
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Compress responses
  compress: true,
  // Strict mode for better error catching in dev
  reactStrictMode: true,
};

export default nextConfig;
