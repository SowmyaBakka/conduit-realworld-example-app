# Implementation Plan — EPMCDMETST-58305

Story: https://jiraeu.epam.com/browse/EPMCDMETST-58305  
Epic: https://jiraeu.epam.com/browse/EPMCDMETST-57719

## Goal
Add UX affordances to the **Popular Tags** sidebar:
- highlight the currently active tag filter
- provide a **Clear filter** control to return to the appropriate default feed

Frontend-only (no API/backend/DB changes).

## Linked Tasks (execution order)

### 1) EPMCDMETST-58306 — FeedContext: add clearTagFilter()
https://jiraeu.epam.com/browse/EPMCDMETST-58306
- Add an explicit `clearTagFilter()` (or similarly named) method to reset filtering state without relying on `event.target`.
- Behavior:
  - set `tagName` to empty
  - set `tabName` to `"feed"` when authenticated, otherwise `"global"`

**Dependencies:** none  
**Effort:** S (0.5–1h)

### 2) EPMCDMETST-58307 — PopularTags/TagButton: selected styling + Clear filter control
https://jiraeu.epam.com/browse/EPMCDMETST-58307
- Read `tabName`/`tagName` from `FeedContext`.
- Apply an "active/selected" class when `tabName === "tag"` and this button’s tag matches `tagName`.
- Render a **Clear filter** control only when `tabName === "tag"`.
- Wire Clear filter to `clearTagFilter()`.

**Dependencies:** depends on Task 1 (context helper)  
**Effort:** S (1–2h)

### 3) EPMCDMETST-58308 — CSS: styles for selected tag + clear control
https://jiraeu.epam.com/browse/EPMCDMETST-58308
- Add minimal styling for:
  - selected tag pill (e.g., different background/border/weight)
  - Clear filter control (link/button, aligned with tag list)

**Dependencies:** depends on Task 2 (class names / markup)  
**Effort:** XS–S (0.5–1h)

### 4) EPMCDMETST-58309 — Playwright E2E coverage
https://jiraeu.epam.com/browse/EPMCDMETST-58309
- Guest flow (minimum):
  - open Home
  - click a popular tag -> tag becomes selected in sidebar
  - clear filter -> selection removed and feed returns to Global
- Optional: authenticated flow verifying reset goes back to Your Feed.

**Dependencies:** depends on Tasks 1–3  
**Effort:** S–M (2–3h)

## Notes / Risks
- Ensure the Clear filter action does not break FeedToggler behavior; it should continue to display the tag pill only while `tabName === "tag"`.
- Keep markup changes minimal to avoid broad CSS regressions.
