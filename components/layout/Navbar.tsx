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
import Link from "next/link";
import {
  ArrowRight,
  Backpack,
  BadgePercent,
  BookMarked,
  BookOpen,
  ChevronDown,
  Compass,
  GraduationCap,
  Languages,
  Menu,
  Newspaper,
  PencilLine,
  Presentation,
  Quote,
  Route,
  School,
  Sigma,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { ACCENT_VAR } from "@/lib/glow";
import { AgentIcon } from "@/components/ui/AgentIcon";
import {
  ProgressPreview,
  RoadmapPreview,
  AgentHuddle,
  ExamSheetPreview,
  TrainingPreview,
} from "@/components/layout/NavPreviews";

type MenuKey = "product" | "exams" | "materials";

type MenuItem = {
  icon: IconComponent;
  title: string;
  description: string;
  href: string;
  /**
   * The card's accent. Every card lights the same blurred colour sweep behind
   * its white surface; `violet` adds a wash of the palette's lavender pooling
   * at the bottom edge on top of it, which is the only thing separating two
   * cards sharing a slot.
   */
  tone?: "accent" | "violet";
  /**
   * Size class for the icon. Raster marks need more area than a line glyph to
   * stay readable, so they opt up from the default.
   */
  iconSize?: string;
  /**
   * Fixed height for the icon row. Cards sharing a slot keep their titles on
   * one line no matter how the marks inside differ in size.
   */
  iconSlot?: string;
};

type MenuColumn = { heading: string; items: MenuItem[] };

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
   * A wide card's artwork, laid behind the copy and bleeding off the right
   * edge — the reference's own treatment for its wide cards.
   */
  backdrop?: React.ReactNode;
  /**
   * A wide card's inline artwork, beside the copy — the Agent card's huddle of
   * the team at its right edge. Nothing in it moves on hover.
   */
  art?: React.ReactNode;
};

/**
 * Two panel shapes.
 *
 * `grid` is the reference's Product dropdown — a row of three tall cards over a
 * row of two wide ones. `split` is the original: large blocks in a left column
 * with headed lists beside them, which is what Egzaminy still uses.
 */
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
};

type Menu =
  | { label: string; layout: "grid"; top: FeatureCard[]; bottom: FeatureCard[] }
  | {
      label: string;
      layout: "columns";
      columns: Array<{ heading: string; compact?: boolean; items: ColumnItem[] }>;
    }
  | {
      label: string;
      layout: "split";
      featured: MenuItem[];
      columns: MenuColumn[];
    };

/** Every entry in a menu, in reading order — the mobile list is flat. */
function menuItems(menu: Menu): Array<Pick<MenuItem, "icon" | "title" | "href">> {
  if (menu.layout === "grid") return [...menu.top, ...menu.bottom];
  if (menu.layout === "columns") return menu.columns.flatMap((column) => column.items);
  return [...menu.featured, ...menu.columns.flatMap((column) => column.items)];
}

const menus: Record<MenuKey, Menu> = {
  product: {
    label: "Produkt",
    layout: "grid",
    // Landing-page sections are linked root-absolutely, so the panel works
    // the same from /pricing as it does from the landing page. Trening,
    // Roadmapa and Symulacja are the exceptions: each has a page of its own.
    // Postępy holds the orange spotlight slot; Symulacja sits in the wide row
    // beside the agent, in lavender.
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
        href: "/#progress",
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
        backdrop: <ExamSheetPreview />,
      },
      {
        icon: AgentIcon,
        accent: "lavender",
        title: "Agenci Examax",
        description: "Twój zespół korepetytorów",
        href: "/#agent",
        art: <AgentHuddle />,
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
            href: "/schools",
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
          { icon: Sigma, title: "Matematyka", href: "/#practice", hoverTint: "group-hover:text-electric-blue" },
          { icon: BookMarked, title: "Język polski", href: "/#practice", hoverTint: "group-hover:text-vivid-green" },
          { icon: Languages, title: "Język angielski", href: "/#practice", hoverTint: "group-hover:text-lavender" },
        ],
      },
    ],
  },
  materials: {
    label: "O nas",
    layout: "split",
    // The two evergreen references lead as cards; what changes over time sits
    // in the list beside them. Routes are live paths rather than hashes: the
    // pages land later, but the nav skeleton is then already final.
    featured: [
      {
        icon: Compass,
        title: "O Examax",
        description: "Misja, wizja i to, po co powstał Examax",
        href: "/about",
      },
      {
        icon: BookOpen,
        title: "Dokumentacja",
        description: "Przewodniki po platformie, FAQ i materiały do nauki",
        href: "/docs",
        tone: "violet",
      },
    ],
    columns: [
      {
        heading: "Na bieżąco",
        items: [
          {
            icon: Newspaper,
            title: "Aktualności",
            description: "Nowe funkcje, zmiany w produkcie i ogłoszenia",
            href: "/updates",
          },
          {
            icon: Quote,
            title: "Opinie",
            description: "Historie uczniów i opinie społeczności",
            href: "/reviews",
          },
        ],
      },
    ],
  },
};

const menuKeys = Object.keys(menus) as MenuKey[];

const plainLinks = [
  { label: "Cennik", href: "/pricing" },
  // Dub's "Enterprise" slot: the plan for whole schools (placeholder route).
  { label: "Instytucje", href: "/schools" },
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
 * The hover light, borrowed from the reference's GridCard: a heavily blurred
 * colour wash sitting behind the card, fading in on hover.
 *
 * The reference uses a red/violet/blue conic sweep. This is the same technique
 * in Examax's own accents, which is the one liberty taken with DESIGN.md's
 * rule about decorative gradients — the interaction does not read without it.
 */
const HOVER_GLOW =
  "conic-gradient(from 180deg, var(--color-electric-blue) 0deg, var(--color-lavender) 130deg, var(--color-deep-sapphire) 230deg, var(--color-vivid-green) 310deg, var(--color-electric-blue) 360deg)";

/**
 * The Matura card's accent: a violet wash pooling at the bottom edge on hover.
 *
 * At rest the two exam cards are the same plain white surface; this is all
 * that tells their hover states apart. It is mixed down from the palette's own
 * lavender and fades out well below the title, which keeps it reading as light
 * collecting under the card rather than as a second background colour.
 */
const VIOLET_FOOT = [
  "linear-gradient(to top",
  "color-mix(in oklab, var(--color-lavender) 16%, transparent) 0%",
  "color-mix(in oklab, var(--color-lavender) 6%, transparent) 38%",
  "transparent 78%)",
].join(", ");

/**
 * A large navigation card — the reference's GridCard proportions: a bordered
 * white surface, icon above, title and description below, generous padding.
 * It is a visible card at rest and lights up on hover.
 */
function NavCard({
  item,
  tabIndex,
  onNavigate,
}: {
  item: MenuItem;
  tabIndex: number;
  onNavigate: () => void;
}) {
  const violet = item.tone === "violet";

  return (
    <Link
      href={item.href}
      tabIndex={tabIndex}
      onClick={onNavigate}
      className="focus-ring group relative isolate z-0 flex h-full flex-col overflow-hidden rounded-cards border border-ash bg-white px-4 py-3.5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[10%] -z-10 opacity-0 blur-[46px] transition-opacity duration-200 group-hover:opacity-25 motion-reduce:transition-none"
        style={{ backgroundImage: HOVER_GLOW }}
      />
      {/* Sits above the sweep but still below the type. Hidden at rest, like
          the sweep itself, so the two cards are identical until hovered. */}
      {violet && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
          style={{ backgroundImage: VIOLET_FOOT }}
        />
      )}
      {/* A fixed slot keeps the cards' titles on one line even when the marks
          above them are sized differently. */}
      <span className={cn("relative flex items-center", item.iconSlot)}>
        <item.icon
          className={cn("text-steel", item.iconSize ?? "size-6")}
          strokeWidth={1.8}
        />
      </span>
      <span className="relative mt-4 block">
        <span className="block text-body font-semibold text-charcoal">
          {item.title}
        </span>
        <span className="mt-1 block text-[12px] leading-snug text-fog">
          {item.description}
        </span>
      </span>
    </Link>
  );
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
 * bleeds off the right edge (`backdrop`). The Agent card carries its own
 * artwork (`art`) instead: the team, huddled at its right edge.
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
          {card.art && (
            <div className="pointer-events-none absolute inset-0">{card.art}</div>
          )}
          <div className="relative flex items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-body leading-none font-medium text-charcoal">
                {card.title}
              </span>
              {/* The copy stops short of the artwork on the right, at both
                  panel widths. */}
              <p
                className={cn(
                  "mt-1 text-body text-fog",
                  card.backdrop ? "max-w-52" : card.art ? "max-w-64 xl:max-w-68" : "max-w-sm",
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
  return (
    <Link
      href={item.href}
      tabIndex={tabIndex}
      onClick={onNavigate}
      className={cn(
        "focus-ring group -mx-2 flex items-center gap-3 rounded-[8px] p-2 transition-colors hover:bg-canvas-muted active:bg-paper-mist",
        compact && "py-1",
      )}
    >
      <span
        className={cn(
          "shrink-0 border border-ash bg-white/50",
          compact ? "rounded-lg p-1" : "rounded-md p-2.5",
        )}
      >
        <item.icon
          className={cn("size-4 text-steel transition-colors", item.hoverTint)}
          strokeWidth={1.8}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-medium text-slate">{item.title}</span>
        {item.description && (
          <span className="block truncate text-xs text-fog">{item.description}</span>
        )}
      </span>
    </Link>
  );
}

/**
 * A compact navigation row — the reference's small item: icon, title, and an
 * arrow that slides in from the left edge of its slot on hover.
 */
function NavRow({
  item,
  tabIndex,
  onNavigate,
}: {
  item: MenuItem;
  tabIndex: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={item.href}
      tabIndex={tabIndex}
      onClick={onNavigate}
      className="focus-ring group relative flex items-center gap-3 rounded-cards px-2 py-2 transition-colors duration-150 hover:bg-paper-mist"
    >
      <item.icon className="size-4 shrink-0 text-steel" strokeWidth={1.8} />
      <span className="text-[13px] font-medium text-charcoal">{item.title}</span>
      <span className="relative ml-auto flex h-full w-4 items-center">
        <ArrowRight
          className="size-3.5 -translate-x-2 text-fog opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
          aria-hidden
        />
      </span>
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
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

        <nav ref={navListRef} aria-label="Główna nawigacja" className="relative hidden lg:block">
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
                  onFocus={() => setOpenMenu(key)}
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
                      /* The reference's Solutions panel: three columns split
                         3:3:2 by hairlines, each headed by a small caps label. */
                      <div className="grid w-[58rem] shrink-0 grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,2fr)] divide-x divide-ash xl:w-[1020px]">
                        {menu.columns.map((column) => (
                          <div key={column.heading} className="px-6 py-4">
                            <p className="mb-2 text-xs uppercase text-fog">{column.heading}</p>
                            <ul className="flex flex-col gap-0.5">
                              {column.items.map((item) => (
                                <li key={item.title}>
                                  <ColumnLink
                                    item={item}
                                    compact={column.compact}
                                    tabIndex={active ? 0 : -1}
                                    onNavigate={() => setOpenMenu(null)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : menu.layout === "grid" ? (
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
                    ) : (
                      <>
                        <ul className="grid w-[26rem] shrink-0 grid-cols-2 gap-3 border-r border-ash p-4">
                          {menu.featured.map((item) => (
                            <li key={item.title}>
                              <NavCard
                                item={item}
                                tabIndex={active ? 0 : -1}
                                onNavigate={() => setOpenMenu(null)}
                              />
                            </li>
                          ))}
                        </ul>

                        <div className="w-60 space-y-3 p-3">
                          {menu.columns.map((column) => (
                            <div key={column.heading}>
                              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-fog">
                                {column.heading}
                              </p>
                              <ul>
                                {column.items.map((item) => (
                                  <li key={item.title}>
                                    <NavRow
                                      item={item}
                                      tabIndex={active ? 0 : -1}
                                      onNavigate={() => setOpenMenu(null)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/login" variant="outline" size="nav">
            Zaloguj się
          </Button>
          <Button href="/signup" variant="primary" size="nav">
            Zacznij teraz
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
              {menuItems(menus[key]).map((item) => (
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
            <Button href="/login" variant="outline" className="flex-1">
              Zaloguj się
            </Button>
            <Button href="/signup" variant="primary" className="flex-1">
              Zacznij teraz
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
