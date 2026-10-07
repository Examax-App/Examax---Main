import { defineLive } from "next-sanity/live";
import { client } from "@/lib/sanity/client";
import { token } from "@/lib/sanity/token";

/*
 * The Live Content API: fetch with `sanityFetch` in server components, and
 * render `<SanityLive />` once in the layout of any route that shows Sanity
 * content. Published edits then appear without a redeploy or a webhook.
 * The read token stays on the server. `browserToken` is off because there is
 * no Draft Mode / Visual Editing yet; turn it on (it is sent to the browser,
 * in Draft Mode only) when draft previews are built.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: false,
});
