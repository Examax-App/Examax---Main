import Image from "next/image";
import Link from "@/components/ui/Link";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { BlockContent } from "@/sanity.types";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/cn";

/**
 * Prose, as dub's posts set it (`prose prose-neutral`, read off the live
 * page): 16px on 28px in neutral-700, 20px between paragraphs, a disc list
 * indented 32px with 8px between items, links in medium neutral-500
 * underlined 4px below the text and darkening on hover. Headings, numbered
 * lists, quotes and code follow the same scale, for whatever the Studio's
 * rich text allows.
 */
const PROSE =
  "text-[16px] leading-[28px] text-slate [&_a]:font-medium [&_a]:text-fog [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-black [&_li]:my-2 [&_li]:pl-1.5 [&_p]:my-5 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-charcoal [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-8 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-8 [&_li::marker]:text-slate [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:scroll-mt-20 [&_h2]:font-satoshi [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-charcoal [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:scroll-mt-20 [&_h3]:font-satoshi [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-charcoal [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-ash [&_blockquote]:pl-5 [&_blockquote]:font-medium [&_blockquote]:text-charcoal [&_code]:font-mono [&_code]:text-[14px] [&_code]:font-medium [&_code]:text-charcoal";

/** An image asset's size, read from its id ("image-<hash>-2560x1440-png"), so inline images keep their own shape. */
function assetSize(ref: string | undefined) {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z]+$/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 16, height: 9 };
}

const components: PortableTextComponents = {
  marks: {
    /** Site paths stay in the app; email links open the mail client; anything else opens in a new tab, as dub's do. */
    link: ({ value, children }) => {
      const href: string = value?.href ?? "";
      if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
      if (href.startsWith("mailto:")) return <a href={href}>{children}</a>;
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const { width, height } = assetSize(value.asset._ref);
      return (
        <Image
          src={urlFor(value).width(2400).fit("max").url()}
          alt={value.alt ?? ""}
          width={2400}
          height={Math.round((2400 * height) / width)}
          sizes="(min-width: 1080px) 744px, (min-width: 768px) 75vw, 100vw"
          className="my-8 w-full rounded-lg border border-ash"
        />
      );
    },
  },
};

/** A changelog post's rich text from Sanity. */
export function PostBody({ value, className }: { value: BlockContent | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cn(PROSE, className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
