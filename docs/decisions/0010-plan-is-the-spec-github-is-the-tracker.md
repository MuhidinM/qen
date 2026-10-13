# ADR-0010 · PLAN.md is the product spec; GitHub issues and docs/ are the tracker

**Status:** accepted · 2026-10-13

## Context

PLAN.md held both the spec and a checkbox tracker. The project now also has requirement IDs, a backlog and GitHub issues (N-001).

## Decision

- `PLAN.md`: vision, features, reference data, phase scope, small dated decisions.
- `docs/requirements.md`: what must be true, with evidence.
- `docs/backlog.md` + GitHub milestones and issues: the work and its status.
- `docs/decisions/`: ADRs for choices between real alternatives.
- `docs/spec-notes.md`: gaps, conflicts and open questions.
- Phases map 1:1 to milestones (Phase 1 = M1).

## Consequences

- PLAN.md §4 keeps the phase scope without checkboxes. CLAUDE.md points to the backlog for the next task.
