import type { Metadata } from "next";
import { SubjectPage } from "@/components/subjects/SubjectPage";
import { ENGLISH } from "@/components/subjects/data/english";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: ENGLISH.title, description: ENGLISH.sub, path: "/english" });

/** /english — every area of the English exams; the layout is SubjectPage's. */
export default function EnglishPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Język angielski", path: "/english" }])} />
      <SubjectPage subject={ENGLISH} />
    </>
  );
}
