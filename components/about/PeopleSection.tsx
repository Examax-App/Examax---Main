"use client";

import { useId } from "react";
import Image from "next/image";
import { UserRound, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Globe } from "@/components/about/Globe";
import { EXAMAX_SOCIALS, GitHubIcon, XIcon, type SocialLink } from "@/components/ui/SocialIcons";

/*
 * dub.co/about's "Our People" band: the globe rising behind a centred
 * heading (icon eyebrow, Satoshi title, one muted line), then the team as a
 * hairline grid of cards — a round 48px portrait, the name, the role and a
 * row of small icon links. Hovering a card greys it to neutral-50 and slides
 * a faint 60px grid up into its top half.
 *
 * Examax has two cards side by side: the founder's, and Examax's own
 * official profile (the app icon, linking to its socials). Every icon link
 * opens the profile in a new tab, as dub's do.
 *
 * PLACEHOLDER: the founder's X and GitHub URLs point at the sites' home
 * pages and his portrait is the grey silhouette until they are supplied.
 */

type Person = {
  name: string;
  role: string;
  portrait: React.ReactNode;
  links: SocialLink[];
};

const OWNER: Person = {
  name: "Franciszek Kierzkiewicz",
  role: "Założyciel Examax",
  portrait: (
    <span className="grid size-full place-items-center bg-paper-mist text-silver">
      <UserRound className="size-5" strokeWidth={1.75} aria-hidden />
    </span>
  ),
  links: [
    { label: "X", href: "https://x.com/kenarfTBD", icon: XIcon },
    { label: "GitHub", href: "https://github.com/FrancisTechX2", icon: GitHubIcon },
  ],
};

const EXAMAX: Person = {
  name: "Examax",
  role: "Oficjalny profil",
  portrait: <Image src="/favicon.svg" alt="" width={48} height={48} unoptimized className="size-full" />,
  links: EXAMAX_SOCIALS,
};

const LINK_CLASS =
  "focus-ring group/link relative block shrink-0 rounded-md p-2 text-steel transition-colors duration-75 hover:bg-white/10 hover:text-charcoal";

function PersonCard({ person }: { person: Person }) {
  const gridId = useId();
  return (
    <div className="group/card relative flex flex-col items-center gap-5 bg-white px-6 py-10 text-center">
      {/* Hover: the card greys and a faint grid slides up into its top half */}
      <div aria-hidden className="absolute inset-0 overflow-hidden bg-canvas-muted opacity-0 transition-opacity group-hover/card:opacity-100">
        <svg
          className="pointer-events-none absolute inset-y-0 left-1/2 w-80 -translate-x-1/2 translate-y-2 text-ash transition-transform duration-300 ease-out [mask-image:linear-gradient(black_30%,transparent)] group-hover/card:translate-y-0"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id={gridId} x="-50" y="-1" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="transparent" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect fill={`url(#${gridId})`} width="100%" height="100%" />
        </svg>
      </div>

      <div className="relative size-12 overflow-hidden rounded-full border border-black/5">{person.portrait}</div>
      <div className="relative flex flex-col whitespace-nowrap">
        <span className="text-base font-medium text-graphite">{person.name}</span>
        <span className="text-sm text-fog">{person.role}</span>
      </div>
      <div className="relative flex gap-1">
        {person.links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${person.name} — ${link.label}`}
              className={LINK_CLASS}
            >
              <Icon className="size-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function PeopleSection() {
  return (
    <section aria-labelledby="people-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash pt-12">
        <div className="relative w-full bg-white">
          <div className="absolute inset-x-0 -top-8 z-0 mx-auto h-[240px] w-full max-w-[440px] overflow-visible">
            <Globe />
          </div>

          <Reveal className="pointer-events-none relative z-10 mx-auto w-full max-w-2xl px-4 pb-2 pt-56 text-center">
            <div className="flex items-center justify-center gap-2.5 text-base font-medium text-steel">
              <Users className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
              Ludzie
            </div>
            <h2 id="people-heading" className="mx-auto mt-3 max-w-xl text-pretty font-satoshi text-3xl font-medium text-charcoal sm:text-4xl sm:leading-tight">
              Tworzone w Polsce, dla polskich uczniów
            </h2>
            <p className="mt-3 text-pretty text-lg text-fog">
              Examax to niezależny projekt tworzony w Polsce. Budujemy go blisko uczniów, nauczycieli i wymagań współczesnych egzaminów.
            </p>
          </Reveal>

          {/* The founder and the official profile, side by side */}
          <div className="relative z-10 mt-16 grid grid-cols-1 gap-px border-t border-ash bg-ash md:grid-cols-2">
            <PersonCard person={OWNER} />
            <PersonCard person={EXAMAX} />
          </div>
        </div>
      </div>
    </section>
  );
}
