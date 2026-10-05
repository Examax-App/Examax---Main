/*
 * Fixed-window counters kept in this server instance's memory, for routes
 * that must not be hammered (the contact form). On Vercel, Fluid Compute
 * reuses an instance across requests, so this stops a burst from one
 * sender; it is not a global count across instances or deploys. A Vercel
 * Firewall rate-limit rule on the same path, or a shared store such as
 * Redis, is the durable layer on top.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Drop expired windows so the map cannot grow without bound. */
function prune(now: number) {
  for (const [key, window] of windows) if (window.resetAt <= now) windows.delete(key);
}

export type Limit = { key: string; max: number; windowMs: number };

/**
 * Counts one hit against every limit, or none if any is already full (so a
 * refused request does not use up the others). Returns the seconds until
 * the fullest one opens again.
 */
export function take(limits: Limit[], now = Date.now()): { ok: true } | { ok: false; retryAfter: number } {
  if (windows.size > 10_000) prune(now);

  const current = limits.map((limit) => {
    const window = windows.get(limit.key);
    return window && window.resetAt > now ? window : { count: 0, resetAt: now + limit.windowMs };
  });

  const full = current.filter((window, i) => window.count >= limits[i].max);
  if (full.length) {
    const retryAfter = Math.max(...full.map((window) => window.resetAt - now));
    return { ok: false, retryAfter: Math.ceil(retryAfter / 1000) };
  }

  current.forEach((window, i) => windows.set(limits[i].key, { count: window.count + 1, resetAt: window.resetAt }));
  return { ok: true };
}
