/**
 * Floating onboarding pill pinned to the sheet's bottom-right corner
 * (reference: "Complete setup" with a progress ring).
 */
export function SetupPill() {
  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2.5 rounded-full bg-midnight-ink px-4 py-2.5 text-body font-medium text-white shadow-md transition-transform duration-200 hover:scale-[1.02]"
    >
      Dokończ konfigurację
      <svg viewBox="0 0 20 20" className="size-4.5" aria-hidden>
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2.5"
        />
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="50.3"
          strokeDashoffset="37.7"
          transform="rotate(-90 10 10)"
        />
      </svg>
    </button>
  );
}
