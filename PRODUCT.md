# PRODUCT.md

## Examax

Examax is a AI-powered exam preparation platform built specifically for Polish CKE examinations. The goal of becoming the best available tool for Polish students preparing for these exams.

This file describes **what the product is and why it exists**. For engineering conventions and how AI coding agents should work in this repository, see `CLAUDE.md` (Claude Code specific) and `AGENTS.md` (universal, for any AI coding agent).

---

## The Problem

Traditional exam preparation for Polish students relies on manual practice papers and disconnected study materials. This approach is slow, gives no personalized feedback, and leaves students without a clear answer to two basic questions:

- What do I actually know, and what am I weak at?
- What should I study next to get the best possible result?

Examax exists to answer those two questions continuously, for every student, automatically.

---

## Target Exams (MVP Scope)

Examax focuses on three official Polish CKE examinations:

- **Egzamin Ósmoklasisty** (8th grade exam)
- **Matura Podstawowa** (basic-level Matura)
- **Matura Rozszerzona** (extended-level Matura)

Each supported exam has its own independent roadmap and question bank. Vocational exams (*Egzaminy Zawodowe*) are explicitly out of scope for the MVP, though future expansion is possible.

---

## Core Product Vision

Examax is not a simple quiz app. It combines four things into one continuous experience:

1. **Official exam-style practice** — real, past-exam-format questions, organized by topic and difficulty.
2. **Structured learning** — a roadmap that guides a student from wherever they currently are to full exam readiness.
3. **An integrated AI assistant (the Examax Agent)** — available both as its own dedicated space and contextually throughout the app, to explain mistakes, answer questions, and adjust the student's plan.
4. **Continuous progress tracking** — every question answered feeds back into what the student is shown next.

The product should always be able to answer: *"What should this student learn next to get the best possible exam result?"*

---

## Main Sections

### Home / Dashboard
A personalized landing page after login, shown after a short onboarding flow. It always helps the student continue where they left off. Planned sections include:
- Welcome / greeting
- Continue Lesson / Continue Quiz
- Recommended Practice
- Exam Readiness (an overall readiness score across subjects)
- Progress overview
- AI recommendations
- Quick actions
- Recent activity

### Roadmap
A structured, tree-like learning path, one per supported exam. Roadmap nodes (e.g. Introduction → Exam Tips → Fractions → Percentages → Geometry → Algebra → …) are **never locked** — students can freely skip ahead. Each node tracks its own completion percentage independently.

A roadmap node is more than a quiz — it is a full learning module that can include: an introduction, explanation, worked examples, diagrams, interactive content, memory techniques, official CKE questions, AI explanations, and a completion summary. A student can complete the quiz portion first and skip the lesson if their performance shows they already know the material; completing either path (or both) can bring the node to 100%.

### Practice
Separate from the Roadmap — this is where a student freely practices any topic on demand (e.g. Fractions, Percentages, Geometry, Functions, Algebra) rather than following the guided path. It includes:
- Recommended quizzes and recently completed quizzes
- A **diagnostic quiz** — a first, broad-mix quiz that evaluates a student's overall knowledge; on completion, Examax recommends specific weak topics, next quizzes, and roadmap priorities.
- **Official Exam Simulations** (a premium feature) — full exam replicas with original timing, official structure, and a detailed performance breakdown afterward.

### Examax Agent
The platform's AI assistant. It is available both as a dedicated page (for full conversations and history) and contextually throughout the app — inside quizzes, lessons, the roadmap, and the dashboard. It can explain questions, answer study questions, help modify the student's roadmap, recommend next topics, explain mistakes, and provide general platform guidance.

---

## Navigation Structure

- **Home**
- **Practice**
- **Roadmap**
- **Examax Agent** (also globally accessible, not just its own tab)
- **Profile / Settings**

---

## Business Model & Pricing Philosophy

Examax is being built as a **real commercial product** with a tiered subscription model: **Free, Pro, Max, and Enterprise** (Enterprise being a custom-priced tier aimed at schools and educational organizations, not individual students).

The guiding pricing principle: **do not limit learning itself.** Core practice, lessons, and roadmap progress should not be gated by a hard content cap — doing so creates the wrong incentive (students hoarding questions instead of practicing freely) and works against the product's purpose.

Instead, premium tiers unlock **premium capabilities**, such as:
- Full official exam simulations
- Expanded AI usage
- Custom AI-generated quizzes and personalized study sessions
- Advanced analytics and deeper performance insight
- Expanded question libraries and deeper personalization

The Free plan is intended to remain genuinely useful on its own — good enough that a student can meaningfully improve without ever paying.

---

## Design Direction

Examax's visual identity is inspired by modern, premium SaaS products (in the spirit of Dub, Linear, and Vercel) rather than typical education-brand visual language. Current design system specifics:

- White canvas with hairline borders
- Typography: **Satoshi** (display) + **Inter** (UI/body)
- A single accent color: **#2563eb** (electric blue)

The `design/` folder and `DESIGN.md` are the source of truth for all visual decisions — see `CLAUDE.md` / `AGENTS.md` for how contributors (human or AI) are expected to use them.

---

## AI Provider Direction

DeepSeek is under consideration as the underlying AI provider for the Examax Agent, primarily for cost efficiency at scale. This is a direction, not yet a final architectural decision.

---

## Where to Look Next

- **`CLAUDE.md`** — development rules specific to Claude Code.
- **`AGENTS.md`** — universal rules for any AI coding agent working in this repository (including the "investigate first, ask second, implement last" philosophy this project follows).
- **`DESIGN.md`** and the **`design/`** folder — the single source of truth for all visual and UX decisions.
