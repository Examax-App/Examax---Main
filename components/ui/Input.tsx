import { cn } from "@/lib/cn";

/**
 * Form input per DESIGN.md. Two looks:
 * - "default" — quiet 1px ash border (toolbars, settings forms)
 * - "emphasis" — the signature near-black border (auth forms, modal focus
 *   fields): "inputs feel important, not optional".
 */
export function Input({
  emphasis = false,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { emphasis?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full min-w-0 rounded-inputs border bg-white px-3 text-body text-charcoal placeholder:text-fog focus:outline-2 focus:outline-offset-2 focus:outline-charcoal",
        emphasis ? "border-midnight-ink" : "border-ash hover:border-smoke",
        className,
      )}
    />
  );
}

/** Textarea sibling — contact "How can we help?" field. */
export function Textarea({
  emphasis = false,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { emphasis?: boolean }) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full min-w-0 rounded-inputs border bg-white p-3 text-body text-charcoal placeholder:text-fog focus:outline-2 focus:outline-offset-2 focus:outline-charcoal",
        emphasis ? "border-midnight-ink" : "border-ash hover:border-smoke",
        className,
      )}
    />
  );
}

/**
 * Input with a fixed gray prefix segment — the onboarding slug field
 * ("app.examax.pl / twoj-profil") from the workspace-create reference.
 */
export function PrefixInput({
  prefix,
  emphasis = false,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  prefix: string;
  emphasis?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex h-10 w-full overflow-hidden rounded-inputs border bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-charcoal",
        emphasis ? "border-midnight-ink" : "border-ash",
        className,
      )}
    >
      <span className="flex select-none items-center border-r border-ash bg-paper-mist px-3 text-body text-steel">
        {prefix}
      </span>
      <input
        {...props}
        className="h-full w-full min-w-0 bg-white px-3 text-body text-charcoal placeholder:text-fog focus:outline-none"
      />
    </span>
  );
}

/** Field label + optional help circle, matching the reference forms. */
export function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-body font-medium text-charcoal"
    >
      {children}
      {required ? (
        <span className="text-[#dc2626]" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}
