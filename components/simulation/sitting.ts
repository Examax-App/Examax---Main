/*
 * One sitting, shared by the landing's simulation film and every picture on
 * /simulation, so the reel and the page describe the same afternoon: the May
 * 2025 basic-level maths paper (CKE's MMAP-P0_100: 31 tasks, 50 points,
 * 180 minutes from 9:00 — all off the paper's cover), handed in after
 * 141 minutes with 42 points.
 *
 * PLACEHOLDER DATA — the learner and her figures are illustrative; the
 * sheet, its length, its points and its time are CKE's.
 */

export const SITTING = {
  exam: "Matura 2025",
  subject: "Matematyka",
  level: "Poziom podstawowy",
  code: "MMAP-P0_100",
  tasks: 31,
  max: 50,
  examMinutes: 180,
  score: 42,
  /** 42 of 50, rounded as the report shows it. */
  percent: 84,
  minutes: 141,
  passMark: 0.3,
  metrics: [
    { label: "Wynik", color: "#60a5fa", from: " 0", to: "42", unit: "/ 50 pkt" },
    { label: "Procent", color: "#fb923c", from: " 0%", to: "84%", unit: "" },
    { label: "Czas", color: "#a78bfa", from: "  0", to: "141", unit: "min" },
  ],
  /** Points collected, 0–1 of the 50, every six minutes or so; the three tasks left for last land at the end. */
  curve: [0, 0.03, 0.07, 0.11, 0.15, 0.2, 0.24, 0.28, 0.33, 0.37, 0.41, 0.43, 0.48, 0.52, 0.55, 0.59, 0.63, 0.66, 0.69, 0.72, 0.74, 0.76, 0.78, 42 / 50],
  pointsAxis: ["50", "25", "0"],
  timeTicks: ["0", "35 min", "70 min", "105 min", "141 min"],
  /** Minutes on each task, 1 to 31; together, the 141. */
  perTask: [3, 2, 3, 2, 4, 3, 3, 2, 4, 8, 3, 4, 3, 5, 3, 4, 5, 4, 3, 4, 4, 6, 5, 4, 5, 4, 9, 5, 6, 7, 14],
  minutesAxis: ["16", "8", "0"],
  minutesTop: 16,
};

/** The sheet in CKE's archive. */
export const CKE_SHEET_URL = "https://cke.gov.pl/egzamin-maturalny/egzamin-maturalny-w-formule-2023/arkusze/2025-2/";
