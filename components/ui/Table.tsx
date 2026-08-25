import { cn } from "@/lib/cn";

/**
 * Reference data table: bordered 12px container, hairline header, generous
 * 16px rows separated by 1px ash bottom borders. Ghost rows render the
 * faded placeholder records seen behind empty-state upsells.
 */
export function DataTable({
  columns,
  children,
  className,
}: {
  columns: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-cards border border-ash bg-white",
        className,
      )}
    >
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ash">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-3.5 text-body font-medium text-charcoal"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TableRow({
  cells,
  ghost = false,
  className,
}: {
  cells: React.ReactNode[];
  /** Faded placeholder record (the reference's locked-plan preview rows). */
  ghost?: boolean;
  className?: string;
}) {
  return (
    <tr
      aria-hidden={ghost || undefined}
      className={cn(
        "border-b border-ash/70 last:border-b-0",
        ghost && "text-fog opacity-50 select-none",
        className,
      )}
    >
      {cells.map((cell, index) => (
        <td
          key={index}
          className={cn(
            "px-4 py-3.5 text-body",
            ghost ? "text-fog" : "text-charcoal",
          )}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}

/** "Viewing 0 links" + Previous/Next pagination strip. */
export function TableFooter({
  summary,
  className,
}: {
  summary: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-1 py-3.5 text-body text-charcoal",
        className,
      )}
    >
      <p>{summary}</p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          className="rounded-buttons border border-ash bg-white px-3.5 py-2 text-body font-medium text-silver"
        >
          Poprzednia
        </button>
        <button
          type="button"
          disabled
          className="rounded-buttons border border-ash bg-white px-3.5 py-2 text-body font-medium text-silver"
        >
          Następna
        </button>
      </div>
    </div>
  );
}
