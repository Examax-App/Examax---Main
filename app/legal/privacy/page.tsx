import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from "@/components/legal/privacy";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Polityka prywatności",
  description: "Jakie dane przetwarza Examax, w jakim celu, komu je powierzamy i jakie prawa przysługują Ci na podstawie RODO.",
  path: "/legal/privacy",
});

/** /legal/privacy — the privacy policy, on dub.co/legal/privacy's layout (see LegalDocument). */
export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Polityka prywatności", path: "/legal/privacy" }])} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <LegalDocument title="Polityka prywatności" sections={PRIVACY_SECTIONS} updated={PRIVACY_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
