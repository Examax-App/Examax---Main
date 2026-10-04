import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { ClientOnly } from "@/components/auth/ClientOnly";
import { AuthPreview } from "@/components/auth/AuthPreview";

/*
 * dub.co's login and sign-up page frame (dubinc/dub: app.dub.co/(auth-marketing)/
 * layout.tsx, side-panel.tsx, ui/layout/auth-layout.tsx; `DesignRules/Auth _
 * Dub A.png`, `…B.png`, `Auth components _ Dub.png`) — a full page of its own
 * at /login and /signup, not a layer over another page.
 *
 * Left: white, a 60px grid fading out over its first 320px, Dub's conic glow
 * behind the logo (which leads home), the form centred between a 96px spacer
 * and the terms. Right, from 900px: the side panel — neutral-50, a hairline
 * edge, the same glow at its foot and a still of the product bleeding off its
 * corner. It stays in view if a short window scrolls the form.
 */

const GLOW =
  "bg-[conic-gradient(from_90deg,#F00_5deg,#EAB308_63deg,#5CFF80_115deg,#1E00FF_170deg,#855AFC_220deg,#3A8BFD_286deg,#F00_360deg)]";

/** Dub's glow: two stacked layers, one overlaid at full strength, one faint. */
function Glow({ position, faint }: { position: string; faint: string }) {
  return (
    <>
      {[0, 1].map((layer) => (
        <div
          key={layer}
          aria-hidden
          className={cn("absolute left-1/2 size-[80px] -translate-x-1/2 scale-x-[1.6]", position, layer === 0 ? "mix-blend-overlay" : faint)}
        >
          {Array.from({ length: layer === 0 ? 2 : 1 }, (_, i) => (
            <div key={i} className={cn("absolute -inset-16 mix-blend-overlay blur-[50px] saturate-[2]", GLOW)} />
          ))}
        </div>
      ))}
    </>
  );
}

function SidePanel() {
  return (
    <div className="sticky top-0 hidden h-dvh overflow-hidden border-l border-black/5 bg-canvas-muted min-[900px]:block">
      <Glow position="bottom-0 translate-y-1/2" faint="opacity-15" />
      <div className="relative h-full">
        <AuthPreview />
      </div>
    </div>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-dvh grid-cols-1 min-[900px]:grid-cols-[minmax(0,1fr)_440px] lg:grid-cols-[minmax(0,1fr)_595px]">
      <div className="relative">
        <div aria-hidden className="absolute inset-0 isolate overflow-hidden bg-white">
          <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent_320px),linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]">
            <svg className="pointer-events-none absolute inset-0 text-ash" width="100%" height="100%">
              <defs>
                <pattern id="auth-grid" x="-0.25" y="-1" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="transparent" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect fill="url(#auth-grid)" width="100%" height="100%" />
            </svg>
          </div>
          <Glow position="top-6 -translate-y-1/2" faint="opacity-10" />
        </div>

        <div className="relative flex min-h-dvh w-full justify-center">
          <Link href="/" aria-label="Examax — strona główna" className="focus-ring absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-[4px] py-1">
            <Logo />
          </Link>
          <main className="flex min-h-dvh w-full flex-col items-center justify-between">
            {/* Dub's spacer: keeps the form optically centred under the logo */}
            <div className="grow basis-0">
              <div className="h-24" />
            </div>
            <ClientOnly className="relative flex w-full flex-col items-center justify-center px-4">{children}</ClientOnly>
            <div className="flex grow basis-0 flex-col justify-end">
              <p className="px-20 py-8 text-center text-xs font-medium text-fog md:px-0">
                Kontynuując, akceptujesz{" "}
                <Link href="/terms" prefetch={false} className="font-semibold text-steel transition-colors hover:text-graphite">
                  Regulamin
                </Link>{" "}
                i{" "}
                <Link href="/privacy" prefetch={false} className="font-semibold text-steel transition-colors hover:text-graphite">
                  Politykę prywatności
                </Link>{" "}
                Examax
              </p>
            </div>
          </main>
        </div>
      </div>

      <SidePanel />
    </div>
  );
}
