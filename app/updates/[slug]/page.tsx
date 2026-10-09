import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EXAMAX_SOCIALS, FacebookIcon, TikTokIcon, XIcon, type SocialIcon } from "@/components/ui/SocialIcons";
import { formatDate } from "@/components/updates/format";
import { PostBody } from "@/components/updates/PostBody";
import { PostCover } from "@/components/updates/PostCover";
import { urlFor } from "@/lib/sanity/image";
import { sanityFetch } from "@/lib/sanity/live";
import { UPDATE_QUERY, UPDATES_QUERY } from "@/lib/sanity/queries";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

/**
 * /updates/[slug] — one changelog post, a one-to-one of a dub.co/changelog
 * post page (read off its live DOM on 2026-10-07):
 *
 *   a short ruled strip fading in under the navbar
 *   then one ruled band on a four-column grid — "Wszystkie wpisy" and the
 *   date in the first column; the title (Satoshi 30, medium), the 16:9
 *   cover (8px radius, neutral-100 hairline), the authors with the share
 *   links across from them, and the prose across the other three
 *   then a short ruled strip fading out above the footer
 *
 * Every published post is built ahead of time; a post published later is
 * rendered on its first visit. <SanityLive /> in the layout keeps both fresh.
 */

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const { data } = await sanityFetch({ query: UPDATE_QUERY, params: { slug }, perspective: "published", stega: false });
  return data;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({ query: UPDATES_QUERY, perspective: "published", stega: false });
  return data.flatMap((post) => (post.slug ? [{ slug: post.slug }] : []));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post?.title) return {};
  const path = `/updates/${post.slug}`;
  const image = post.image?.asset
    ? { url: urlFor(post.image).width(1200).height(630).fit("crop").url(), width: 1200, height: 630, alt: post.image.alt || post.title }
    : undefined;
  return pageMetadata({ title: post.title, description: post.summary ?? "", path, image });
}

const TIKTOK_PROFILE = EXAMAX_SOCIALS.find((social) => social.icon === TikTokIcon)?.href ?? "https://www.tiktok.com/@examax.app";

/**
 * Dub's share row, 20px, growing a little on hover: X and Facebook share the
 * post; TikTok has no share link, so it opens Examax's own profile. (No
 * LinkedIn: Examax has no page there yet.)
 */
function ShareLinks({ title, url, className }: { title: string; url: string; className: string }) {
  const links: Array<{ label: string; href: string; icon: SocialIcon }> = [
    { label: "Udostępnij na X", href: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, icon: XIcon },
    { label: "Examax na TikToku", href: TIKTOK_PROFILE, icon: TikTokIcon },
    { label: "Udostępnij na Facebooku", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: FacebookIcon },
  ];
  return (
    <div className={className}>
      {links.map(({ label, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="focus-ring rounded text-graphite transition-all hover:scale-110">
          <Icon className="size-5 p-px" />
        </a>
      ))}
    </div>
  );
}

export default async function UpdatePostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post?.title || !post.slug) notFound();

  const url = `${SITE_URL}/updates/${post.slug}`;
  const authors = post.authors ?? [];
  const organization = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL };

  return (
    <>
      <JsonLd
        data={breadcrumbStructuredData([
          { name: "Aktualności", path: "/updates" },
          { name: post.title, path: `/updates/${post.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary ?? undefined,
          datePublished: post.publishedAt ?? undefined,
          image: post.image?.asset ? [urlFor(post.image).width(1200).height(675).fit("crop").url()] : undefined,
          url,
          mainEntityOfPage: url,
          inLanguage: "pl-PL",
          author: authors.length ? authors.map((author) => ({ "@type": "Person", name: author.name })) : organization,
          publisher: organization,
        }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        {/* The reference's short strip under the navbar, its rules fading in */}
        <div className="border-b border-ash px-4">
          <div aria-hidden className="mx-auto h-8 max-w-[var(--page-max-width)] border-x border-ash [mask-image:linear-gradient(transparent,black)]" />
        </div>

        <article aria-labelledby="post-title" className="border-b border-ash bg-white px-4">
          <div className="mx-auto grid max-w-[var(--page-max-width)] grid-cols-1 gap-y-4 border-x border-ash px-4 pb-12 pt-4 sm:px-12 sm:pb-20 sm:pt-12 md:grid-cols-4">
            <div className="flex flex-col gap-2 md:gap-4">
              <Link href="/updates" className="group flex w-fit items-center gap-1.5 text-sm font-medium text-graphite">
                <ChevronLeft className="size-3 text-fog transition-transform group-hover:-translate-x-0.5" strokeWidth={2} aria-hidden />
                Wszystkie wpisy
              </Link>
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="flex items-center text-sm font-medium text-graphite">
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </div>

            <div className="flex flex-col md:col-span-3">
              <h1 id="post-title" className="font-satoshi text-2xl font-medium text-graphite sm:text-3xl">
                {post.title}
              </h1>
              <PostCover image={post.image} title={post.title} preload className="mt-5 border-paper-mist" />

              <div className="my-8 flex items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  {authors.map((author) => (
                    <div key={author._id} className="flex items-center gap-3">
                      {author.image?.asset && (
                        <Image
                          src={urlFor(author.image).width(72).height(72).fit("crop").url()}
                          alt={author.image.alt || author.name || ""}
                          width={36}
                          height={36}
                          className="size-9 rounded-full"
                        />
                      )}
                      <p className="whitespace-nowrap text-sm font-medium text-slate">{author.name}</p>
                    </div>
                  ))}
                </div>
                <ShareLinks title={post.title} url={url} className="hidden items-center gap-x-6 md:flex" />
              </div>

              <PostBody value={post.body} />
              <ShareLinks title={post.title} url={url} className="mt-8 flex items-center justify-end gap-x-6 md:hidden" />
            </div>
          </div>
        </article>

        {/* The reference's short strip above the footer, its rules fading out */}
        <div className="px-4">
          <div aria-hidden className="mx-auto h-12 max-w-[var(--page-max-width)] border-x border-ash [mask-image:linear-gradient(black,transparent)]" />
        </div>
      </main>
      <Footer />
    </>
  );
}
