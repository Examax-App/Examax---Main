import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export type Quote = {
  quote: string;
  name: string;
  role: string;
  /** Short wordmark shown in place of a customer logo. */
  mark: string;
  /** Optional "read the story" pill link. */
  story?: string;
};

/* ---------------------------------------------------------------------------
 * PLACEHOLDER COPY — none of these people or schools exist.
 * Swap the strings for real quotes before launch; the layout needs no changes.
 * ------------------------------------------------------------------------- */
export const PLACEHOLDER_QUOTES: Record<string, Quote> = {
  roadmapa: {
    quote:
      "Pierwszy raz widziałam cały materiał w jednym miejscu i wiedziałam, od czego zacząć. Wcześniej otwierałam zbiór zadań i zamykałam go po dziesięciu minutach.",
    name: "Zofia Lewandowska",
    role: "Maturzystka · LO nr 4, Wrocław",
    mark: "LO IV",
    story: "#metoda",
  },
  trening: {
    quote:
      "Zadania są dokładnie takie jak na arkuszu, więc na egzaminie próbnym nic mnie nie zaskoczyło. Po prostu robiłem to, co codziennie.",
    name: "Kacper Nowicki",
    role: "Ósmoklasista · SP 12, Gdynia",
    mark: "SP 12",
  },
  agent: {
    quote:
      "Uczniowie przestali pytać „jaki jest wynik”, a zaczęli pytać „dlaczego”. Agent tłumaczy krok po kroku i nie traci cierpliwości o dwudziestej drugiej.",
    name: "Marta Zielińska",
    role: "Nauczycielka matematyki",
    mark: "Korepetycje ZM",
    story: "#agent",
  },
  postepy: {
    quote:
      "Zamiast pytać córkę, czy się uczyła, po prostu patrzę na wskaźnik gotowości. Skończyły się kłótnie przy kolacji.",
    name: "Paweł Adamczyk",
    role: "Rodzic ósmoklasistki",
    mark: "Rodzic",
  },
};

/**
 * Customer quote band — the reference closes every product section with one
 * of these, on the dotted design-system texture: quote at 20px/28px, wordmark
 * top-right, 40px avatar, and an optional story pill.
 */
export function Testimonial({ quote, name, role, mark, story }: Quote) {
  return (
    <section className="col-rules relative overflow-hidden border-t border-ash bg-white">
      <div className="bg-dots mask-fade-edges absolute inset-0 opacity-60" aria-hidden />
      <Container className="relative py-12">
        <Reveal>
          <figure className="grid gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <blockquote className="max-w-2xl text-pretty text-xl leading-7 text-charcoal">
                „{quote}”
              </blockquote>
              {story ? (
                <Link
                  href={story}
                  className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-full border border-ash bg-white px-3 py-1.5 text-[13px] font-medium text-charcoal shadow-subtle transition-all hover:ring-4 hover:ring-ash"
                >
                  <BookOpen className="size-3.5 text-fog" aria-hidden />
                  Przeczytaj historię
                </Link>
              ) : null}
            </div>
            <figcaption className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-3 lg:text-right">
              <div className="order-2 lg:order-1">
                <p className="text-body font-semibold tracking-tight text-charcoal">
                  {mark}
                </p>
                <p className="mt-1.5 text-body font-medium text-charcoal">
                  {name}
                </p>
                <p className="text-body text-fog">{role}</p>
              </div>
              <Avatar name={name} size="lg" className="order-1 lg:order-2" />
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
