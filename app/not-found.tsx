import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
};

/**
 * The 404, as dub.co's own (`DesignRules/404 _ Dub.png`, markup read off the
 * live page): the site's navbar and footer around a centred "404" in the
 * display face and one line with the way home — same sizes, same copy, in
 * Polish.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex min-h-[40vh] flex-col items-center justify-center gap-4 bg-white px-4 py-20 text-center">
        <h1 className="font-satoshi text-4xl font-bold text-charcoal">404</h1>
        <p className="text-body-xl text-charcoal">
          Ta strona jest w budowie, zmieniła adres albo nie istnieje. Wróć na{" "}
          <Link href="/" className="text-steel underline underline-offset-4 transition-colors hover:text-charcoal">
            stronę główną
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
