"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

/*
 * The small parts of dub.co's auth screens (dubinc/dub: packages/ui button
 * and input, ui/auth/*), in our tokens: neutral-900/800 → charcoal/graphite,
 * neutral-500/400/300/200 → fog/silver/smoke/ash.
 */

/** Dub's auth button: 40px, rounded-lg; black primary with a ring on hover, white secondary. */
export function AuthButton({
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  loading?: boolean;
}) {
  const inert = disabled || loading;
  return (
    <button
      {...props}
      disabled={inert}
      className={cn(
        "group flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm transition-all",
        inert
          ? "cursor-not-allowed border-ash bg-paper-mist text-silver"
          : variant === "primary"
            ? "border-charcoal bg-charcoal text-white hover:bg-graphite hover:ring-4 hover:ring-ash"
            : "border-ash bg-white text-charcoal outline-none hover:bg-canvas-muted focus-visible:border-fog",
        className,
      )}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 animate-spin text-silver" aria-hidden>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Dub's auth field: a 14px label, 8px above an input with a black focus. */
export function AuthField({
  label,
  aside,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; aside?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between">
        <span className="block text-sm font-medium leading-none text-charcoal">{label}</span>
        {aside}
      </span>
      <input
        {...props}
        size={1}
        className="block w-full min-w-0 appearance-none rounded-md border border-smoke px-3 py-2 text-charcoal placeholder-silver shadow-sm read-only:bg-paper-mist read-only:text-fog focus:border-charcoal focus:outline-none sm:text-sm"
      />
    </label>
  );
}

/** Dub's "or" between the methods. */
export function Separator() {
  return (
    <div className="my-3 flex shrink items-center justify-center gap-2">
      <div className="grow basis-0 border-b border-ash" />
      <span className="text-xs font-medium uppercase leading-none text-silver">lub</span>
      <div className="grow basis-0 border-b border-ash" />
    </div>
  );
}

/** Dub's partner banner, a dotted card linking elsewhere — ours points institutions to their plan. */
export function AlternativeBanner({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <Link
      href={href}
      className="relative block overflow-hidden rounded-lg border border-ash bg-canvas-muted px-2 py-4 transition-colors hover:bg-paper-mist"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(var(--color-ash)_1px,transparent_1px)] [background-position:1px_5px] [background-size:12px_12px]" />
      <div className="relative text-center text-sm text-steel">
        <p>{text}</p>
        <span className="block font-semibold text-graphite">{cta}</span>
      </div>
    </Link>
  );
}

/**
 * Dub's AnimatedSizeContainer (height only): the block eases to the height
 * of whatever it holds, so methods moving between the top slot and the
 * list below never jump.
 */
export function AnimatedHeight({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const node = inner.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
      style={{ height }}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}

export function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.56-5.18 3.56-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.29a7.22 7.22 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

export function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M17.05 12.9c-.03-2.53 2.06-3.74 2.15-3.8-1.17-1.71-3-1.95-3.65-1.98-1.55-.16-3.03.91-3.82.91-.79 0-2-.89-3.3-.86-1.7.02-3.26.99-4.13 2.5-1.76 3.06-.45 7.59 1.27 10.07.84 1.21 1.84 2.58 3.15 2.53 1.26-.05 1.74-.82 3.27-.82 1.53 0 1.96.82 3.3.79 1.36-.02 2.22-1.24 3.05-2.46.96-1.41 1.36-2.78 1.38-2.85-.03-.01-2.64-1.01-2.67-4.03ZM14.53 5.4c.7-.85 1.17-2.02 1.04-3.19-1 .04-2.22.67-2.94 1.51-.65.75-1.21 1.95-1.06 3.1 1.12.09 2.26-.57 2.96-1.42Z" />
    </svg>
  );
}

/** What a UI-only method does when used: a moment of loading, as the real one would show. */
export const PREVIEW_DELAY = 1400;

type ToastState = { id: number; message: string } | null;

/** One message at a time, gone after four seconds — Dub's toasts, without the library. */
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = (message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 4000);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { toast, show };
}

/** Dub's toast (sonner), bottom centre: a white card with a hairline and a soft shadow. */
export function Toast({ toast }: { toast: ToastState }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toast && (
        <p key={toast.id} className="animate-auth-rise max-w-sm rounded-lg border border-ash bg-white px-4 py-3 text-sm text-charcoal shadow-md">
          {toast.message}
        </p>
      )}
    </div>
  );
}
