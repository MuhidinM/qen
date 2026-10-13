# ADR-0008 · The desktop app uses Tauri, not Electron

**Status:** accepted · 2026-10-13 (owner confirmed)

## Context

The desktop app is a small tray app showing the Ethiopian date and time, with a converter panel and notifications. It reuses the React UI.

## Decision

Tauri 2. The UI is the same React components; the Rust side is limited to the tray, notifications, autostart and updates.

Alternatives considered:

- Electron: all JavaScript and simpler CI, but 100 MB+ installers and high memory for an always-running tray app.

## Consequences

- The desktop CI job needs the Rust toolchain and per-OS runners; it runs only when `apps/desktop` changes.
- Code signing for Windows and macOS needs certificates from the owner at M10.
