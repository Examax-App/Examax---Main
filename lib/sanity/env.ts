/*
 * The Sanity project the app reads. Both values are public by design (they
 * name the project, they grant nothing; the Studio repo has them in its
 * config too), so they are NEXT_PUBLIC_ and safe in any module. The env vars
 * win when set; the fallbacks keep builds working where they are not (CI,
 * Vercel Preview). The Studio is its own repo, Examax-App/Examax---CMS, and
 * is never embedded here. next.config.ts reads these too (CSP, images).
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "64k3ozib";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Pinned on purpose: bump it deliberately, never to "today" at runtime. */
export const apiVersion = "2026-10-06";
