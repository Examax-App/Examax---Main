import {
  BadgePercent,
  BookOpen,
  CircleCheck,
  FolderOpen,
  MousePointerClick,
  PencilLine,
  RefreshCcw,
  Route,
  Tag,
} from "lucide-react";
import type { NavGroup, Status } from "@/components/hero-film/kit";

/**
 * The film's fixture — every name, figure and chart point on screen.
 *
 * Nothing in a loop carries its own literal. One student (Ala Wiśniewska,
 * Matura z matematyki) runs through all three loops, and the numbers that
 * appear in more than one place are defined once here so two screens can
 * never disagree about her.
 */

/* ------------------------------------------------------------------------ */
/* Navigation                                                                */
/* ------------------------------------------------------------------------ */

const ROADMAP_REVIEW_PENDING = 4;

/**
 * The sidebar — one set of rows, identical in every loop, so switching tabs
 * never reshuffles it. The three hero tabs are its first rows (Trening,
 * Roadmapa, Postępy) and only the highlight moves. `review` is the Powtórki
 * badge, which the Roadmapa loop counts down.
 */
export function appNav(review: number = ROADMAP_REVIEW_PENDING): NavGroup[] {
  return [
    {
      heading: "",
      items: [
        { label: "Trening", icon: PencilLine },
        { label: "Roadmapa", icon: Route },
        { label: "Powtórki", icon: RefreshCcw, badge: review },
      ],
    },
    {
      heading: "Wgląd",
      items: [
        { label: "Postępy", icon: BadgePercent },
        { label: "Aktywność", icon: MousePointerClick },
        { label: "Opanowane", icon: CircleCheck },
      ],
    },
    {
      heading: "Biblioteka",
      items: [
        { label: "Przedmioty", icon: BookOpen },
        { label: "Foldery", icon: FolderOpen },
        { label: "Etykiety", icon: Tag },
      ],
    },
  ];
}

/* ------------------------------------------------------------------------ */
/* Roadmapa                                                                  */
/* ------------------------------------------------------------------------ */

export const ROADMAP = {
  mastery: { label: "Opanowanie materiału", value: "68%" },
  /** The mastery curve over the last 30 days, 0–1. */
  curve: [0.3, 0.3, 0.42, 0.38, 0.5, 0.46, 0.34, 0.2, 0.18, 0.58, 0.55, 0.4, 0.5, 0.42, 0.47, 0.66, 0.6, 0.44, 0.44, 0.58, 0.68, 0.72, 0.62, 0.56, 0.7],
  range: ["pon, 24 lut", "śr, 25 mar"],
  today: [
    { label: "Powtórz błędne zadania", count: 4 },
    { label: "Dokończ dział: Funkcje", count: 2 },
    { label: "Odblokuj nowe tematy", count: 3 },
  ],
  shortcuts: [
    { label: "Arkusze CKE", meta: "12 arkuszy z lat 2015–2024" },
    { label: "Plan tygodnia", meta: "5 sesji · 3 h 20 min" },
    { label: "Raport postępów", meta: "Wysyłany co niedzielę" },
  ],
  review: {
    pending: ROADMAP_REVIEW_PENDING,
    mastered: { from: "38", to: "42" },
    streak: "34 dni",
  },
  topics: [
    { topic: "Procenty", unit: "Liczby", status: "pending", score: "62%" },
    { topic: "Funkcja liniowa", unit: "Funkcje", status: "pending", score: "58%" },
    { topic: "Ciągi arytmetyczne", unit: "Ciągi", status: "pending", score: "64%" },
    { topic: "Prawdopodobieństwo", unit: "Statystyka", status: "pending", score: "55%" },
    { topic: "Równania kwadratowe", unit: "Równania", status: "done", score: "94%" },
    { topic: "Potęgi", unit: "Liczby", status: "done", score: "91%" },
    { topic: "Trójkąty", unit: "Geometria", status: "done", score: "88%" },
    { topic: "Wyrażenia algebraiczne", unit: "Algebra", status: "done", score: "90%" },
  ] satisfies Array<{ topic: string; unit: string; status: Status; score: string }>,
  /** Scores the pending topics reach once reviewed. */
  reviewed: ["86%", "82%", "88%", "80%"],
} as const;

/* ------------------------------------------------------------------------ */
/* Trening                                                                   */
/* ------------------------------------------------------------------------ */

export type Session = {
  title: string;
  source: string;
  date: string;
  tasks: string;
  score: string;
};

export const PRACTICE = {
  sessions: [
    { title: "Procenty", source: "Arkusz CKE 2024 · Matematyka", date: "25 mar 2027", tasks: "12", score: "92%" },
    { title: "Funkcja liniowa", source: "Arkusz CKE 2023 · Matematyka", date: "24 mar 2027", tasks: "10", score: "80%" },
    { title: "Lektury obowiązkowe", source: "Język polski · Quiz", date: "22 mar 2027", tasks: "15", score: "73%" },
    { title: "Past Simple", source: "Język angielski · Quiz", date: "21 mar 2027", tasks: "20", score: "95%" },
    { title: "Ciągi arytmetyczne", source: "Arkusz CKE 2022 · Matematyka", date: "19 mar 2027", tasks: "8", score: "75%" },
  ] satisfies Session[],
  /** What the student types into the new-session form. */
  draft: {
    topic: "Równania kwadratowe",
    subject: "Matematyka",
    level: "Rozszerzenie",
    count: "10",
    tags: ["Matura", "Powtórka"],
    question: "Rozwiąż równanie x² − 5x + 6 = 0.",
    options: ["x = 1 lub x = 6", "x = 2 lub x = 3", "x = −2 lub x = −3", "Brak rozwiązań"],
  },
  created: { title: "Równania kwadratowe", source: "Matematyka · Rozszerzenie", date: "Dzisiaj", tasks: "10", score: "—" } satisfies Session,
} as const;

/* ------------------------------------------------------------------------ */
/* Śledzenie postępów                                                        */
/* ------------------------------------------------------------------------ */

export const PROGRESS = {
  metrics: [
    { label: "Zadania", value: "7 214", color: "#60a5fa" },
    { label: "Poprawne", value: "5 136", color: "#c084fc" },
    { label: "Opanowane", value: "38 tematów", color: "#2dd4bf" },
  ],
  tasksCurve: [0.42, 0.42, 0.67, 0.62, 0.77, 0.58, 0.19, 0.14, 0.82, 0.78, 0.43, 0.67, 0.55, 0.62, 0.89, 0.43, 0.43, 0.6, 0.86, 0.92, 0.77, 0.67, 0.18],
  masteredCurve: [0.25, 0.72, 0.8, 0.95, 0.9, 0.72, 0.5, 0.5, 0.78, 0.93, 0.62, 0.53, 0.72, 0.5, 0.82, 0.86, 0.22, 0.26, 0.62, 0.8, 0.68, 0.72, 0.5, 0.5],
  axis: ["400", "200", "0"],
  ticks: ["4 mar", "10 mar", "16 mar", "22 mar", "28 mar"],
  tooltip: { date: "18 mar", label: "Zadania", value: "380" },
  funnel: [
    { color: "#1a5cff", share: "100%" },
    { color: "#a020f0", share: "71%" },
    { color: "#14d2b9", share: "9,7%" },
  ],
  events: [
    { date: "25 mar, 18:42", topic: "Procenty", subject: "Matematyka", score: "3/3", source: "Arkusz CKE 2024" },
    { date: "25 mar, 18:31", topic: "Procenty", subject: "Matematyka", score: "2/3", source: "Arkusz CKE 2024" },
    { date: "25 mar, 17:55", topic: "Funkcja liniowa", subject: "Matematyka", score: "2/2", source: "Quiz" },
    { date: "24 mar, 20:10", topic: "Past Simple", subject: "Angielski", score: "5/5", source: "Quiz" },
    { date: "24 mar, 19:47", topic: "Lektury", subject: "Polski", score: "4/5", source: "Quiz" },
    { date: "24 mar, 19:12", topic: "Ciągi", subject: "Matematyka", score: "1/2", source: "Arkusz CKE 2022" },
    { date: "23 mar, 21:03", topic: "Potęgi", subject: "Matematyka", score: "3/3", source: "Arkusz CKE 2023" },
    { date: "23 mar, 20:40", topic: "Reading", subject: "Angielski", score: "4/4", source: "Quiz" },
    { date: "23 mar, 18:16", topic: "Trójkąty", subject: "Matematyka", score: "2/3", source: "Arkusz CKE 2021" },
  ],
  sparks: [
    [0.2, 0.3, 0.25, 0.55, 0.5, 0.42, 0.48, 0.45, 0.62, 0.9],
    [0.25, 0.35, 0.3, 0.5, 0.48, 0.4, 0.5, 0.42, 0.66, 0.85],
    [0.15, 0.28, 0.3, 0.52, 0.44, 0.4, 0.46, 0.4, 0.7, 0.88],
  ],
} as const;
