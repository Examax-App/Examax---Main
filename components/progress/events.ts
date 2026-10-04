import {
  BookMarked,
  BookOpen,
  FileCheck,
  Languages,
  ListChecks,
  PencilLine,
  Route,
  Sigma,
  Target,
  Zap,
} from "lucide-react";
import type { Accent } from "@/components/ui/FeaturePill";
import type { IconComponent } from "@/lib/icon";

/*
 * One learner's evening, for the "Na bieżąco" band on /progress: the topics
 * she works on, where each task came from, and the three streams the
 * reference's stat cards switch between (its clicks, leads and sales — here
 * every answer, every finished lesson, and every scored task).
 *
 * Times are minutes before now, so the rows end at the visitor's own clock.
 * PLACEHOLDER DATA — topics, scores and timings are illustrative.
 */

export type SubjectKey = "math" | "polish" | "english";

export const SUBJECTS: Record<SubjectKey, { name: string; icon: IconComponent; accent: Accent }> = {
  math: { name: "Matematyka", icon: Sigma, accent: "blue" },
  polish: { name: "Język polski", icon: BookMarked, accent: "green" },
  english: { name: "Język angielski", icon: Languages, accent: "lavender" },
};

/** Where a task came from — the reference's link column. `exam` sources wear the Matura mark. */
export type Source = { label: string; icon?: IconComponent; exam?: boolean };

const ARKUSZ_2024: Source = { label: "Arkusz CKE 2024", exam: true };
const ARKUSZ_2023: Source = { label: "Arkusz CKE 2023", exam: true };
const QUIZ: Source = { label: "Quiz tematyczny", icon: ListChecks };
const ROADMAP: Source = { label: "Roadmapa", icon: Route };
const TRAINING: Source = { label: "Trening", icon: PencilLine };
const TUTOR: Source = { label: "Korepetytor AI", icon: Zap };

const DAY = 24 * 60;

export type Activity = { icon: IconComponent; label: string; detail: string; ago: number };

/** A topic and its own history — what the sheet opens on, the reference's customer. */
export type Topic = {
  id: string;
  name: string;
  subject: SubjectKey;
  /** Where the topic is followed from. */
  source: Source;
  /** Time from the first lesson to the first quiz, and on to mastery. */
  toQuiz: string;
  toMastery: string;
  mastery: number;
  /** Newest first; the last entry is when the topic was started. */
  activity: Activity[];
};

export const TOPICS: Record<string, Topic> = {
  quadratic: {
    id: "quadratic",
    name: "Funkcja kwadratowa",
    subject: "math",
    source: ROADMAP,
    toQuiz: "2 dni",
    toMastery: "12 dni",
    mastery: 92,
    activity: [
      { icon: Target, label: "Temat opanowany", detail: "92%", ago: 3 },
      { icon: ListChecks, label: "Quiz tematyczny", detail: "9/10 pkt", ago: 4 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "Postać kanoniczna", ago: 3 * DAY + 95 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2023 · zad. 12", ago: 12 * DAY + 210 },
    ],
  },
  sequences: {
    id: "sequences",
    name: "Ciągi",
    subject: "math",
    source: QUIZ,
    toQuiz: "1 dzień",
    toMastery: "9 dni",
    mastery: 88,
    activity: [
      { icon: FileCheck, label: "Zadanie otwarte", detail: "3/4 pkt", ago: 8 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "Ciąg geometryczny", ago: 2 * DAY + 40 },
      { icon: ListChecks, label: "Quiz tematyczny", detail: "7/10 pkt", ago: 6 * DAY + 130 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2022 · zad. 9", ago: 9 * DAY + 75 },
    ],
  },
  romanticism: {
    id: "romanticism",
    name: "Romantyzm",
    subject: "polish",
    source: ROADMAP,
    toQuiz: "3 dni",
    toMastery: "16 dni",
    mastery: 81,
    activity: [
      { icon: ListChecks, label: "Quiz tematyczny", detail: "8/10 pkt", ago: 12 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "Dziady cz. III", ago: 4 * DAY + 60 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2024 · zad. 3", ago: 16 * DAY + 20 },
    ],
  },
  pastTenses: {
    id: "pastTenses",
    name: "Czasy przeszłe",
    subject: "english",
    source: TRAINING,
    toQuiz: "1 dzień",
    toMastery: "6 dni",
    mastery: 95,
    activity: [
      { icon: FileCheck, label: "Zadanie zamknięte", detail: "1/1 pkt", ago: 15 },
      { icon: Target, label: "Temat opanowany", detail: "95%", ago: DAY + 300 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "Past Perfect", ago: 3 * DAY + 15 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2023 · zad. 6", ago: 6 * DAY + 180 },
    ],
  },
  trigonometry: {
    id: "trigonometry",
    name: "Trygonometria",
    subject: "math",
    source: TUTOR,
    toQuiz: "4 dni",
    toMastery: "w toku",
    mastery: 64,
    activity: [
      { icon: Zap, label: "Wyjaśnienie błędu", detail: "Korepetytor AI", ago: 18 },
      { icon: FileCheck, label: "Zadanie otwarte", detail: "2/4 pkt", ago: 19 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "Wzory redukcyjne", ago: DAY + 85 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2024 · zad. 14", ago: 5 * DAY + 50 },
    ],
  },
  stylistics: {
    id: "stylistics",
    name: "Środki stylistyczne",
    subject: "polish",
    source: QUIZ,
    toQuiz: "1 dzień",
    toMastery: "8 dni",
    mastery: 86,
    activity: [
      { icon: FileCheck, label: "Zadanie zamknięte", detail: "2/2 pkt", ago: 23 },
      { icon: ListChecks, label: "Quiz tematyczny", detail: "9/10 pkt", ago: 2 * DAY + 200 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2021 · zad. 2", ago: 8 * DAY + 90 },
    ],
  },
  reading: {
    id: "reading",
    name: "Reading",
    subject: "english",
    source: ARKUSZ_2024,
    toQuiz: "2 dni",
    toMastery: "10 dni",
    mastery: 90,
    activity: [
      { icon: FileCheck, label: "Zadanie zamknięte", detail: "4/5 pkt", ago: 27 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "True / False / No info", ago: 3 * DAY + 70 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2024 · zad. 4", ago: 10 * DAY + 45 },
    ],
  },
  planimetry: {
    id: "planimetry",
    name: "Planimetria",
    subject: "math",
    source: ARKUSZ_2023,
    toQuiz: "3 dni",
    toMastery: "w toku",
    mastery: 58,
    activity: [
      { icon: FileCheck, label: "Zadanie otwarte", detail: "1/3 pkt", ago: 31 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "Twierdzenie Talesa", ago: 2 * DAY + 110 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2023 · zad. 15", ago: 4 * DAY + 30 },
    ],
  },
  essay: {
    id: "essay",
    name: "Rozprawka",
    subject: "polish",
    source: TUTOR,
    toQuiz: "5 dni",
    toMastery: "w toku",
    mastery: 71,
    activity: [
      { icon: Zap, label: "Ocena wypracowania", detail: "28/35 pkt", ago: 36 },
      { icon: BookOpen, label: "Lekcja ukończona", detail: "Teza i argumenty", ago: 3 * DAY + 25 },
      { icon: PencilLine, label: "Pierwsze zadanie", detail: "Matura 2022 · wypracowanie", ago: 14 * DAY + 60 },
    ],
  },
};

const ORDER = ["quadratic", "sequences", "romanticism", "pastTenses", "trigonometry", "stylistics", "reading", "planimetry", "essay"];

/* ── The three streams ──────────────────────────────────────────────────── */

export type Outcome = "correct" | "partial" | "wrong";

/** Every answer — the reference's clicks: the task, its subject, how it went. */
export type AnswerRow = { task: string; subject: SubjectKey; outcome: Outcome; ago: number };

/** Every finished lesson — the reference's leads, each tied to a topic. */
export type LessonRow = { source: Source; topic: string; ago: number };

/** Every scored task — the reference's sales, with the points it earned. */
export type ScoreRow = { event: string; source: Source; topic: string; points: number; max: number; ago: number };

const ANSWER_PATTERN: Array<Omit<AnswerRow, "ago">> = [
  { task: "Matura 2024 · zad. 7", subject: "math", outcome: "correct" },
  { task: "Matura 2023 · zad. 4", subject: "english", outcome: "correct" },
  { task: "Matura 2024 · zad. 12", subject: "math", outcome: "partial" },
  { task: "Matura 2022 · zad. 3", subject: "polish", outcome: "correct" },
  { task: "Matura 2023 · zad. 15", subject: "math", outcome: "wrong" },
  { task: "Matura 2024 · zad. 5", subject: "english", outcome: "correct" },
  { task: "Matura 2021 · zad. 9", subject: "math", outcome: "correct" },
  { task: "Matura 2024 · zad. 2", subject: "polish", outcome: "partial" },
];

export const ANSWERS: AnswerRow[] = Array.from({ length: 16 }, (_, i) => ({
  ...ANSWER_PATTERN[i % ANSWER_PATTERN.length],
  ago: i * 2 + (i % 3 === 2 ? 1 : 0),
}));

/** Roughly one lesson an evening, a couple on the weekend. */
const LESSON_AGO = [18, 95, DAY + 40, DAY + 130, 2 * DAY + 60, 3 * DAY + 25, 3 * DAY + 95, 4 * DAY + 60, 5 * DAY + 15, 6 * DAY + 80, 6 * DAY + 140, 7 * DAY + 30, 8 * DAY + 55, 9 * DAY + 20, 9 * DAY + 110, 10 * DAY + 45];
const LESSON_SOURCES = [ROADMAP, ROADMAP, TUTOR, ROADMAP, TRAINING];

export const LESSONS: LessonRow[] = LESSON_AGO.map((ago, i) => ({
  source: LESSON_SOURCES[i % LESSON_SOURCES.length],
  topic: ORDER[(i * 4) % ORDER.length],
  ago,
}));

/** The first loop is tonight's, each row stamped as in its topic's own history. */
const SCORE_PATTERN: ScoreRow[] = [
  { event: "Quiz tematyczny", source: QUIZ, topic: "quadratic", points: 9, max: 10, ago: 4 },
  { event: "Zadanie otwarte", source: ARKUSZ_2024, topic: "sequences", points: 3, max: 4, ago: 8 },
  { event: "Quiz tematyczny", source: QUIZ, topic: "romanticism", points: 8, max: 10, ago: 12 },
  { event: "Zadanie zamknięte", source: TRAINING, topic: "pastTenses", points: 1, max: 1, ago: 15 },
  { event: "Zadanie otwarte", source: ARKUSZ_2024, topic: "trigonometry", points: 2, max: 4, ago: 19 },
  { event: "Zadanie zamknięte", source: ARKUSZ_2023, topic: "stylistics", points: 2, max: 2, ago: 23 },
  { event: "Zadanie zamknięte", source: ARKUSZ_2024, topic: "reading", points: 4, max: 5, ago: 27 },
  { event: "Zadanie otwarte", source: ARKUSZ_2023, topic: "planimetry", points: 1, max: 3, ago: 31 },
  { event: "Wypracowanie", source: TUTOR, topic: "essay", points: 28, max: 35, ago: 36 },
];

/** Later rows run on, earlier in the evening, four minutes apart. */
export const SCORES: ScoreRow[] = Array.from({ length: 16 }, (_, i) => ({
  ...SCORE_PATTERN[i % SCORE_PATTERN.length],
  ago: i < SCORE_PATTERN.length ? SCORE_PATTERN[i].ago : 36 + (i - SCORE_PATTERN.length + 1) * 4,
}));
