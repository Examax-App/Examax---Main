# Examax Development Guidelines

This repository contains the primary frontend application for Examax.

Examax is a premium AI-powered education platform built specifically for Polish CKE examinations, including Egzamin Ósmoklasisty and Matura. The goal of this project is to build a world-class educational product with the quality and polish of modern SaaS applications.

Before making implementation decisions, prioritize consistency, maintainability, and user experience over speed.

---

# Design First

The `DesignRules/` directory is the single source of truth for the project's visual identity.

Before implementing any UI, component, animation, page or feature:

- Read the relevant `design.md` files.
- Review every available screenshot.
- Review any UI references.
- Review typography, spacing, layout and animation references.
- Follow the design language as closely as possible.

Never invent a new design language when an existing reference already exists.

If something is unclear, ask instead of guessing.

---

# Never Make Large Unrequested Changes

Do not redesign existing pages unless explicitly requested.

Do not:

- replace layouts
- move sections
- rename components
- change navigation
- introduce new functionality
- remove existing functionality
- change styling

unless the task explicitly requires it.

If a requested change could affect other parts of the application, explain the impact before making it.

---

# Preserve Existing Architecture

Always work with the existing project architecture.

Avoid unnecessary refactoring.

Avoid moving files without reason.

Avoid introducing additional abstractions unless they provide clear long-term value.

Prefer extending existing components over creating duplicates.

---

# Keep Components Reusable

Whenever possible:

- build reusable UI components
- avoid duplicated logic
- keep components modular
- keep files organized

Follow existing naming conventions.

---

# Code Quality

Write production-quality code.

Prioritize:

- readability
- maintainability
- performance
- accessibility
- responsive layouts
- clean TypeScript

Avoid quick hacks.

Avoid temporary fixes unless explicitly requested.

---

# Animations

Animations should feel premium.

Preferred characteristics:

- smooth
- subtle
- intentional
- performant

Avoid excessive motion.

The goal is a polished SaaS experience similar in quality to companies such as Linear, Stripe and Dub—not identical designs, but similar attention to detail.

---

# UI Consistency

Every new component should feel like it belongs in the existing application.

Match:

- spacing
- typography
- border radius
- shadows
- animations
- colors
- interaction patterns

Do not introduce inconsistent visual styles.

---

# Before Creating New Assets

Before creating:

- illustrations
- icons
- placeholders
- graphics
- images

first check whether the project already contains suitable assets or references.

Reuse existing assets whenever appropriate.

---

# Product Knowledge

This file contains development rules only.

For product behaviour, platform functionality, user experience, roadmap, feature definitions and business logic, refer to:

`PRODUCT.md`

---

# When Requirements Are Unclear

Never guess.

If information is missing or multiple interpretations are possible:

- stop
- explain the ambiguity
- ask for clarification

A correct implementation is more valuable than a fast implementation.

---

# Respect Existing Code

Before replacing an existing implementation:

- understand why it exists
- check where it is used
- preserve existing behaviour unless instructed otherwise

Modify before rewriting.

Small, targeted changes are preferred over large rewrites.

# Goal

Every contribution should move Examax closer to becoming a premium, polished, maintainable product.

Prefer thoughtful improvements over unnecessary changes.