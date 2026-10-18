# ADR-0011 · Packages are released from CI with Changesets and npm provenance

**Status:** accepted · 2026-10-13

## Context

The packages are public and other projects will trust them. Releases from a laptop are hard to audit.

## Decision

Changesets records each user-facing change. On `main`, the Changesets GitHub Action opens a "Version packages" PR; merging it publishes to npm with provenance, using npm trusted publishing or an automation token stored as a repo secret. Apps are never published to npm.

Alternatives considered:

- release-please: commit-message driven and weaker for independent versions in a monorepo.

(Amended 2026-10-17: GitHub Actions may not open PRs in this repo, and PRs opened with the Actions token don't trigger CI, which branch protection requires. So the "Version packages" PR is opened from a normal branch by running `pnpm changeset version`; `release.yml` skips while changesets are pending and publishes, with provenance, tags and GitHub releases, once they are gone. #28)

(Amended 2026-10-17: `changeset publish` publishes through pnpm without provenance, so 0.1.0 has no attestation. `pnpm release` now runs `pnpm -r publish --provenance` (which skips versions already on npm) and then `changeset tag`; `publishConfig.provenance` is also set. Verified on every release since 0.2.0, including @qen/core 1.0.0 and @qen/react 0.1.0, #89.)

## Consequences

- The owner sets up npm publishing credentials before the first release (T-033).
- Publishing stays an owner step: the owner merges the "Version packages" PR.
