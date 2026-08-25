import { cn } from "@/lib/cn";

/**
 * Keyboard-shortcut chip. "dark" sits inside filled primary buttons
 * ("Create link  C"), "light" sits on white toolbars.
 */
export function Kbd({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "grid size-5 place-items-center rounded-[5px] font-inter text-[11px] font-medium",
        tone === "dark"
          ? "bg-white/20 text-white"
          : "border border-ash bg-paper-mist text-fog",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
