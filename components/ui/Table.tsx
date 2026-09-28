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
  divided = false,
}: {
  columns: string[];
  children: React.ReactNode;
  className?: string;
  /**
   * Draw a hairline between columns as well as between rows. Off by default —
   * the dashboard's own tables are row-ruled only; the marketing pages' event
   * stream is column-ruled, which is what the reference does when a table is
   * being read as a grid of fields rather than as a list.
   */
  divided?: boolean;
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
                className={cn(
                  "px-3.5 py-2.5 text-body-sm font-medium text-charcoal",
                  divided && "border-l border-ash first:border-l-0",
                )}
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
  divided = false,
}: {
  cells: React.ReactNode[];
  /** Faded placeholder record (the reference's locked-plan preview rows). */
  ghost?: boolean;
  className?: string;
  /** Match the parent DataTable's `divided`. */
  divided?: boolean;
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
            "px-3.5 py-2.5 text-body-sm",
            ghost ? "text-fog" : "text-charcoal",
            divided && "border-l border-ash first:border-l-0",
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
        "flex items-center justify-between gap-4 px-1 py-3 text-body-sm text-charcoal",
        className,
      )}
    >
      <p>{summary}</p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          className="rounded-buttons border border-ash bg-white px-3 py-1.5 text-body-sm font-medium text-silver"
        >
          Poprzednia
        </button>
        <button
          type="button"
          disabled
          className="rounded-buttons border border-ash bg-white px-3 py-1.5 text-body-sm font-medium text-silver"
        >
          Następna
        </button>
      </div>
    </div>
  );
}
