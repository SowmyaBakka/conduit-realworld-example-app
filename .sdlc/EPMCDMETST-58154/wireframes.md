# Wireframes — EPMCDMETST-58154

Jira: https://jiraeu.epam.com/browse/EPMCDMETST-58154

## Overview
This story is a **behavioral** UX change: the UI layout stays the same, but tab/tag/page selection becomes **deep-linkable**.

Key UI elements:
- Feed toggler: `Your Feed` (auth), `Global Feed`, and tag pill when a tag is selected.
- Articles list
- Pagination control

## Wireframe (Home page with URL-synced state)

### 1) Default (no query params)
- If unauthenticated: Global feed selected
- If authenticated: Your Feed selected

```
+--------------------------------------------------+
| Conduit banner (only if unauth)                   |
+--------------------------------------------------+
| [Your Feed]* [Global Feed] [# <tag> (hidden)]     |
|--------------------------------------------------|
| Article preview list                              |
| ...                                               |
|--------------------------------------------------|
| Pagination:  [1]* [2] [3] ...                     |
+--------------------------------------------------+
| Popular tags:  [react] [angular] [vue] ...        |
+--------------------------------------------------+
URL: /
(or /?tab=global&page=0 for explicit)
```

### 2) Tag selected via Popular Tags
User clicks tag button `react`.

```
+--------------------------------------------------+
| [Your Feed] [Global Feed] [# react]*              |
|--------------------------------------------------|
| Article preview list filtered by tag=react        |
|--------------------------------------------------|
| Pagination:  [1]* [2] [3] ...                     |
+--------------------------------------------------+
URL: /?tab=tag&tag=react&page=0
```

### 3) Pagination interaction
User clicks page 3 while on tag feed.

```
+--------------------------------------------------+
| [Your Feed] [Global Feed] [# react]*              |
|--------------------------------------------------|
| Article preview list (offset changes)             |
|--------------------------------------------------|
| Pagination:  [1] [2] [3]* [4] ...                 |
+--------------------------------------------------+
URL: /?tab=tag&tag=react&page=2
```

### 4) Back/forward restoration
User clicks browser Back.
- UI returns to page 1 and URL updates to `page=0`.

## Invalid param behavior (UI outcome)
- `/?tab=unknown` ⇒ behave like default tab.
- `/?tab=tag` (missing tag) ⇒ behave like default tab.
- `/?page=abc` ⇒ treat as page 0.

## Notes
- Layout is unchanged; only URL synchronization and state restoration are added.
- Tag pill tab text should match the tag value from URL.
