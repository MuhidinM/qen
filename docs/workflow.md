# Workflow

## Project facts

- **Goal:** one reliable Gregorian / Ethiopian / Hijri engine (`@qen/core`), React components (`@qen/react`), and user products on top: website + PWA, browser extension, hosted feeds, desktop tray app.
- **Audience:** developers building Ethiopian apps; people in Ethiopia and the diaspora who use all three calendars.
- **Deadline:** none set. Milestones ship in order.
- **Domains:** library/SDK (core, react) · web frontend (web, extension) · backend API (feeds) · desktop (Tauri).
- **Stack:** see [architecture.md](architecture.md#tech-stack).
- **Runs on:** npm (packages), a static/serverless host (web, feeds), Chrome Web Store + Firefox Add-ons, Windows/macOS/Linux installers.
- **Tracking:** GitHub issues + milestones + project board at [MuhidinM/qen](https://github.com/MuhidinM/qen); mirrored in [backlog.md](backlog.md).

## Working agreement

- **May do without asking:** create and update issues, labels, milestones and the project board; push branches; open PRs; merge PRs when CI is green.
- **Always ask first:** npm publishing (merging the "Version packages" PR), store submissions, production deploys, repo settings (branch protection, secrets), anything involving accounts, money or credentials, deleting data, publishing third-party material.
- **Standing approval, M8 (owner, 2026-10-25):** patch and minor releases of `@qen/core` and `@qen/react` that the extension work needs may be published without asking, through the usual Version packages PR with CI green and provenance; never a major version. Each release is reported afterwards.
- **Facts:** holiday dates, religious rules and names in any language come from a cited source (CLDR, an official text) or, where the owner delegated it (2026-10-17), from Claude's best knowledge marked "review before 1.0" (T-068). `needs-owner` marks issues waiting on owner approval or facts.
- **Merge style:** merge commits; branches deleted after merge.
- **Public docs:** `docs/` · **private notes:** `notes/private/` (gitignored).

## Where things live

| What                            | Where                                    |
| ------------------------------- | ---------------------------------------- |
| Product spec, reference data    | [PLAN.md](../PLAN.md)                    |
| Requirements with evidence      | [requirements.md](requirements.md)       |
| Tasks and status                | [backlog.md](backlog.md) + GitHub issues |
| Architecture                    | [architecture.md](architecture.md)       |
| Decisions                       | [decisions/](decisions/README.md)        |
| Gaps, conflicts, open questions | [spec-notes.md](spec-notes.md)           |

## Branches

`feature/<issue>-slug`, `fix/<issue>-slug`, `docs/<issue>-slug`, `test/<issue>-slug`, `chore/<issue>-slug`, cut from an up-to-date `main`.

## Commits

Conventional prefix (`feat`, `fix`, `docs`, `test`, `chore`, `perf`, `refactor`) + imperative subject. The body says why, names the key files, and records decisions, incidental fixes and known gaps. Calendar logic: the test commit comes before (or with) the implementation.

## Pull requests

Plain-language title. Body sections:

- Closes #n
- What changed and why
- How it was checked (commands, results, screenshots for UI)
- **Not in this PR:** deferred items, each linked to its new issue

CI must be green before merge. A user-facing package change includes a changeset.

## Releasing a package

1. Feature PRs add changesets (`pnpm changeset`); `release.yml` waits while any are pending.
2. When a release is due: on a branch `chore/release-<version>`, run `pnpm changeset version` (bumps versions, writes CHANGELOG.md, deletes the changesets), run the release checklist in [requirements.md](requirements.md#release-checklist), open a "Version packages" PR.
3. **The owner merges it.** That is the approval to publish: `release.yml` then publishes to npm with provenance and creates the git tag and GitHub release.
4. Check `npm view @qen/<pkg> version` and install it in a fresh project.

## Definition of Done

- [ ] The issue's "Done when" items are met; requirement rows ticked with evidence
- [ ] Tests written first for calendar logic; anchors from PLAN.md §5 included where relevant
- [ ] Error and edge paths tested (invalid dates, Pagume 6, 29/30-day Hijri months, year boundaries)
- [ ] Lint, typecheck, format, tests (coverage ≥ 95% lines for `core`) and build pass locally and in CI
- [ ] Every new public function has TSDoc with an example
- [ ] Changeset added for user-facing package changes
- [ ] UI work: keyboard, screen-reader labels, light/dark, RTL for Arabic, 320 px, checked in the running app with screenshots
- [ ] Docs updated in the same PR: requirements, backlog, spec notes, ADR amendments, README
- [ ] Issue closed with no empty checkboxes (deferred → "Moved to #N")
