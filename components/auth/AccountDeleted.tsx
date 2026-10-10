"use client";

import Link from "@/components/ui/Link";
import { AuthHeading } from "@/components/auth/pieces";
import { NoticeIconByName } from "@/components/auth/NoticeIconByName";

/** The body of /account-deleted (also in the dev panel): what happened, and who to ask. */
export function AccountDeleted() {
  return (
    <div className="w-full max-w-sm">
      <NoticeIconByName name="user-x" />
      <AuthHeading description="Jeśli to pomyłka albo masz z tym problem, napisz do nas — pomożemy.">To konto zostało usunięte</AuthHeading>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/contact/support"
          className="flex h-10 w-full items-center justify-center rounded-lg border border-charcoal bg-charcoal text-sm text-white transition-all hover:bg-graphite hover:ring-4 hover:ring-ash"
        >
          Skontaktuj się z nami
        </Link>
        <Link
          href="/"
          className="flex h-10 w-full items-center justify-center rounded-lg border border-ash bg-white text-sm text-charcoal transition-colors hover:bg-canvas-muted"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
}
