import type { ReactNode } from "react";
import {
  BadgePercent,
  BarChart3,
  BookOpenCheck,
  Brain,
  CalendarDays,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Gauge,
  GraduationCap,
  Headset,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MessagesSquare,
  PencilLine,
  Receipt,
  RefreshCcw,
  Route,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import type { Accent } from "@/components/ui/FeaturePill";
import type { IconComponent } from "@/lib/icon";

/**
 * PLACEHOLDER PRICING — the /pricing page is wired entirely to this file, so
 * renaming a plan, moving a price or changing what a tier includes means
 * editing exactly one module.
 *
 * One pricing system: Free / Pro / Max / Enterprise, the same whichever exam
 * a student is preparing for. The exam only decides which plan the page
 * recommends (`RECOMMENDED_PLAN`).
 *
 * The ladder follows PRODUCT.md's pricing rule — never limit learning itself.
 * Roadmaps, lessons and practice are open on every plan; what grows with the
 * tier is Korepetytor AI (more questions, then memory and the strongest
 * model), exam simulations, AI-generated practice and analytics.
 *
 * Plan names stay untranslated: they are product nouns rather than copy, so
 * they are the one exception to the Polish-copy rule in PRODUCT.md.
 */

export type PlanId = "free" | "pro" | "max" | "enterprise";
export type ExamType = "e8" | "matura";

/** A card feature: a glyph, a label, and the explanation its tooltip shows. */
export type PlanFeature = {
  icon: IconComponent;
  label: string;
  /** Tooltip copy. A feature without one renders as plain text, as the
   *  reference does for its support rows. */
  tip?: string;
};

export type Plan = {
  id: PlanId;
  name: string;
  /** Monthly price in zł. `0` is the free tier, `null` a custom quote. */
  monthly: number | null;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  featuresHeading: string;
  features: PlanFeature[];
};

/* ── Exam selector ─────────────────────────────────────────────────────── */

export type ExamOption = {
  id: ExamType;
  label: string;
  /** For the narrowest phones, where the full label will not fit. */
  shortLabel: string;
  icon: IconComponent;
  /** The recommended badge's colours, in the exam mark's own hue. */
  badgeClassName: string;
};

/** In switch order: the ósmoklasista first, Matura second. */
export const exams: ExamOption[] = [
  { id: "e8", label: "Egzamin ósmoklasisty", shortLabel: "E8", icon: E8Icon, badgeClassName: "bg-green-200 text-green-900" },
  { id: "matura", label: "Matura", shortLabel: "Matura", icon: MaturaIcon, badgeClassName: "bg-violet-200 text-violet-900" },
];

export const DEFAULT_EXAM: ExamType = "e8";

/**
 * The one thing the exam changes. Ósmoklasiści are pointed at Pro; maturzyści,
 * with more subjects, the extended level and more at stake, at Max.
 */
export const RECOMMENDED_PLAN: Record<ExamType, PlanId> = {
  e8: "pro",
  matura: "max",
};

/* ── Billing ───────────────────────────────────────────────────────────── */

/** Yearly billing charges ten months and gives twelve. */
const YEARLY_MONTHS_CHARGED = 10;

export const YEARLY_DISCOUNT_NOTE = "2 miesiące gratis";

/** The figure a plan shows for the chosen period: per month, or per year. */
export function priceFor(plan: Plan, yearly: boolean): number | null {
  if (plan.monthly === null || plan.monthly === 0) return plan.monthly;
  return yearly ? plan.monthly * YEARLY_MONTHS_CHARGED : plan.monthly;
}

/** What a year paid up front saves against twelve monthly payments. */
export function yearlySaving(plan: Plan): { amount: number; percent: number } | null {
  if (plan.monthly === null || plan.monthly === 0) return null;
  const twelveMonths = plan.monthly * 12;
  const amount = twelveMonths - plan.monthly * YEARLY_MONTHS_CHARGED;
  return { amount, percent: Math.round((amount / twelveMonths) * 100) };
}

/* ── Plans ─────────────────────────────────────────────────────────────── */

const AI_TIP_FREE =
  "Korepetytor AI tłumaczy zadania krok po kroku i odpowiada na pytania z materiału. Limit odnawia się codziennie.";
const AI_TIP_PRO = "Dziesięć razy więcej rozmów z Korepetytorem AI niż w planie Free.";
const AI_TIP_MAX = "Najwyższy dzienny limit pytań do Korepetytora AI, z zapasem na najbardziej intensywne tygodnie przed egzaminem.";

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    description: "Zacznij naukę bez karty płatniczej i sprawdź, jak działa Examax.",
    cta: { label: "Zacznij za darmo", href: "/signup" },
    featuresHeading: "Najważniejsze funkcje:",
    features: [
      {
        icon: Route,
        label: "Roadmapa E8 i matury",
        tip: "Cały materiał z wymagań CKE ułożony w kolejne kroki, osobno dla każdego egzaminu i poziomu.",
      },
      {
        icon: PencilLine,
        label: "Trening bez limitu zadań",
        tip: "Nie ograniczamy nauki: w każdym planie rozwiązujesz tyle zadań, ile chcesz.",
      },
      {
        icon: FileSpreadsheet,
        label: "Oficjalne arkusze CKE",
        tip: "Arkusze z poprzednich lat, punktowane według kluczy CKE.",
      },
      {
        icon: ScanSearch,
        label: "Quiz diagnostyczny",
        tip: "Pierwszy, przekrojowy quiz, po którym Examax wie, od czego zacząć.",
      },
      { icon: Zap, label: "15 pytań do AI dziennie", tip: AI_TIP_FREE },
      {
        icon: Timer,
        label: "Próbna symulacja",
        tip: "Jeden pełny arkusz w warunkach egzaminu, żeby zobaczyć, jak działa symulacja.",
      },
      { icon: BarChart3, label: "Podstawowe statystyki" },
      { icon: Mail, label: "Pomoc e-mail" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 49,
    description: "Więcej wsparcia AI i regularne przygotowanie do egzaminu.",
    cta: { label: "Wybierz Pro", href: "/signup" },
    featuresHeading: "Wszystko z Free, plus:",
    features: [
      { icon: Zap, label: "150 pytań do AI dziennie", tip: AI_TIP_PRO },
      {
        icon: Timer,
        label: "4 symulacje w miesiącu",
        tip: "Pełny arkusz z czasem liczonym jak na sali i raportem po zakończeniu.",
      },
      {
        icon: Sparkles,
        label: "Quizy od Korepetytora AI",
        tip: "Korepetytor AI układa quiz z tematów, w których robisz najwięcej błędów.",
      },
      {
        icon: PencilLine,
        label: "AI ocenia wypracowania",
        tip: "Korepetytor AI ocenia wypracowanie według kryteriów CKE i pokazuje, gdzie tracisz punkty.",
      },
      {
        icon: Gauge,
        label: "Wskaźnik gotowości",
        tip: "Jedna liczba, która mówi, ile brakuje Ci do wyniku, który sobie założysz.",
      },
      {
        icon: RefreshCcw,
        label: "Inteligentne powtórki",
        tip: "Materiał wraca dokładnie wtedy, kiedy zaczyna uciekać z pamięci.",
      },
      {
        icon: ScanSearch,
        label: "Analiza błędów",
        tip: "Każdy błąd przypisany do działu i typu zadania, żeby było widać, co go powoduje.",
      },
      { icon: Mail, label: "Priorytetowa pomoc" },
    ],
  },
  {
    id: "max",
    name: "Max",
    monthly: 79,
    description: "Pełne wsparcie AI i przygotowanie prowadzone aż do dnia egzaminu.",
    cta: { label: "Wybierz Max", href: "/signup" },
    featuresHeading: "Wszystko z Pro, plus:",
    features: [
      { icon: Zap, label: "Najwyższy limit AI", tip: AI_TIP_MAX },
      {
        icon: Brain,
        label: "AI pamięta Twoje błędy",
        tip: "Korepetytor AI pamięta wcześniejsze rozmowy, błędy i Twoją roadmapę, więc nie zaczynasz od zera.",
      },
      {
        icon: Sparkles,
        label: "Najmocniejszy model AI",
        tip: "Dokładniejsze wyjaśnienia trudnych zadań i dłuższe, bardziej szczegółowe odpowiedzi.",
      },
      {
        icon: Timer,
        label: "Symulacje bez limitu",
        tip: "Tyle pełnych arkuszy, ile potrzebujesz, z raportem po każdym.",
      },
      {
        icon: BookOpenCheck,
        label: "Sesje nauki z AI",
        tip: "Codzienna sesja ułożona przez Korepetytora AI: powtórki, nowe tematy i zadania na słabe punkty.",
      },
      {
        icon: CalendarDays,
        label: "Plan do dnia egzaminu",
        tip: "Roadmapa rozpisana na tygodnie wstecz od terminu CKE.",
      },
      {
        icon: FileText,
        label: "Tygodniowy raport",
        tip: "Podsumowanie tygodnia na e-mail: co poszło do przodu i co przećwiczyć dalej.",
      },
      {
        icon: Users,
        label: "Podgląd dla rodzica",
        tip: "Rodzic widzi postępy i gotowość, ale nie Twoje rozmowy z Korepetytorem AI.",
      },
      { icon: MessagesSquare, label: "Pomoc na czacie" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    description: "Dla szkół, które prowadzą z Examax całe klasy",
    cta: { label: "Umów rozmowę", href: "/enterprise#trial" },
    featuresHeading: "Wszystko z Max, plus:",
    features: [
      {
        icon: GraduationCap,
        label: "Konta dla klas i roczników",
        tip: "Uczniów dodajesz całymi klasami, bez osobnej rejestracji każdego z nich.",
      },
      {
        icon: LayoutDashboard,
        label: "Panel nauczyciela",
        tip: "Postępy, słabe działy i gotowość każdego ucznia w jednym widoku.",
      },
      {
        icon: Zap,
        label: "AI dla nauczycieli",
        tip: "Korepetytor AI układa sprawdziany i zestawy zadań pod to, z czym klasa ma najwięcej trudności.",
      },
      {
        icon: BarChart3,
        label: "Raporty klasowe",
        tip: "Wyniki całej klasy i rocznika w podziale na działy wymagań CKE.",
      },
      {
        icon: ShieldCheck,
        label: "Logowanie SSO",
        tip: "Jedno logowanie dla całej placówki, przez Google Workspace lub Microsoft 365.",
      },
      { icon: FileSignature, label: "Umowa RODO dla szkoły" },
      { icon: Receipt, label: "Faktura dla placówki" },
      { icon: Headset, label: "Dedykowany opiekun" },
    ],
  },
];

/* ── Comparison ────────────────────────────────────────────────────────── */

/**
 * One comparison row. Every cell names the feature itself, as the reference
 * does, so the table needs no label column:
 *
 *   true    included — the row's `label`
 *   string  included, with this plan's own wording; `**x**` sets x in medium
 *   false   not in this plan — the `label`, greyed and dotted
 */
export type CompareValue = boolean | string;

export type CompareRow = {
  label: string;
  tip?: string;
  /** One entry per plan, in `plans` order. */
  values: CompareValue[];
};

/** The glyph at a group's right edge: both exam marks, or a feature-area chip. */
export type CompareGroupMark = { kind: "exams" } | { kind: "chip"; icon: IconComponent; accent: Accent };

export type CompareGroup = {
  heading: string;
  mark: CompareGroupMark;
  rows: CompareRow[];
};

export const compareGroups: CompareGroup[] = [
  {
    heading: "Egzaminy",
    mark: { kind: "exams" },
    rows: [
      {
        label: "Egzamin ósmoklasisty",
        tip: "Roadmapa, zadania i arkusze do egzaminu ósmoklasisty.",
        values: [true, true, true, true],
      },
      {
        label: "Matura: poziom podstawowy",
        tip: "Cały materiał z wymagań CKE ułożony w kolejne kroki.",
        values: [true, true, true, true],
      },
      {
        label: "Matura: poziom rozszerzony",
        tip: "Wymagania rozszerzenia rozpisane osobno, z własnymi arkuszami i zadaniami.",
        values: [true, true, true, true],
      },
      {
        label: "Przedmioty obowiązkowe",
        tip: "Matematyka, język polski i język angielski — kolejne przedmioty dochodzą.",
        values: [true, true, true, true],
      },
      {
        label: "Oficjalne arkusze CKE",
        tip: "Arkusze z poprzednich lat, punktowane według kluczy CKE.",
        values: [true, true, true, true],
      },
      {
        label: "AI ocenia wypracowania",
        tip: "Korepetytor AI ocenia wypracowanie według kryteriów CKE i pokazuje, gdzie tracisz punkty.",
        values: [false, true, true, true],
      },
    ],
  },
  {
    heading: "Trening",
    mark: { kind: "chip", icon: PencilLine, accent: "green" },
    rows: [
      {
        label: "Zadania bez limitu",
        tip: "Nie ograniczamy nauki: w każdym planie rozwiązujesz tyle zadań, ile chcesz.",
        values: [true, true, true, true],
      },
      {
        label: "Quiz diagnostyczny",
        tip: "Pierwszy, przekrojowy quiz, po którym Examax wie, od czego zacząć.",
        values: [true, true, true, true],
      },
      {
        label: "Inteligentne powtórki",
        tip: "Materiał wraca dokładnie wtedy, kiedy zaczyna uciekać z pamięci.",
        values: [false, true, true, true],
      },
      {
        label: "Quizy od Korepetytora AI",
        tip: "Korepetytor AI układa quiz z tematów, w których robisz najwięcej błędów.",
        values: [false, "**20** quizów miesięcznie", "Najwyższy limit quizów", "Limit dla całej szkoły"],
      },
      {
        label: "Sesje nauki z AI",
        tip: "Codzienna sesja ułożona przez Korepetytora AI: powtórki, nowe tematy i zadania na słabe punkty.",
        values: [false, false, true, true],
      },
    ],
  },
  {
    heading: "Symulacja egzaminu",
    mark: { kind: "chip", icon: Timer, accent: "lavender" },
    rows: [
      {
        label: "Symulacje egzaminu",
        tip: "Pełny arkusz z czasem liczonym jak na sali i raportem po zakończeniu.",
        values: ["**1** próbna symulacja", "**4** symulacje miesięcznie", "Symulacje bez limitu", "Symulacje bez limitu"],
      },
      { label: "Warunki jak na sali", values: [true, true, true, true] },
      {
        label: "Raport po symulacji",
        tip: "Wynik, punkty w podziale na zadania i działy, które kosztowały najwięcej.",
        values: [true, true, true, true],
      },
      { label: "Historia symulacji", values: [false, true, true, true] },
    ],
  },
  {
    heading: "Korepetytor AI",
    mark: { kind: "chip", icon: Zap, accent: "yellow" },
    rows: [
      {
        label: "Pytania do Korepetytora AI",
        tip: "Limit odnawia się codziennie.",
        values: ["**15** pytań dziennie", "**150** pytań dziennie", "Najwyższy limit pytań", "Limit dla całej szkoły"],
      },
      { label: "Wyjaśnienia krok po kroku", values: [true, true, true, true] },
      {
        label: "AI w każdym zadaniu",
        tip: "Korepetytor AI jest pod ręką w quizie, w lekcji i na roadmapie, nie tylko w osobnym czacie.",
        values: [true, true, true, true],
      },
      {
        label: "Kontekst Twojej roadmapy",
        tip: "Korepetytor AI widzi Twoją roadmapę i odpowiedzi, więc podpowiada, co przećwiczyć dalej.",
        values: [false, true, true, true],
      },
      {
        label: "Pamięć rozmów i błędów",
        tip: "Korepetytor AI pamięta wcześniejsze rozmowy i błędy, więc nie zaczynasz od zera.",
        values: [false, false, true, true],
      },
      { label: "Najmocniejszy model AI", values: [false, false, true, true] },
      {
        label: "AI dla nauczycieli",
        tip: "Sprawdziany i zestawy zadań układane pod postępy klasy.",
        values: [false, false, false, true],
      },
    ],
  },
  {
    heading: "Postępy",
    mark: { kind: "chip", icon: BadgePercent, accent: "tangerine" },
    rows: [
      {
        label: "Statystyki postępów",
        values: ["Podstawowe statystyki", "Pełna analityka", "Pełna analityka", "Pełna analityka"],
      },
      {
        label: "Wskaźnik gotowości",
        tip: "Jedna liczba, która mówi, ile brakuje Ci do wyniku, który sobie założysz.",
        values: [false, true, true, true],
      },
      { label: "Analiza błędów", values: [false, true, true, true] },
      {
        label: "Plan do dnia egzaminu",
        tip: "Roadmapa rozpisana na tygodnie wstecz od terminu CKE.",
        values: [false, false, true, true],
      },
      { label: "Tygodniowy raport", values: [false, false, true, true] },
      { label: "Podgląd dla rodzica", values: [false, false, true, true] },
      { label: "Raporty klasowe", values: [false, false, false, true] },
    ],
  },
  {
    heading: "Konto i wsparcie",
    mark: { kind: "chip", icon: LifeBuoy, accent: "sapphire" },
    rows: [
      {
        label: "Pomoc",
        values: ["Pomoc e-mail", "Priorytetowa pomoc e-mail", "Pomoc na czacie", "Dedykowany opiekun"],
      },
      { label: "Konta dla klas i roczników", values: [false, false, false, true] },
      { label: "Panel nauczyciela", values: [false, false, false, true] },
      { label: "Logowanie SSO", values: [false, false, false, true] },
      { label: "Umowa RODO dla szkoły", values: [false, false, false, true] },
      { label: "Faktura dla placówki", values: [false, false, false, true] },
    ],
  },
];

/* ── The three-up row and the Enterprise band ──────────────────────────── */

/*
 * /pricing shows Free, Pro and Max side by side and gives Enterprise a band
 * of its own under them — dub.co/pricing's layout for the plan that stands
 * apart (its Free band on the Links tab). The comparison follows the cards,
 * as dub's does: three columns, and the rows only Enterprise has (they are on
 * its band) drop out.
 */

const isTier = (plan: Plan) => plan.id !== "enterprise";

export const tierPlans: Plan[] = plans.filter(isTier);

export const enterprisePlan: Plan = plans.find((plan) => !isTier(plan))!;

/** Where each of the three plans sits in a comparison row's `values`. */
const tierColumns = plans.flatMap((plan, column) => (isTier(plan) ? [column] : []));

export const tierCompareGroups: CompareGroup[] = compareGroups
  .map((group) => ({
    ...group,
    rows: group.rows
      .map((row) => ({ ...row, values: tierColumns.map((column) => row.values[column]) }))
      .filter((row) => row.values.some(Boolean)),
  }))
  .filter((group) => group.rows.length > 0);

/**
 * The copy of the Enterprise block under the cards — a section of its own
 * rather than a fourth card: what a school gets, said as a tailored offer
 * rather than as "Max, plus".
 */
export const enterpriseOffer = {
  subheading: "Indywidualna wycena dla całej placówki",
  body: "Examax dla całych klas i roczników — konta, panel nauczyciela i raporty z postępów, dopasowane do tego, jak uczy Twoja szkoła.",
  listHeading: "Funkcje dla całej szkoły",
  items: [
    { icon: Receipt, label: "Wycena pod liczbę uczniów i klas", tip: "Płacisz za tylu uczniów, ilu faktycznie korzysta — cena rośnie razem ze szkołą." },
    { icon: GraduationCap, label: "Konta dla klas i roczników", tip: "Uczniów dodajesz całymi klasami, bez osobnej rejestracji każdego z nich." },
    { icon: LayoutDashboard, label: "Panel nauczyciela i raporty klasowe", tip: "Postępy, słabe działy i gotowość każdego ucznia oraz całej klasy w jednym widoku." },
    { icon: Zap, label: "Korepetytor AI dla nauczycieli", tip: "Układa sprawdziany i zestawy zadań pod to, z czym klasa ma najwięcej trudności." },
    { icon: ShieldCheck, label: "Logowanie SSO i umowa RODO", tip: "Jedno logowanie przez Google Workspace lub Microsoft 365 i umowa powierzenia danych dla szkoły." },
    { icon: Headset, label: "Wdrożenie z dedykowanym opiekunem", tip: "Opiekun pomaga uruchomić Examax w szkole i jest pod ręką przez cały rok szkolny." },
  ],
} satisfies {
  subheading: string;
  body: string;
  listHeading: string;
  items: Array<{ icon: IconComponent; label: string; tip: string }>;
};

/* ── FAQ ───────────────────────────────────────────────────────────────── */

/**
 * DRAFT COPY — needs review.
 *
 * Pricing-specific questions only: the landing page's FAQ answers "what is
 * Examax", this one answers "what am I paying for". It mirrors the eight
 * questions dub.co/pricing asks, answered for Examax.
 */
export type PricingFaq = { question: string; answer: ReactNode };

export const pricingFaqs: PricingFaq[] = [
  {
    question: "Który plan wybrać?",
    answer:
      "Ceny są takie same dla matury i egzaminu ósmoklasisty. Ósmoklasistom zwykle wystarcza Pro: więcej pytań do Korepetytora AI i regularne symulacje. Maturzystom polecamy Max: najwyższy limit pytań do Korepetytora AI, Korepetytora AI z pamięcią Twoich postępów i symulacje bez limitu aż do dnia egzaminu. Jeśli dopiero zaczynasz, zostań przy Free: roadmapa i trening są w nim bez limitu. Enterprise jest dla szkół.",
  },
  {
    question: "Co się dzieje, gdy wyczerpię dzienny limit pytań do Korepetytora AI?",
    answer:
      "Nic nie znika i nic się nie blokuje. Limit pytań odnawia się następnego dnia, a do tego czasu dalej rozwiązujesz zadania, przerabiasz roadmapę i piszesz symulacje. Jeśli limit regularnie Ci nie wystarcza, przejdź na Pro albo Max.",
  },
  {
    question: "Czy jest okres próbny?",
    answer:
      "Nie potrzebujesz go: plan Free jest darmowy na zawsze i nie wymaga karty. Zamiast kilkunastu dni pełnego dostępu dajemy Ci bezterminowo pełną roadmapę, trening bez limitu i codzienną pulę pytań do Korepetytora AI. Kiedy zaczyna być za ciasno, przechodzisz wyżej.",
  },
  {
    question: "Czy oferujecie zniżki?",
    answer:
      "Tak. Przy płatności rocznej płacisz za dziesięć miesięcy, a korzystasz przez dwanaście: Pro kosztuje 490 zł zamiast 588 zł, a Max 790 zł zamiast 948 zł. Szkoły wyceniamy pod liczbę uczniów, więc im większa placówka, tym niższa cena za osobę.",
  },
  {
    question: "Czy mogę anulować subskrypcję w każdej chwili?",
    answer:
      "Tak. Plan zmieniasz i anulujesz w ustawieniach konta, bez kontaktu z nami. Po anulowaniu zachowujesz dostęp do końca opłaconego okresu, a potem konto wraca do planu Free. Twoje postępy, wyniki i historia zadań zostają.",
  },
  {
    question: "Czy zwracacie pieniądze?",
    answer:
      "Jeśli plan Ci nie odpowiada, napisz do nas w ciągu 14 dni od pierwszej płatności, a zwrócimy całą kwotę. Po tym czasie możesz anulować subskrypcję w każdej chwili, a dostęp zostaje do końca opłaconego okresu.",
  },
  {
    question: "Jak dbacie o prywatność i bezpieczeństwo danych?",
    answer:
      "Twoje dane należą do Ciebie. Szyfrujemy je w trakcie przesyłania i przechowywania, nie sprzedajemy ich nikomu i działamy zgodnie z RODO. W każdej chwili możesz je wyeksportować albo usunąć konto. Szkołom podpisujemy umowę powierzenia przetwarzania danych.",
  },
  {
    question: "Mam więcej pytań o Examax. Jak się z Wami skontaktować?",
    answer:
      "Napisz do nas przez stronę kontaktu. Odpowiadamy w ciągu jednego dnia roboczego, a szkołom pomagamy dobrać plan i przygotować wycenę.",
  },
];
