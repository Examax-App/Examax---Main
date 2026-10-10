import type { NextConfig } from "next";
import { projectId as sanityProjectId } from "./lib/sanity/env";
import { supabaseOrigin } from "./lib/supabase/env";

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
 * The outside sources: Sanity (its image CDN, and the project's API for live
 * content updates, lib/sanity/live.ts); Supabase, which the auth forms call
 * from the browser (lib/supabase/client.ts) and whose Storage holds the
 * e-mail logo the dev panel's previews show; and Cloudflare Turnstile, whose
 * script and challenge frame guard those forms (components/auth/Turnstile.tsx).
 */
const sanityApi = ` https://${sanityProjectId}.api.sanity.io https://${sanityProjectId}.apicdn.sanity.io`;
const supabaseApi = supabaseOrigin ? ` ${supabaseOrigin}` : "";
const turnstile = "https://challenges.cloudflare.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${turnstile}${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://cdn.sanity.io${supabaseApi}`,
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self'${sanityApi}${supabaseApi}${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  `frame-src ${turnstile}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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
  /** Sanity's image CDN, for next/image (build the URL with urlFor in lib/sanity/image.ts). */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: `/images/${sanityProjectId}/**` }],
  },
  /**
   * One host for search engines: www.examax.app answers on Vercel too, so it
   * sends every path to examax.app (the canonical host) instead of serving a
   * second copy of the site. The privacy policy lives under /legal, as dub's
   * does; the short path still finds it.
   */
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.examax.app" }], destination: "https://examax.app/:path*", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/cookies", destination: "/legal/cookies", permanent: true },
      { source: "/gdpr", destination: "/legal/gdpr", permanent: true },
    ];
  },
  /**
   * Microsoft's publisher-domain check (Entra → Branding & properties) asks
   * for /.well-known/microsoft-identity-association without the extension
   * as well as with it; both answer with the same JSON file in public/.
   */
  async rewrites() {
    return [{ source: "/.well-known/microsoft-identity-association", destination: "/.well-known/microsoft-identity-association.json" }];
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
