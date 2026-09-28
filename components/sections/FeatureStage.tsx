"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";
import { FeatureTriad, type TriadItem } from "@/components/sections/FeatureTriad";

/**
 * Whether the picture reading it is the one on show. Pictures that keep time
 * of their own (a live feed, a counter) pause while their panel is away;
 * pictures that only animate on entry use `in-data-[current=true]:` instead.
 */
const PanelCurrentContext = createContext(true);

export function usePanelCurrent() {
  return useContext(PanelCurrentContext);
}

/**
 * The reference's demo band for a feature with three sub-features: one picture
 * per column of the strip below, and the picture follows the strip. The panel
 * leaving slides half its width towards the side it came from while it fades,
 * the one arriving slides in from the other side — dub.co's own transition
 * (300ms, opacity and translate).
 *
 * The pictures are drawn on a fixed 800×440 stage and scaled down on narrow
 * screens, so each keeps its composition instead of reflowing.
 */
export function FeatureStage({
  showcases,
  items,
  initialIndex,
}: {
  showcases: [React.ReactNode, React.ReactNode, React.ReactNode];
  items: TriadItem[];
  initialIndex: number;
}) {
  const [active, setActive] = useState(initialIndex);
  return (
    <>
      {/* The band is the stage's 440px height times its scale at each
          breakpoint, so the picture always fills it exactly. The pictures are
          illustrations, so nothing in them can be selected or copied. */}
      <div className="relative h-[198px] cursor-default select-none overflow-hidden px-4 sm:h-[352px] sm:px-8 md:h-[405px] lg:h-[440px]">
        {showcases.map((showcase, index) => {
          const current = index === active;
          const direction = index < active ? -1 : 1;
          return (
            <div
              key={index}
              role="tabpanel"
              aria-hidden={!current}
              // Pictures key entrance animations off this (`in-data-[current=true]:`),
              // so they replay every time their panel comes back.
              data-current={current}
              className={cn(
                "absolute inset-0 flex justify-center transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                current ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              style={{ transform: current ? undefined : `translateX(${direction * 50}%)` }}
            >
              <div className="h-[440px] w-[800px] shrink-0 origin-top scale-[0.45] sm:scale-[0.8] md:scale-[0.92] lg:scale-100">
                <PanelCurrentContext.Provider value={current}>{showcase}</PanelCurrentContext.Provider>
              </div>
            </div>
          );
        })}
      </div>
      <FeatureTriad items={items} initialIndex={initialIndex} active={active} onActiveChange={setActive} />
    </>
  );
}
