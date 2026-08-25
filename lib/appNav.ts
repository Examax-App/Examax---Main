import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Blocks,
  BookOpen,
  CreditCard,
  FileClock,
  FolderOpen,
  KeyRound,
  Layers,
  MousePointerClick,
  PencilLine,
  Settings2,
  Shield,
  Tag,
  UserRound,
  Users,
  Webhook,
} from "lucide-react";

/**
 * PLACEHOLDER LABELS — the whole app template is wired to this file, so
 * renaming a page or section means editing exactly one entry here.
 */

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  /** Group heading; empty string renders items without a heading. */
  heading: string;
  items: NavItem[];
};

/** Product-area title above the main sidebar (reference: "Short Links"). */
export const WORKSPACE_TITLE = "Nauka";

export const mainNav: NavGroup[] = [
  {
    heading: "",
    items: [
      { label: "Zadania", href: "/app", icon: PencilLine },
      { label: "Przedmioty", href: "/app/przedmioty", icon: BookOpen },
    ],
  },
  {
    heading: "Wgląd",
    items: [
      { label: "Analityka", href: "/app/analityka", icon: BarChart3 },
      { label: "Aktywność", href: "/app/aktywnosc", icon: MousePointerClick },
      { label: "Wyniki", href: "/app/wyniki", icon: Users },
    ],
  },
  {
    heading: "Biblioteka",
    items: [
      { label: "Foldery", href: "/app/foldery", icon: FolderOpen },
      { label: "Etykiety", href: "/app/etykiety", icon: Tag },
      { label: "Szablony", href: "/app/szablony", icon: Layers },
    ],
  },
];

export const settingsNav: NavGroup[] = [
  {
    heading: "Profil",
    items: [
      { label: "Ogólne", href: "/app/ustawienia", icon: Settings2 },
      { label: "Subskrypcja", href: "/app/ustawienia/subskrypcja", icon: CreditCard },
      { label: "Opiekunowie", href: "/app/ustawienia/opiekunowie", icon: Users },
      { label: "Integracje", href: "/app/ustawienia/integracje", icon: Blocks },
      { label: "Bezpieczeństwo", href: "/app/ustawienia/bezpieczenstwo", icon: Shield },
    ],
  },
  {
    heading: "Deweloper",
    items: [
      { label: "Klucze API", href: "/app/ustawienia/klucze-api", icon: KeyRound },
      { label: "Logi", href: "/app/ustawienia/logi", icon: FileClock },
      { label: "Webhooki", href: "/app/ustawienia/webhooks", icon: Webhook },
    ],
  },
  {
    heading: "Konto",
    items: [
      { label: "Twoje konto", href: "/app/konto", icon: UserRound },
      { label: "Powiadomienia", href: "/app/ustawienia/powiadomienia", icon: Bell },
    ],
  },
];

/** Sidebar usage widget rows (reference: "Events 0 of 1K / Links 0 of 25"). */
export const usageRows = [
  { label: "Zadania", used: 0, limit: "200", icon: PencilLine },
  { label: "Pytania AI", used: 0, limit: "50", icon: MousePointerClick },
];

export const USAGE_RESET_NOTE = "Limit odnowi się 21 wrz 2026";
