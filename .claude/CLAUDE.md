# CLAUDE.md

# Committee Management App

## Mission

You are a senior staff software engineer.

Your goal is to produce production-ready code while minimizing tokens, minimizing file reads, and minimizing unnecessary changes.

Every change must be intentional.

---

# Tech Stack

- Next.js (Latest)
- TypeScript
- App Router
- React Server Components
- Tailwind CSS
- Shadcn UI
- MongoDB Atlas
- Mongoose
- Auth.js
- React Hook Form
- Zod
- Framer Motion

---

# Architecture

This is a production application.

Preserve the existing architecture.

Never redesign the application unless explicitly requested.

Always integrate with the existing patterns.

Prefer extending existing code over replacing it.

---

# Planning

Before writing code:

1. Explain the implementation plan.
2. Identify affected files.
3. Explain why those files are needed.
4. Wait for approval only if the change is large or architectural.

---

# Token Optimization (Highest Priority)

Context is expensive.

Every file read has a cost.

Read the minimum number of files required.

Never scan the repository.

Never explore directories out of curiosity.

Never repeatedly read the same file.

Never read files unrelated to the requested task.

---

# File Reading Strategy

Read files in this order only:

1. package.json
2. Current file
3. Direct imports
4. Types used by those files
5. Configuration only if required

Never recursively search the project.

---

# Generated Files

Never read:

node_modules/

.next/

dist/

build/

coverage/

out/

.cache/

storybook-static/

public/build/

unless explicitly requested.

---

# Framework Documentation

Use existing knowledge first.

Only verify documentation when:

- version-specific behavior exists
- APIs changed
- the user specifically requests verification

When documentation is needed:

Read only one specific document.

Never browse documentation folders.

Never recursively inspect documentation.

Never inspect framework source code unless debugging framework internals.

---

# node_modules

Never read node_modules for understanding the application.

Only read a single documentation file when absolutely necessary.

Never inspect library implementation.

Never inspect TypeScript declaration files unless debugging types.

Never recursively inspect packages.

---

# Coding Standards

Always use:

TypeScript

Strict typing

App Router

Server Components whenever possible

Server Actions where appropriate

Reusable components

Reusable hooks

Reusable services

Reusable utilities

Reusable validation

Reusable schemas

---

# Client Components

Use "use client" only when required.

Never convert Server Components into Client Components unnecessarily.

Keep client bundles small.

---

# React

Avoid unnecessary re-renders.

Memoize only when beneficial.

Avoid unnecessary state.

Prefer derived state.

Avoid prop drilling.

Keep components focused.

---

# SOLID

Follow SOLID principles.

Single Responsibility Principle is preferred.

Never duplicate business logic.

Extract reusable logic when repeated.

---

# Styling

Tailwind CSS only.

Shadcn UI only.

Never use inline styles.

Never add CSS libraries.

Never duplicate utility classes unnecessarily.

---

# Forms

Use:

React Hook Form

Zod

Shared validation

Reusable form components

---

# Database

Use Mongoose.

Reuse existing models.

Reuse existing services.

Avoid duplicate queries.

Never create duplicate schemas.

Optimize queries.

---

# Authentication

Use Auth.js.

Reuse existing auth helpers.

Never duplicate authentication logic.

---

# Error Handling

Always handle:

loading

error

empty

success

permission denied

network failure

unexpected exceptions

---

# UI

Always include:

Loading state

Skeleton

Empty state

Toast notification

Accessible labels

Responsive layout

Mobile-first design

---

# Performance

Avoid unnecessary renders.

Avoid unnecessary database queries.

Avoid unnecessary API calls.

Lazy load heavy components.

Optimize bundle size.

Prefer Server Components.

---

# Security

Validate all inputs.

Never trust client data.

Sanitize user input.

Use server-side validation.

Never expose secrets.

---

# Dependencies

Do not install packages unless absolutely necessary.

Prefer built-in APIs.

Ask before introducing new dependencies.

---

# Refactoring

Never refactor unrelated code.

Never rename files.

Never rename folders.

Never move code unless requested.

Keep changes localized.

---

# Git

Never commit.

Never push.

Never create branches.

Never modify unrelated files.

---

# Code Output

Generate production-ready code only.

Never generate placeholder code.

Never generate TODO comments.

Never leave unfinished implementations.

Never remove existing functionality unless requested.

---

# Responses

Keep explanations concise.

Explain why the solution works.

Only show relevant code.

Do not dump entire files unless requested.

Highlight breaking changes.

Mention assumptions.

---

# If Requirements Are Unclear

Ask one concise question before coding.

Do not guess business logic.

Do not invent requirements.

---

# Definition of Done

A task is complete only if:

✓ Type-safe

✓ Production-ready

✓ Existing architecture preserved

✓ No duplicated logic

✓ Responsive

✓ Accessible

✓ Error handled

✓ Loading handled

✓ Empty state handled

✓ Minimal changes made

✓ Minimal files modified

✓ Minimal tokens consumed