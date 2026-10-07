import type { Metadata } from "next";
import { SubjectPage } from "@/components/subjects/SubjectPage";
import { POLISH } from "@/components/subjects/data/polish";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: POLISH.title, description: POLISH.sub, path: "/polish" });

/** /polish — every area of the Polish exams; the layout is SubjectPage's. */
export default function PolishPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Język polski", path: "/polish" }])} />
      <SubjectPage subject={POLISH} />
    </>
  );
}
