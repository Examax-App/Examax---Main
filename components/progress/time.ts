import { useSyncExternalStore } from "react";

/*
 * Dates on /progress, in Polish and counted back from now — the reference
 * stamps its event rows a few minutes apart, ending at the visitor's own
 * clock, so the stream always reads as tonight's.
 */

const SHORT = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
const GENITIVE = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const NOMINATIVE = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

const MINUTE = 60_000;

/** The render on the server, and the first one in the browser: a fixed evening. */
const SERVER_NOW = new Date(2026, 9, 1, 19, 26).getTime();

let clientNow: number | null = null;
const noop = () => () => {};

/**
 * The visitor's clock, rounded down to the minute and read once per page
 * load, so every row on the page counts back from the same moment. The server
 * renders a fixed evening and the browser swaps in its own after hydration.
 */
export function useNow() {
  return useSyncExternalStore(
    noop,
    () => (clientNow ??= Math.floor(Date.now() / MINUTE) * MINUTE),
    () => SERVER_NOW,
  );
}

export const minutesAgo = (now: number, minutes: number) => new Date(now - minutes * MINUTE);

const pad = (value: number) => String(value).padStart(2, "0");

/** "1 paź, 19:23" — the table's date column. */
export const stamp = (date: Date) => `${date.getDate()} ${SHORT[date.getMonth()]}, ${date.getHours()}:${pad(date.getMinutes())}`;

/** "18 wrz 2026" — the sheet's start-date chip. */
export const day = (date: Date) => `${date.getDate()} ${SHORT[date.getMonth()]} ${date.getFullYear()}`;

/** "17 września 2026" — the chart tooltip's header. */
export const longDay = (date: Date) => `${date.getDate()} ${GENITIVE[date.getMonth()]} ${date.getFullYear()}`;

/** "6 wrz" — an axis tick. */
export const tick = (date: Date) => `${date.getDate()} ${SHORT[date.getMonth()]}`;

/** "Wrzesień 2026" — a month in the hero's tooltip. */
export const month = (date: Date) => `${NOMINATIVE[date.getMonth()]} ${date.getFullYear()}`;
