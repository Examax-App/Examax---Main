import { useCurrentFrame } from "remotion";
import { ArrowUp, Sparkles } from "lucide-react";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { ramp } from "@/components/hero-film/motion";
import { V } from "@/components/simulation/math";
import { BEATS, SCENES, TYPING, typed, typedEnd } from "@/components/launch-film/timeline";
import { Bubble } from "@/components/launch-film/pieces";
import { Caret, Card, Headline, Pointer, Scene, Words, bob, pointerAt, useArrival } from "@/components/launch-film/parts";

/*
 * 24–34 s. Dub's "Ask AI" sequence — a question typed into a box, the answer
 * arriving — as a lesson with Korepetytor AI. The learner is stuck on
 * Zadanie 10 of the same paper (3(2x² + 1) < 11x); the tutor gives the first
 * step and hands the next one back, the learner picks it, works Δ = 49, and
 * the tutor confirms and sends them on. It never solves the task for them.
 */

/** Words of a streamed reply visible `frame` frames after it starts, two frames a word. */
function streamed(text: string, frame: number, start: number): string {
  const words = text.split(" ");
  const count = Math.max(0, Math.floor((frame - start) / 2) + 1);
  return words.slice(0, Math.min(words.length, count)).join(" ");
}

const FIRST_REPLY = "Zacznij od przeniesienia wszystkiego na jedną stronę. Co policzysz teraz?";
const SECOND_REPLY = "Dokładnie tak. √Δ = 7 — teraz policz oba pierwiastki.";

export function Tutor() {
  const frame = useCurrentFrame();
  const window = useArrival(6);
  const question = typed(TYPING.question, frame);
  const sent = frame >= BEATS.tutorSend;
  const thinking = frame >= BEATS.tutorSend + 6 && frame < BEATS.tutorSend + 26;
  const replyStart = BEATS.tutorSend + 26;
  const choicesAt = replyStart + 34;
  const choices = ramp(frame, choicesAt, 12);
  const picked = frame >= BEATS.tutorChoice;
  const pointer = pointerAt(frame, [
    { at: choicesAt + 10, x: 1500, y: 1020 },
    { at: BEATS.tutorChoice - 4, x: 654, y: 826 },
    { at: BEATS.tutorChoice, x: 654, y: 826, click: true },
    { at: BEATS.tutorChoice + 24, x: 760, y: 900 },
  ]);

  return (
    <Scene frames={SCENES.tutor.frames}>
      <Headline top={64} className="text-[84px]">
        <Words text="Korepetytor AI tłumaczy krok po kroku" at={4} step={4} />
        <br />
        <Words text="— ale rozwiązujesz Ty" at={BEATS.tutorChoice - 30} step={4} from="#e5e5e5" to="#a3a3a3" />
      </Headline>

      <div className="absolute left-1/2 top-[300px]" style={{ perspective: 2400 }}>
        <Card
          className="relative h-[730px] w-[1240px] overflow-hidden"
          style={{ transform: `translateX(-50%) translateY(${(1 - window) * 220 + bob(frame, 4)}px) rotateX(${3 + (1 - window) * 18}deg)`, opacity: Math.min(1, window * 1.4) }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ash px-9 py-6">
            <span className="flex items-center gap-4 text-[26px] font-semibold">
              <span className="grid size-12 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#ede9fe,#dbeafe)] text-lavender">
                <Sparkles className="size-6" strokeWidth={2} />
              </span>
              Korepetytor AI
            </span>
            <span className="flex items-center gap-3 rounded-[12px] bg-paper-mist px-4 py-2 text-[20px] text-steel">
              <MaturaIcon className="h-6 w-8" />
              Matura 2025 · Zadanie 10
            </span>
          </div>

          {/* Conversation */}
          <div className="absolute inset-x-0 bottom-[132px] top-[100px] overflow-hidden [mask-image:linear-gradient(transparent,black_14%)]">
            {/* Anchored to the bottom, so older messages rise out of view as new ones arrive */}
            <div className="absolute inset-x-9 bottom-6 flex flex-col gap-6">
              {sent ? (
                <Bubble from="learner" style={{ opacity: ramp(frame, BEATS.tutorSend, 8) }}>
                  {TYPING.question.text}
                </Bubble>
              ) : null}
              {thinking ? (
                <Bubble from="tutor">
                  <span className="flex gap-2 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-3 rounded-full bg-silver" style={{ opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame / 6) + i)) }} />
                    ))}
                  </span>
                </Bubble>
              ) : null}
              {frame >= replyStart ? (
                <Bubble from="tutor">
                  <p>{streamed(FIRST_REPLY, frame, replyStart)}</p>
                  <p
                    className="mt-3 rounded-[12px] border border-ash bg-white px-5 py-3 font-serif text-[30px] italic text-[#1e3a8a]"
                    style={{ opacity: ramp(frame, replyStart + 16, 10) }}
                  >
                    6<V>x</V>
                    <sup className="text-[0.6em]">2</sup> − 11<V>x</V> + 3 &lt; 0
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-[22px]" style={{ opacity: choices, transform: `translateY(${(1 - choices) * 10}px)` }}>
                    <span className="text-fog">Twój ruch:</span>
                    {["Policz Δ", "Wyciągnij x", "Nie wiem"].map((choice, i) => (
                      <span
                        key={choice}
                        className={
                          i === 0 && picked
                            ? "rounded-full border-2 border-lavender bg-soft-violet px-5 py-2 font-medium text-lavender"
                            : "rounded-full border-2 border-ash bg-white px-5 py-2 font-medium text-slate"
                        }
                      >
                        {choice}
                      </span>
                    ))}
                  </div>
                </Bubble>
              ) : null}
              {picked ? (
                <Bubble from="learner" style={{ opacity: ramp(frame, BEATS.tutorChoice + 6, 8) }}>
                  Δ = 121 − 72 = 49
                </Bubble>
              ) : null}
              {frame >= BEATS.tutorReply ? <Bubble from="tutor">{streamed(SECOND_REPLY, frame, BEATS.tutorReply)}</Bubble> : null}
            </div>
          </div>

          {/* Composer */}
          <div className="absolute inset-x-9 bottom-8 flex h-[84px] items-center gap-4 rounded-[20px] border border-ash bg-white px-6 shadow-[0_6px_20px_-10px_rgba(0,0,0,0.15)]">
            <Sparkles className="size-7 text-lavender" strokeWidth={2} />
            <span className="flex-1 text-[26px]">
              {sent ? <span className="text-silver">Zapytaj Korepetytora AI…</span> : question}
              {!sent && frame >= TYPING.question.at ? <Caret className="text-charcoal" /> : null}
              {!sent && frame < TYPING.question.at ? <span className="text-silver">Zapytaj Korepetytora AI…</span> : null}
            </span>
            <span
              className="grid size-12 place-items-center rounded-full bg-charcoal text-white"
              style={{ transform: `scale(${frame >= BEATS.tutorSend - 2 && frame < BEATS.tutorSend + 6 ? 0.88 : 1})`, opacity: frame >= typedEnd(TYPING.question) - 6 ? 1 : 0.3 }}
            >
              <ArrowUp className="size-6" strokeWidth={2.5} />
            </span>
          </div>
        </Card>
      </div>
      <Pointer {...pointer} />
    </Scene>
  );
}
