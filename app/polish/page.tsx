import type { Metadata } from "next";
import { SubjectPage } from "@/components/subjects/SubjectPage";
import { POLISH } from "@/components/subjects/data/polish";

export const metadata: Metadata = {
  title: "Język polski",
  description: POLISH.sub,
  openGraph: { title: "Język polski — Examax", description: POLISH.sub, url: "https://examax.app/polish" },
};

/** /polish — every area of the Polish exams; the layout is SubjectPage's. */
export default function PolishPage() {
  return <SubjectPage subject={POLISH} />;
}
