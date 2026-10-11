"use client";

import { useState } from "react";
import { AuthButton, FacebookGlyph, GoogleGlyph, MicrosoftGlyph, UNAVAILABLE_DELAY, useResetOnReturn } from "@/components/auth/pieces";
import { startOAuth } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { UI_PREVIEW_ERROR, isUiPreview } from "@/lib/dev/preview";
import type { OAuthProvider, ProviderStatus } from "@/lib/auth/providers";
import type { ToastTone } from "@/components/ui/Toast";

/*
 * Google, Microsoft and Facebook, in that order, shared by login and
 * sign-up (the same call does both: a new address gets an account, a known
 * one signs in). Google goes through Supabase's redirect, or — once
 * GOOGLE_SIGN_IN_VIA_SITE is on — through our own /auth/google, so its screen
 * names examax.app instead of the Supabase project (lib/auth/google.ts).
 * Microsoft goes through Supabase. Both spin while the browser leaves for the
 * provider, and stop again if the visitor comes back with Back. Facebook
 * looks like the others but, until it is switched on in Supabase (Meta's
 * verification is not done), spins for a moment and answers with the "not
 * available yet" toast the passkey and school buttons use.
 */

const PROVIDERS: Array<{ id: OAuthProvider; name: string; icon: React.ReactNode }> = [
  { id: "google", name: "Google", icon: <GoogleGlyph /> },
  { id: "azure", name: "Microsoft", icon: <MicrosoftGlyph /> },
  { id: "facebook", name: "Facebook", icon: <FacebookGlyph /> },
];

export function ProviderButtons({
  providers,
  next,
  notify,
  disabled = false,
}: {
  providers: ProviderStatus;
  next: string;
  notify: (message: string, tone: ToastTone) => void;
  /** Another method is running. */
  disabled?: boolean;
}) {
  const [pending, setPending] = useState<OAuthProvider | null>(null);
  useResetOnReturn(() => setPending(null));

  return (
    <>
      {PROVIDERS.map(({ id, name, icon }) => (
        <AuthButton
          key={id}
          variant="secondary"
          icon={icon}
          loading={pending === id}
          disabled={disabled || (pending !== null && pending !== id)}
          onClick={async () => {
            setPending(id);
            if (id === "facebook" && !providers.facebook) {
              window.setTimeout(() => {
                setPending(null);
                notify("Logowanie przez Facebook nie jest jeszcze dostępne.", "error");
              }, UNAVAILABLE_DELAY);
              return;
            }
            // The dev panel's previews (development only) never leave the page.
            if (isUiPreview()) {
              window.setTimeout(() => {
                setPending(null);
                notify(authErrorMessage(UI_PREVIEW_ERROR), "error");
              }, UNAVAILABLE_DELAY);
              return;
            }
            if (id === "google" && providers.googleViaSite) {
              // A full page load, not the router: /auth/google is a route handler that redirects to Google.
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.assign(`/auth/google?next=${encodeURIComponent(next)}`);
              return;
            }
            const error = await startOAuth(id, next);
            // Only reached when the redirect never started.
            if (error) {
              setPending(null);
              notify(`Nie udało się połączyć z ${name}. Spróbuj ponownie.`, "error");
            }
          }}
        >
          Kontynuuj przez {name}
        </AuthButton>
      ))}
    </>
  );
}
