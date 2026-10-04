import type { Metadata } from "next";
import { SubjectPage } from "@/components/subjects/SubjectPage";
import { ENGLISH } from "@/components/subjects/data/english";

export const metadata: Metadata = {
  title: "Język angielski",
  description: ENGLISH.sub,
  openGraph: { title: "Język angielski — Examax", description: ENGLISH.sub, url: "https://examax.app/english" },
};

/** /english — every area of the English exams; the layout is SubjectPage's. */
export default function EnglishPage() {
  return <SubjectPage subject={ENGLISH} />;
}
