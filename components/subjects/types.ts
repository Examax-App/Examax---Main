import type { Accent } from "@/components/ui/FeaturePill";
import type { MiniFeature } from "@/components/roadmap/sections";
import type { IconComponent } from "@/lib/icon";

/*
 * The shape of a subject page (/math, /polish, /english) — one file of
 * content per subject under `data/`, one layout (`SubjectPage`) for all
 * three. Everything a page says lives in its data file.
 */

/**
 * Where a topic is examined: the eighth-grade exam, the written matura at
 * either level, or the oral matura.
 */
export type Exam = "e8" | "mp" | "mr" | "mu";

export type Topic = {
  name: string;
  /** The card's mark, set in the subject's chip. */
  icon: IconComponent;
  description: string;
  exams: Exam[];
};

/** The diagram a featured topic shows beside its card (`diagrams.tsx`). */
export type DiagramKey =
  | "parabola"
  | "percent"
  | "trig"
  | "pythagoras"
  | "sequence"
  | "essay"
  | "epochs"
  | "devices"
  | "reading"
  | "commas"
  | "tenses"
  | "listening"
  | "email"
  | "conditionals"
  | "transform";

/** A topic the hero carousel opens up: what it is, what Examax gives you for it, and a diagram of it. */
export type FeaturedTopic = Topic & {
  /** What the topic holds in Examax, one line each. */
  inside: string[];
  diagram: DiagramKey;
};

export type Category = {
  /** Anchor for the row, so the category grid can jump to it. */
  id: string;
  name: string;
  icon: IconComponent;
  topics: Topic[];
};

export type Subject = {
  /** The route, e.g. "math" → /math. */
  slug: string;
  name: string;
  icon: IconComponent;
  accent: Accent;
  title: string;
  sub: string;
  featured: FeaturedTopic[];
  categories: Category[];
  benefits: { items: MiniFeature[]; summary: string };
  cta: { title: string; sub: string };
};
