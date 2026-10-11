"use client";

import { authErrorMessage } from "@/lib/auth/errors";

/*
 * Passkeys (Supabase Auth's WebAuthn: registerPasskey, signInWithPasskey,
 * auth.passkey.list/delete). Supabase's relying party is examax.app, so the
 * browser only lets passkeys be created and used there — on localhost and
 * preview hosts the ceremony fails with ERROR_INVALID_DOMAIN / RP_ID, and the
 * forms say so in words.
 */

export type PasskeyItem = { id: string; name: string; createdAt: string; lastUsedAt: string | null };

/**
 * A name for a passkey created on this device. Supabase does not report
 * which authenticator holds a passkey, so the name comes from the device it
 * is being added on — what the student will recognise in the list.
 */
export function passkeyDeviceName() {
  const ua = navigator.userAgent;
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? "";
  const touch = navigator.maxTouchPoints > 1;
  if (/iPhone/.test(ua)) return "Face ID · iPhone";
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch)) return "Touch ID · iPad";
  if (/Mac/i.test(platform) || /Macintosh/.test(ua)) return "Touch ID · Mac";
  if (/Android/.test(ua)) return "Odcisk palca · Android";
  if (/Win/i.test(platform) || /Windows/.test(ua)) return "Windows Hello";
  if (/CrOS/.test(ua)) return "Chromebook";
  return "Klucz dostępu";
}

export const passkeysSupported = () => typeof window !== "undefined" && typeof window.PublicKeyCredential === "function";

type WebAuthnLike = { name?: string; code?: string; message?: string; status?: number } | null | undefined;

/** A failed passkey ceremony in the student's words; null when they simply cancelled. */
export function passkeyErrorMessage(error: WebAuthnLike): string | null {
  if (!error) return null;
  if (error.code === "ERROR_CEREMONY_ABORTED") return null;
  if (error.code === "ERROR_INVALID_DOMAIN" || error.code === "ERROR_INVALID_RP_ID") return "Klucze dostępu działają tylko na examax.app.";
  if (error.code === "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED") return "To urządzenie ma już klucz dostępu do tego konta.";
  // NotAllowedError: the prompt was closed or timed out.
  if (error.name === "NotAllowedError" || /NotAllowedError|not allowed|cancel/i.test(error.message ?? "")) return "Anulowano. Spróbuj ponownie, gdy będziesz gotowy.";
  if (error.code === "webauthn_challenge_expired") return "Minęło zbyt dużo czasu. Spróbuj ponownie.";
  if (typeof error.code === "string" && error.code.startsWith("ERROR_")) return "Nie udało się użyć klucza dostępu na tym urządzeniu.";
  return authErrorMessage(error as Parameters<typeof authErrorMessage>[0]);
}
