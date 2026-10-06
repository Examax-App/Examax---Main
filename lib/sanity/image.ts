import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/lib/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** A URL for a Sanity image, honouring its crop and hotspot: `urlFor(post.mainImage).width(1200).url()`. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
