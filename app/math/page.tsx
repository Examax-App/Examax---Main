import type { Metadata } from "next";
import { SubjectPage } from "@/components/subjects/SubjectPage";
import { MATH } from "@/components/subjects/data/math";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: MATH.title,
  description:
    "Matematyka do egzaminu ósmoklasisty i matury podstawowej i rozszerzonej: wszystkie działy, zadania z arkuszy CKE i plan nauki krok po kroku.",
  path: "/math",
  keywords: [
    "matura z matematyki",
    "egzamin ósmoklasisty z matematyki",
    "zadania maturalne z matematyki",
    "matura rozszerzona z matematyki",
    "nauka matematyki krok po kroku",
  ],
});

/** /math — every area of the maths exams; the layout is SubjectPage's. */
export default function MathPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData([{ name: "Matematyka", path: "/math" }])} />
      <SubjectPage subject={MATH} />
    </>
  );
}
