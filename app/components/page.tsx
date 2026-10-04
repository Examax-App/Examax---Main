import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentsGallery } from "@/components/dev/ComponentsGallery";

export const metadata: Metadata = {
  title: "Komponenty",
  robots: { index: false, follow: false },
};

/**
 * /components — the design system's internal gallery. A development tool,
 * not part of the site: in production it is a 404, so the public build
 * exposes nothing but the pages themselves.
 */
export default function ComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ComponentsGallery />;
}
