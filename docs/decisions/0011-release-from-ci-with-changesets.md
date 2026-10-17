# ADR-0011 · Packages are released from CI with Changesets and npm provenance

**Status:** accepted · 2026-10-13

## Context

The packages are public and other projects will trust them. Releases from a laptop are hard to audit.

## Decision

Changesets records each user-facing change. On `main`, the Changesets GitHub Action opens a "Version packages" PR; merging it publishes to npm with provenance, using npm trusted publishing or an automation token stored as a repo secret. Apps are never published to npm.

Alternatives considered:

- release-please: commit-message driven and weaker for independent versions in a monorepo.

## Consequences

- The owner sets up npm publishing credentials before the first release (T-033).
- Publishing stays an owner step: the owner merges the "Version packages" PR.
