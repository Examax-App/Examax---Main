import { SanityLive } from "@/lib/sanity/live";

/**
 * /updates and every post under it read Sanity. <SanityLive /> listens for
 * content changes and refreshes the cached pages when a post is published or
 * edited, with no redeploy. It lives here, not in the root layout, so the
 * rest of the site loads nothing from Sanity.
 */
export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SanityLive />
    </>
  );
}
