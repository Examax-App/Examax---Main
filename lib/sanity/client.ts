import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/lib/sanity/env";

/** Published content only, through Sanity's CDN — the fast path for every page that renders it. */
export const client = createClient({ projectId, dataset, apiVersion, useCdn: true });
