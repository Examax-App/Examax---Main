import Link from "next/link";
import { LaunchVisual } from "@/components/updates/LaunchVisual";

/*
 * The changelog — every post on /updates, newest first, and the RSS feed
 * at /updates/rss.xml. One post for now: the launch.
 */

export type Entry = {
  slug: string;
  /** ISO date; the page writes it out in Polish. */
  date: string;
  title: string;
  /** One plain sentence, for the feed. */
  summary: string;
  /** The 16:9 picture under the title. */
  visual: React.ReactNode;
  body: React.ReactNode;
};

export const ENTRIES: Entry[] = [
  {
    slug: "start-examax",
    date: "2026-10-03",
    title: "Podgląd platformy Examax",
    summary: "Udostępniliśmy podgląd Examaxu, w tym logowanie i zakładanie konta. Cała platforma będzie dostępna wkrótce. Dziękujemy, że jesteś z nami od początku.",
    visual: <LaunchVisual />,
    body: (
      <>
        <p>
          Udostępniliśmy <strong>podgląd Examaxu</strong> – możesz już zobaczyć, jak wyglądają logowanie i zakładanie konta. Cała platforma będzie
          dostępna wkrótce.
        </p>
        <p>
          Jeśli czytasz ten wpis, jesteś z nami od samego początku. <strong>Dziękujemy</strong> – każda wizyta i każda uwaga pomagają nam zbudować
          Examax lepiej.
        </p>
        <p>Na start przygotowujemy:</p>
        <ul>
          <li>
            <Link href="/training">trening</Link> na zadaniach z oryginalnych arkuszy CKE – z rozwiązaniami krok po kroku
          </li>
          <li>
            <Link href="/roadmap">roadmapę</Link> ułożoną pod Twój egzamin, termin i tempo
          </li>
          <li>
            <Link href="/simulation">symulację egzaminu</Link> z raportem po każdym arkuszu
          </li>
          <li>
            <Link href="/progress">postępy</Link> w każdym dziale i <Link href="/agents">Korepetytora AI</Link>, który prowadzi pytaniami,
            zamiast podawać wynik
          </li>
        </ul>
        <p>
          O każdej zmianie napiszemy właśnie tutaj. Masz pomysł albo pytanie? <Link href="/contact">Napisz do nas</Link>.
        </p>
      </>
    ),
  },
];

/** "3 października 2026". */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}
