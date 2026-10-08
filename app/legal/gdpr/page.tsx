import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { GDPR_SECTIONS, GDPR_UPDATED } from "@/components/legal/gdpr";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "RODO",
  description: "Ochrona danych osobowych w Examax zgodnie z RODO: administrator, podstawy prawne, okres przechowywania, Twoje prawa i skarga do UODO.",
  path: "/legal/gdpr",
});

/** /legal/gdpr — the GDPR (RODO) notice, on the same layout as /legal/privacy (see LegalDocument). */
export default function GdprPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "RODO", path: "/legal/gdpr" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <LegalDocument title="RODO" sections={GDPR_SECTIONS} updated={GDPR_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
