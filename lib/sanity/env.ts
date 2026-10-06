/*
 * The Sanity project the app reads. Both values are public by design (they
 * name the project, they grant nothing), so they are NEXT_PUBLIC_ and safe in
 * any module. The Studio lives in its own folder beside this app
 * (../studio-examax) and is never embedded here.
 */

function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing environment variable ${name} — see .env.local`);
  return value;
}

export const projectId = required("NEXT_PUBLIC_SANITY_PROJECT_ID", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const dataset = required("NEXT_PUBLIC_SANITY_DATASET", process.env.NEXT_PUBLIC_SANITY_DATASET);

/** Pinned on purpose: bump it deliberately, never to "today" at runtime. */
export const apiVersion = "2026-10-06";
