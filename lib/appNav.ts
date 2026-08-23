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
      { label: "Zadania", href: "/dashboard", icon: PencilLine },
      { label: "Przedmioty", href: "/dashboard/subjects", icon: BookOpen },
    ],
  },
  {
    heading: "Wgląd",
    items: [
      { label: "Analityka", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Aktywność", href: "/dashboard/activity", icon: MousePointerClick },
      { label: "Wyniki", href: "/dashboard/results", icon: Users },
    ],
  },
  {
    heading: "Biblioteka",
    items: [
      { label: "Foldery", href: "/dashboard/folders", icon: FolderOpen },
      { label: "Etykiety", href: "/dashboard/labels", icon: Tag },
      { label: "Szablony", href: "/dashboard/templates", icon: Layers },
    ],
  },
];

export const settingsNav: NavGroup[] = [
  {
    heading: "Profil",
    items: [
      { label: "Ogólne", href: "/dashboard/settings", icon: Settings2 },
      { label: "Subskrypcja", href: "/dashboard/settings/subscription", icon: CreditCard },
      { label: "Opiekunowie", href: "/dashboard/settings/guardians", icon: Users },
      { label: "Integracje", href: "/dashboard/settings/integrations", icon: Blocks },
      { label: "Bezpieczeństwo", href: "/dashboard/settings/security", icon: Shield },
    ],
  },
  {
    heading: "Deweloper",
    items: [
      { label: "Klucze API", href: "/dashboard/settings/api-keys", icon: KeyRound },
      { label: "Logi", href: "/dashboard/settings/logs", icon: FileClock },
      { label: "Webhooki", href: "/dashboard/settings/webhooks", icon: Webhook },
    ],
  },
  {
    heading: "Konto",
    items: [
      { label: "Twoje konto", href: "/dashboard/account", icon: UserRound },
      { label: "Powiadomienia", href: "/dashboard/settings/notifications", icon: Bell },
    ],
  },
];

/** Sidebar usage widget rows (reference: "Events 0 of 1K / Links 0 of 25"). */
export const usageRows = [
  { label: "Zadania", used: 0, limit: "200", icon: PencilLine },
  { label: "Pytania AI", used: 0, limit: "50", icon: MousePointerClick },
];

export const USAGE_RESET_NOTE = "Limit odnowi się 21 wrz 2026";
