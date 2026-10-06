"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlignLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export type TocItem = { id: string; title: string };

/** A heading counts as reached once its top passes this line: the 80px it lands at when its link is followed (dub's scroll-mt-20), plus a little slack. */
const REACHED_AT = 96;

/**
 * dub's "On this page" rail (dub.co/legal/privacy, read off the live DOM):
 * a 2px gray-200 rule with every section's title 16px off it in 14px
 * gray-500, the current one in black under a 2px black bar. The bar slides
 * from one title to the next, as dub's shared-layout bar does, rather than
 * jumping.
 *
 * The current section is the last one whose heading has scrolled up to the
 * top of the window; at the very bottom of the page it is the last section,
 * whose heading may never get that far.
 */
export function LegalToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [bar, setBar] = useState<{ y: number; height: number } | null>(null);
  /* The bar takes its first place without sliding there from the top. */
  const [placed, setPlaced] = useState(false);
  const links = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id;
      for (const { id } of items) {
        const heading = document.getElementById(id);
        if (heading && heading.getBoundingClientRect().top <= REACHED_AT) current = id;
      }
      const root = document.documentElement;
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) current = items[items.length - 1]?.id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  useLayoutEffect(() => {
    const link = active ? links.current.get(active) : undefined;
    if (!link) return;
    const measure = () => setBar({ y: link.offsetTop, height: link.offsetHeight });
    measure();
    /* Titles rewrap when fonts load or the column resizes; the bar follows. */
    const observer = new ResizeObserver(measure);
    observer.observe(link);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (bar && !placed) requestAnimationFrame(() => setPlaced(true));
  }, [bar, placed]);

  return (
    <nav aria-labelledby="toc-heading" className="sticky top-20 flex-col">
      <p id="toc-heading" className="-ml-0.5 flex items-center gap-1.5 text-sm text-gray-500">
        <AlignLeft className="size-4" aria-hidden />
        Na tej stronie
      </p>
      <div className="relative mt-4 grid gap-4 border-l-2 border-gray-200">
        {items.map(({ id, title }) => (
          <a
            key={id}
            ref={(node) => {
              if (node) links.current.set(id, node);
              else links.current.delete(id);
            }}
            href={`#${id}`}
            aria-current={id === active ? "location" : undefined}
            className="focus-ring relative -ml-0.5 rounded-[4px] pl-4"
          >
            <span className={cn("block text-sm transition-colors", id === active ? "text-black" : "text-gray-500")}>{title}</span>
          </a>
        ))}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -left-0.5 top-0 w-0.5 bg-black",
            placed && "transition-[transform,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            !bar && "opacity-0",
          )}
          style={bar ? { transform: `translateY(${bar.y}px)`, height: bar.height } : undefined}
        />
      </div>
    </nav>
  );
}
