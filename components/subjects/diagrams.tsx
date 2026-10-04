import { Check, Play } from "lucide-react";
import { Frac, V } from "@/components/simulation/math";
import { cn } from "@/lib/cn";
import type { DiagramKey } from "@/components/subjects/types";

/*
 * The pictures in a subject page's featured carousel — one small, true
 * diagram per featured topic, in the card style of the site's other
 * pictures (white, hairline, a soft drop shadow). Each is drawn in its
 * subject's colour: maths blue, Polish green, English lavender. Every
 * figure on them is worked and checks out (the parabola's roots, the
 * discount, the 3-4-5 triangle, the sequence's fifth term, the periods'
 * dates, the conditionals' forms, the transformation).
 */

const BLUE = { line: "#2563eb", soft: "#dbeafe", mid: "#60a5fa" };
const GREEN = { line: "#16a34a", soft: "#dcfce7", mid: "#4ade80" };
const LAVENDER = { line: "#7c3aed", soft: "#ede9fe", mid: "#a78bfa" };

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-[380px] rounded-xl border border-ash bg-white p-5 shadow-[0_20px_20px_0_#00000017]", className)}>
      <p className="text-[13px] font-medium text-charcoal">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/* ── Maths ───────────────────────────────────────────────────────────────── */

/** f(x) = −(x − 3)² + 4: vertex (3, 4), roots 1 and 5. */
function Parabola() {
  const px = (x: number) => 30 + x * 46;
  const py = (y: number) => 150 - y * 26;
  const curve = Array.from({ length: 49 }, (_, i) => {
    const x = 0.6 + (i / 48) * 4.8;
    const y = -((x - 3) ** 2) + 4;
    return `${i === 0 ? "M" : "L"}${px(x).toFixed(1)} ${py(y).toFixed(1)}`;
  }).join(" ");
  return (
    <Card title="Postać kanoniczna">
      <svg viewBox="0 0 310 200" className="w-full" fill="none" aria-hidden>
        <path d={`M10 ${py(0)}H300M${px(0)} 190V12`} stroke="#d4d4d4" strokeWidth="1.2" />
        <path d={`M${px(3)} ${py(4)}V${py(0)}`} stroke={BLUE.mid} strokeWidth="1.2" strokeDasharray="4 4" />
        <path d={curve} stroke={BLUE.line} strokeWidth="2.5" strokeLinecap="round" />
        {[1, 5].map((x) => (
          <circle key={x} cx={px(x)} cy={py(0)} r="4.5" fill="white" stroke={BLUE.line} strokeWidth="2" />
        ))}
        <circle cx={px(3)} cy={py(4)} r="5" fill={BLUE.line} />
        <text x={px(3) + 10} y={py(4) - 6} fontSize="12" fill="#171717" fontWeight="500">W(3, 4)</text>
        <text x={px(1) + 9} y={py(0) - 8} fontSize="11" fill="#737373">x₁ = 1</text>
        <text x={px(5) - 9} y={py(0) - 8} fontSize="11" fill="#737373" textAnchor="end">x₂ = 5</text>
      </svg>
      <p className="mt-2 text-center text-[15px] text-charcoal">
        <V>f</V>(<V>x</V>) = −(<V>x</V> − 3)<sup>2</sup> + 4
      </p>
    </Card>
  );
}

function Percent() {
  return (
    <Card title="Obniżka o 15%">
      <div className="space-y-3">
        {[
          { label: "Przed obniżką", value: "200 zł", width: "100%", color: BLUE.soft, text: "#1e3a8a" },
          { label: "Po obniżce", value: "170 zł", width: "85%", color: BLUE.mid, text: "#1e3a8a" },
        ].map((bar) => (
          <div key={bar.label}>
            <p className="mb-1 flex justify-between text-[11.5px] text-fog">
              {bar.label}
              <span className="font-medium tabular-nums text-charcoal">{bar.value}</span>
            </p>
            <div className="h-7 rounded-md bg-paper-mist">
              <div className="h-full rounded-md" style={{ width: bar.width, background: bar.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <span className="rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-[#1d4ed8]">−15% = −30 zł</span>
      </div>
      <p className="mt-3 border-t border-ash pt-3 text-center text-[15px] tabular-nums text-charcoal">200 zł · 0,85 = 170 zł</p>
    </Card>
  );
}

function Trig() {
  return (
    <Card title="Funkcje kąta ostrego">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 170 130" className="w-[58%] shrink-0" fill="none" aria-hidden>
          <path d="M14 112H150V18Z" fill={BLUE.soft} stroke={BLUE.line} strokeWidth="2" strokeLinejoin="round" />
          <path d="M138 112V100H150" stroke={BLUE.line} strokeWidth="1.4" />
          <path d="M44 112A30 30 0 0 0 38.7 95.3" stroke="#171717" strokeWidth="1.4" />
          <text x="48" y="106" fontSize="12" fill="#171717" fontStyle="italic">α</text>
          <text x="156" y="70" fontSize="13" fill="#171717" fontStyle="italic">a</text>
          <text x="80" y="126" fontSize="13" fill="#171717" fontStyle="italic">b</text>
          <text x="70" y="56" fontSize="13" fill="#171717" fontStyle="italic">c</text>
        </svg>
        <div className="space-y-2 text-[14px] text-charcoal">
          <p>
            sin α = <Frac n={<V>a</V>} d={<V>c</V>} />
          </p>
          <p>
            cos α = <Frac n={<V>b</V>} d={<V>c</V>} />
          </p>
          <p>
            tg α = <Frac n={<V>a</V>} d={<V>b</V>} />
          </p>
        </div>
      </div>
    </Card>
  );
}

/** The 3-4-5 triangle with a square on each side: 9 + 16 = 25. */
function Pythagoras() {
  return (
    <Card title="Trójkąt 3 · 4 · 5">
      <div className="flex items-center gap-4">
        <svg viewBox="30 10 230 255" className="w-[52%] shrink-0" fill="none" aria-hidden>
          <path d="M34 104H100V170H34Z" fill={BLUE.soft} stroke={BLUE.mid} strokeWidth="1.5" />
          <path d="M100 170H188V258H100Z" fill={BLUE.soft} stroke={BLUE.mid} strokeWidth="1.5" />
          <path d="M100 104L188 170L254 82L166 16Z" fill="#bfdbfe" stroke={BLUE.mid} strokeWidth="1.5" />
          <path d="M100 104V170H188Z" fill="white" stroke={BLUE.line} strokeWidth="2" strokeLinejoin="round" />
          <path d="M100 160H110V170" stroke={BLUE.line} strokeWidth="1.2" />
          <text x="67" y="142" fontSize="16" fontWeight="600" fill="#1e3a8a" textAnchor="middle">9</text>
          <text x="144" y="219" fontSize="16" fontWeight="600" fill="#1e3a8a" textAnchor="middle">16</text>
          <text x="177" y="98" fontSize="16" fontWeight="600" fill="#1e3a8a" textAnchor="middle">25</text>
        </svg>
        <div className="space-y-1.5 text-[14px] text-charcoal">
          <p>
            <V>a</V>
            <sup>2</sup> + <V>b</V>
            <sup>2</sup> = <V>c</V>
            <sup>2</sup>
          </p>
          <p className="tabular-nums text-steel">
            3<sup>2</sup> + 4<sup>2</sup> = 5<sup>2</sup>
          </p>
          <p className="tabular-nums text-steel">9 + 16 = 25</p>
        </div>
      </div>
    </Card>
  );
}

/** a₁ = 2, r = 3: 2, 5, 8, 11, 14. */
function Sequence() {
  const terms = [2, 5, 8, 11, 14];
  return (
    <Card title="Ciąg arytmetyczny, r = 3">
      <div className="flex h-[132px] items-end justify-between gap-2 border-b border-ash px-1">
        {terms.map((term, i) => (
          <div key={term} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[12px] font-medium tabular-nums text-charcoal">{term}</span>
            <div className="w-full rounded-t-md" style={{ height: term * 7.5, background: i === terms.length - 1 ? BLUE.line : BLUE.mid }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between px-1 text-[11px] text-fog">
        {terms.map((_, i) => (
          <span key={i} className="flex-1 text-center">
            <V>a</V>
            <sub>{i + 1}</sub>
          </span>
        ))}
      </div>
      <p className="mt-3 border-t border-ash pt-3 text-center text-[14px] text-charcoal">
        <V>a</V>
        <sub>5</sub> = 2 + 4 · 3 = 14
      </p>
    </Card>
  );
}

/* ── Polish ──────────────────────────────────────────────────────────────── */

function Essay() {
  const parts = [
    { name: "Wstęp", tag: "teza", lines: [90, 60] },
    { name: "Argument 1", tag: "przykład z lektury", lines: [100, 80, 45] },
    { name: "Argument 2", tag: "kontekst", lines: [95, 70] },
    { name: "Zakończenie", tag: "wniosek", lines: [80] },
  ];
  return (
    <Card title="Kompozycja wypracowania">
      <div className="space-y-2.5">
        {parts.map((part) => (
          <div key={part.name} className="flex gap-3 rounded-lg border border-ash p-2.5">
            <span className="w-1 shrink-0 rounded-full" style={{ background: GREEN.mid }} />
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between text-[12px] font-medium text-charcoal">
                {part.name}
                <span className="rounded-[4px] px-1.5 py-px text-[10.5px] font-medium" style={{ background: GREEN.soft, color: "#166534" }}>
                  {part.tag}
                </span>
              </p>
              <div className="mt-1.5 space-y-1">
                {part.lines.map((w, i) => (
                  <span key={i} className="block h-1 rounded-full bg-paper-mist" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Polish Romanticism: 1822 (Ballady i romanse) to 1863 (the January Uprising). */
function Epochs() {
  return (
    <Card title="Romantyzm na osi czasu">
      <div className="flex h-10 overflow-hidden rounded-lg text-[11.5px] font-medium">
        <span className="grid w-[28%] place-items-center bg-paper-mist text-steel">Oświecenie</span>
        <span className="grid flex-1 place-items-center text-white" style={{ background: GREEN.line }}>
          Romantyzm
        </span>
        <span className="grid w-[26%] place-items-center bg-paper-mist text-steel">Pozytywizm</span>
      </div>
      <div className="relative mt-1.5 flex h-4 text-[11px] tabular-nums text-fog">
        <span className="absolute left-[28%] -translate-x-1/2">1822</span>
        <span className="absolute left-[74%] -translate-x-1/2">1863</span>
      </div>
      <div className="mt-3 space-y-1.5 text-[12px] text-steel">
        <p>
          <span className="font-medium text-charcoal">1822</span> — „Ballady i romanse” Mickiewicza
        </p>
        <p>
          <span className="font-medium text-charcoal">1863</span> — powstanie styczniowe
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["bohater romantyczny", "świat duchów", "bunt jednostki", "mesjanizm"].map((motif) => (
          <span key={motif} className="rounded-md border border-ash px-2 py-0.5 text-[11.5px] text-charcoal">
            {motif}
          </span>
        ))}
      </div>
    </Card>
  );
}

function Devices() {
  const mark = (text: string, label: string) => (
    <span className="relative inline-flex flex-col items-center">
      <span className="rounded-[4px] px-0.5" style={{ background: GREEN.soft, boxShadow: `inset 0 -2px 0 ${GREEN.mid}` }}>
        {text}
      </span>
      <span className="mt-1 text-[10.5px] font-medium" style={{ color: "#166534" }}>
        {label}
      </span>
    </span>
  );
  return (
    <Card title="Środki w jednym zdaniu">
      <p className="flex flex-wrap items-start gap-x-1.5 gap-y-2 text-[15px] leading-6 text-charcoal">
        {mark("Złote", "epitet")} słońce {mark("tonęło", "metafora")} w morzu{" "}
        <span className="inline-flex items-start">
          {mark("jak rozżarzona moneta", "porównanie")}.
        </span>
      </p>
      <p className="mt-5 border-t border-ash pt-3 text-[12px] text-fog">Nazwij środek i powiedz, co wnosi do opisu.</p>
    </Card>
  );
}

function Reading() {
  return (
    <Card title="Tekst i pytanie">
      <div className="space-y-1.5 rounded-lg bg-paper-mist p-3">
        {[100, 92, 96].map((w, i) => (
          <span key={i} className="block h-1.5 rounded-full bg-ash" style={{ width: `${w}%` }} />
        ))}
        <p className="rounded-[4px] px-1 py-0.5 text-[12.5px] leading-5 text-charcoal" style={{ background: GREEN.soft, boxShadow: `inset 2px 0 0 ${GREEN.line}` }}>
          Czytania ze zrozumieniem uczymy się latami, a nie przed samym egzaminem.
        </p>
        {[88, 70].map((w, i) => (
          <span key={i} className="block h-1.5 rounded-full bg-ash" style={{ width: `${w}%` }} />
        ))}
      </div>
      <p className="mt-3 text-[12.5px] font-medium text-charcoal">Wskaż zdanie, w którym autor formułuje tezę.</p>
      <p className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: "#166534" }}>
        <Check className="size-3.5" strokeWidth={2.5} />
        Zaznaczone zdanie — tego stanowiska autor broni dalej.
      </p>
    </Card>
  );
}

function Commas() {
  const comma = (
    <span className="relative inline-block font-semibold" style={{ color: GREEN.line }}>
      ,
    </span>
  );
  return (
    <Card title="Gdzie stawiamy przecinek">
      <p className="text-center text-[17px] leading-8 text-charcoal">
        Wiem{comma} że zdążę{comma} jeśli wyjdę wcześniej.
      </p>
      <div className="mt-4 space-y-2 border-t border-ash pt-3 text-[12px] text-steel">
        <p className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-full text-[11px] font-semibold text-white" style={{ background: GREEN.line }}>
            1
          </span>
          przed „że” — zaczyna się zdanie podrzędne
        </p>
        <p className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-full text-[11px] font-semibold text-white" style={{ background: GREEN.line }}>
            2
          </span>
          przed „jeśli” — kolejne zdanie podrzędne
        </p>
      </div>
    </Card>
  );
}

/* ── English ─────────────────────────────────────────────────────────────── */

function Tenses() {
  return (
    <Card title="Past Simple czy Present Perfect?">
      <svg viewBox="0 0 320 110" className="w-full" fill="none" aria-hidden>
        <path d="M14 70H300" stroke="#d4d4d4" strokeWidth="1.5" />
        <path d="M294 64L302 70L294 76" stroke="#d4d4d4" strokeWidth="1.5" />
        <circle cx="110" cy="70" r="5" fill={LAVENDER.line} />
        <text x="110" y="92" fontSize="11" fill="#737373" textAnchor="middle">2023</text>
        <path d="M60 60C120 6 220 6 266 60" stroke={LAVENDER.mid} strokeWidth="2" strokeDasharray="5 4" />
        <circle cx="270" cy="70" r="5" fill="white" stroke={LAVENDER.line} strokeWidth="2" />
        <text x="270" y="92" fontSize="11" fill="#171717" fontWeight="500" textAnchor="middle">teraz</text>
      </svg>
      <div className="mt-1 space-y-2 text-[13px]">
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-charcoal">I visited London in 2023.</span>
          <span className="shrink-0 text-[11px] text-fog">konkretny moment</span>
        </p>
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-charcoal">I have visited London.</span>
          <span className="shrink-0 text-[11px] text-fog">ważne do teraz</span>
        </p>
      </div>
    </Card>
  );
}

const WAVE = [6, 12, 20, 9, 26, 18, 32, 14, 24, 10, 28, 22, 16, 30, 12, 20, 8, 24, 14, 18, 10, 22, 16, 8, 12];

function Listening() {
  return (
    <Card title="Rozumienie ze słuchu">
      <div className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ background: LAVENDER.line }}>
          <Play className="size-3.5 translate-x-px" fill="currentColor" strokeWidth={0} />
        </span>
        <div className="flex h-9 flex-1 items-center gap-[3px]">
          {WAVE.map((h, i) => (
            <span key={i} className="flex-1 rounded-full" style={{ height: h, background: i < 11 ? LAVENDER.line : "#e5e5e5" }} />
          ))}
        </div>
      </div>
      <p className="mt-4 text-[13px] font-medium text-charcoal">Where does the speaker want to go at the weekend?</p>
      <div className="mt-2 space-y-1.5">
        {["A. To the cinema.", "B. To the seaside.", "C. To a concert."].map((option, i) => (
          <p
            key={option}
            className={cn("flex items-center justify-between rounded-lg border px-3 py-1.5 text-[12.5px]", i === 1 ? "text-charcoal" : "border-ash text-steel")}
            style={i === 1 ? { borderColor: LAVENDER.mid, background: LAVENDER.soft } : undefined}
          >
            {option}
            {i === 1 ? <Check className="size-3.5" style={{ color: LAVENDER.line }} strokeWidth={2.5} /> : null}
          </p>
        ))}
      </div>
    </Card>
  );
}

function Email() {
  return (
    <Card title="E-mail · trzy punkty polecenia">
      <div className="rounded-lg border border-ash">
        <p className="border-b border-ash px-3 py-1.5 text-[11.5px] text-fog">
          Do: <span className="text-charcoal">Tom</span>
        </p>
        <p className="border-b border-ash px-3 py-1.5 text-[11.5px] text-fog">
          Temat: <span className="text-charcoal">Weekend plans</span>
        </p>
        <div className="space-y-1.5 px-3 py-3">
          <p className="text-[12px] text-charcoal">Hi Tom,</p>
          {[96, 84, 90, 62].map((w, i) => (
            <span key={i} className="block h-1.5 rounded-full bg-paper-mist" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Punkt 1", "Punkt 2", "Punkt 3"].map((point) => (
          <span key={point} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-medium" style={{ background: LAVENDER.soft, color: "#5b21b6" }}>
            <Check className="size-3" strokeWidth={2.5} />
            {point}
          </span>
        ))}
      </div>
    </Card>
  );
}

function Conditionals() {
  const rows = [
    { name: "Zero", ifPart: "present simple", result: "present simple" },
    { name: "First", ifPart: "present simple", result: "will + V" },
    { name: "Second", ifPart: "past simple", result: "would + V" },
    { name: "Third", ifPart: "past perfect", result: "would have + V3" },
  ];
  return (
    <Card title="Okresy warunkowe">
      <div className="overflow-hidden rounded-lg border border-ash text-[12px]">
        <div className="grid grid-cols-[64px_1fr_1fr] bg-paper-mist px-3 py-1.5 text-[11px] font-medium text-fog">
          <span />
          <span>if + …</span>
          <span>wynik</span>
        </div>
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[64px_1fr_1fr] items-center border-t border-ash px-3 py-2">
            <span className="font-medium" style={{ color: LAVENDER.line }}>
              {row.name}
            </span>
            <span className="text-charcoal">{row.ifPart}</span>
            <span className="text-charcoal">{row.result}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** "It's a pity I can't come." → "I wish I could come." */
function Transform() {
  return (
    <Card title="Transformacja zdania">
      <p className="rounded-lg bg-paper-mist px-3 py-2 text-[14px] text-charcoal">It&apos;s a pity I can&apos;t come.</p>
      <p className="my-2 text-center text-[13px] text-fog">↓</p>
      <p className="rounded-lg border border-ash px-3 py-2 text-[14px] text-charcoal">
        I wish I{" "}
        <span className="rounded-[5px] px-1.5 py-0.5 font-medium" style={{ background: LAVENDER.soft, color: "#5b21b6", boxShadow: `inset 0 -2px 0 ${LAVENDER.mid}` }}>
          could
        </span>{" "}
        come.
      </p>
      <p className="mt-4 border-t border-ash pt-3 text-[12px] text-fog">wish + past simple — żal dotyczący teraźniejszości</p>
    </Card>
  );
}

export const DIAGRAMS: Record<DiagramKey, () => React.ReactElement> = {
  parabola: Parabola,
  percent: Percent,
  trig: Trig,
  pythagoras: Pythagoras,
  sequence: Sequence,
  essay: Essay,
  epochs: Epochs,
  devices: Devices,
  reading: Reading,
  commas: Commas,
  tenses: Tenses,
  listening: Listening,
  email: Email,
  conditionals: Conditionals,
  transform: Transform,
};
