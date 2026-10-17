# Documentation

| Doc                                | Contents                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| [../PLAN.md](../PLAN.md)           | Product spec: vision, features, reference data, phase scope                        |
| [requirements.md](requirements.md) | Every requirement with an ID, the task that delivers it, and the evidence it works |
| [backlog.md](backlog.md)           | Milestones and tasks, each linked to its GitHub issue and requirements             |
| [architecture.md](architecture.md) | Runtime model, data flow, state, errors, security, folders, stack, test strategy   |
| [decisions/](decisions/README.md)  | Architecture Decision Records, one per significant choice                          |
| [spec-notes.md](spec-notes.md)     | Gaps, conflicts and open questions, and what was decided                           |
| [workflow.md](workflow.md)         | Working agreement, branches, commits, PRs, Definition of Done                      |

How they connect:

```
Requirement (R-xxx) ─► task (T-xxx) ─► GitHub issue ─► pull request ─► evidence in requirements.md
Gap or conflict ─► spec note (N-xxx) ─► decision (ADR) or task
```
