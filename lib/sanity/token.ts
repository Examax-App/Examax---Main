/*
 * Sanity's read token (viewer role). Server-only: it is not NEXT_PUBLIC_, so it
 * never reaches a client bundle. It lets the app read drafts in Draft Mode and
 * keeps live updates working; published content needs no token at all, so a
 * missing token is not an error.
 */
export const token = process.env.SANITY_API_READ_TOKEN || undefined;
