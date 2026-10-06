import type { Metadata } from "next";
import { ShieldUser } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExamStrip } from "@/components/about/ExamStrip";
import { ContactHero, FormBand } from "@/components/contact/pieces";
import { ContactForm } from "@/components/contact/ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Porozmawiaj z nami",
  description: "Umów prezentację Examaxu i porozmawiaj o dostępie dla szkoły, cenach dla grup albo integracjach.",
  path: "/contact/sales",
  social: { description: "Examax dla szkół i klas." },
});

/**
 * /contact/sales — dub.co/contact/sales one to one (the capture is
 * `DesignRules/screenshots/contact-sales.png`): the icon over the title and
 * a line, the form in its white column on the grey band, then the logo
 * strip. dub's strip is its customers; Examax has none to name, so it is
 * the about page's strip of exams and subjects.
 */
export default function ContactSalesPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <ContactHero
          icon={ShieldUser}
          title="Porozmawiaj z naszym zespołem"
          sub="Umów prezentację i porozmawiaj o dostępie dla szkoły, cenach dla grup i integracjach."
        />
        <FormBand>
          <ContactForm kind="sales" />
        </FormBand>
        <ExamStrip />
      </main>
      <Footer />
    </>
  );
}
