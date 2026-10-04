"use client";

import { Suspense, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * dub.co/contact/sales' form, as its live DOM sets it: a 24px-padded grid,
 * 14px medium labels with a red asterisk 8px above each field, fields with a
 * neutral-300 edge and a 6px radius, and a 40px "Send message" button that
 * stays grey and unpressable until every required field is filled, then
 * turns black.
 *
 * Examax has no mail backend yet, so sending opens the visitor's own mail
 * app with the message addressed to pomoc@examax.app and filled in. The
 * line under the button says so, and gives the address for anyone whose
 * mail app does not open.
 *
 * The support form adds a topic, so one form takes questions, problems,
 * account and payment matters and feedback alike.
 */

export const CONTACT_EMAIL = "pomoc@examax.app";

export type SupportTopic = "pytanie" | "problem" | "konto" | "platnosci" | "opinia";

const TOPICS: Array<{ key: SupportTopic; label: string }> = [
  { key: "pytanie", label: "Pytanie" },
  { key: "problem", label: "Zgłoszenie problemu" },
  { key: "konto", label: "Konto i logowanie" },
  { key: "platnosci", label: "Płatności" },
  { key: "opinia", label: "Opinia lub pomysł" },
];

const FIELD =
  "block w-full rounded-md border border-[#d4d4d4] bg-white px-3 py-2 text-sm text-charcoal placeholder:text-[#a3a3a3] focus:border-[#737373] focus:outline-none focus:ring-1 focus:ring-[#737373]";

const LABEL = "mb-2 block text-sm font-medium text-charcoal";

function Required() {
  return (
    <span className="text-[#dc2626]" aria-hidden>
      {" "}
      *
    </span>
  );
}

const valid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export function ContactForm({ kind, defaultTopic }: { kind: "sales" | "support"; defaultTopic?: SupportTopic }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState<SupportTopic>(defaultTopic ?? "pytanie");
  const [opened, setOpened] = useState(false);
  const ready = valid(email) && message.trim().length > 0;

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    const topicLabel = TOPICS.find((t) => t.key === topic)?.label ?? "";
    const subject = kind === "sales" ? "Examax dla szkoły — rozmowa z zespołem" : `Wsparcie Examax — ${topicLabel}`;
    const body = `${message.trim()}\n\n—\nOdpowiedz na: ${email.trim()}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form onSubmit={send} noValidate className="grid grid-cols-1 gap-6 p-6">
      {kind === "support" ? (
        <fieldset>
          <legend className={LABEL}>
            Temat
            <Required />
          </legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-charcoal has-[:focus-visible]:ring-offset-2",
                  topic === option.key ? "border-charcoal bg-white font-medium text-charcoal ring-1 ring-charcoal" : "border-ash bg-white text-steel hover:bg-canvas-muted",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-topic`}
                  value={option.key}
                  checked={topic === option.key}
                  onChange={() => setTopic(option.key)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div>
        <label htmlFor={`${id}-email`} className={LABEL}>
          {kind === "sales" ? "E-mail służbowy" : "Adres e-mail"}
          <Required />
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={kind === "sales" ? "dyrekcja@szkola.edu.pl" : "ala.nowak@gmail.com"}
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={LABEL}>
          {kind === "sales" ? "W czym możemy pomóc?" : "Wiadomość"}
          <Required />
        </label>
        <textarea
          id={`${id}-message`}
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={
            kind === "sales"
              ? "Opowiedz nam o swojej szkole lub klasie i o tym, czego potrzebujecie"
              : topic === "problem"
                ? "Co się stało? Jeśli to błąd w zadaniu, podaj arkusz i numer zadania"
                : "Napisz, w czym możemy pomóc"
          }
          className={cn(FIELD, "min-h-[118px] resize-y")}
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!ready}
          className={cn(
            "focus-ring flex h-10 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm transition-all",
            ready ? "cursor-pointer border-black bg-black font-medium text-white hover:ring-4 hover:ring-ash" : "cursor-not-allowed border-ash bg-paper-mist text-fog",
          )}
        >
          Wyślij wiadomość
        </button>
        <p className="text-[13px] text-fog" aria-live="polite">
          {opened ? (
            <span className="inline-flex items-center gap-1.5 text-[#15803d]">
              <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
              Otworzyliśmy Twój program pocztowy z gotową wiadomością. Nic się nie otworzyło? Napisz na{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              .
            </span>
          ) : (
            <>
              Wiadomość otworzy się w Twoim programie pocztowym, zaadresowana do{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-steel underline underline-offset-2 hover:text-charcoal">
                {CONTACT_EMAIL}
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
}

const TOPIC_KEYS = TOPICS.map((t) => t.key);

/** The support form with its topic taken from `?temat=`, read in the browser so the page itself stays static. */
function SupportFormFromQuery() {
  const temat = useSearchParams().get("temat");
  const topic = TOPIC_KEYS.find((key) => key === temat);
  return <ContactForm key={topic ?? "none"} kind="support" defaultTopic={topic} />;
}

export function SupportForm() {
  return (
    <Suspense fallback={<ContactForm kind="support" />}>
      <SupportFormFromQuery />
    </Suspense>
  );
}
