import type { Metadata } from "next";
import { SubjectPage } from "@/components/subjects/SubjectPage";
import { MATH } from "@/components/subjects/data/math";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: MATH.title, description: MATH.sub, path: "/math" });

/** /math — every area of the maths exams; the layout is SubjectPage's. */
export default function MathPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Matematyka", path: "/math" }])} />
      <SubjectPage subject={MATH} />
    </>
  );
}
