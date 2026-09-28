import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Dokumentacja",
  description:
    "Przewodniki po platformie Examax, odpowiedzi na pytania i materiały do nauki.",
};

export default function DokumentacjaPage() {
  return (
    <PlaceholderPage
      icon={BookOpen}
      title="Dokumentacja"
      description="Przewodniki po platformie, odpowiedzi na pytania i materiały do nauki."
      planned={[
        "Pierwsze kroki — zakładanie konta i wybór egzaminu",
        "Przewodnik po roadmapie nauki i treningu zadań",
        "Jak korzystać z agenta Examax i czytać wskaźnik gotowości",
        "Konta dla klas: zaproszenia, opiekunowie i raporty",
      ]}
    />
  );
}
