"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Loader2, Plus, ScanFace } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { passkeyDeviceName, passkeyErrorMessage, passkeysSupported, type PasskeyItem } from "@/lib/auth/passkeys";
import type { ToastTone } from "@/components/ui/Toast";

/*
 * The account's passkeys on /welcome: "+" adds one through the device's own
 * prompt (Touch ID, Face ID, Windows Hello…) — Supabase's registerPasskey()
 * runs the whole WebAuthn ceremony — and names it after the device; each
 * passkey has its row with when it was added and last used, and a red
 * "Usuń". Passkeys work on examax.app only (Supabase's relying party); on
 * other hosts the prompt fails and the toast says why.
 */

const day = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", year: "numeric" });

function PasskeyMark({ name }: { name: string }) {
  const Icon = /Face ID/.test(name) ? ScanFace : Fingerprint;
  return (
    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-md border border-ash bg-canvas-muted text-steel">
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  );
}

export function PasskeysCard({ passkeys, notify }: { passkeys: PasskeyItem[]; notify: (message: string, tone: ToastTone) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const add = async () => {
    if (!passkeysSupported()) return notify("Ta przeglądarka nie obsługuje kluczy dostępu.", "error");
    setAdding(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.registerPasskey();
      if (error || !data) {
        const message = passkeyErrorMessage(error);
        if (message) notify(message, "error");
        return;
      }
      // Named after this device, so the list reads "Touch ID · Mac" rather than an id.
      await supabase.auth.passkey.update({ passkeyId: data.id, friendlyName: passkeyDeviceName() });
      notify("Klucz dostępu został dodany.", "success");
      router.refresh();
    } finally {
      setAdding(false);
    }
  };

  const remove = async (passkey: PasskeyItem) => {
    setRemoving(passkey.id);
    try {
      const { error } = await createClient().auth.passkey.delete({ passkeyId: passkey.id });
      if (error) return notify(passkeyErrorMessage(error) ?? "Nie udało się usunąć klucza dostępu.", "error");
      notify("Klucz dostępu został usunięty.", "success");
      router.refresh();
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="mt-4 divide-y divide-ash rounded-cards border border-ash bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-fog">Klucze dostępu</p>
          <p className="mt-1 text-sm text-charcoal">{passkeys.length ? "Logowanie bez hasła na tych urządzeniach" : "Brak"}</p>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={adding}
          aria-label="Dodaj klucz dostępu"
          className="focus-ring grid size-8 shrink-0 cursor-pointer place-items-center rounded-md border border-ash bg-white text-steel transition-colors hover:bg-canvas-muted hover:text-charcoal disabled:cursor-wait disabled:text-silver"
        >
          {adding ? <Loader2 className="size-3.5 animate-spin" strokeWidth={2} aria-hidden /> : <Plus className="size-3.5" strokeWidth={2} aria-hidden />}
        </button>
      </div>

      {passkeys.map((passkey) => (
        <div key={passkey.id} className="flex items-center gap-3 px-4 py-3">
          <PasskeyMark name={passkey.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-charcoal">{passkey.name}</p>
            <p className="truncate text-xs text-fog">
              Dodano {day.format(new Date(passkey.createdAt))}
              {passkey.lastUsedAt ? ` · użyty ${day.format(new Date(passkey.lastUsedAt))}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(passkey)}
            disabled={removing !== null}
            className="shrink-0 cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-alert-red transition-colors hover:bg-[#fef2f2] hover:text-[#b91c1c] disabled:cursor-wait disabled:opacity-60"
          >
            {removing === passkey.id ? "Usuwanie…" : "Usuń"}
          </button>
        </div>
      ))}
    </div>
  );
}
