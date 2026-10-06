/**
 * Pages the site links to but has not built yet. Their links land on the
 * 404 by design (see the footer and navbar), so they are never prefetched —
 * otherwise every page load would quietly fetch a handful of 404s as their
 * links scroll into view. Remove a path here once its page exists.
 */
const UNBUILT_ROUTES = new Set(["/docs", "/help", "/reviews", "/tutors", "/careers", "/terms", "/cookies", "/gdpr"]);

/** `prefetch` for a Link: off for an unbuilt page, Next's default otherwise. */
export function prefetchFor(href: string): false | undefined {
  return UNBUILT_ROUTES.has(href.split(/[?#]/)[0]) ? false : undefined;
}
