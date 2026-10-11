"use client";

import { useEffect, useRef } from "react";
import Link from "@/components/ui/Link";
import { AuthHeading } from "@/components/auth/pieces";
import { FormSubmit } from "@/components/auth/FormSubmit";
import { NoticeIconByName } from "@/components/auth/NoticeIconByName";
import { CONFIRM_COPY, type LinkIntent } from "@/lib/auth/emailLinks";

/*
 * The body of /auth/confirm, where every e-mail link lands. With `autoSubmit`
 * (the real page) the form sends itself the moment the page opens, so one
 * click in the e-mail is all it takes: the token is spent, and the visitor
 * lands where the link leads, with a toast saying what happened. It is still
 * a POST made by the page's script, not a GET — mail scanners that merely
 * fetch links do not run it, so they cannot use a link up. The button stays
 * as the fallback (no JavaScript, a slow device). The page passes the server
 * action; the dev panel passes a stand-in.
 */

export function ConfirmCard({
  intent,
  fields,
  action,
  autoSubmit = false,
}: {
  intent: LinkIntent;
  /** Hidden inputs the action reads: token_hash, type, next, intent. */
  fields: Record<string, string>;
  action: (formData: FormData) => void | Promise<void>;
  /** Send the form as soon as it mounts (once, even under React's double effects). */
  autoSubmit?: boolean;
}) {
  const copy = CONFIRM_COPY[intent];
  const form = useRef<HTMLFormElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (!autoSubmit || sent.current) return;
    sent.current = true;
    form.current?.requestSubmit();
  }, [autoSubmit]);

  return (
    <div className="w-full max-w-sm">
      <NoticeIconByName name={copy.icon} />
      <AuthHeading description={copy.description}>{copy.title}</AuthHeading>
      <form ref={form} action={action} className="mt-8">
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <FormSubmit>{copy.button}</FormSubmit>
      </form>
    </div>
  );
}

/** A link that arrived without its token — cut short by the mail app, or typed by hand. */
export function ConfirmInvalid() {
  return (
    <div className="w-full max-w-sm">
      <NoticeIconByName name="mail" />
      <AuthHeading description="Ten link jest niepełny. Otwórz go ponownie z wiadomości albo poproś o nowy.">Nieprawidłowy link</AuthHeading>
      <p className="mt-8 text-center text-sm font-medium text-fog">
        <Link href="/verify" className="font-semibold text-slate transition-colors hover:text-charcoal">
          Wyślij nowy link
        </Link>
      </p>
    </div>
  );
}
