import { Fragment } from "react";

/**
 * Renders the pricing copy's one bit of markup: `**x**` sets x in `<strong>`.
 * Enough for "**15** wiadomości dziennie" without shipping a Markdown parser.
 */
export function rich(text: string, strongClassName?: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className={strongClassName}>
        {part}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/** The same copy with the markup stripped — for accessible names. */
export function plain(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}
