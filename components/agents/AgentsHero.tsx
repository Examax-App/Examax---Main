"use client";

import { BotAvatar, type BotAvatarType } from "bot-avatars";
import { Button } from "@/components/ui/Button";
import { ProMark } from "@/components/ui/ProMark";
import { GridPattern } from "@/components/training/GridPattern";
import { AgentShowcase } from "@/components/mockups/AgentShowcase";

/* ---------------------------------------------------------------------------
 * The /agents hero — Grok Bot's (x.ai/bot, his capture `DesignRules/agents.png`): the
 * team's faces floating round a centred headline on white, the app window
 * under it. Drawn in Examax's light page frame (dub's grid and a 15% sweep,
 * the 1080px column) rather than Grok's dark.
 *
 * The faces are the team's own (AgentShowcase's roster) at hero size: the
 * bot-avatars canvas renders at the screen's pixel density, so they stay
 * sharp at any size, and the library pauses any face scrolled off screen.
 * Each bobs on its own slow cycle (`agent-float`, 7–10s, out of step); the
 * eyes follow the pointer, and a click makes a face hop and turn. Hops spill
 * above the face's box, so nothing round them clips.
 * ------------------------------------------------------------------------- */

type Face = { type: BotAvatarType; size: number; left: number; top: number; duration: number; delay: number };

/** Placed on a 1200px stage round the copy (312–888), kept out towards the edges so the headline has air. */
const FACES: Face[] = [
  { type: "clover", size: 112, left: 36, top: 36, duration: 8.4, delay: -1.2 },
  { type: "cat", size: 86, left: 128, top: 238, duration: 9.6, delay: -4.1 },
  { type: "triangle", size: 92, left: 24, top: 392, duration: 7.4, delay: -2.6 },
  { type: "circle", size: 108, left: 1036, top: 28, duration: 9.1, delay: -0.4 },
  { type: "star", size: 82, left: 1104, top: 236, duration: 7.9, delay: -5.3 },
  { type: "droid", size: 92, left: 990, top: 388, duration: 8.8, delay: -3.4 },
];

export function AgentsHero() {
  return (
    <section aria-labelledby="agents-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] px-4 pb-20 pt-16 text-center sm:pt-28">
        {/* The column's edges, fading in as they come down */}
        <div aria-hidden className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black_40%)]" />

        {/* The grid: one field across the column and two wings beyond it */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 opacity-60 [mask-image:linear-gradient(transparent,black_30%,black_60%,transparent)]">
          <div className="absolute inset-x-[360px] inset-y-0">
            <GridPattern id="agents-grid-left" className="inset-y-0 right-full w-[360px] text-ash [mask-image:linear-gradient(90deg,transparent,black)]" />
            <GridPattern id="agents-grid-right" className="inset-y-0 left-full w-[360px] text-ash [mask-image:linear-gradient(270deg,transparent,black)]" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden opacity-60 [mask-image:linear-gradient(transparent,black_30%,black_60%,transparent)]">
          <GridPattern id="agents-grid" className="inset-0 text-ash" />
        </div>

        {/* The sweep: the agents' own colours, at 15% */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-full w-[150%] opacity-15">
            <div className="size-full bg-[linear-gradient(90deg,#FDE68A,#C4B5FD,#93C5FD,#86EFAC)] [mask-image:linear-gradient(transparent_15%,black_55%,transparent)]" />
          </div>
        </div>

        {/* The faces, round the copy — on screens wide enough to hold them clear of it */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-[620px] w-[1200px] -translate-x-1/2 xl:block">
          {FACES.map((face, index) => (
            <div
              key={face.type}
              className="animate-slide-up-fade absolute"
              style={{ left: face.left, top: face.top, "--offset": "16px", "--delay": `${300 + index * 90}ms` } as React.CSSProperties}
            >
              <div className="agent-float pointer-events-auto relative z-[1]" style={{ animation: `agent-float ${face.duration}s ease-in-out ${face.delay}s infinite` }}>
                <BotAvatar type={face.type} size={face.size} aria-hidden />
              </div>
            </div>
          ))}
        </div>

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
          <span className="relative flex w-fit items-center gap-2 overflow-hidden rounded-full border border-ash bg-white py-1 pl-1 pr-3 text-xs font-medium leading-tight text-steel">
            <ProMark scale={0.7} />
            Korepetytor AI
          </span>
          <h1
            id="agents-heading"
            className="animate-slide-up-fade mt-5 text-balance font-satoshi text-4xl font-medium text-charcoal sm:text-5xl sm:leading-[1.15]"
            style={{ "--offset": "20px" } as React.CSSProperties}
          >
            AI pomaga. Myślisz Ty.
          </h1>
          <p
            className="animate-slide-up-fade mt-5 text-pretty text-lg font-medium text-fog sm:text-xl"
            style={{ "--offset": "10px", "--delay": "150ms" } as React.CSSProperties}
          >
            Korepetytor AI tłumaczy zadania krok po kroku, sprawdza Twój tok rozumowania i&nbsp;pomaga zaplanować powtórki. Każde zadanie rozwiązujesz sam — dlatego wiedza zostaje z&nbsp;Tobą.
          </p>
        </div>
        <div
          className="animate-slide-up-fade relative mx-auto mt-8 flex max-w-fit flex-wrap justify-center gap-3"
          style={{ "--offset": "5px", "--delay": "300ms" } as React.CSSProperties}
        >
          <Button href="/signup" variant="primary">
            Zacznij za darmo
          </Button>
          <Button href="/pricing" variant="outline">
            Zobacz plan Pro
          </Button>
        </div>

        {/* The product itself: the team's window, live — pick an agent and send its question */}
        <div className="animate-slide-up-fade relative mx-auto mt-20 text-left sm:mt-24" style={{ "--offset": "16px", "--delay": "500ms" } as React.CSSProperties}>
          <AgentShowcase />
          <p className="mt-4 text-center text-sm text-fog">Wybierz agenta i wyślij jego pytanie — odpowiada na żywo.</p>
        </div>
      </div>
    </section>
  );
}
