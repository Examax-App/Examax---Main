import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** Toolbar search field — quiet ash border, leading icon. */
export function SearchInput({
  className,
  placeholder = "Szukaj...",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className={cn("relative block", className)}>
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fog"
        aria-hidden
      />
      <input
        type="search"
        placeholder={placeholder}
        {...props}
        className="h-9 w-full min-w-0 rounded-buttons border border-ash bg-white pl-8 pr-3 text-body-sm text-charcoal placeholder:text-fog hover:border-smoke focus:outline-2 focus:outline-offset-2 focus:outline-charcoal"
      />
    </span>
  );
}
