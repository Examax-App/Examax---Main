"use client";

import Link from "@/components/ui/Link";
import { AuthHeading } from "@/components/auth/pieces";
import { NoticeIconByName } from "@/components/auth/NoticeIconByName";
import { VerifyResend } from "@/components/auth/VerifyResend";

/*
 * The body of /verify: where a link that did not work ends up (/auth/confirm
 * sends `?error=`), where anyone can ask for a fresh activation link, and
 * the halfway point of a secure address change (`?notice=`). A reset or an
 * address change cannot be resent from here — those start again where they
 * began. Shared by the page and the dev panel.
 */

const primaryLink =
  "flex h-10 w-full items-center justify-center rounded-lg border border-charcoal bg-charcoal text-sm text-white transition-all hover:bg-graphite hover:ring-4 hover:ring-ash";

export function VerifyView({ error, type, notice }: { error?: string; type?: string; notice?: string }) {
  if (notice === "email-change-pending") {
    return (
      <div className="w-full max-w-sm">
        <NoticeIconByName name="mail" />
        <AuthHeading description="Kliknij jeszcze link wysłany na drugi adres, aby dokończyć zmianę.">Jeden adres potwierdzony</AuthHeading>
        <div className="mt-8">
          <Link
            href="/welcome"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-ash bg-white text-sm text-charcoal transition-colors hover:bg-canvas-muted"
          >
            Przejdź do konta
          </Link>
        </div>
      </div>
    );
  }

  const failed = error === "expired" || error === "invalid";
  const title = !failed ? "Wyślij nowy link aktywacyjny" : error === "expired" ? "Link wygasł" : "Ten link nie działa";
  const description = !failed
    ? "Podaj adres, na który zakładasz konto Examax."
    : type === "recovery"
      ? "Linki do zmiany hasła działają tylko raz i przez krótki czas. Poproś o nowy na stronie logowania."
      : type === "email_change"
        ? "Linki potwierdzające zmianę adresu działają tylko raz i przez krótki czas. Zmień adres ponownie w ustawieniach konta."
        : "Linki aktywacyjne działają tylko raz i przez krótki czas. Wyślemy Ci nowy.";

  return (
    <div className="w-full max-w-sm">
      <NoticeIconByName name={failed ? "link-off" : "mail"} />
      <AuthHeading description={description}>{title}</AuthHeading>
      <div className="mt-8">
        {type === "recovery" ? (
          <Link href="/login" className={primaryLink}>
            Wróć do logowania
          </Link>
        ) : type === "email_change" ? (
          <Link href="/welcome" className={primaryLink}>
            Przejdź do konta
          </Link>
        ) : (
          <VerifyResend />
        )}
      </div>
      <p className="mt-6 text-center text-sm font-medium text-fog">
        Masz już aktywne konto?&nbsp;
        <Link href="/login" className="font-semibold text-slate transition-colors hover:text-charcoal">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
