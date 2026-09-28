# Examax — AI Agent Instructions

Welcome to the Examax project.

This file provides universal instructions for every AI coding agent working inside this repository.

These instructions apply regardless of the model, IDE, or coding assistant being used.

---

# About Examax

Examax is a premium AI-powered education platform built specifically for Polish CKE examinations, including Egzamin Ósmoklasisty and Matura.

The platform combines:

- structured learning roadmaps
- official exam-style practice
- interactive lessons
- AI-powered explanations
- progress tracking
- exam simulations
- modern SaaS-quality user experience

The goal is to build a polished, maintainable, production-ready platform.

---

# Before Writing Code

Before making any implementation:

1. Understand the existing architecture.
2. Review the relevant files.
3. Review the `design/` directory.
4. Read `PRODUCT.md` for product behaviour.
5. Follow `CLAUDE.md` for repository-specific development rules.

Never start implementing without first understanding the surrounding code.

---

# Design Rules

The `design/` directory is the project's visual source of truth.

Before implementing any UI:

- inspect all relevant screenshots
- inspect all design.md files
- inspect animations
- inspect typography
- inspect layouts
- inspect spacing
- inspect component patterns

Do not invent a different design language.

Every new UI element should feel like it belongs to the existing application.

---

# Stay Consistent

New features should integrate naturally with the rest of the project.

Match:

- spacing
- typography
- animations
- colors
- component behaviour
- naming
- architecture

Avoid introducing inconsistent patterns.

---

# Never Assume

If requirements are unclear:

DO NOT guess.

Instead:

- inspect the repository
- inspect the design folder
- inspect PRODUCT.md
- inspect CLAUDE.md

If you are still uncertain after reviewing the available information:

STOP.

Return to the user.

Ask questions until you are at least **99.99% confident** that you fully understand the requested task before making implementation decisions.

Correctness is always more important than speed.

---

# Scope

Implement exactly what is requested.

Do not:

- redesign unrelated pages
- move components
- rename files
- rewrite architecture
- replace existing functionality

unless explicitly instructed.

Keep changes focused.

---

# Existing Code

Respect existing implementations.

Modify existing code before replacing it.

Avoid unnecessary rewrites.

Avoid introducing duplicate components.

Reuse existing logic whenever possible.

---

# Code Quality

Write production-quality code.

Prioritize:

- readability
- maintainability
- performance
- accessibility
- responsive layouts
- clean architecture

Avoid temporary fixes.

Avoid hacks.

---

# Components

Build reusable components whenever appropriate.

Avoid duplicated code.

Follow the project's existing conventions.

---

# Animations

Animations should be:

- smooth
- subtle
- performant
- intentional

Avoid unnecessary movement.

The goal is a premium product experience.

---

# If You Discover Problems

If you discover:

- architectural issues
- bugs
- inconsistencies
- performance concerns

that are directly related to the requested task,

mention them before implementing a large change.

Do not silently change unrelated parts of the application.

---

# Goal

Every contribution should make Examax more polished, more maintainable, and more consistent.

When in doubt:

understand first,
ask second,
implement last.

## Imported Claude Cowork project instructions

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
