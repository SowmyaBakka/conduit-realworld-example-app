# Wireframes — EPMCDMETST-58457

Jira: [EPMCDMETST-58457](https://jiraeu.epam.com/browse/EPMCDMETST-58457)

## Home page — feed toggler + tag clear

### Current (simplified)
```
+--------------------------------------------------+
| [Your Feed] [Global Feed] [react]                |
+--------------------------------------------------+
| Article cards...                                 |
| ...                                              |
| Pagination: 1 2 3                                |
+--------------------------------------------------+
```

### Proposed
- When a tag is active, show the tag chip plus a clear action.

```
+--------------------------------------------------------------+
| [Your Feed] [Global Feed] [react]  (Clear)                   |
+--------------------------------------------------------------+
| Article cards...                                             |
| ...                                                          |
| Pagination: 1 2 3                                            |
+--------------------------------------------------------------+
```

## Interaction notes
- **Clear** appears only when tag mode is active.
- Clicking **Clear**:
  - switches to default feed (Your Feed if logged in, else Global Feed)
  - resets pagination selection to page 1 (index 0)

## Pagination behavior (visual)

### Scenario: user is on page 3, selects a tag
```
Before:
Pagination: 1 2 [3]

After selecting tag "react":
Pagination: [1] 2 3
```

### Scenario: user is on page 2 in tag mode, clears tag
```
Before (tag mode):
[react] (Clear)
Pagination: 1 [2] 3

After Clear:
Pagination: [1] 2 3
```
