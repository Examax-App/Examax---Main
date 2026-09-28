import type { Accent } from "@/components/ui/FeaturePill";

/**
 * The palette token behind each accent, for the glow helpers below.
 *
 * Lives here rather than beside a call site because every surface that lights
 * up on hover needs it and they must not drift apart.
 */
export const ACCENT_VAR: Record<Accent, string> = {
  blue: "var(--color-electric-blue)",
  green: "var(--color-vivid-green)",
  lavender: "var(--color-lavender)",
  sapphire: "var(--color-deep-sapphire)",
  tangerine: "var(--color-tangerine)",
  yellow: "#eab308",
};

/**
 * The reference's card hover light.
 *
 * Lifted from dub.co's own Product dropdown (styles read off the live DOM in
 * `DesignRules/dom-captures/productHoverSample.html`): every card carries a
 * `pointer-events: none` layer at `inset: 0` painting
 * `radial-gradient(circle at 50% 100%, <accent>, transparent)`,
 * held at 0.07 opacity at rest and brightened on hover over 150ms with
 * `cubic-bezier(0.4, 0, 0.2, 1)`.
 *
 * Keeping both halves here is what stops the navbar's feature cards and the
 * pricing tiers from drifting apart — they are the same interaction, and only
 * the accent differs. The layer sits at `-z-10` inside an `isolate`d card, so
 * it paints over the card's surface but under its content.
 *
 * DESIGN.md reserves decorative gradients for brand visuals; this is the same
 * documented liberty already taken by the navbar's HOVER_GLOW, and it is what
 * the reference itself does.
 */
export function bottomGlow(color: string): string {
  return `radial-gradient(circle at 50% 100%, ${color}, transparent 72%)`;
}

/**
 * Classes for a {@link bottomGlow} layer. The card above it must be a `group`
 * and must establish a stacking context (`relative isolate`).
 *
 * Opacity lives in classes rather than inline style so `group-hover` can win —
 * an inline `opacity` would outrank it.
 */
export const GLOW_LAYER =
  "pointer-events-none absolute inset-0 -z-10 opacity-[0.07] transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-[0.16] motion-reduce:transition-none";


/**
 * A heavier {@link GLOW_LAYER}, for tints that carry no hue.
 *
 * An achromatic wash is pure luminance: at the opacities above it settles into
 * haze rather than depth, which is why an ink tint reads as flat next to a
 * violet one at the same strength. Roughly double the opacity is what it takes
 * for near-black to land as weight — the tint a top tier wants.
 */
export const GLOW_LAYER_DEEP =
  "pointer-events-none absolute inset-0 -z-10 opacity-[0.15] transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-[0.26] motion-reduce:transition-none";

/**
 * A grounded variant of {@link bottomGlow}, for tints that would otherwise
 * spread over the whole surface: an achromatic wash at {@link GLOW_LAYER_DEEP}
 * strength, or any hue on a card tall enough that a farthest-corner circle
 * reaches the top of it — the navbar's square feature cards, for one.
 *
 * The circle above is sized farthest-corner, so on a tall card it reaches most
 * of the way up. That is right for a hue at 7% and wrong for near-black at
 * twice that: the tint stops reading as a light on the bottom edge and starts
 * reading as the whole card having gone grey, which takes the feature list
 * down with it. A wide, shallow ellipse keeps the same weight where it belongs
 * — pooled at the base, clear of the copy.
 */
export function baseGlow(color: string): string {
  return `radial-gradient(ellipse 120% 46% at 50% 100%, ${color}, transparent 72%)`;
}
