import { Check } from "lucide-react";
import { Frac, Radical, V } from "@/components/simulation/math";
import { SITTING } from "@/components/simulation/sitting";

/*
 * The finished sheet in /simulation's hero card, on its own so the launch
 * film (components/launch-film) can show the same page without pulling in
 * the hero around it.
 */

/** The student's pen: CKE allows black or blue ink; the sheet is written in blue. */
const INK = "text-[#1e3a8a]";

/** One rubric point awarded in the marking column, level with the line that earned it. */
function Mark({ top }: { top: number }) {
  return (
    <span className="absolute right-0 flex items-center gap-0.5 text-[9px] font-semibold text-[#15803d]" style={{ top }}>
      <Check className="size-2.5" strokeWidth={3} />
      +1
    </span>
  );
}

/**
 * Zadanie 10 of MMAP-P0_100 (CKE, May 2025), as the sheet looks once handed
 * in: the printed task, the working in ink on the squared grid — standard
 * form, Δ, both roots, the sketch and the answer, as in CKE's model
 * solution — and the marker's column, one point for the roots and one for
 * the answer.
 */
export function FinishedSheet() {
  return (
    <div aria-hidden inert className="absolute inset-0 select-none px-4 pt-3 text-left text-charcoal">
      <div className="flex items-center justify-between border-b border-ash pb-1.5 text-[8.5px] text-silver">
        <span>{SITTING.code}</span>
        <span>Strona 10 z {SITTING.tasks}</span>
      </div>
      <div className="mt-2.5 flex items-start justify-between">
        <p className="text-[11px] font-semibold">Zadanie 10. (0–2)</p>
        <span className="flex items-center gap-1 rounded-[5px] bg-[#dcfce7] px-1.5 py-0.5 text-[9px] font-semibold text-[#166534]">
          <Check className="size-2.5" strokeWidth={3} />2 / 2 pkt
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-[16px] text-slate">
        Rozwiąż nierówność 3(2<V>x</V>
        <sup className="text-[0.65em]">2</sup> + 1) &lt; 11<V>x</V>. Zapisz obliczenia.
      </p>

      {/* The squared grid, as CKE prints it for the working, and the marking column beside it */}
      <div className="relative mt-2 h-[188px] pr-7">
        <div className="absolute inset-y-0 left-0 right-7 rounded-[3px] border border-[#dbeafe] bg-[linear-gradient(#e0ecff_1px,transparent_1px),linear-gradient(90deg,#e0ecff_1px,transparent_1px)] bg-[size:9px_9px]" />
        <div className="absolute inset-y-0 right-6 border-l border-dashed border-[#fca5a5]" />

        <div className={`relative space-y-[3px] px-2 pt-1.5 text-[11.5px] italic leading-[18px] ${INK}`}>
          <p>
            6<V>x</V>
            <sup className="text-[0.65em]">2</sup> − 11<V>x</V> + 3 &lt; 0
          </p>
          <p className="flex items-center gap-2">
            <span>Δ = 121 − 72 = 49,</span>
            <span className="inline-flex items-center">
              <Radical>Δ</Radical>&nbsp;= 7
            </span>
          </p>
          <p className="flex items-center gap-3 pt-0.5">
            <span className="inline-flex items-center">
              <V>x</V>
              <sub className="text-[0.65em]">1</sub>&nbsp;=&nbsp;
              <Frac n="11 − 7" d="12" />
              &nbsp;=&nbsp;
              <Frac n="1" d="3" />
            </span>
            <span className="inline-flex items-center">
              <V>x</V>
              <sub className="text-[0.65em]">2</sub>&nbsp;=&nbsp;
              <Frac n="11 + 7" d="12" />
              &nbsp;=&nbsp;
              <Frac n="3" d="2" />
            </span>
          </p>
        </div>

        {/* The sketch: an upward parabola through 1/3 and 3/2, the part under the axis traced over */}
        <svg viewBox="0 0 160 64" className="absolute left-3 top-[90px] h-14 w-36 overflow-visible" fill="none">
          <path d="M4 46H150" className="stroke-[#1e3a8a]" strokeWidth="1" strokeLinecap="round" />
          <path d="M146 43l5 3-5 3" className="stroke-[#1e3a8a]" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 4C40 74 104 74 124 4" className="stroke-[#1e3a8a]" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M33.5 46H110.5" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="33.5" cy="46" r="2.4" fill="white" stroke="#2563eb" strokeWidth="1.2" />
          <circle cx="110.5" cy="46" r="2.4" fill="white" stroke="#2563eb" strokeWidth="1.2" />
          <text x="29" y="60" className="fill-[#1e3a8a] text-[8px] italic">1/3</text>
          <text x="106" y="60" className="fill-[#1e3a8a] text-[8px] italic">3/2</text>
        </svg>

        <p className={`absolute left-2 top-[150px] inline-flex items-center rounded-[3px] border border-[#1e3a8a]/60 px-1.5 text-[11.5px] italic leading-[22px] ${INK}`}>
          <V>x</V>&nbsp;∈&nbsp;
          <span className="inline-flex items-center">
            (<Frac n="1" d="3" />,&nbsp;
            <Frac n="3" d="2" />)
          </span>
        </p>

        <Mark top={52} />
        <Mark top={155} />
      </div>
    </div>
  );
}
