# ADR-0007 · Orthodox movable holidays come from Bahire Hasab, verified by Julian Easter

**Status:** accepted · 2026-10-13

## Context

Fasika and the feasts and fasts tied to it move every year. They must be right for every year, not only those with published calendars.

## Decision

Implement Bahire Hasab to find Tsome Nenewe (Fast of Nineveh), then derive the rest from the offset table in PLAN.md §3.4. Test-only code implements Meeus' Julian Easter algorithm; Fasika must equal it for every year 1900–2100 and match the PLAN.md anchors.

Alternatives considered:

- Julian Easter only: gives Fasika but not the computus outputs (Evangelist year, Metqe, Beale Metqe) that `bahireHasab()` exposes.

(Amended 2026-10-17: no authoritative written description of the steps was found online, only other libraries' code, which we did not use. The implementation follows the traditional steps: Amete Alem = year + 5500; Wenber = (Amete Alem − 1) mod 19; Abekte = 11·Wenber mod 30; Metqe = 19·Wenber mod 30 (0 counts as 30); Beale Metqe in Meskerem if Metqe > 14, else Tikimt; Tewsak by Beale Metqe's weekday (Sun 7, Mon 6, Tue 5, Wed 4, Thu 3, Fri 2, Sat 8); Nineveh = Tir or Yekatit day Metqe + Tewsak, carrying past 30. Correctness rests on the Julian Easter cross-check, #36.)

## Consequences

- Two independent methods must agree, which catches off-by-one errors in either.
