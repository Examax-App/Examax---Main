import { defineQuery } from "next-sanity";

/*
 * The blog's GROQ queries. TypeGen (run from the Studio: `npm run typegen`)
 * reads them and writes their result types to sanity.types.ts.
 */

/** Every published post with a slug, newest first — what a post list needs. */
export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  "author": author->{ name, "slug": slug.current, image },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`);

/** One post by its slug, with everything its page renders. */
export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  body,
  "author": author->{ name, "slug": slug.current, image, bio },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`);

/** Every post's slug, for static generation and the sitemap. */
export const POST_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`);
