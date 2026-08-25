import Link from "next/link";
import { Lock } from "lucide-react";
import { FieldLabel, Input } from "@/components/ui/Input";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.56-5.18 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29a7.22 7.22 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M17.05 12.9c-.03-2.53 2.06-3.74 2.15-3.8-1.17-1.71-3-1.95-3.65-1.98-1.55-.16-3.03.91-3.82.91-.79 0-2-.89-3.3-.86-1.7.02-3.26.99-4.13 2.5-1.76 3.06-.45 7.59 1.27 10.07.84 1.21 1.84 2.58 3.15 2.53 1.26-.05 1.74-.82 3.27-.82 1.53 0 1.96.82 3.3.79 1.36-.02 2.22-1.24 3.05-2.46.96-1.41 1.36-2.78 1.38-2.85-.03-.01-2.64-1.01-2.67-4.03ZM14.53 5.4c.7-.85 1.17-2.02 1.04-3.19-1 .04-2.22.67-2.94 1.51-.65.75-1.21 1.95-1.06 3.1 1.12.09 2.26-.57 2.96-1.42Z" />
    </svg>
  );
}

/**
 * The reference auth form: emphasized e-mail field, dark primary action,
 * an OR divider, three SSO buttons, swap link and the dotted alt-account box.
 */
export function AuthForm({
  title,
  primaryLabel,
  swapPrompt,
  swapLabel,
  swapHref,
}: {
  title: string;
  primaryLabel: string;
  swapPrompt: string;
  swapLabel: string;
  swapHref: string;
}) {
  return (
    <div>
      <h1 className="text-center text-subheading font-semibold text-charcoal">
        {title}
      </h1>

      <form className="mt-8">
        <FieldLabel htmlFor="auth-email">Adres e-mail</FieldLabel>
        <Input
          id="auth-email"
          type="email"
          emphasis
          placeholder="ty@przyklad.pl"
        />
        <button
          type="button"
          className="mt-3 h-10 w-full rounded-buttons bg-primary-action-fill text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
        >
          {primaryLabel}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-ash" />
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-fog">
          lub
        </span>
        <span className="h-px flex-1 bg-ash" />
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2.5 rounded-buttons border border-ash bg-white text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
        >
          <GoogleGlyph />
          Kontynuuj przez Google
        </button>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2.5 rounded-buttons border border-ash bg-white text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
        >
          <AppleGlyph />
          Kontynuuj przez Apple
        </button>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2.5 rounded-buttons border border-ash bg-white text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
        >
          <Lock className="size-4 text-steel" aria-hidden />
          Kontynuuj przez SSO szkoły
        </button>
      </div>

      <p className="mt-6 text-center text-body text-steel">
        {swapPrompt}{" "}
        <Link href={swapHref} className="font-semibold text-charcoal">
          {swapLabel}
        </Link>
      </p>

      <div className="bg-dots mt-10 rounded-cards border border-ash px-5 py-4 text-center">
        <p className="text-body text-steel">
          Szukasz konta dla nauczycieli?
          <br />
          <a href="#" className="font-semibold text-charcoal">
            Zaloguj się na nauczyciel.examax.pl
          </a>
        </p>
      </div>
    </div>
  );
}
