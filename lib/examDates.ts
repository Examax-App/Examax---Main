/**
 * Likely first days of the May 2027 CKE session. Deliberately approximate —
 * every surface that shows these carries an "orientacyjne" footnote; the
 * exact timetable is announced by CKE.
 */
export const MATURA_DATE = new Date(2027, 4, 4);
export const E8_DATE = new Date(2027, 4, 11);

export function daysUntil(target: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000));
}
