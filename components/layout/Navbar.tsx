"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookMarked,
  Bot,
  CalendarDays,
  ChevronDown,
  Gauge,
  GraduationCap,
  Languages,
  Menu,
  PencilLine,
  Route,
  Sigma,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type MenuKey = "produkt" | "egzaminy";

type MenuItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

type MenuColumn = { heading: string; items: MenuItem[] };

const menus: Record<MenuKey, { label: string; columns: MenuColumn[] }> = {
  produkt: {
    label: "Produkt",
    columns: [
      {
        heading: "System nauki",
        items: [
          {
            icon: Route,
            title: "Roadmapa nauki",
            description: "Cały egzamin rozpisany na kroki",
            href: "#roadmapa",
          },
          {
            icon: PencilLine,
            title: "Trening zadań",
            description: "Zadania z arkuszy CKE i quizy",
            href: "#trening",
          },
          {
            icon: Bot,
            title: "Agent Examax",
            description: "Wyjaśnienia krok po kroku",
            href: "#agent",
          },
        ],
      },
      {
        heading: "Wyniki",
        items: [
          {
            icon: BarChart3,
            title: "Śledzenie postępów",
            description: "Opanowanie i skuteczność na żywo",
            href: "#postepy",
          },
          {
            icon: Gauge,
            title: "Wskaźnik gotowości",
            description: "Wiesz, ile brakuje do celu",
            href: "#postepy",
          },
          {
            icon: Timer,
            title: "Symulacje egzaminu",
            description: "Wkrótce w Examax Premium",
            href: "#symulacja",
          },
        ],
      },
    ],
  },
  egzaminy: {
    label: "Egzaminy",
    columns: [
      {
        heading: "Egzamin ósmoklasisty",
        items: [
          {
            icon: Sigma,
            title: "Matematyka",
            description: "Zadania, roadmapa i powtórki",
            href: "#trening",
          },
          {
            icon: BookMarked,
            title: "Język polski",
            description: "Lektury i arkusze egzaminacyjne",
            href: "#trening",
          },
          {
            icon: Languages,
            title: "Język angielski",
            description: "Słówka i środki językowe",
            href: "#trening",
          },
        ],
      },
      {
        heading: "Matura",
        items: [
          {
            icon: GraduationCap,
            title: "Poziom podstawowy",
            description: "Wymagania podstawy krok po kroku",
            href: "#roadmapa",
          },
          {
            icon: TrendingUp,
            title: "Poziom rozszerzony",
            description: "Trening pod rekrutację na studia",
            href: "#roadmapa",
          },
          {
            icon: CalendarDays,
            title: "Terminy 2027",
            description: "Ile zostało do egzaminu",
            href: "#terminy",
          },
        ],
      },
    ],
  },
};

const menuKeys = Object.keys(menus) as MenuKey[];

const plainLinks = [
  { label: "Cennik", href: "#cennik" },
  { label: "FAQ", href: "#faq" },
];

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [panelSize, setPanelSize] = useState<{ width: number; height: number } | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const contentRefs = useRef<Partial<Record<MenuKey, HTMLDivElement | null>>>({});
  const navRef = useRef<HTMLElement>(null);

  // Any scroll dismisses an open mega-panel.
  useEffect(() => {
    const onScroll = () => setOpenMenu(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Morph the shared panel to the active menu's natural size.
  useLayoutEffect(() => {
    if (!openMenu) return;
    const content = contentRefs.current[openMenu];
    if (!content) return;
    setPanelSize({ width: content.offsetWidth, height: content.offsetHeight });
  }, [openMenu]);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const scheduleOpen = (key: MenuKey) => {
    clearTimers();
    // Hover intent: tiny open delay, so skimming the bar doesn't flicker.
    openTimer.current = window.setTimeout(() => setOpenMenu(key), 60);
  };

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 150);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu]);

  return (
    <header
      ref={navRef}
      className="sticky inset-x-0 top-0 z-30 w-full transition-all"
      onMouseLeave={scheduleClose}
    >
      {/* The surface is a separate absolutely-positioned layer. At rest it is
          solid white — flush with the hero behind it, so no band of the page
          surface shows through. On scroll it thins to a glassy tint and picks
          up the hairline. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 block border-b transition-all duration-300",
          scrolled
            ? "border-ash bg-white/70 backdrop-blur-md"
            : "border-transparent bg-white",
        )}
      />
      {/* Inner container is max-w-screen-lg (1024px), narrower than the
          1080px content column. */}
      <div className="relative mx-auto w-full max-w-screen-lg px-3 lg:px-4 xl:px-0">
        <div className="flex h-14 items-center justify-between">
        <Link
          href="/"
          aria-label="Examax — strona główna"
          className="focus-ring rounded-buttons"
        >
          <Logo wordmark={false} />
        </Link>

        <nav aria-label="Główna nawigacja" className="relative hidden lg:block">
          <ul className="flex items-center gap-1">
            {menuKeys.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openMenu === key}
                  onMouseEnter={() => scheduleOpen(key)}
                  onFocus={() => setOpenMenu(key)}
                  onClick={() =>
                    setOpenMenu((current) => (current === key ? null : key))
                  }
                  className={cn(
                    "focus-ring inline-flex h-8 items-center gap-1 rounded-buttons px-3 text-body font-medium transition-colors duration-150",
                    openMenu === key
                      ? "bg-paper-mist text-charcoal"
                      : "text-slate hover:text-charcoal",
                  )}
                >
                  {menus[key].label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-fog transition-transform duration-200",
                      openMenu === key && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
              </li>
            ))}
            {plainLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onMouseEnter={scheduleClose}
                  className="focus-ring inline-flex h-8 items-center rounded-buttons px-3 text-body font-medium text-slate transition-colors duration-150 hover:text-charcoal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Shared morphing mega-panel */}
          <div
            className={cn(
              "absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-opacity duration-200",
              openMenu ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            onMouseEnter={clearTimers}
            onMouseLeave={scheduleClose}
          >
            <div
              className="relative overflow-hidden rounded-largecards border border-ash bg-white shadow-md transition-[width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={panelSize ?? undefined}
            >
              {menuKeys.map((key) => {
                const activeIndex = openMenu ? menuKeys.indexOf(openMenu) : 0;
                const index = menuKeys.indexOf(key);
                const active = openMenu === key;
                return (
                  <div
                    key={key}
                    ref={(el) => {
                      contentRefs.current[key] = el;
                    }}
                    aria-hidden={!active}
                    className={cn(
                      "top-0 left-0 flex w-max gap-8 p-6 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active
                        ? "relative opacity-100 translate-x-0"
                        : cn(
                            "pointer-events-none absolute opacity-0",
                            index < activeIndex ? "-translate-x-4" : "translate-x-4",
                          ),
                    )}
                  >
                    {menus[key].columns.map((column) => (
                      <div key={column.heading} className="min-w-52">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fog">
                          {column.heading}
                        </p>
                        <ul className="mt-3 space-y-1">
                          {column.items.map((item) => (
                            <li key={item.title}>
                              <Link
                                href={item.href}
                                tabIndex={active ? 0 : -1}
                                onClick={() => setOpenMenu(null)}
                                className="group flex items-start gap-3 rounded-cards p-2 transition-colors hover:bg-paper-mist"
                              >
                                <span className="grid size-9 shrink-0 place-items-center rounded-buttons border border-ash bg-white text-steel shadow-subtle transition-colors group-hover:text-charcoal">
                                  <item.icon className="size-4" strokeWidth={1.8} />
                                </span>
                                <span>
                                  <span className="block text-body font-semibold text-charcoal">
                                    {item.title}
                                  </span>
                                  <span className="block text-[13px] text-fog">
                                    {item.description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/logowanie" variant="outline" size="nav">
            Zaloguj się
          </Button>
          <Button href="/rejestracja" variant="primary" size="nav">
            Załóż konto
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
          className="focus-ring grid size-8 place-items-center rounded-buttons border border-ash text-charcoal transition-colors duration-150 hover:bg-paper-mist lg:hidden"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "absolute inset-x-0 top-full max-h-[calc(100vh-56px)] overflow-y-auto border-b border-ash bg-white shadow-md lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {menuKeys.map((key) => (
            <div key={key} className="border-b border-ash/70 pb-3 pt-1 last:border-b-0">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-fog">
                {menus[key].label}
              </p>
              {menus[key].columns[0].items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-buttons px-3 py-2 text-body-lg font-medium text-charcoal transition-colors hover:bg-paper-mist"
                >
                  <item.icon className="size-4 text-steel" aria-hidden />
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
          {plainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-buttons px-3 py-2.5 text-body-lg font-medium text-charcoal transition-colors hover:bg-paper-mist"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2 border-t border-ash pt-4">
            <Button href="/logowanie" variant="outline" className="flex-1">
              Zaloguj się
            </Button>
            <Button href="/rejestracja" variant="primary" className="flex-1">
              Załóż konto
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
