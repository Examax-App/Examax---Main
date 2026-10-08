import Link from "@/components/ui/Link";
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
  roadmap: {
    quote:
      "Pierwszy raz widziałam cały materiał w jednym miejscu i wiedziałam, od czego zacząć. Wcześniej otwierałam zbiór zadań i zamykałam go po dziesięciu minutach.",
    name: "Zofia Lewandowska",
    role: "Maturzystka · LO nr 4, Wrocław",
    mark: "LO IV",
    story: "#method",
  },
  practice: {
    quote:
      "Zadania są dokładnie takie jak na arkuszu, więc na egzaminie próbnym nic mnie nie zaskoczyło. Po prostu robiłem to, co codziennie.",
    name: "Kacper Nowicki",
    role: "Ósmoklasista · SP 12, Gdynia",
    mark: "SP 12",
  },
  agent: {
    quote:
      "Uczniowie przestali pytać „jaki jest wynik”, a zaczęli pytać „dlaczego”. Korepetytor AI tłumaczy krok po kroku i nie traci cierpliwości o dwudziestej drugiej.",
    name: "Marta Zielińska",
    role: "Nauczycielka matematyki",
    mark: "Korepetycje ZM",
    story: "#agent",
  },
  progress: {
    quote:
      "Zamiast pytać córkę, czy się uczyła, po prostu patrzę na wskaźnik gotowości. Skończyły się kłótnie przy kolacji.",
    name: "Paweł Adamczyk",
    role: "Rodzic ósmoklasistki",
    mark: "Rodzic",
  },
};

/**
 * Customer quote, in two shapes.
 *
 * `band` (the default, and what the landing page uses) is the reference's
 * compact closer: a 12px-padded strip on the dotted texture, quote left,
 * attribution right.
 *
 * `feature` is the reference's *other* quote treatment — the one it gives a
 * section of its own: wordmark, a centred 24px quote, avatar, name, role and
 * the story link, all stacked down the middle. Use it where a page carries one
 * quote rather than one per feature; three thin bands at even intervals read
 * as speed bumps rather than as proof.
 */
export function Testimonial({
  quote,
  name,
  role,
  mark,
  story,
  layout = "band",
}: Quote & { layout?: "band" | "feature" }) {
  if (layout === "feature") {
    return (
      <section className="col-rules relative overflow-hidden border-t border-ash bg-white">
        <div className="bg-dots mask-fade-edges absolute inset-0 opacity-60" aria-hidden />
        <Container className="relative py-20">
          <Reveal>
            <figure className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <p className="font-satoshi text-body-lg font-bold tracking-tight text-charcoal">
                {mark}
              </p>
              <blockquote className="mt-8 text-pretty text-heading-sm leading-[1.42] text-charcoal">
                „{quote}”
              </blockquote>
              <figcaption className="mt-8 flex flex-col items-center gap-3">
                <Avatar name={name} size="lg" />
                <span className="block">
                  <span className="block text-body font-medium text-charcoal">
                    {name}
                  </span>
                  <span className="block text-body text-fog">{role}</span>
                </span>
              </figcaption>
              {story ? (
                <Link
                  href={story}
                  className="focus-ring mt-8 inline-flex items-center gap-1.5 rounded-full border border-ash bg-white px-3.5 py-2 text-[13px] font-medium text-electric-blue shadow-subtle transition-all hover:ring-4 hover:ring-ash"
                >
                  <BookOpen className="size-3.5" aria-hidden />
                  Przeczytaj historię
                </Link>
              ) : null}
            </figure>
          </Reveal>
        </Container>
      </section>
    );
  }

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
