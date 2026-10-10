# PRODUCT.md

## Examax

Examax is an AI-powered exam preparation platform built specifically for the Polish CKE examinations. Its goal is to become the best available tool for Polish students preparing for these exams — and to stay honest about how it gets them there: the student does the work, and AI helps them understand it.

This file describes **what the product is and why it exists**. For engineering conventions and how AI coding agents should work in this repository, see `CLAUDE.md` (Claude Code specific) and `AGENTS.md` (universal, for any AI coding agent).

---

## Current Status — Public Preview

Examax is in **public preview**. The marketing site is live; the learning platform itself is not open yet.

- **What is live:** every product page (Trening, Roadmapa, Postępy, Symulacja, Korepetytor AI), the subject pages (Matematyka, Język polski, Język angielski), pricing, the enterprise page for schools, About, the changelog (Aktualności) and Contact.
- **Accounts:** sign-up and login work — e-mail and password (confirmed by an activation link), a sign-in link by e-mail, Google and Microsoft. Facebook is listed but unavailable until Meta's verification is done; passkeys and school SSO still say they are not available yet. Every form is protected by Cloudflare Turnstile.
- **After signing in:** a temporary page (`/welcome`) greets the student and says the dashboard is still being prepared. It holds the account settings: change e-mail, change or set the password, log out, delete the account.
- **What does not exist publicly:** the dashboard. It was removed from the build before the preview went live and returns once the learning platform opens.
- **Not built yet, linked on purpose:** Documentation, Help Center, Reviews, Careers, the tutors page and the legal pages. Their links land on the site's 404 until each page exists.

When the platform opens, the changelog (`/updates`) announces it first.

---

## The Problem

Traditional exam preparation for Polish students relies on manual practice papers and disconnected study materials. This approach is slow, gives no personalized feedback, and leaves students without a clear answer to two basic questions:

- What do I actually know, and what am I weak at?
- What should I study next to get the best possible result?

Examax exists to answer those two questions continuously, for every student, automatically.

A third problem has appeared with general-purpose AI chats: they make it easy to get an answer without understanding it. A student who copies a solution learns nothing that will still be there in the exam room. Examax is built against that habit (see *Learning Principles* below).

---

## Target Exams (MVP Scope)

Examax focuses on three official Polish CKE examinations:

- **Egzamin Ósmoklasisty** (8th grade exam)
- **Matura Podstawowa** (basic-level Matura)
- **Matura Rozszerzona** (extended-level Matura)

The oral Matura (Polish and English) is covered as preparation material on the subject pages.

Each supported exam has its own independent roadmap and question bank. Vocational exams (*Egzaminy Zawodowe*) are explicitly out of scope for the MVP, though future expansion is possible.

### Subjects

| Subject | Status | Areas covered |
| --- | --- | --- |
| Matematyka | Available at launch | Numbers, algebraic expressions, equations and inequalities, functions, sequences, trigonometry, plane and analytic geometry, solid geometry, statistics and probability — with extended-level topics (derivatives, optimisation, limits) tagged as such |
| Język polski | Available at launch | Set books, literary periods, language, spelling and punctuation, literary theory, reading comprehension, written forms, the oral Matura |
| Język angielski | Available at launch | Tenses, grammatical structures, vocabulary by CKE's thematic areas, exam skills, written tasks, the oral Matura |
| Biologia, Chemia, Historia | Coming later | Shown as "soon" in the footer |

Each subject has its own page (`/math`, `/polish`, `/english`) listing every topic with the exams it appears on.

---

## Core Product Vision

Examax is not a simple quiz app. It combines five things into one continuous experience:

1. **Official exam-style practice (Trening)** — real past-exam questions, organized by topic and difficulty.
2. **Structured learning (Roadmapa)** — a roadmap that guides a student from wherever they currently are to full exam readiness, laid out to the exam date and the student's pace.
3. **Progress tracking (Postępy)** — every question answered feeds back into what the student is shown next; mastery is tracked per topic.
4. **Full exam simulations (Symulacja)** — complete CKE papers under real timing and rules, marked by CKE's own marking scheme, with a report afterwards.
5. **An integrated AI tutor (Korepetytor AI)** — available both as its own space and contextually throughout the app, to explain mistakes, guide through tasks step by step, and adjust the student's plan.

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

*Not part of the public preview — see Current Status.*

### Roadmap
A structured, tree-like learning path, one per supported exam. Roadmap nodes (e.g. Introduction → Exam Tips → Fractions → Percentages → Geometry → Algebra → …) are **never locked** — students can freely skip ahead. Each node tracks its own completion percentage independently.

A roadmap node is more than a quiz — it is a full learning module that can include: an introduction, explanation, worked examples, diagrams, interactive content, memory techniques, official CKE questions, AI explanations, and a completion summary. A student can complete the quiz portion first and skip the lesson if their performance shows they already know the material; completing either path (or both) can bring the node to 100%.

The plan recalculates itself when the student changes the exam date or has a weaker week, and weak topics found by the diagnostic quiz move to the front.

### Practice
Separate from the Roadmap — this is where a student freely practices any topic on demand (e.g. Fractions, Percentages, Geometry, Functions, Algebra) rather than following the guided path. It includes:
- Recommended quizzes and recently completed quizzes
- A **diagnostic quiz** — a first, broad-mix quiz that evaluates a student's overall knowledge; on completion, Examax recommends specific weak topics, next quizzes, and roadmap priorities.
- **Official Exam Simulations** (a premium feature) — full exam replicas with original timing, official structure, and a detailed performance breakdown afterward.

### Korepetytor AI
The platform's AI tutor (formerly "Examax Agent"). It is available both as a dedicated space (for full conversations and history) and contextually throughout the app — inside quizzes, lessons, the roadmap, and the dashboard.

- **Custom agents.** Agents are not fixed one-job roles. A student creates their own: a face, a name, what it is for, and which **permissions** it has — explaining step by step, checking solutions, building tests, picking CKE tasks, changing the roadmap, keeping up repetitions.
- **Routines.** An agent can keep a study rhythm — e.g. three sessions a week on one topic — and prepare the tasks for each session.
- **Guides, never solves.** The tutor asks the student's next step instead of giving the result (see *Learning Principles*).
- **Changes need consent.** Anything that changes the student's plan waits for the student's approval.

---

## Learning Principles

These rules apply to every part of the product and every plan, including Free.

1. **Original CKE tasks, unchanged.** Examax does not write its own exam tasks and never presents CKE's tasks as its own. Tasks come from official CKE papers, unmodified, always with their source. What Examax adds is better explanation.
2. **Understanding over answers.** The AI leads with questions, one step at a time. In the exam there is no chat — only what the student understands remains.
3. **No ads, ever.** No advertising and no sponsored content, in any plan. Examax should grow because students recommend it.
4. **Never lock learning.** Roadmap topics are never locked; practice is never capped by a hard content limit.
5. **Honest numbers.** The product shows real results and real progress. Marketing never claims users, scores or testimonials Examax does not have.

---

## Navigation Structure

- **Home**
- **Practice**
- **Roadmap**
- **Korepetytor AI** (also globally accessible, not just its own tab)
- **Profile / Settings**

The public site's navigation: **Produkt** (the five product parts), **Materiały** (exams, audiences, subjects), **O nas** (company, help, updates), **Cennik**, **Dla Instytucji**.

---

## Business Model & Pricing Philosophy

Examax is being built as a **real commercial product** with a tiered subscription model. All prices and plan contents live in one file, `lib/pricing.ts`.

| Plan | Price | For |
| --- | --- | --- |
| **Free** | 0 zł | A genuinely useful start: the roadmap, unlimited practice, official CKE papers, the diagnostic quiz, 15 AI questions a day, a trial simulation |
| **Pro** | 49 zł / month | Serious preparation: 150 AI questions a day, 4 simulations a month, AI quizzes, AI-marked essays, readiness score, smart repetitions, error analysis |
| **Max** | 79 zł / month | Everything, unlimited: the highest AI limit, memory of the student's mistakes, the strongest model, unlimited simulations, AI study sessions, a plan to exam day, weekly reports, a parent view |
| **Enterprise** | Custom | Schools and institutions: class and year accounts, a teacher panel, class reports, SSO, a GDPR agreement, invoicing, a dedicated contact |

Paying yearly charges 10 months for 12.

The guiding pricing principle: **do not limit learning itself.** Core practice, lessons, and roadmap progress are not gated by a hard content cap — doing so creates the wrong incentive (students hoarding questions instead of practicing freely) and works against the product's purpose. Premium tiers unlock **premium capabilities** instead: full simulations, expanded AI usage, AI-generated quizzes and sessions, deeper analytics and personalization. The Free plan is intended to remain good enough that a student can meaningfully improve without ever paying.

---

## Privacy & Safety

- **Students are often minors.** Data collection is kept to what the product needs to teach; nothing is sold or used for advertising.
- **Parents can see progress** (Max plan), and schools get a GDPR data-processing agreement (Enterprise).
- **The AI acts only within its permissions**, and plan changes wait for the student's consent.
- **The public site is static and self-contained:** no third-party scripts, ads or tracking cookies, every asset served from Examax's own origin, a strict Content Security Policy and security headers on every response (see `next.config.ts`). Visits are counted with Vercel Web Analytics — cookieless, anonymous page views, its script served from Examax's own domain.

---

## Design Direction

Examax's visual identity is inspired by modern, premium SaaS products — Dub above all, in the spirit of Linear and Vercel — rather than typical education-brand visual language:

- White canvas with hairline borders; a ruled 1080px page column
- Typography: **Satoshi** (display) and **Inter** (UI/body)
- **One accent per product area**, never one colour for everything: Trening green, Roadmapa blue, Postępy tangerine, Symulacja lavender, Korepetytor AI yellow; subjects follow the same chips (Matematyka blue, Polski green, Angielski lavender)
- Official exam marks (E8, Matura, CKE) are used as they are, never redrawn
- Motion is smooth, subtle and intentional; product films are built with Remotion from the same components as the UI

The `DesignRules/` folder holds the references and `DESIGN.md` — the source of truth for visual decisions (see `CLAUDE.md` / `AGENTS.md` for how contributors are expected to use them).

---

## AI Provider Direction

DeepSeek is under consideration as the underlying AI provider for Korepetytor AI, primarily for cost efficiency at scale. This is a direction, not yet a final architectural decision. Whatever the provider, the product rules above (guiding rather than solving, permissions, consent) are enforced by Examax, not left to the model.

---

## What Comes Next

1. **Open accounts** — sign-up and login go live; the dashboard returns behind authentication.
2. **The learning platform** — Trening, Roadmapa and Postępy for the three launch subjects.
3. **Korepetytor AI and simulations** — custom agents, routines, full CKE simulations with reports.
4. **Help Center and documentation** — the pages already linked from the site.
5. **More subjects** — Biologia, Chemia, Historia.
6. **Schools** — class accounts and the teacher panel.

---

## Where to Look Next

- **`CLAUDE.md`** — development rules specific to Claude Code.
- **`AGENTS.md`** — universal rules for any AI coding agent working in this repository (including the "investigate first, ask second, implement last" philosophy this project follows).
- **`DESIGN.md`** and the **`DesignRules/`** folder — the source of truth for all visual and UX decisions.
- **`README.md`** — how to run, build and deploy the project.
- **`SECURITY.md`** — how to report a vulnerability.
