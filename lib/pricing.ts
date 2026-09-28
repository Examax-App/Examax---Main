import type { ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  FileSpreadsheet,
  FileText,
  Gauge,
  GraduationCap,
  LifeBuoy,
  PencilLine,
  RefreshCcw,
  Route,
  ShieldCheck,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import { AgentIcon } from "@/components/ui/AgentIcon";
import type { Accent } from "@/components/ui/FeaturePill";
import type { IconComponent } from "@/lib/icon";

/**
 * PLACEHOLDER PRICING — the /pricing page is wired entirely to this file, so
 * renaming a plan, moving a price or changing what a tier includes means
 * editing exactly one module (the same contract as lib/appNav.ts).
 *
 * Plan names stay untranslated: they are product nouns rather than copy, so
 * they are the one exception to the Polish-copy rule in PRODUCT.md.
 */

export type Plan = {
  name: string;
  /** Monthly price in zł. `null` renders as a custom quote (Enterprise). */
  monthly: number | null;
  /** Shown under the price when there is no figure to show. */
  priceNote: string;
  description: string;
  cta: {
    label: string;
    href: string;
    /** One rung of the CTA ladder: filled → smoke edge → ash edge → ghost. */
    variant: "primary" | "outline" | "outlineStrong" | "ghostDark";
  };
  /** The recommended tier — gets the badge and the one filled CTA. */
  highlight?: boolean;
  featuresHeading: string;
  features: Array<{ icon: IconComponent; label: string }>;
};

/** Yearly billing bills ten months for twelve — the existing site's offer. */
export const YEARLY_DISCOUNT_NOTE = "2 miesiące gratis";

/**
 * What a year of `plan` saves against paying monthly, in whole złoty.
 * `null` wherever there is nothing to compare — free and custom-quote tiers.
 */
export function yearlySaving(plan: Plan): number | null {
  if (plan.monthly === null || plan.monthly === 0) return null;
  const discounted = priceFor(plan, true);
  if (discounted === null) return null;
  return (plan.monthly - discounted) * 12;
}

export function priceFor(plan: Plan, yearly: boolean): number | null {
  if (plan.monthly === null || plan.monthly === 0) return plan.monthly;
  return yearly ? Math.round(plan.monthly * (10 / 12)) : plan.monthly;
}

export const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    priceNote: "na zawsze",
    description: "Na start — jeden przedmiot i codzienna dawka zadań.",
    cta: { label: "Załóż konto", href: "/signup", variant: "outline" },
    featuresHeading: "W planie Free:",
    features: [
      { icon: Route, label: "Roadmapa jednego przedmiotu" },
      { icon: PencilLine, label: "20 zadań dziennie" },
      { icon: FileSpreadsheet, label: "Wybrane arkusze CKE" },
      { icon: AgentIcon, label: "10 pytań do agenta dziennie" },
      { icon: BarChart3, label: "Podstawowy podgląd postępów" },
    ],
  },
  {
    name: "Pro",
    monthly: 29,
    priceNote: "/ mies",
    description: "Cała roadmapa i trening bez limitów, do jednego egzaminu.",
    cta: { label: "Wybierz Pro", href: "/signup", variant: "primary" },
    highlight: true,
    featuresHeading: "Wszystko z Free, plus:",
    features: [
      { icon: Route, label: "Roadmapy wszystkich przedmiotów" },
      { icon: PencilLine, label: "Trening bez limitu zadań" },
      { icon: FileSpreadsheet, label: "Pełna baza arkuszy CKE" },
      { icon: AgentIcon, label: "Agent Examax bez limitu" },
      { icon: Gauge, label: "Wskaźnik gotowości i analityka" },
      { icon: RefreshCcw, label: "Inteligentne powtórki" },
    ],
  },
  {
    name: "Max",
    monthly: 59,
    priceNote: "/ mies",
    description: "Dla zdających kilka rozszerzeń — z symulacjami arkusza.",
    cta: { label: "Wybierz Max", href: "/signup", variant: "outline" },
    featuresHeading: "Wszystko z Pro, plus:",
    features: [
      { icon: TrendingUp, label: "Poziom rozszerzony bez dopłat" },
      { icon: Timer, label: "Symulacje w formacie arkusza" },
      { icon: CalendarDays, label: "Plan powtórek do dnia egzaminu" },
      { icon: FileText, label: "Tygodniowy raport gotowości" },
      { icon: Users, label: "Podgląd wyników dla opiekuna" },
      { icon: LifeBuoy, label: "Priorytetowa pomoc" },
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    priceNote: "indywidualna",
    description: "Dla szkół — konta dla klas i wsparcie wdrożenia.",
    cta: { label: "Porozmawiajmy", href: "/contact", variant: "outline" },
    featuresHeading: "Wszystko z Max, plus:",
    features: [
      { icon: GraduationCap, label: "Konta dla klas i roczników" },
      { icon: BarChart3, label: "Panel nauczyciela i raporty klasowe" },
      { icon: ShieldCheck, label: "Logowanie SSO" },
      { icon: LifeBuoy, label: "Wdrożenie i szkolenie zespołu" },
      { icon: FileText, label: "Umowa i faktura dla placówki" },
      { icon: Users, label: "Dedykowany opiekun" },
    ],
  },
];

/** `true`/`false` render as the check/cross marks; a string renders verbatim. */
export type CompareValue = boolean | string;

export type CompareRow = {
  label: string;
  description: string;
  /** One entry per plan, in `plans` order. */
  values: CompareValue[];
};

export type CompareGroup = {
  heading: string;
  icon: IconComponent;
  accent: Accent;
  rows: CompareRow[];
};

export const compareGroups: CompareGroup[] = [
  {
    heading: "Roadmapa nauki",
    icon: Route,
    accent: "blue",
    rows: [
      {
        label: "Przedmioty w roadmapie",
        description: "Ile przedmiotów prowadzisz równolegle",
        values: ["1", "Bez limitu", "Bez limitu", "Bez limitu"],
      },
      {
        label: "Poziom rozszerzony",
        description: "Wymagania rozszerzenia rozpisane osobno",
        values: [false, false, true, true],
      },
      {
        label: "Inteligentne powtórki",
        description: "Materiał wraca dokładnie wtedy, kiedy zaczyna uciekać",
        values: [false, true, true, true],
      },
      {
        label: "Plan do dnia egzaminu",
        description: "Roadmapa rozpisana na tygodnie wstecz od terminu CKE",
        values: [false, false, true, true],
      },
    ],
  },
  {
    heading: "Trening zadań",
    icon: PencilLine,
    accent: "green",
    rows: [
      {
        label: "Zadania dziennie",
        description: "Limit rozwiązywanych zadań w ciągu doby",
        values: ["20", "Bez limitu", "Bez limitu", "Bez limitu"],
      },
      {
        label: "Arkusze CKE",
        description: "Dostęp do oficjalnych arkuszy z poprzednich lat",
        values: ["Wybrane", "Pełna baza", "Pełna baza", "Pełna baza"],
      },
      {
        label: "Zasady oceniania",
        description: "Punktacja według oficjalnych kluczy CKE",
        values: [true, true, true, true],
      },
      {
        label: "Symulacje egzaminu",
        description: "Pełny arkusz, czas liczony jak na sali",
        values: [false, false, true, true],
      },
    ],
  },
  {
    heading: "Agent Examax",
    icon: AgentIcon,
    accent: "lavender",
    rows: [
      {
        label: "Pytania dziennie",
        description: "Ile razy dziennie poprosisz agenta o wyjaśnienie",
        values: ["10", "Bez limitu", "Bez limitu", "Bez limitu"],
      },
      {
        label: "Wyjaśnienia krok po kroku",
        description: "Rozbicie zadania na kolejne etapy rozwiązania",
        values: [true, true, true, true],
      },
      {
        label: "Kontekst Twojej roadmapy",
        description: "Agent zna Twoje błędy i podpowiada, co dalej",
        values: [false, true, true, true],
      },
    ],
  },
  {
    heading: "Wyniki i raporty",
    icon: BarChart3,
    accent: "sapphire",
    rows: [
      {
        label: "Podgląd postępów",
        description: "Opanowanie i skuteczność w podziale na działy",
        values: ["Podstawowy", "Pełny", "Pełny", "Pełny"],
      },
      {
        label: "Wskaźnik gotowości",
        description: "Ile brakuje do wyniku, który sobie założysz",
        values: [false, true, true, true],
      },
      {
        label: "Tygodniowy raport",
        description: "Podsumowanie tygodnia na e-mail",
        values: [false, false, true, true],
      },
      {
        label: "Panel nauczyciela",
        description: "Raporty klasowe i postępy całego rocznika",
        values: [false, false, false, true],
      },
    ],
  },
  {
    heading: "Konto i wsparcie",
    icon: LifeBuoy,
    accent: "blue",
    rows: [
      {
        label: "Opiekunowie",
        description: "Konta rodziców lub nauczycieli z wglądem w wyniki",
        values: ["1", "2", "2", "Bez limitu"],
      },
      {
        label: "Pomoc",
        description: "Kanał kontaktu z zespołem Examax",
        values: ["E-mail", "E-mail", "Priorytetowa", "Dedykowany opiekun"],
      },
      {
        label: "Logowanie SSO",
        description: "Jedno logowanie dla całej placówki",
        values: [false, false, false, true],
      },
      {
        label: "Umowa i faktura",
        description: "Rozliczenie na dane szkoły lub organizacji",
        values: [false, false, false, true],
      },
    ],
  },
];

/**
 * DRAFT COPY — needs review.
 *
 * Pricing-specific questions only: the landing page's `Faq` section answers
 * "what is Examax", this one answers "what am I paying for". Kept here rather
 * than in the component for the same reason as the plans — one module to edit.
 *
 * Every figure below is derived from `plans` above, so a price change means
 * editing the plan, not hunting through prose.
 */
export type PricingFaq = { question: string; answer: ReactNode };

export const pricingFaqs: PricingFaq[] = [
  {
    question: "Który plan będzie dla mnie odpowiedni?",
    answer:
      "Jeśli dopiero zaczynasz i uczysz się jednego przedmiotu — zostań przy Free. Jeśli przygotowujesz się do konkretnego egzaminu i chcesz trenować bez limitów, weź Pro. Max ma sens, kiedy zdajesz kilka rozszerzeń albo zależy Ci na symulacjach w formacie arkusza. Enterprise jest dla szkół, nie dla pojedynczych uczniów.",
  },
  {
    question: "Czy jest okres próbny?",
    answer:
      "Nie potrzebujesz go — plan Free jest darmowy na zawsze i nie wymaga karty. Zamiast kilkunastu dni pełnego dostępu dajemy Ci bezterminowo mniejszą wersję: jedną roadmapę, 20 zadań i 10 pytań do agenta dziennie. Kiedy zaczyna być za ciasno, przechodzisz wyżej.",
  },
  {
    question: "Czy mogę zmienić albo anulować plan w każdej chwili?",
    answer:
      "Tak. Plan zmieniasz i anulujesz w ustawieniach konta, bez kontaktu z nami. Po anulowaniu zachowujesz dostęp do końca opłaconego okresu, a potem konto wraca do planu Free — Twoje postępy, wyniki i historia zadań zostają.",
  },
  {
    question: "Co się dzieje, gdy wyczerpię dzienny limit w planie Free?",
    answer:
      "Nic się nie psuje i nic nie znika — po prostu czekasz do następnego dnia, kiedy limit 20 zadań i 10 pytań do agenta odnawia się od zera. Reszta aplikacji, w tym Twoja roadmapa i dotychczasowe wyniki, działa bez zmian. W planach Pro i wyżej limitów nie ma.",
  },
  {
    question: "Ile realnie oszczędzam przy płatności rocznej?",
    answer:
      "Przy rozliczeniu rocznym płacisz za dziesięć miesięcy zamiast dwunastu — Pro wychodzi 24 zł miesięcznie zamiast 29 zł, a Max 49 zł zamiast 59 zł. Kwotę za cały rok pobieramy z góry.",
  },
  {
    question: "Czy szkoły mają zniżki?",
    answer:
      "Tak. Plan Enterprise wyceniamy pod liczbę uczniów, więc im większa placówka, tym niższa cena za osobę — a klasy i roczniki zakładamy zbiorczo, zamiast kazać każdemu uczniowi rejestrować się osobno. Napisz do nas, a przygotujemy wycenę.",
  },
  {
    question: "Czy dostanę fakturę?",
    answer:
      "Tak. Faktura trafia na e-mail po każdej płatności i jest do pobrania w ustawieniach konta. Dane do faktury — także dane szkoły lub organizacji — uzupełniasz przed pierwszą płatnością.",
  },
];
