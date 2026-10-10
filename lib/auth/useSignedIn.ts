"use client";

import { useSyncExternalStore } from "react";
import { supabaseOrigin } from "@/lib/supabase/env";

/*
 * Whether this browser holds a Supabase session, for the marketing pages'
 * navbar ("Przejdź do panelu" instead of "Zaloguj się" / "Zacznij teraz").
 * It only looks for the session cookie (`sb-<project>-auth-token`, possibly
 * split into .0, .1 …), so the static pages stay static and no request is
 * made. It is a hint, not a check: /welcome verifies the session on the
 * server and sends anyone without a valid one to /login.
 */

const cookiePrefix = supabaseOrigin ? `sb-${new URL(supabaseOrigin).hostname.split(".")[0]}-auth-token` : null;

const hasSessionCookie = () =>
  Boolean(cookiePrefix) && document.cookie.split(";").some((part) => part.trim().startsWith(`${cookiePrefix}=`) || part.trim().startsWith(`${cookiePrefix}.`));

const subscribe = () => () => {};

export function useSignedIn() {
  return useSyncExternalStore(subscribe, hasSessionCookie, () => false);
}
