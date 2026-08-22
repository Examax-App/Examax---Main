"use client";

import { useState } from "react";
import {
  BarChart3,
  Bot,
  FileText,
  Gauge,
  LifeBuoy,
  PencilLine,
  RefreshCcw,
  Route,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Plan = {
  name: string;
  monthly: number;
  description: string;
  cta: string;
  ctaVariant: "primary" | "outline";
  bestValue?: boolean;
  featuresHeading: string;
  features: Array<{ icon: LucideIcon; label: string }>;
};

const plans: Plan[] = [
  {
    name: "Darmowy",
    monthly: 0,
    description: "Na start i do codziennego treningu — bez karty, bez zobowiązań",
    cta: "Załóż darmowe konto",
    ctaVariant: "outline",
    featuresHeading: "W planie darmowym:",
    features: [
      { icon: Route, label: "Roadmapa dla jednego przedmiotu" },
      { icon: PencilLine, label: "20 zadań treningu dziennie" },
      { icon: FileText, label: "Wybrane arkusze CKE" },
      { icon: Bot, label: "Rozmowy z agentem (limit dzienny)" },
      { icon: BarChart3, label: "Podstawowe postępy" },
    ],
  },
  {
    name: "Premium",
    monthly: 29,
    description: "Pełny system przygotowań — od pierwszego tematu do egzaminu",
    cta: "Wybierz Premium",
    ctaVariant: "primary",
    bestValue: true,
    featuresHeading: "Wszystko z Darmowego, plus:",
    features: [
      { icon: Route, label: "Roadmapy wszystkich przedmiotów" },
      { icon: PencilLine, label: "Trening bez limitów" },
      { icon: FileText, label: "Pełna baza arkuszy CKE" },
      { icon: Bot, label: "Agent Examax bez limitu" },
      { icon: Gauge, label: "Wskaźnik gotowości i pełna analityka" },
      { icon: RefreshCcw, label: "Inteligentne powtórki" },
      { icon: Timer, label: "Symulacje egzaminu (wkrótce)" },
      { icon: LifeBuoy, label: "Priorytetowa pomoc" },
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="cennik"
      aria-labelledby="pricing-heading"
      className="border-t border-ash bg-white"
    >
      <Container className="py-24">
        <Reveal>
          <h2
            id="pricing-heading"
            className="max-w-md font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none"
          >
            Prosty cennik na cały rok szkolny
          </h2>
          <p className="mt-5 max-w-md text-body-xl text-steel">
            Zacznij za darmo, bez podawania karty. Premium włączysz wtedy,
            kiedy poczujesz, że chcesz więcej.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-body text-fog">
              Ceny w złotówkach, z VAT. Subskrypcję anulujesz jednym kliknięciem.
            </p>

            <div className="flex items-center gap-1 rounded-full border border-ash p-1">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={cn(
                  "rounded-full px-4 py-2 text-body font-medium transition-colors",
                  !yearly
                    ? "border border-ash bg-white text-charcoal shadow-subtle"
                    : "text-steel hover:text-charcoal",
                )}
              >
                Miesięcznie
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-body font-medium transition-colors",
                  yearly
                    ? "border border-ash bg-white text-charcoal shadow-subtle"
                    : "text-steel hover:text-charcoal",
                )}
              >
                Rocznie
                <span className="rounded-full bg-sidebar-active px-2 py-0.5 text-[11px] font-medium text-lavender">
                  2 miesiące gratis
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 60} className="h-full">
              <article
                aria-label={`Plan ${plan.name}`}
                className="flex h-full flex-col rounded-largecards border border-ash bg-[#fafafa] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-center gap-2.5">
                  <h3 className="text-heading-sm font-medium text-charcoal">
                    {plan.name}
                  </h3>
                  {plan.bestValue ? (
                    <span className="rounded-full bg-[#ece2fb] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-lavender">
                      Najczęściej wybierany
                    </span>
                  ) : null}
                </div>

                <p className="mt-1.5 text-body-lg">
                  <span className="font-medium text-charcoal">
                    {yearly && plan.monthly > 0
                      ? Math.round(plan.monthly * (10 / 12))
                      : plan.monthly}{" "}
                    zł
                  </span>{" "}
                  <span className="text-fog">
                    miesięcznie
                    {yearly && plan.monthly > 0 ? ", przy płatności rocznej" : ""}
                  </span>
                </p>

                <p className="mt-5 text-body-lg text-steel">{plan.description}</p>

                <Button
                  href="#"
                  variant={plan.ctaVariant}
                  className="mt-6 w-full"
                >
                  {plan.cta}
                </Button>

                <div className="mt-8 border-t border-ash pt-6">
                  <p className="text-body-lg font-semibold text-charcoal">
                    {plan.featuresHeading}
                  </p>
                  <ul className="mt-4 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.label}
                        className="flex items-center gap-2.5 text-body-lg text-slate"
                      >
                        <feature.icon
                          className="size-4 shrink-0 text-steel"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                        <span className="underline-dotted">{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
