# ADR-0001 · One monorepo holds every package and app

**Status:** accepted · 2026-10-13

## Context

Qen ships npm packages (`core`, `react`) and four products (website, browser extension, hosted feeds, desktop app). Every product depends on the calendar engine, and engine changes often need matching app changes.

## Decision

One Git repository with pnpm workspaces and Turborepo. Packages live in `packages/`, apps in `apps/`. Only `packages/*` are published to npm; apps are `private: true` and released by their own workflows (deploy, store upload, installers). CI builds only what a change affects (Turborepo filtering), and slow jobs (Rust toolchain for Tauri, Playwright) run only when their folder changes.

Alternatives considered:

- One repo per product: every engine change becomes a multi-repo version bump, with duplicated CI and tooling.
- Nx instead of Turborepo: more than needed; Turborepo is simpler for a TypeScript-only graph.

## Consequences

- An engine fix and the app changes that use it land in one PR with one CI run.
- Apps always build against the workspace version of `core`, so they can't drift.
- CI must stay fast as apps arrive: per-app jobs with path filters.
