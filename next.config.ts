import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const isDev = process.env.NODE_ENV === "development";

// Public pages are static (served from cache), so they use a fixed policy.
// The admin panel gets a stricter per-request nonce policy in src/proxy.ts.
const publicCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  // Bundle the seed content with the server functions (read-only hosting).
  outputFileTracingIncludes: { "/**": ["./data/seed.json"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
  },
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/((?!admin).*)", headers: [{ key: "Content-Security-Policy", value: publicCsp }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
    ];
  },
  async redirects() {
    // Keep old addresses of the current site working.
    return [
      { source: "/kashmir-conflict", destination: "/kashmir-cause", permanent: true },
      { source: "/wp-admin", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
