import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Supabase with the secret key (sb_secret_…), which bypasses Row Level
 * Security and can manage any user. Server-only — `server-only` makes the
 * build fail if a client module ever imports this file. Used for the one
 * thing a visitor's own session cannot do: deleting their account.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set (see .env.example).");
  return createClient(supabaseEnv().url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
