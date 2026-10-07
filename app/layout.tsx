import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { FlashToast } from "@/components/ui/Toast";
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_URL, X_HANDLE } from "@/lib/seo";
import "./globals.css";

/* Inter is self-hosted from public/fonts (see the @font-face rules at the top of
   globals.css); these are the two files every page's text needs. */
const INTER_PRELOADS = ["/fonts/inter-v20/latin.woff2", "/fonts/inter-v20/latin-ext-a.woff2"];

const geistMono = Geist_Mono({
  variable: "--font-geist-mono-local",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  /* Only the product pictures use it, mostly far down the page: fetched when a page shows one, not preloaded on every page. */
  preload: false,
});

const satoshi = localFont({
  variable: "--font-satoshi-local",
  src: [
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /* The landing page's title, and the fallback for any page without one. */
  title: {
    default: "Examax — przygotowanie do matury i egzaminu ósmoklasisty",
    template: "%s — Examax",
  },
  applicationName: SITE_NAME,
  category: "education",
  description: SITE_DESCRIPTION,
  keywords: [
    "matura",
    "egzamin ósmoklasisty",
    "arkusze CKE",
    "przygotowanie do matury",
    "zadania maturalne",
    "roadmapa nauki",
    "nauka do egzaminu",
  ],
  openGraph: {
    title: "Examax — Zamień naukę w wyniki",
    description:
      "Kompletny system przygotowań do egzaminu ósmoklasisty i matury: roadmapa nauki, zadania z arkuszy CKE i Korepetytor AI.",
    url: "/",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    title: "Examax — Zamień naukę w wyniki",
    description:
      "Kompletny system przygotowań do egzaminu ósmoklasisty i matury: roadmapa nauki, zadania z arkuszy CKE i Korepetytor AI.",
  },
  robots: {
    index: true,
    follow: true,
    /* Let search show the whole snippet and full-size previews of the product pictures. */
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  /* The RealFaviconGenerator set lives in public/ and is declared here once
     for every page. Keep the app/ icon file conventions (favicon.ico, icon.*,
     apple-icon.*) empty — they would emit a second set of <link> tags, and an
     app/favicon.ico collides with public/favicon.ico. Bump `v` when the set is
     regenerated so browsers drop their cached copies. In-app imagery lives in
     public/brand/. */
  icons: {
    icon: [
      { url: "/favicon-96x96.png?v=20261007", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg?v=20261007", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=20261007",
    apple: { url: "/apple-touch-icon.png?v=20261007", sizes: "180x180" },
  },
  appleWebApp: { title: "Examax" },
  manifest: "/site.webmanifest?v=20261007",
};

/* theme-color lives on the viewport export, not on metadata. */
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  for (const href of INTER_PRELOADS) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html
      lang="pl"
      className={`${geistMono.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* A toast one page leaves for the next (e.g. "account created") */}
        <FlashToast />
        {/* Vercel Web Analytics: cookieless page views, served from this origin
            (/_vercel/insights). That route exists only on Vercel, so builds made
            anywhere else (local `pnpm start`, CI) leave it out instead of 404ing. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
