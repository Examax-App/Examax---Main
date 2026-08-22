import Link from "next/link";
import {
  BarChart3,
  Bot,
  Lock,
  PencilLine,
  Route,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { AccentTile } from "@/components/ui/FeaturePill";

const productLinks = [
  { label: "Roadmapa nauki", href: "#roadmapa", icon: Route, accent: "lavender" as const },
  { label: "Trening zadań", href: "#trening", icon: PencilLine, accent: "tangerine" as const },
  { label: "Agent Examax", href: "#agent", icon: Bot, accent: "blue" as const },
  { label: "Śledzenie postępów", href: "#postepy", icon: BarChart3, accent: "green" as const },
];

const columns = [
  {
    heading: "Egzaminy",
    links: [
      "Egzamin ósmoklasisty",
      "Matura podstawowa",
      "Matura rozszerzona",
      "Matematyka",
      "Język polski",
      "Język angielski",
    ],
  },
  {
    heading: "Zasoby",
    links: ["Centrum pomocy", "Blog", "Co nowego", "Cennik", "FAQ"],
  },
  {
    heading: "Firma",
    links: ["O nas", "Kontakt", "Prywatność", "Regulamin"],
  },
];

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

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
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

const socials = [
  { label: "Instagram", icon: InstagramIcon },
  { label: "TikTok", icon: TikTokIcon },
  { label: "YouTube", icon: YouTubeIcon },
  { label: "Discord", icon: DiscordIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-ash bg-white">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2.2fr]">
          <div className="flex flex-col gap-7">
            <Logo />
            <p className="max-w-xs text-body text-steel">
              Kompletny system przygotowań do egzaminu ósmoklasisty i matury —
              roadmapa, zadania CKE i agent AI.
            </p>

            <form aria-label="Zapisz się na nowości produktowe" className="max-w-xs">
              <label
                htmlFor="footer-email"
                className="text-body font-medium text-charcoal"
              >
                Bądź na bieżąco z nowościami
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="ty@przyklad.pl"
                  className="h-10 min-w-0 flex-1 rounded-inputs border border-midnight-ink bg-white px-3 text-body text-charcoal placeholder:text-fog focus:outline-2 focus:outline-offset-2 focus:outline-charcoal"
                />
                <button
                  type="button"
                  className="h-10 shrink-0 rounded-buttons bg-primary-action-fill px-4 text-body font-medium text-white shadow-subtle transition-all duration-200 hover:bg-graphite hover:shadow-sm"
                >
                  Zapisz się
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-buttons border border-ash px-2.5 py-1.5 text-[12px] font-medium text-steel">
                <ShieldCheck className="size-3.5" aria-hidden />
                Zgodne z RODO
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-buttons border border-ash px-2.5 py-1.5 text-[12px] font-medium text-steel">
                <Lock className="size-3.5" aria-hidden />
                Dane w UE
              </span>
            </div>

            <div className="mt-auto flex items-center gap-4 pt-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="text-charcoal transition-all duration-200 hover:-translate-y-0.5 hover:text-fog"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <nav aria-label="Produkt">
              <h3 className="text-body-lg font-semibold text-charcoal">Produkt</h3>
              <ul className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-body text-steel transition-colors hover:text-charcoal"
                    >
                      <AccentTile icon={link.icon} accent={link.accent} size="sm" />
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="#symulacja"
                    className="inline-flex items-center gap-2 text-body text-steel transition-colors hover:text-charcoal"
                  >
                    <span
                      aria-hidden
                      className="grid size-4 shrink-0 place-items-center rounded-[6px] bg-graphite text-white"
                    >
                      <Timer className="size-2.5" strokeWidth={2.5} />
                    </span>
                    Symulacje egzaminu
                    <span className="rounded-full bg-paper-mist px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-fog">
                      wkrótce
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>

            {columns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h3 className="text-body-lg font-semibold text-charcoal">
                  {column.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((label) => (
                    <li key={label}>
                      <a
                        href="#"
                        className="link-underline text-body text-steel transition-colors hover:text-charcoal"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-ash pt-8 sm:flex-row">
          <span className="inline-flex items-center gap-2 rounded-full border border-ash px-3.5 py-2 text-body text-charcoal">
            <span className="size-2 rounded-full bg-vivid-green" aria-hidden />
            Wszystkie systemy działają
          </span>
          <p className="text-body text-fog">© 2026 Examax</p>
        </div>
      </Container>
    </footer>
  );
}
