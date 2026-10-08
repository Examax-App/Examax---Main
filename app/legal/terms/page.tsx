import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { TERMS_SECTIONS, TERMS_UPDATED } from "@/components/legal/terms";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Regulamin",
  description: "Zasady korzystania z Examax: konto, plany i subskrypcje, zwroty płatności, funkcje AI, materiały CKE i prawa autorskie.",
  path: "/legal/terms",
});

/** /legal/terms — the terms of service, on the same layout as /legal/privacy (see LegalDocument). */
export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Regulamin", path: "/legal/terms" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <LegalDocument title="Regulamin" sections={TERMS_SECTIONS} updated={TERMS_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
