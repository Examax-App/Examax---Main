import { FileText, Gauge, RefreshCcw, Route } from "lucide-react";
import { AgentIcon } from "@/components/ui/AgentIcon";
import type { Accent } from "@/components/ui/FeaturePill";
import type { IconComponent } from "@/lib/icon";

export type Release = {
  date: string;
  title: string;
  description: string;
  icon: IconComponent;
  accent: Accent;
};

/* ---------------------------------------------------------------------------
 * PLACEHOLDER RELEASES — dates, titles and summaries are illustrative and
 * should be replaced by the real changelog before launch.
 *
 * One list, read by both the landing page's changelog strip and /updates.
 * These were two copies of the same five entries, which is exactly how a
 * changelog ends up disagreeing with itself.
 * ------------------------------------------------------------------------- */
export const releases: Release[] = [
  {
    date: "18 sie 2026",
    title: "Agent Examax 2.0",
    description:
      "Agent tłumaczy błąd krok po kroku i sam dobiera kilka podobnych zadań na sprawdzenie.",
    icon: AgentIcon,
    accent: "lavender",
  },
  {
    date: "4 sie 2026",
    title: "Arkusze CKE 2026",
    description:
      "Majowa sesja ósmoklasisty i matury w bazie — z pełną punktacją według zasad oceniania.",
    icon: FileText,
    accent: "green",
  },
  {
    date: "21 lip 2026",
    title: "Roadmapa matury rozszerzonej",
    description:
      "Osobna ścieżka dla poziomu rozszerzonego, rozpisana pod wymagania rekrutacyjne.",
    icon: Route,
    accent: "blue",
  },
  {
    date: "8 lip 2026",
    title: "Wskaźnik gotowości",
    description:
      "Jedna liczba na wszystkie przedmioty, przeliczana po każdej serii zadań.",
    icon: Gauge,
    accent: "sapphire",
  },
  {
    date: "24 cze 2026",
    title: "Tryb powtórek",
    description:
      "Tematy wracają do kolejki na kilka dni przed tym, jak zaczniesz je zapominać.",
    icon: RefreshCcw,
    accent: "blue",
  },
];
