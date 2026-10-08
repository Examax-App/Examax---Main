import Image from "next/image";
import { Flag } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

import clouds from "@/public/about/clouds.jpg";

/*
 * dub.co/about's "Our values": a strip of sky drifting sideways behind the
 * heading (two copies of one tile on a 60s loop, half-transparent, a touch
 * more saturated, cut to a soft oval by a radial mask), a flag icon over the
 * title, then the values on a ruled two-column grid. The right column hangs
 * 64px lower than the left, so the rules step down across the page; each
 * value has its number in the accent, a Satoshi title and a muted paragraph.
 *
 * The sky is Examax's own tile (`public/about/clouds.jpg`, generated to wrap
 * seamlessly), not dub's, and a little stronger and wider than dub's (65%
 * rather than 50%, its fade starting a third of the way out) so it reads
 * on any screen. The numbers are in the brand blue where dub uses its orange.
 */

type Value = { title: string; body: string };

const VALUES: Value[] = [
  {
    title: "Nauka szyta na miarę",
    body: "Nauka dopasowana do ucznia: zaczynasz od tego, co już umiesz, i ćwiczysz to, co wymaga poprawy. Chcemy, żebyś rozumiał nie tylko swój wynik, ale też to, co już opanowałeś i nad czym warto jeszcze popracować.",
  },
  {
    title: "Zero reklam",
    body: "Nie budujemy Examaxu wokół reklam. Liczy się Twoja wygoda i to, żebyś naprawdę czegoś się nauczył. Chcemy, żeby Examax rósł dzięki uczniom, którzy polecają go dalej — a nie dzięki reklamodawcom.",
  },
  {
    title: "Zrozumieć, nie przepisać",
    body: "Korepetytor AI prowadzi krok po kroku i pyta o Twój następny ruch, zamiast podawać gotowe rozwiązanie. Na egzaminie nie będzie czatu — zostanie to, co naprawdę rozumiesz.",
  },
  {
    title: "Ciągle poprawiamy",
    body: "Examax cały czas się rozwija. Ważne zmiany opisujemy w aktualnościach, a uwagi użytkowników pomagają nam ulepszać platformę. Zgłoszone błędy w zadaniach poprawiamy w pierwszej kolejności.",
  },
  {
    title: "Oryginalne zadania CKE",
    body: "Korzystamy z oficjalnych materiałów egzaminacyjnych Centralnej Komisji Egzaminacyjnej i nie przypisujemy sobie do nich praw. Nasza wartość to wszystko, co budujemy wokół nich: środowisko nauki, wyjaśnienia i narzędzia, które pomagają zrozumieć, czego wymaga egzamin.",
  },
];

/** An odd count leaves one value over; it closes the grid as a full-width row. */
const CLOSING = VALUES.length % 2 === 1 ? VALUES.length - 1 : -1;

/**
 * Each cell's rules, as dub draws them: the right column overlaps the left by
 * a pixel and hangs 64px lower; the left column's last cell closes the grid.
 * A closing row starts where the right column ends, mirroring the step at the
 * top, and draws the grid's last rule itself.
 */
function cellRules(index: number) {
  if (index === CLOSING) return "sm:mt-16 sm:border-b";
  if (index % 2 === 1) return "-mx-px border-l sm:translate-y-16";
  return cn("sm:border-r", CLOSING === -1 && index === VALUES.length - 2 && "sm:border-b");
}

export function ValuesSection() {
  return (
    <section aria-labelledby="values-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash py-16">
        <div className="relative pt-48">
          {/* The sky, drifting */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 left-1/2 h-[calc(100%+3rem)] w-full max-w-2xl -translate-x-1/2 overflow-hidden opacity-[0.65] saturate-[1.25] [mask-image:radial-gradient(closest-side,black_35%,transparent)]"
          >
            <div className="absolute inset-0 flex w-[200vw]">
              {[0, 1].map((copy) => (
                <Image
                  key={copy}
                  src={clouds}
                  alt=""
                  sizes="900px"
                  className={cn(
                    "relative block h-full w-auto max-w-none animate-infinite-scroll [--scroll-duration:60s] [--scroll:-100%] motion-reduce:animate-none",
                    copy === 1 && "-ml-px",
                  )}
                />
              ))}
            </div>
          </div>

          <Reveal className="relative flex flex-col items-center text-center">
            <Flag className="size-6 text-graphite" strokeWidth={1.75} aria-hidden />
            <h2 id="values-heading" className="mt-3 text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl">
              Nasze wartości
            </h2>
          </Reveal>
        </div>

        <div className="mt-24">
          <ul className="grid w-full grid-cols-1 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <li key={value.title} className={cn(index === CLOSING && "sm:col-span-2")}>
                <Reveal delay={index * 100} className="h-full">
                  <div className={cn("relative h-full border-t border-ash", cellRules(index))}>
                    {/* The closing row splits on the grid's columns: number and title left, body right, level with the title */}
                    <div className={cn("relative text-base", index === CLOSING ? "sm:grid sm:grid-cols-2" : "p-8 lg:p-14")}>
                      <div className={cn(index === CLOSING && "px-8 pt-8 sm:pb-8 lg:p-14")}>
                        <span className="block font-medium tabular-nums leading-tight text-electric-blue">{String(index + 1).padStart(2, "0")}</span>
                        <h3 className="mt-8 font-satoshi text-2xl font-medium leading-7 text-charcoal">{value.title}</h3>
                      </div>
                      <p
                        className={cn(
                          "mt-6 text-pretty leading-relaxed text-fog",
                          index === CLOSING && "px-8 pb-8 sm:mt-0 sm:pt-[5.25rem] lg:p-14 lg:pt-[6.75rem]",
                        )}
                      >
                        {value.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
