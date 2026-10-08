"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/Link";
import {
  ArrowUpRight,
  BadgePercent,
  BookMarked,
  ChevronDown,
  Dna,
  FlaskConical,
  Landmark,
  Languages,
  PencilLine,
  Route,
  Sigma,
  Timer,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { EXAMAX_SOCIALS } from "@/components/ui/SocialIcons";
import { cn } from "@/lib/cn";
import { prefetchFor } from "@/lib/routes";
import type { IconComponent } from "@/lib/icon";

/**
 * The site footer, a one-to-one of dub.co's own (`DesignRules/Footer _ Dub.png`,
 * markup read off the live page): a 1024px column on the page's white; the
 * logo over the socials on the left, four link columns on the right — the
 * first two carrying Dub's 16px tinted chips — and a bottom row of status,
 * compliance mark and copyright.
 *
 * Dub's values, mapped onto our tokens: headings 14px medium charcoal, 10px
 * above their list; links 14px fog, 14px apart, darkening to slate in 75ms;
 * "Narzędzia" and "Prawne" open small menus, as Dub's "Tools" and "Legal" do.
 */

type FooterLink = {
  label: string;
  href: string;
  /** A chip before the label, as Dub's product and compare columns carry. */
  chip?: { icon: IconComponent; accent: Accent };
  external?: boolean;
  /** Not available yet: greyed out and not a link. */
  soon?: boolean;
};

/**
 * Product, in the navbar's icons and accents and the hero tabs' short names —
 * Dub's product names are one or two words, and the column is sized for that.
 * The agents are a yellow chip with a black bolt.
 */
const PRODUCT: FooterLink[] = [
  { label: "Trening", href: "/training", chip: { icon: PencilLine, accent: "green" } },
  { label: "Roadmapa", href: "/roadmap", chip: { icon: Route, accent: "blue" } },
  { label: "Postępy", href: "/progress", chip: { icon: BadgePercent, accent: "tangerine" } },
  { label: "Symulacja", href: "/simulation", chip: { icon: Timer, accent: "lavender" } },
  { label: "Korepetytor AI", href: "/agents", chip: { icon: Zap, accent: "yellow" } },
];

const EXAMS: FooterLink[] = [
  { label: "Egzamin ósmoklasisty", href: "/roadmap" },
  { label: "Matura podstawowa", href: "/roadmap" },
  { label: "Matura rozszerzona", href: "/roadmap" },
];

const RESOURCES: FooterLink[] = [
  { label: "Dokumentacja", href: "/docs" },
  { label: "Centrum pomocy", href: "/contact" },
  { label: "Aktualności", href: "/updates" },
  { label: "Cennik", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Arkusze CKE", href: "https://cke.gov.pl/egzamin-maturalny/egzamin-maturalny-w-formule-2023/arkusze/", external: true },
];

const TOOLS: FooterLink[] = [
  { label: "Plan nauki", href: "/roadmap" },
  { label: "Trening z arkuszy", href: "/training" },
  { label: "Symulacja egzaminu", href: "/simulation" },
];

/* NOT BUILT YET — /reviews, /tutors and /careers have no page behind them, so their links land on the 404
   until each one is written. */
const COMPANY: FooterLink[] = [
  { label: "O nas", href: "/about" },
  { label: "Kontakt", href: "/contact" },
  { label: "Opinie", href: "/reviews" },
  { label: "Dla szkół", href: "/enterprise" },
  { label: "Dla korepetytorów", href: "/tutors" },
  { label: "Kariera", href: "/careers" },
  { label: "Prywatność", href: "/legal/privacy" },
];

const LEGAL: FooterLink[] = [
  { label: "Regulamin", href: "/legal/terms" },
  { label: "Polityka prywatności", href: "/legal/privacy" },
  { label: "Polityka cookies", href: "/legal/cookies" },
  { label: "RODO", href: "/legal/gdpr" },
];

/** Subjects, in the navbar's accents; the ones still to come in Dub's neutral chip. */
const SUBJECTS: FooterLink[] = [
  { label: "Matematyka", href: "/math", chip: { icon: Sigma, accent: "blue" } },
  { label: "Język polski", href: "/polish", chip: { icon: BookMarked, accent: "green" } },
  { label: "Język angielski", href: "/english", chip: { icon: Languages, accent: "lavender" } },
  { label: "Biologia", href: "", soon: true, chip: { icon: Dna, accent: "blue" } },
  { label: "Chemia", href: "", soon: true, chip: { icon: FlaskConical, accent: "blue" } },
  { label: "Historia", href: "", soon: true, chip: { icon: Landmark, accent: "blue" } },
];

/* Pieces ------------------------------------------------------------------- */

const LINK = "flex items-center gap-2 rounded-[4px] text-body text-fog transition-colors duration-75 hover:text-slate focus-ring";

function Column({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-body font-medium text-charcoal">{heading}</h2>
      <ul role="list" className="mt-2.5 flex flex-col gap-3.5">
        {children}
      </ul>
    </div>
  );
}

function Item({ link }: { link: FooterLink }) {
  const body = (
    <>
      {link.chip && <AccentTile icon={link.chip.icon} accent={link.chip.accent} size="xs" />}
      {link.label}
      {link.external && <ArrowUpRight className="-ml-1 size-3.5" strokeWidth={1.75} aria-hidden />}
    </>
  );
  return (
    <li>
      {link.external ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK}>
          {body}
          <span className="sr-only">(otwiera się w nowej karcie)</span>
        </a>
      ) : (
        <Link href={link.href} prefetch={prefetchFor(link.href)} className={LINK}>
          {body}
        </Link>
      )}
    </li>
  );
}

/**
 * A subject still to come: Dub's neutral chip, a quieter label, no link. The
 * cursor stays the plain arrow over it and it can't be selected as text —
 * it sits there as if it weren't interactive at all.
 */
function Soon({ link }: { link: FooterLink }) {
  const Icon = link.chip?.icon;
  return (
    <li className="flex cursor-not-allowed select-none items-center gap-2 text-body text-fog">
      {Icon && (
        <span aria-hidden className="grid size-4 shrink-0 place-items-center rounded-[4px] border border-black/5 bg-paper-mist text-silver">
          <Icon className="size-2.5" strokeWidth={2.25} />
        </span>
      )}
      {link.label}
      {/* Readable grey (WCAG AA) — the tag, not a faded label, says it is not here yet */}
      <span className="rounded-[4px] border border-ash px-1 text-[10px] font-medium leading-4 text-fog">
        wkrótce
      </span>
    </li>
  );
}

/**
 * Dub's "Tools" and "Legal": the last row of a column opens a small menu of
 * links. It opens upward, since the footer ends the page, and closes on a
 * click outside it or on Escape.
 */
function Menu({ label, links }: { label: string; links: FooterLink[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li ref={ref} className="relative -mt-1">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(LINK, "cursor-pointer", open && "text-slate")}
      >
        {label}
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
          strokeWidth={2}
          aria-hidden
        />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className="animate-view-swap absolute bottom-full left-0 z-20 mb-2 min-w-[200px] rounded-xl border border-ash bg-white p-1 shadow-md"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              prefetch={prefetchFor(link.href)}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex h-8 items-center rounded-lg px-2.5 text-body-sm text-steel transition-colors duration-75 hover:bg-paper-mist hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

/* The footer --------------------------------------------------------------- */

export function Footer() {
  return (
    <footer className="border-t border-ash bg-white">
      <div className="mx-auto w-full max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* The logo, and the socials at the foot of the column */}
          <div className="flex flex-col gap-6">
            <div className="grow">
              <Link href="/" className="focus-ring block max-w-fit rounded-[4px]" aria-label="Examax — strona główna">
                <Logo />
              </Link>
              <p className="mt-4 max-w-[17rem] text-body text-fog">
                Platforma do przygotowania do egzaminów CKE — z&nbsp;zadaniami, roadmapą nauki i&nbsp;wsparciem AI.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {EXAMAX_SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group focus-ring rounded-full p-1"
                >
                  <social.icon className="size-4 text-charcoal transition-colors duration-75 group-hover:text-steel" />
                </a>
              ))}
            </div>
          </div>

          {/* Four columns in two pairs, as Dub's */}
          <nav aria-label="Stopka" className="mt-16 grid grid-cols-2 gap-4 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2">
              <div className="grid gap-8">
                <Column heading="Produkt">
                  {PRODUCT.map((link) => (
                    <Item key={link.label} link={link} />
                  ))}
                </Column>
                <Column heading="Egzaminy">
                  {EXAMS.map((link) => (
                    <Item key={link.label} link={link} />
                  ))}
                </Column>
              </div>
              <div className="mt-10 md:mt-0">
                <Column heading="Zasoby">
                  {RESOURCES.map((link) => (
                    <Item key={link.label} link={link} />
                  ))}
                  <Menu label="Narzędzia" links={TOOLS} />
                </Column>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2">
              <Column heading="Firma">
                {COMPANY.map((link) => (link.soon ? <Soon key={link.label} link={link} /> : <Item key={link.label} link={link} />))}
                <Menu label="Prawne" links={LEGAL} />
              </Column>
              <div className="mt-10 md:mt-0">
                <Column heading="Przedmioty">
                  {SUBJECTS.map((link) => (link.soon ? <Soon key={link.label} link={link} /> : <Item key={link.label} link={link} />))}
                </Column>
              </div>
            </div>
          </nav>
        </div>

        {/* Status and the copyright */}
        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/contact"
            className="group focus-ring flex max-w-fit select-none items-center gap-2 rounded-lg border border-ash bg-white py-2 pl-2 pr-2.5 transition-colors duration-75 hover:bg-canvas-muted active:bg-paper-mist"
          >
            <span className="relative size-2">
              <span className="absolute inset-0 m-auto size-2 animate-ping rounded-full bg-vivid-green/40 group-hover:animate-none motion-reduce:animate-none" />
              <span className="absolute inset-0 z-10 m-auto size-2 rounded-full bg-vivid-green" />
            </span>
            <span className="text-[12px] font-medium leading-none text-steel">Wszystkie systemy działają</span>
          </Link>

          <p className="text-[12px] text-fog sm:text-right">© 2026 Examax</p>
        </div>
      </div>
    </footer>
  );
}
