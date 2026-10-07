import Image from "next/image";
import type { UPDATES_QUERY_RESULT } from "@/sanity.types";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/cn";

type Cover = UPDATES_QUERY_RESULT[number]["image"];

/**
 * A changelog post's 16:9 cover, as dub's: 8px radius and a hairline, whose
 * colour the caller sets in `className` (neutral-200 on the list, neutral-100
 * on a post's own page). The Studio's crop and hotspot decide the frame;
 * Sanity serves it at 2400 × 1350 and next/image picks the size for the
 * screen.
 */
export function PostCover({ image, title, preload, className }: { image: Cover; title: string; preload?: boolean; className?: string }) {
  if (!image?.asset) return null;
  return (
    <Image
      src={urlFor(image).width(2400).height(1350).fit("crop").url()}
      alt={image.alt || title}
      width={2400}
      height={1350}
      sizes="(min-width: 1080px) 744px, (min-width: 768px) 75vw, 100vw"
      preload={preload}
      className={cn("aspect-video w-full rounded-lg border object-cover", className)}
    />
  );
}
