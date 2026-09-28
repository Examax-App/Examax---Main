"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
import { cn } from "@/lib/cn";
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
};

/**
 * Product, in the navbar's icons and accents and the hero tabs' short names —
 * Dub's product names are one or two words, and the column is sized for that.
 * The agents are a yellow chip with a black bolt.
 */
const PRODUCT: FooterLink[] = [
  { label: "Trening", href: "/training", chip: { icon: PencilLine, accent: "green" } },
  { label: "Roadmapa", href: "/roadmap", chip: { icon: Route, accent: "blue" } },
  { label: "Postępy", href: "/#progress", chip: { icon: BadgePercent, accent: "tangerine" } },
  { label: "Symulacja", href: "/simulation", chip: { icon: Timer, accent: "lavender" } },
  { label: "Agenci", href: "/#agent", chip: { icon: Zap, accent: "yellow" } },
];

const EXAMS: FooterLink[] = [
  { label: "Egzamin ósmoklasisty", href: "/roadmap" },
  { label: "Matura podstawowa", href: "/roadmap" },
  { label: "Matura rozszerzona", href: "/roadmap" },
];

const RESOURCES: FooterLink[] = [
  { label: "Dokumentacja", href: "/docs" },
  { label: "Centrum pomocy", href: "/help" },
  { label: "Aktualności", href: "/updates" },
  { label: "Cennik", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Arkusze CKE", href: "https://cke.gov.pl/egzamin-maturalny/egzamin-maturalny-w-formule-2023/arkusze/", external: true },
];

const TOOLS: FooterLink[] = [
  { label: "Test poziomujący", href: "/start" },
  { label: "Plan nauki", href: "/roadmap" },
  { label: "Trening z arkuszy", href: "/training" },
  { label: "Symulacja egzaminu", href: "/simulation" },
];

/* PLACEHOLDER ROUTES — /schools and /tutors are the navbar's own; /careers
   and the legal pages are planned and not built yet. */
const COMPANY: FooterLink[] = [
  { label: "O nas", href: "/about" },
  { label: "Kontakt", href: "/contact" },
  { label: "Opinie", href: "/reviews" },
  { label: "Dla szkół", href: "/schools" },
  { label: "Dla korepetytorów", href: "/tutors" },
  { label: "Kariera", href: "/careers" },
  { label: "Prywatność", href: "/privacy" },
];

const LEGAL: FooterLink[] = [
  { label: "Regulamin", href: "/terms" },
  { label: "Polityka prywatności", href: "/privacy" },
  { label: "Polityka cookies", href: "/cookies" },
  { label: "RODO", href: "/rodo" },
];

/** Subjects, in the navbar's accents; the ones still to come in Dub's neutral chip. */
const SUBJECTS: Array<FooterLink & { soon?: boolean }> = [
  { label: "Matematyka", href: "/#practice", chip: { icon: Sigma, accent: "blue" } },
  { label: "Język polski", href: "/#practice", chip: { icon: BookMarked, accent: "green" } },
  { label: "Język angielski", href: "/#practice", chip: { icon: Languages, accent: "lavender" } },
  { label: "Biologia", href: "", soon: true, chip: { icon: Dna, accent: "blue" } },
  { label: "Chemia", href: "", soon: true, chip: { icon: FlaskConical, accent: "blue" } },
  { label: "Historia", href: "", soon: true, chip: { icon: Landmark, accent: "blue" } },
];

/* Socials ------------------------------------------------------------------ */

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 2h-3.2v13.5a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.4a6.6 6.6 0 0 0-.9-.06 6.1 6.1 0 1 0 6.1 6.1V8.3a7.7 7.7 0 0 0 4.5 1.4V6.5a4.5 4.5 0 0 1-4.5-4.5Z" />
    </svg>
  );
}

function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.9 2.5h3.3l-7.2 8.3 8.5 11.2h-6.6l-5.2-6.8-6 6.8H2.4l7.7-8.8L2 2.5h6.8l4.7 6.2 5.4-6.2Zm-1.2 17.6h1.8L7.3 4.3H5.4l12.3 15.8Z" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.4.5 0 5.9 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.4 4.2 18.4 4.5 18.4 4.5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12.1 12.1 0 0 0 24 12.6C24 5.9 18.6.5 12 .5Z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/examaxofficial/" },
  { label: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@examax.app?lang=en" },
  { label: "X", icon: XIcon, href: "https://x.com/examaxapp" },
  { label: "Discord", icon: DiscordIcon, href: "https://discord.gg/ccvgTNZF" },
  { label: "GitHub", icon: GitHubIcon, href: "https://github.com/Examax-App" },
];

/* Pieces ------------------------------------------------------------------- */

const LINK = "flex items-center gap-2 rounded-[4px] text-body text-fog transition-colors duration-75 hover:text-slate focus-ring";

function Column({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-body font-medium text-charcoal">{heading}</h3>
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
        <Link href={link.href} className={LINK}>
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
  const Icon = link.chip!.icon;
  return (
    <li className="flex cursor-default select-none items-center gap-2 text-body text-silver">
      <span aria-hidden className="grid size-4 shrink-0 place-items-center rounded-[4px] border border-black/5 bg-paper-mist text-silver">
        <Icon className="size-2.5" strokeWidth={2.25} />
      </span>
      {link.label}
      <span className="sr-only">(wkrótce)</span>
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
                System nauki do egzaminów oparty na&nbsp;AI. Wszystko, czego potrzebujesz przed egzaminem, w&nbsp;jednym miejscu.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => (
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
                {COMPANY.map((link) => (
                  <Item key={link.label} link={link} />
                ))}
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
            href="/help"
            className="group focus-ring flex max-w-fit items-center gap-2 rounded-lg border border-ash bg-white py-2 pl-2 pr-2.5 transition-colors duration-75 hover:bg-canvas-muted active:bg-paper-mist"
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
