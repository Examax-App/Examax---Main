import type { Metadata } from "next";
import Link from "next/link";
import { prefetchFor } from "@/lib/routes";
import { ChevronRight, MessagesSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactHero, FormBand } from "@/components/contact/pieces";
import { SupportForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Wsparcie",
  description: "Napisz do zespołu Examax w sprawie konta lub płatności, zadaj pytanie albo zgłoś problem.",
  openGraph: { title: "Wsparcie — Examax", description: "Jak możemy pomóc?", url: "https://examax.app/contact/support" },
};

/**
 * /contact/support — dub.co/contact/support one to one (the capture is
 * `DesignRules/screenshots/contact-support.png`): the icon over "Support"
 * and a line, a white column on the grey band — dub's holds its support
 * chat; here it is the support form, with an optional category so it takes
 * problem reports, account and payment matters and suggestions — then a
 * one-cell strip back to the help hub (dub's second cell, sales, removed
 * at the user's request on 2026-10-05). `?temat=` picks the category (read in the
 * browser, so the page stays static), so the hub's "Zgłoś problem" lands
 * on the right one.
 */
export default function ContactSupportPage() {
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
        <ContactHero icon={MessagesSquare} title="Wsparcie" sub="Napisz do nas w sprawie konta lub płatności, zadaj pytanie albo zgłoś problem." />
        <FormBand>
          <SupportForm />
        </FormBand>

        {/* The way onward: dub's strip, down to its one help link */}
        <section className="relative overflow-clip border-b border-ash bg-white px-4">
          <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash">
            <Link
              href="/contact"
              prefetch={prefetchFor("/contact")}
              className="focus-ring group flex items-center justify-center gap-1 px-6 py-8 text-base text-fog transition-colors hover:bg-canvas-muted hover:text-charcoal"
            >
              Centrum pomocy Examax
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
