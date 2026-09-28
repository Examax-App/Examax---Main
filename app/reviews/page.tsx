import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Opinie",
  description:
    "Historie uczniów przygotowujących się z Examax i opinie społeczności.",
};

export default function OpiniePage() {
  return (
    <PlaceholderPage
      icon={Quote}
      title="Opinie"
      description="Historie uczniów, którzy przygotowywali się z Examax, i opinie społeczności."
      planned={[
        "Historie uczniów przed egzaminem i po nim",
        "Opinie nauczycieli i opiekunów korzystających z kont dla klas",
        "Wyniki i postępy zgłaszane przez społeczność",
        "Materiały wideo i dłuższe rozmowy z uczniami",
      ]}
    />
  );
}
