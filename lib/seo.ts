import type { Metadata } from "next";

export const SITE_URL = "https://examax.app";
export const SITE_NAME = "Examax";
/** Polish everywhere: the language of every page, card and feed. */
export const SITE_LOCALE = "pl_PL";
export const X_HANDLE = "@examaxapp";
/** The landing page's search snippet, and the site's description in structured data. */
export const SITE_DESCRIPTION =
  "Examax to system przygotowań do egzaminu ósmoklasisty i matury: roadmapa nauki, zadania z arkuszy CKE, Korepetytor AI i śledzenie postępów w jednym miejscu.";

/**
 * The share card app/opengraph-image.tsx renders. The root layout picks it up
 * on its own; a page that sets `openGraph` loses it, so pageMetadata names it.
 */
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Examax — przygotowanie do matury i egzaminu ósmoklasisty",
};

/**
 * Who publishes the site and what it is called, for search engines: the
 * Organization gives results their logo and profiles, the WebSite gives them
 * the site name. Rendered once, on the landing page.
 */
export function siteStructuredData({ email, sameAs }: { email: string; sameAs: string[] }) {
  const organization = `${SITE_URL}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organization,
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/web-app-manifest-512x512.png`, width: 512, height: 512 },
        email,
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        /* Google's site-name lookup: what to call the site if "Examax" alone won't do. */
        alternateName: ["examax.app", "Examax.app"],
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        inLanguage: "pl-PL",
        publisher: { "@id": organization },
      },
    ],
  };
}

/**
 * Where a page sits in the site, for search engines: results then show
 * "Examax › Cennik" instead of the bare URL. Pass the trail below the home
 * page, e.g. `[{ name: "Kontakt", path: "/contact" }, { name: "Wsparcie", path: "/contact/support" }]`.
 * Names match the navbar and footer labels.
 */
export function breadcrumbStructuredData(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: SITE_NAME, path: "/" }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`,
    })),
  };
}

/**
 * The share card's fields every page repeats. A page that sets `openGraph`
 * replaces the root layout's object whole (metadata merges shallowly), so
 * these are spread back in rather than inherited.
 */
const OPEN_GRAPH_BASE = { siteName: SITE_NAME, locale: SITE_LOCALE, type: "website" } as const;

/**
 * Metadata for one public page: its title and description, the canonical
 * URL, and the Open Graph and X cards built from them. `social` overrides
 * the cards' title and description where a page words its share card
 * differently from its search snippet; `image` replaces the site-wide
 * share image (a changelog post uses its cover).
 */
export function pageMetadata({
  title,
  description,
  path,
  social = {},
  image = SHARE_IMAGE,
}: {
  title: string;
  description: string;
  /** The page's path, "/" for the landing page. */
  path: string;
  social?: { title?: string; description?: string };
  image?: { url: string; width: number; height: number; alt: string; type?: string };
}): Metadata {
  const cardTitle = social.title ?? `${title} — ${SITE_NAME}`;
  const cardDescription = social.description ?? description;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH_BASE, url: path, title: cardTitle, description: cardDescription, images: [image] },
    twitter: { card: "summary_large_image", site: X_HANDLE, title: cardTitle, description: cardDescription, images: [image] },
  };
}
