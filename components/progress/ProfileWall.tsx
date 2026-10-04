"use client";

import { ProgressProfile } from "@/components/mockups/ProgressStage";
import { useInView } from "@/lib/hooks";

import majaPhoto from "@/public/mockups/learner-maja.jpg";

/**
 * The landing's profile wall at the reference's full size. Its columns rise
 * in on `data-current`, as they do in the landing's stage; here the wall is
 * mounted the first time the band scrolls into view, so the stagger plays
 * where it can be seen. Decorative — the band's copy says what it shows.
 *
 * The centre card shows his sunset photo (learner-maja.jpg, 2026-10-01, his
 * pick), held left of centre so her head stays in the frame.
 */
export function ProfileWall() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15, true);
  return (
    <div ref={ref} data-current="true" className="relative mt-14 h-[460px] overflow-hidden sm:h-[540px]">
      {inView ? <ProgressProfile full portrait={{ src: majaPhoto, position: "object-[42%_center]" }} /> : null}
    </div>
  );
}
