# ADR-0007 · Orthodox movable holidays come from Bahire Hasab, verified by Julian Easter

**Status:** accepted · 2026-10-13

## Context

Fasika and the feasts and fasts tied to it move every year. They must be right for every year, not only those with published calendars.

## Decision

Implement Bahire Hasab to find Tsome Nenewe (Fast of Nineveh), then derive the rest from the offset table in PLAN.md §3.4. Test-only code implements Meeus' Julian Easter algorithm; Fasika must equal it for every year 1900–2100 and match the PLAN.md anchors.

Alternatives considered:

- Julian Easter only: gives Fasika but not the computus outputs (Evangelist year, Metqe, Beale Metqe) that `bahireHasab()` exposes.

## Consequences

- Two independent methods must agree, which catches off-by-one errors in either.
