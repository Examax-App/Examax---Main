import type { Metadata } from "next";
import { SubjectPage } from "@/components/subjects/SubjectPage";
import { MATH } from "@/components/subjects/data/math";

export const metadata: Metadata = {
  title: "Matematyka",
  description: MATH.sub,
  openGraph: { title: "Matematyka — Examax", description: MATH.sub, url: "https://examax.app/math" },
};

/** /math — every area of the maths exams; the layout is SubjectPage's. */
export default function MathPage() {
  return <SubjectPage subject={MATH} />;
}
