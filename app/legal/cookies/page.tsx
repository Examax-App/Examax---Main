import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { COOKIES_SECTIONS, COOKIES_UPDATED } from "@/components/legal/cookies";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Polityka cookies",
  description: "Jak Examax korzysta z plików cookies i podobnych technologii: działanie platformy, bezpieczeństwo i analityka — bez reklamowego śledzenia.",
  path: "/legal/cookies",
});

/** /legal/cookies — the cookie policy, on the same layout as /legal/privacy (see LegalDocument). */
export default function CookiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Polityka cookies", path: "/legal/cookies" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <LegalDocument title="Polityka cookies" sections={COOKIES_SECTIONS} updated={COOKIES_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
