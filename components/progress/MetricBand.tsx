"use client";

import {
  Bell,
  CalendarDays,
  CircleCheck,
  Clock,
  FileText,
  Flag,
  Flame,
  Gauge,
  Layers,
  ListChecks,
  RefreshCcw,
  ScanSearch,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { TopicBand, type BandSet } from "@/components/roadmap/TopicBand";

/*
 * The band under the hero — dub.co/analytics' logo band, built on the
 * roadmap's flip (ten marks in a 5×2 grid, each slot turning on its X axis
 * 50ms after its neighbour). Dub shows its customers; Examax has none to name
 * yet, so the band shows what the tracking measures: the results, then the
 * habits behind them. The pill under the first mark names the set.
 */

const SETS: BandSet[] = [
  {
    exam: "Wyniki",
    topics: [
      { name: "Opanowanie", subject: { icon: Target, accent: "tangerine" } },
      { name: "Skuteczność", subject: { icon: CircleCheck, accent: "green" } },
      { name: "Punkty CKE", subject: { icon: Trophy, accent: "blue" } },
      { name: "Gotowość", subject: { icon: Gauge, accent: "tangerine" } },
      { name: "Arkusze", subject: { icon: FileText, accent: "sapphire" } },
      { name: "Słabe punkty", subject: { icon: ScanSearch, accent: "lavender" } },
      { name: "Quizy", subject: { icon: ListChecks, accent: "green" } },
      { name: "Tematy", subject: { icon: Layers, accent: "blue" } },
      { name: "Tempo", subject: { icon: TrendingUp, accent: "tangerine" } },
      { name: "Rekomendacje", subject: { icon: Zap, accent: "yellow" } },
    ],
  },
  {
    exam: "Nawyki",
    topics: [
      { name: "Seria dni", subject: { icon: Flame, accent: "tangerine" } },
      { name: "Czas nauki", subject: { icon: Clock, accent: "blue" } },
      { name: "Cel tygodnia", subject: { icon: Flag, accent: "green" } },
      { name: "Powtórki", subject: { icon: RefreshCcw, accent: "blue" } },
      { name: "Sesje", subject: { icon: CalendarDays, accent: "lavender" } },
      { name: "Przypomnienia", subject: { icon: Bell, accent: "yellow" } },
      { name: "Raport tygodnia", subject: { icon: FileText, accent: "sapphire" } },
      { name: "Udostępnianie", subject: { icon: Share2, accent: "green" } },
      { name: "Postęp dnia", subject: { icon: Sparkles, accent: "tangerine" } },
      { name: "Dla rodzica", subject: { icon: Users, accent: "lavender" } },
    ],
  },
];

export function MetricBand() {
  return <TopicBand sets={SETS} label="Co mierzy Examax" />;
}
