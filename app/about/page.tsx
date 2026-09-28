import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "O Examax",
  description:
    "Misja, wizja i to, po co powstał Examax — platforma przygotowań do egzaminów CKE.",
};

export default function ONasPage() {
  return (
    <PlaceholderPage
      icon={Compass}
      title="O Examax"
      description="Po co powstał Examax, dla kogo go budujemy i dokąd zmierzamy."
      planned={[
        "Misja i wizja — dlaczego przygotowania do CKE wymagają lepszego narzędzia",
        "Historia projektu i kolejne etapy rozwoju platformy",
        "Zespół, który stoi za Examax",
        "Zasady, według których projektujemy produkt i pracujemy z danymi uczniów",
      ]}
    />
  );
}
