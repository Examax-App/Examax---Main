import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy. Everything the site loads is its own: fonts are
 * self-hosted at build time (next/font), and every image, video and script
 * is served from this origin. Next's App Router hydrates through inline
 * scripts, hence 'unsafe-inline' for scripts; there is no user-generated
 * content anywhere on the site for it to be exploited through. Development
 * adds what React's dev tooling and hot reload need ('unsafe-eval', the HMR
 * websocket, and the debug build of Vercel Analytics, which only development
 * loads from Vercel's CDN; in production it is served from this origin).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /** No "X-Powered-By: Next.js" on responses. */
  poweredByHeader: false,
  /** Never ship source maps to the browser (the default, kept explicit). */
  productionBrowserSourceMaps: false,
  /** The privacy policy lives under /legal, as dub's does; the short path still finds it. */
  async redirects() {
    return [{ source: "/privacy", destination: "/legal/privacy", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      /* The self-hosted fonts' paths carry their version (public/fonts/inter-v20), so they never change in place. */
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
