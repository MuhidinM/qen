# ADR-0009 · No native mobile app for now; the website PWA covers phones

**Status:** accepted · 2026-10-13 (owner confirmed)

## Context

Phones are a major use case, but a native app adds a whole platform to build, test and publish.

## Decision

The website is an installable, offline-capable PWA. A native app (for example for an Android home-screen widget, which a PWA can't provide) would be a new milestone after the existing ones.

## Consequences

- The PWA must meet mobile requirements: 320 px layouts, offline use, install prompt.
