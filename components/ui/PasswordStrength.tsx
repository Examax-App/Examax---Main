"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/*
 * A password strength meter: four segmented bars over a single, generic tip
 * while the password is still weak. Built on 21st.dev's password-strength
 * (bars, springs, debounced announcement); its scoring is replaced by fixed
 * steps:
 *
 *   1 red          shorter than 8 characters, or an easily guessed pattern
 *   2 orange       8 or more, but missing a capital letter or a symbol
 *   3 green        8 or more with both a capital letter and a symbol
 *   4 deep green   that, 10 or more characters with small letters and digits
 *                  too, and nothing repetitive
 *
 * The tip never says which step is missing, so nothing on screen hints at
 * what was typed, and it goes once the bars reach green. The screen-reader
 * announcement is just as general. The page is light-only, so there are no
 * dark variants, and the copy is Polish.
 */

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const CROSSFADE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const INSTANT = { duration: 0 } as const;

const COMMON = /^(?:password|passw0rd|haslo|hasło|qwerty|letmein|welcome|admin|iloveyou|loveyou|love|kocham|pizza|polska|zaq12wsx|monkey|dragon|abc123|111111|123123|12345)/i;
const RUN = /(.)\1{3,}/;
const RUN_UP = /(?:0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|qwer|wert|erty|asdf)/i;
const SYMBOL = /[!-/:-@[-`{-~]/;
/** Three of the same character in a row. */
const REPEAT = /(.)\1{2,}/;

/** The shortest password an account accepts. */
export const MIN_PASSWORD_LENGTH = 8;

/** The length a password needs before it can reach the fourth bar. */
const STRONG_PASSWORD_LENGTH = 10;

const BARS = 4;

/** The score an account needs: three bars, green. */
export const ACCEPTED_PASSWORD_SCORE = 3;

/** The one tip, the same whatever is missing. */
const WEAK_TIP = `Słabe hasło. Użyj min. ${MIN_PASSWORD_LENGTH} znaków, wielkich liter, cyfr i symboli.`;

/** One per score, 0 to 4 — agreeing with "hasło". Read out, never shown. */
const LABELS = ["Puste", "Słabe", "Średnie", "Dobre", "Silne"] as const;

/** The steps in the header comment, 0 for an empty field. */
export function scorePassword(value: string) {
  if (value.length === 0) return 0;
  if (value.length < MIN_PASSWORD_LENGTH || COMMON.test(value) || RUN.test(value) || RUN_UP.test(value)) return 1;
  if (!/\p{Lu}/u.test(value) || !SYMBOL.test(value)) return 2;

  // Repetitive: a character three times running, or too few different ones.
  const repetitive = REPEAT.test(value) || new Set(value).size < value.length * 0.6;
  const wellMade = value.length >= STRONG_PASSWORD_LENGTH && /\p{Ll}/u.test(value) && /\d/.test(value) && !repetitive;
  return wellMade ? 4 : 3;
}

export type PasswordStrengthState = {
  score: number;
  max: number;
  label: string;
  /** The general advice while the password is weak; empty otherwise. */
  tip: string;
  announcement: string;
};

export function usePasswordStrength(value: string, { announceDelay = 700 }: { announceDelay?: number } = {}): PasswordStrengthState {
  const state = useMemo(() => {
    const score = scorePassword(value);
    const label = LABELS[score];
    // Weak while the bars are red or orange.
    const tip = score > 0 && score < ACCEPTED_PASSWORD_SCORE ? WEAK_TIP : "";
    const announcement = score === 0 ? "" : [`Siła hasła: ${label.toLowerCase()}.`, tip].filter(Boolean).join(" ");

    return { score, max: BARS, label, tip, announcement };
  }, [value]);

  const [settled, setSettled] = useState("");

  // The live region only hears the text once typing pauses: until the timer
  // catches up with the current text, it holds nothing rather than stale text.
  useEffect(() => {
    if (state.announcement === "") return;
    const id = setTimeout(() => setSettled(state.announcement), announceDelay);
    return () => clearTimeout(id);
  }, [state.announcement, announceDelay]);

  return { ...state, announcement: settled === state.announcement ? settled : "" };
}

export type PasswordStrengthProps = {
  value: string;
  announceDelay?: number;
  className?: string;
};

/** The bars' colour for each score: red, orange, green, then a deeper green. */
const BAR_TONE = ["", "bg-red-500", "bg-orange-500", "bg-green-500", "bg-green-600"] as const;

export function PasswordStrength({ value, announceDelay = 700, className }: PasswordStrengthProps) {
  const { score, max, label, tip, announcement } = usePasswordStrength(value, { announceDelay });
  const reduced = useReducedMotion();

  return (
    <div className={cn("w-full", className)}>
      <div
        role="meter"
        aria-label="Siła hasła"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={score}
        aria-valuetext={label}
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: max }, (_, i) => (
          <div key={i} className="relative h-1.5 overflow-hidden rounded-[2px] bg-ash">
            <motion.span
              className={cn("absolute inset-0 origin-left rounded-[2px] transition-colors duration-300", BAR_TONE[score])}
              initial={false}
              animate={{ scaleX: i < score ? 1 : 0 }}
              transition={reduced ? INSTANT : { ...CELL, delay: i < score ? i * 0.03 : 0 }}
            />
          </div>
        ))}
      </div>

      {/* The tip fades in once something weak is typed and leaves at green;
          the announcement below carries the same advice to screen readers. */}
      {tip && (
        <motion.p
          key={tip}
          aria-hidden
          className="mt-2 text-xs leading-5 text-fog"
          initial={reduced ? false : { opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? INSTANT : CROSSFADE}
        >
          {tip}
        </motion.p>
      )}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

export default PasswordStrength;
