import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-local",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono-local",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
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
  metadataBase: new URL("https://examax.app"),
  title: {
    default: "Examax — Zamień naukę w wyniki",
    template: "%s — Examax",
  },
  description:
    "Examax to kompletny system przygotowań do egzaminu ósmoklasisty i matury: roadmapa nauki, zadania z arkuszy CKE, agent AI i śledzenie postępów — wszystko w jednym miejscu.",
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
      "Kompletny system przygotowań do egzaminu ósmoklasisty i matury: roadmapa nauki, zadania z arkuszy CKE i agent AI.",
    url: "https://examax.app",
    siteName: "Examax",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Examax — Zamień naukę w wyniki",
    description:
      "Kompletny system przygotowań do egzaminu ósmoklasisty i matury: roadmapa nauki, zadania z arkuszy CKE i agent AI.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${geistMono.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
