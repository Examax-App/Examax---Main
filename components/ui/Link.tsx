"use client";

import NextLink from "next/link";
import { useState } from "react";
import { prefetchFor } from "@/lib/routes";

type LinkProps = React.ComponentProps<typeof NextLink>;

/**
 * next/link, prefetching on intent instead of on sight.
 *
 * Next's default prefetches every page whose link enters the viewport — on a
 * page as link-dense as ours (navbar, CTAs, a footer of ~30 links) that is
 * hundreds of KB of other pages' JavaScript downloaded for visits that mostly
 * never happen. Here a link stays cold until the visitor points at it, focuses
 * it or touches it, and only then prefetches as Next would have — still well
 * before the click lands, which is the pattern Next's prefetching guide
 * recommends. `prefetch={false}` (and the unbuilt routes in lib/routes.ts)
 * still turn it off entirely.
 */
export default function Link({ prefetch, href, onMouseEnter, onFocus, onTouchStart, ...props }: LinkProps) {
  const [intent, setIntent] = useState(false);
  const allowed = prefetch !== false && (typeof href !== "string" || prefetchFor(href) !== false);
  return (
    <NextLink
      {...props}
      href={href}
      prefetch={allowed && intent ? prefetch : false}
      onMouseEnter={(event) => {
        setIntent(true);
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        setIntent(true);
        onFocus?.(event);
      }}
      onTouchStart={(event) => {
        setIntent(true);
        onTouchStart?.(event);
      }}
    />
  );
}
