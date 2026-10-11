"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "@/components/ui/Link";
import {
  Backpack,
  BadgePercent,
  BookMarked,
  BookOpen,
  BriefcaseBusiness,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Languages,
  LifeBuoy,
  Mail,
  Newspaper,
  PencilLine,
  Presentation,
  Quote,
  Route,
  School,
  Sigma,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { prefetchFor } from "@/lib/routes";
import { useSignedIn } from "@/lib/auth/useSignedIn";
import type { IconComponent } from "@/lib/icon";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { ACCENT_VAR } from "@/lib/glow";
import {
  AgentChatPreview,
  NavPreviewsWanted,
  SimulationPreview,
  ProgressPreview,
  RoadmapPreview,
  TrainingPreview,
} from "@/components/layout/LazyNavPreviews";

type MenuKey = "product" | "exams" | "materials";


/**
 * A card in the Product panel's feature grid.
 *
 * `accent` drives both the glyph tile and the hover light, so one field keeps
 * a feature's colour consistent wherever it appears.
 */
type FeatureCard = {
  icon: IconComponent;
  accent: Accent;
  title: string;
  description: string;
  href: string;
  /** A tall card's picture of the product, filling the slot under its copy. */
  preview?: React.ReactNode;
  /**
   * A wide card's artwork, laid behind the copy and fading off the right
   * edge — the reference's own treatment for its wide cards. Nothing in it
   * moves on hover.
   */
  backdrop?: React.ReactNode;
};

/**
 * An entry in a `columns` menu — the reference's Solutions menu. `compact`
 * columns drop the description and shrink the icon box; `hoverTint` is the
 * colour a compact entry's icon takes on hover, as the reference's SDK marks
 * pick up their brand colour.
 */
type ColumnItem = {
  icon: IconComponent;
  title: string;
  description?: string;
  href: string;
  hoverTint?: string;
  /** A subject's chip colour, for the mobile menu's tiles (matching the footer's). */
  accent?: Accent;
  /** Not available yet: shown greyed out and cannot be picked. */
  disabled?: boolean;
};

/**
 * Two panel shapes.
 *
 * `grid` is the reference's Product dropdown — a row of three tall cards over
 * a row of two wide ones. `columns` is its Solutions and Resources menus:
 * headed columns split by hairlines. Solutions weights them 3:3:2; `even`
 * gives Resources' three equal thirds.
 */
type Menu =
  | { label: string; layout: "grid"; top: FeatureCard[]; bottom: FeatureCard[] }
  | {
      label: string;
      layout: "columns";
      even?: boolean;
      columns: Array<{ heading: string; compact?: boolean; items: ColumnItem[] }>;
    };

type MobileEntry = { icon: IconComponent; title: string; description?: string; href: string; accent?: Accent; disabled?: boolean };

/** A menu's entries for the mobile accordion, grouped as the desktop panel groups them. */
function mobileGroups(menu: Menu): Array<{ heading?: string; items: MobileEntry[] }> {
  if (menu.layout === "grid") return [{ items: [...menu.top, ...menu.bottom] }];
  return menu.columns.map((column) => ({ heading: column.heading, items: column.items }));
}

const menus: Record<MenuKey, Menu> = {
  product: {
    label: "Produkt",
    layout: "grid",
    // Landing-page sections are linked root-absolutely, so the panel works
    // the same from /pricing as it does from the landing page. Trening,
    // Roadmapa, Postępy and Symulacja are the exceptions: each has a page of its own.
    // The cards follow dub.co's Product menu one for one (NavPreviews):
    // Trening is its Partners card (in Trening's green), Roadmapa its Links rows, Postępy
    // its Analytics (last, in orange); the wide row takes its Integrations slot
    // for the exam launcher and its API window for a chat with an agent.
    top: [
      {
        icon: PencilLine,
        accent: "green",
        title: "Trening zadań",
        description: "Zadania z arkuszy CKE i quizy, sprawdzane od razu",
        href: "/training",
        preview: <TrainingPreview />,
      },
      {
        icon: Route,
        accent: "blue",
        title: "Roadmapa nauki",
        description: "Cały egzamin rozpisany na kroki — zawsze wiesz, co dalej",
        href: "/roadmap",
        preview: <RoadmapPreview />,
      },
      {
        icon: BadgePercent,
        accent: "tangerine",
        title: "Śledzenie postępów",
        description: "Opanowanie i skuteczność na żywo, temat po temacie",
        href: "/progress",
        preview: <ProgressPreview color={ACCENT_VAR.tangerine} />,
      },
    ],
    bottom: [
      {
        icon: Timer,
        accent: "lavender",
        title: "Symulacja egzaminu",
        description: "Egzamin na czas",
        href: "/simulation",
        backdrop: <SimulationPreview />,
      },
      {
        icon: Zap,
        accent: "yellow",
        title: "Korepetytor AI",
        description: "Wyjaśnia krok po kroku",
        href: "/agents",
        backdrop: <AgentChatPreview />,
      },
    ],
  },
  exams: {
    label: "Materiały",
    layout: "columns",
    // The reference's Solutions menu: use case → the exam, stage → who it
    // is for, SDKs → the subjects. School and tutor pages land later; the
    // links are already their final paths.
    columns: [
      {
        heading: "Egzamin",
        items: [
          {
            icon: Backpack,
            title: "Egzamin ósmoklasisty",
            description: "Trzy przedmioty, jedna roadmapa",
            href: "/roadmap",
          },
          {
            icon: GraduationCap,
            title: "Matura",
            description: "Poziom podstawowy, krok po kroku",
            href: "/roadmap",
          },
          {
            icon: TrendingUp,
            title: "Poziom rozszerzony",
            description: "Trening pod rekrutację na studia",
            href: "/roadmap",
          },
        ],
      },
      {
        heading: "Dla kogo",
        items: [
          {
            icon: School,
            title: "Dla szkół",
            description: "Licencje i panel dla całych klas",
            href: "/enterprise",
          },
          {
            icon: Presentation,
            title: "Dla korepetytorów",
            description: "Uczniowie i postępy w jednym miejscu",
            href: "/tutors",
          },
        ],
      },
      {
        heading: "Przedmioty",
        compact: true,
        items: [
          { icon: Sigma, title: "Matematyka", href: "/math", hoverTint: "group-hover:text-electric-blue", accent: "blue" },
          { icon: BookMarked, title: "Język polski", href: "/polish", hoverTint: "group-hover:text-vivid-green", accent: "green" },
          { icon: Languages, title: "Język angielski", href: "/english", hoverTint: "group-hover:text-lavender", accent: "lavender" },
        ],
      },
    ],
  },
  materials: {
    label: "O nas",
    layout: "columns",
    even: true,
    // The reference's Resources menu, column for column — Company leads here,
    // as he asked, then Help and Support, then Updates. Pages that are not
    // built yet keep their final paths and land on the 404 until they are.
    columns: [
      {
        heading: "Firma",
        items: [
          { icon: Users, title: "O Examax", description: "Misja, wartości i zespół", href: "/about" },
          { icon: BookOpen, title: "Dokumentacja", description: "Przewodniki po platformie", href: "/docs" },
          {
            icon: BriefcaseBusiness,
            title: "Kariera",
            description: "Dołącz do zespołu Examax",
            href: "/careers",
          },
        ],
      },
      {
        heading: "Pomoc i wsparcie",
        items: [
          { icon: LifeBuoy, title: "Centrum pomocy", description: "Odpowiedzi na Twoje pytania", href: "/contact" },
          { icon: Mail, title: "Kontakt", description: "Napisz do wsparcia lub w sprawie szkoły", href: "/contact" },
        ],
      },
      {
        heading: "Na bieżąco",
        items: [
          { icon: Newspaper, title: "Aktualności", description: "Nowe funkcje i zmiany w produkcie", href: "/updates" },
          { icon: Quote, title: "Opinie", description: "Historie uczniów i nauczycieli", href: "/reviews" },
        ],
      },
    ],
  },
};

const menuKeys = Object.keys(menus) as MenuKey[];

const plainLinks = [
  { label: "Cennik", href: "/pricing" },
  // Dub's "Enterprise" slot: the plan for schools and institutions (placeholder route).
  { label: "Dla Instytucji", href: "/enterprise" },
];

/**
 * The nav hover pill's easing: the reference's spring, as a `linear()` curve
 * through the progress it reaches at each sampled frame (0 → 1.028 → 1).
 */
const PILL_SPRING =
  "linear(0, 0.054 2.4%, 0.212 8.5%, 0.43 14.6%, 0.631 20.7%, 0.795 26.8%, 0.901 32.7%, 0.968 39%, 1.007 45.1%, 1.025 51%, 1.028 57.1%, 1.025 63.2%, 1.019 69.3%, 1.013 75.4%, 1.008 81.5%, 1.004 87.3%, 1.002 93.4%, 1)";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/**
 * The reference's Product-card texture: a 60px grid of 1px lines drawn in
 * `currentColor` (black/10). `x`/`y` offset the grid inside the card, and the
 * caller's `className` supplies the fade mask.
 */
function GridPattern({ x, y, className }: { x: number; y: number; className: string }) {
  const id = useId();
  return (
    <svg
      aria-hidden
      width="100%"
      height="100%"
      className={cn("pointer-events-none absolute inset-0 text-black/10", className)}
    >
      <defs>
        <pattern id={`${id}-grid`} x={x} y={y} width={60} height={60} patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="transparent" stroke="currentColor" strokeWidth={1} />
        </pattern>
      </defs>
      <rect fill={`url(#${id}-grid)`} width="100%" height="100%" />
    </svg>
  );
}


/**
 * A Product-panel feature card. Its structure and classes come from the
 * reference's own Product menu (dub.co, read off the live DOM).
 *
 * Both sizes use the reference's surface: a #fafafa fill, a 12px radius and
 * its 60px line grid as texture. The copy sits in a `relative` wrapper so it
 * paints above that absolutely positioned grid. The hairline stays ash rather
 * than the reference's paper-mist. Paper-mist is only 1.04:1 against the
 * fill, and when it was tried the card edge disappeared.
 *
 * `tall` cards fill the top row, exactly as the reference builds them:
 * - the grid fades out at the top and bottom
 * - the copy is inset 20px (no bottom padding), with a 16px tinted chip, a
 *   14px title and a 224px-wide description
 * - under it, 40px down, a 160px slot holding a picture of the product that
 *   fades out towards the bottom edge
 * - an accent circle rises from the bottom edge at 7% and brightens to 15%
 *   on hover. That light is the whole hover: nothing moves, the card simply
 *   glows a little brighter.
 *
 * Wide cards fill the bottom row. They follow the reference's wide cards: the
 * grid fades in from the left, there is no chip and no glow, and on hover the
 * fill darkens by one step. The reference's artwork sits behind the copy and
 * fades off the right edge (`backdrop`).
 */
function FeatureCard({
  card,
  tall = false,
  tabIndex,
  onNavigate,
}: {
  card: FeatureCard;
  tall?: boolean;
  tabIndex: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={card.href}
      prefetch={prefetchFor(card.href)}
      tabIndex={tabIndex}
      onClick={onNavigate}
      className={cn(
        "focus-ring group relative flex w-full flex-col overflow-hidden rounded-cards border border-ash bg-canvas-muted",
        !tall &&
          "h-full justify-center transition-colors duration-150 hover:bg-paper-mist active:bg-ash motion-reduce:transition-none",
      )}
    >
      {tall ? (
        <>
          <GridPattern
            x={-52}
            y={-24}
            className="[mask-image:linear-gradient(transparent,black,transparent)]"
          />
          <div className="relative p-5 pb-0">
            <AccentTile icon={card.icon} accent={card.accent} size="xs" />
            <span className="mt-3 block text-body font-medium text-charcoal">
              {card.title}
            </span>
            <p className="mt-2 max-w-56 text-body text-fog">{card.description}</p>
          </div>
          <div className="relative mt-10 h-40 grow">{card.preview}</div>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-15 motion-reduce:transition-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 100%, ${ACCENT_VAR[card.accent]}, transparent)`,
            }}
          />
        </>
      ) : (
        <>
          <GridPattern
            x={-33}
            y={-50}
            className="[mask-image:linear-gradient(90deg,transparent,black)]"
          />
          {card.backdrop}
          <div className="relative flex items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              {/* Inline, as in the reference: the line box stays the div's own
                  24px, which is what gives the wide cards their 80px height. */}
              <span className="text-body font-medium leading-none text-charcoal">{card.title}</span>
              {/* The copy stops short of the artwork on the right, at both
                  panel widths. */}
              <p
                className={cn(
                  "mt-1 text-body text-fog",
                  card.backdrop ? "max-w-52" : "max-w-sm",
                )}
              >
                {card.description}
              </p>
            </div>
          </div>
        </>
      )}
    </Link>
  );
}

/**
 * An entry in a `columns` menu, built as the reference's Solutions menu builds
 * its own: a bordered icon box beside a title and a one-line description, on a
 * row that tints on hover. Compact entries (the reference's SDK list) keep the
 * box but drop the description.
 */
function ColumnLink({
  item,
  compact,
  tabIndex,
  onNavigate,
}: {
  item: ColumnItem;
  compact?: boolean;
  tabIndex: number;
  onNavigate: () => void;
}) {
  const body = (
    <>
      <span
        className={cn(
          "shrink-0 border border-ash bg-white/50",
          compact ? "rounded-lg p-1" : "rounded-md p-2.5",
        )}
      >
        <item.icon
          className={cn("size-4 text-steel transition-colors", !item.disabled && item.hoverTint)}
          strokeWidth={1.8}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-medium text-slate">{item.title}</span>
        {item.description && (
          <span className="block truncate text-xs text-fog">{item.description}</span>
        )}
      </span>
    </>
  );

  // Not available yet: the same row, faded and inert — no link, no hover,
  // no focus stop — so it reads as there but not pickable.
  if (item.disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          "-mx-2 flex cursor-not-allowed select-none items-center gap-3 rounded-[8px] p-2 opacity-45 grayscale",
          compact && "py-1",
        )}
      >
        {body}
        <span className="sr-only">(wkrótce)</span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      prefetch={prefetchFor(item.href)}
      tabIndex={tabIndex}
      onClick={onNavigate}
      className={cn(
        "focus-ring group -mx-2 flex items-center gap-3 rounded-[8px] p-2 transition-colors hover:bg-canvas-muted active:bg-paper-mist",
        compact && "py-1",
      )}
    >
      {body}
    </Link>
  );
}

/**
 * A `columns` panel — the reference's Solutions and Resources menus, read off
 * the live DOM: headed columns split by hairlines.
 */
function ColumnsPanel({
  menu,
  active,
  onNavigate,
}: {
  menu: Extract<Menu, { layout: "columns" }>;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <div
      className={cn(
        "grid w-[58rem] shrink-0 divide-x divide-ash xl:w-[1020px]",
        menu.even ? "grid-cols-3" : "grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,2fr)]",
      )}
    >
      {menu.columns.map((column) => (
        <div key={column.heading} className="px-6 py-4">
          <p className="mb-2 text-xs uppercase text-fog">{column.heading}</p>
          <ul className="flex flex-col gap-0.5">
            {column.items.map((item) => (
              <li key={item.title}>
                <ColumnLink item={item} compact={column.compact} tabIndex={active ? 0 : -1} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Navbar() {
  const signedIn = useSignedIn();
  const [mobileOpen, setMobileOpen] = useState(false);
  // The dropdown pictures load the first time a visitor reaches for the menus.
  const [previewsWanted, setPreviewsWanted] = useState(false);
  const wantPreviews = () => setPreviewsWanted(true);
  // The mobile sheet's contents are built the first time a visitor reaches for the menu button.
  const [mobileMenuWanted, setMobileMenuWanted] = useState(false);
  const wantMobileMenu = () => setMobileMenuWanted(true);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 120,
    () => false,
  );
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [panelSize, setPanelSize] = useState<{ width: number; height: number } | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const contentRefs = useRef<Partial<Record<MenuKey, HTMLDivElement | null>>>({});
  const navRef = useRef<HTMLElement>(null);

  // The hover tint is one shared pill that travels between the items rather
  // than a background on each — the reference's treatment. It rests on the
  // hovered item, falls back to the open menu's trigger, and fades out when
  // neither exists. Arriving from hidden it snaps into place and only fades,
  // so it never sweeps in from wherever it was last seen.
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const pillTarget = hoveredItem ?? openMenu;
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false, snap: true });

  useLayoutEffect(() => {
    const item = pillTarget ? itemRefs.current[pillTarget] : null;
    if (!item) {
      setPill((current) => ({ ...current, visible: false }));
      return;
    }
    setPill((current) => ({
      left: item.offsetLeft,
      width: item.offsetWidth,
      visible: true,
      snap: !current.visible,
    }));
  }, [pillTarget]);

  // Any scroll dismisses an open mega-panel.
  useEffect(() => {
    const onScroll = () => setOpenMenu(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Centre the panel on the page, as the reference does, rather than on the
  // link group: the links sit left of centre (the logo is narrower than the
  // buttons), so a panel centred on them runs off the left edge on narrower
  // screens. `left` is measured from the nav, the panel's containing block.
  const navListRef = useRef<HTMLElement>(null);
  const [panelLeft, setPanelLeft] = useState<number | null>(null);
  useLayoutEffect(() => {
    const place = () => {
      const nav = navListRef.current;
      if (nav) setPanelLeft(window.innerWidth / 2 - nav.getBoundingClientRect().left);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
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
    <NavPreviewsWanted value={previewsWanted}>
    <header
      ref={navRef}
      className="sticky inset-x-0 top-0 z-30 w-full transition-all"
      onMouseLeave={scheduleClose}
    >
      {/* The surface is a separate absolutely-positioned layer. It stays solid
          white — flush with the hero behind it — through the first 120px of
          scroll, then frosts to a translucent pane with the hairline, so the
          glass only appears once there is content passing under it. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 block border-b transition-all duration-300",
          scrolled
            ? "border-ash bg-white/65 backdrop-blur-xl"
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

        <nav ref={navListRef} aria-label="Główna nawigacja" className="relative hidden lg:block" onPointerEnter={wantPreviews}>
          <ul
            className="relative flex items-center gap-1"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* The reference's spring, sampled frame by frame off dub.co and
                replayed through `linear()`: it eases off the mark, overshoots
                by ~3% at 57% of the run and settles by 410ms. */}
            <li
              aria-hidden
              className="pointer-events-none absolute top-0 h-8 rounded-buttons bg-paper-mist motion-reduce:transition-none"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.visible ? 1 : 0,
                transition: pill.snap
                  ? "opacity 150ms ease-out"
                  : `left 410ms ${PILL_SPRING}, width 410ms ${PILL_SPRING}, opacity 150ms ease-out`,
              }}
            />
            {menuKeys.map((key) => (
              <li key={key}>
                <button
                  ref={(el) => {
                    itemRefs.current[key] = el;
                  }}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openMenu === key}
                  onMouseEnter={() => {
                    setHoveredItem(key);
                    scheduleOpen(key);
                  }}
                  onFocus={() => {
                    wantPreviews();
                    setOpenMenu(key);
                  }}
                  onClick={() =>
                    setOpenMenu((current) => (current === key ? null : key))
                  }
                  className={cn(
                    "focus-ring relative inline-flex h-8 cursor-pointer items-center gap-1 rounded-buttons px-3 text-body font-medium transition-colors duration-150",
                    openMenu === key ? "text-charcoal" : "text-slate hover:text-charcoal",
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
                  ref={(el) => {
                    itemRefs.current[link.href] = el;
                  }}
                  href={link.href}
                  onMouseEnter={() => {
                    setHoveredItem(link.href);
                    scheduleClose();
                  }}
                  onFocus={() => setHoveredItem(link.href)}
                  onBlur={() => setHoveredItem(null)}
                  className="focus-ring relative inline-flex h-8 items-center rounded-buttons px-3 text-body font-medium text-slate transition-colors duration-150 hover:text-charcoal"
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
            style={panelLeft === null ? undefined : { left: panelLeft }}
            onMouseEnter={clearTimers}
            onMouseLeave={scheduleClose}
          >
            <div
              className="relative overflow-hidden rounded-largecards border border-ash bg-white shadow-sm transition-[width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={panelSize ?? undefined}
            >
              {menuKeys.map((key) => {
                const activeIndex = openMenu ? menuKeys.indexOf(openMenu) : 0;
                const index = menuKeys.indexOf(key);
                const active = openMenu === key;
                const menu = menus[key];
                return (
                  <div
                    key={key}
                    ref={(el) => {
                      contentRefs.current[key] = el;
                    }}
                    aria-hidden={!active}
                    className={cn(
                      "top-0 left-0 flex w-max transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active
                        ? "relative opacity-100 translate-x-0"
                        : cn(
                            "pointer-events-none absolute opacity-0",
                            index < activeIndex ? "-translate-x-4" : "translate-x-4",
                          ),
                    )}
                  >
                    {menu.layout === "columns" ? (
                      <ColumnsPanel
                        menu={menu}
                        active={active}
                        onNavigate={() => setOpenMenu(null)}
                      />
                    ) : (
                      /* Three equal cards over two, one gap between every
                         edge — the reference's 1020px panel from xl up. */
                      <div className="grid w-[58rem] shrink-0 gap-4 p-4 xl:w-[1020px]">
                        <ul className="grid grid-cols-3 gap-4">
                          {menu.top.map((card) => (
                            <li key={card.title} className="flex">
                              <FeatureCard
                                card={card}
                                tall
                                tabIndex={active ? 0 : -1}
                                onNavigate={() => setOpenMenu(null)}
                              />
                            </li>
                          ))}
                        </ul>
                        <ul className="grid grid-cols-2 gap-4">
                          {menu.bottom.map((card) => (
                            <li key={card.title} className="flex">
                              <FeatureCard
                                card={card}
                                tabIndex={active ? 0 : -1}
                                onNavigate={() => setOpenMenu(null)}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {signedIn ? (
            <Button href="/welcome" variant="primary" size="nav">
              Przejdź do panelu
            </Button>
          ) : (
            <>
              <Button href="/login" variant="outline" size="nav">
                Zaloguj się
              </Button>
              <Button href="/signup" variant="primary" size="nav">
                Zacznij teraz
              </Button>
            </>
          )}
        </div>

        {/* Below the desktop bar: the mark on the left, the menu button on the right — nothing else. */}
        <div className="-mr-2 flex items-center lg:hidden">
          <MenuToggle
            open={mobileOpen}
            onWant={wantMobileMenu}
            onToggle={() => {
              wantMobileMenu();
              setMobileOpen((value) => !value);
            }}
          />
        </div>
        </div>
      </div>

      <MobileMenu open={mobileOpen} built={mobileMenuWanted} onClose={() => setMobileOpen(false)} />
    </header>
    </NavPreviewsWanted>
  );
}

/* ── Mobile ──────────────────────────────────────────────────────────────── */

/**
 * The mobile menu button: dub's bare round button, its three lines set a
 * little further apart than lucide's, folding into an X when the menu opens.
 */
function MenuToggle({ open, onWant, onToggle }: { open: boolean; onWant: () => void; onToggle: () => void }) {
  const line = "absolute left-1/2 h-[1.75px] w-[18px] -translate-x-1/2 rounded-full bg-charcoal transition-[transform,opacity,top] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";
  return (
    <button
      type="button"
      onClick={onToggle}
      onPointerEnter={onWant}
      onPointerDown={onWant}
      onFocus={onWant}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Zamknij menu" : "Otwórz menu"}
      className="focus-ring relative ml-0.5 size-10 shrink-0 rounded-full transition-colors duration-200 hover:bg-paper-mist active:bg-ash"
    >
      <span aria-hidden className={cn(line, open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[13px]")} />
      <span aria-hidden className={cn(line, "top-1/2 -translate-y-1/2", open && "opacity-0")} />
      <span aria-hidden className={cn(line, open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-[25.25px]")} />
    </button>
  );
}

/** A mobile menu entry's tile: the product and subject chips in their colours, every other glyph in charcoal — dub's 36px bordered box. */
function MobileTile({ item }: { item: MobileEntry }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-ash bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {item.accent ? <AccentTile icon={item.icon} accent={item.accent} size="sm" /> : <item.icon className="size-[18px] text-charcoal" strokeWidth={1.75} aria-hidden />}
    </span>
  );
}

/**
 * dub.co's mobile menu, one to one: a full-height sheet under the bar with
 * an accordion — Produkt, Materiały and O nas open to their entries (a tile,
 * the name, a one-line description), Cennik and Dla Instytucji are plain
 * links — each row 16px semibold on a hairline. The account buttons close
 * it. The page underneath stops scrolling while it is open; Escape, a link,
 * or widening past the breakpoint closes it.
 *
 * The sheet itself is always there (the button's aria-controls points at it,
 * and its fade runs on it), but its contents are only built once `built` —
 * the first time a visitor reaches for the button. Closed, they would be
 * a few hundred invisible nodes laid out on every phone's first paint, and
 * their links, sitting in the viewport at zero opacity, would be prefetched.
 */
function MobileMenu({ open, built, onClose }: { open: boolean; built: boolean; onClose: () => void }) {
  const signedIn = useSignedIn();
  const [expanded, setExpanded] = useState<MenuKey | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && onClose();
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-x-0 bottom-0 top-14 z-20 overflow-y-auto overscroll-contain bg-white transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      {built ? (
        <nav aria-label="Menu" className="flex min-h-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
          <ul className="divide-y divide-ash">
            {menuKeys.map((key) => {
              const isOpen = expanded === key;
              const panelId = `mobile-${key}`;
              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpanded(isOpen ? null : key)}
                    className="flex w-full cursor-pointer items-center justify-between py-4 text-left text-base font-semibold text-charcoal"
                  >
                    {menus[key].label}
                    <ChevronDown className={cn("size-4 text-steel transition-transform duration-300", isOpen && "rotate-180")} strokeWidth={2} aria-hidden />
                  </button>
                  <div
                    id={panelId}
                    className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0 overflow-hidden" inert={!isOpen}>
                      <div className="space-y-4 pb-5">
                        {mobileGroups(menus[key]).map((group, i) => (
                          <div key={group.heading ?? i}>
                            {group.heading ? <p className="mb-2 text-xs font-medium text-fog">{group.heading}</p> : null}
                            <ul className="space-y-1">
                              {group.items.map((item) => (
                                <li key={item.title}>
                                  <Link
                                    href={item.href}
                                    prefetch={prefetchFor(item.href)}
                                    onClick={onClose}
                                    className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors active:bg-paper-mist"
                                  >
                                    <MobileTile item={item} />
                                    <span className="min-w-0">
                                      <span className="block text-sm font-medium text-charcoal">{item.title}</span>
                                      {item.description ? <span className="block truncate text-sm text-fog">{item.description}</span> : null}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {plainLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={prefetchFor(link.href)}
                  onClick={onClose}
                  className="flex w-full items-center justify-between py-4 text-base font-semibold text-charcoal"
                >
                  {link.label}
                  <ArrowRight className="size-4 text-silver" strokeWidth={2} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-ash pt-5">
            {signedIn ? (
              <Button href="/welcome" variant="primary" className="col-span-2 h-10">
                Przejdź do panelu
              </Button>
            ) : (
              <>
                <Button href="/login" variant="outline" className="h-10">
                  Zaloguj się
                </Button>
                <Button href="/signup" variant="primary" className="h-10">
                  Zacznij teraz
                </Button>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
