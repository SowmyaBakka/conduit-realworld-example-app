# High-Level Design (HLD): Popular Tags Tag Selection & Clear Filter (EPMCDMETST-58305)

[Jira Story: EPMCDMETST-58305](https://jiraeu.epam.com/browse/EPMCDMETST-58305)

## Objective
Improve the Popular Tags sidebar UX: show which tag is currently filtering the feed, and allow clearing it without navigating away or clicking elsewhere.

## Main components
- **FeedContext (frontend/src/context/FeedContext.jsx):**
    - Holds feed state: { tabName (string), tagName (string) }
    - Provides API to select tab or tag, and a new clearTagFilter() method that resets tabName/tagName appropriately based on authentication status and current selection.
- **PopularTags/TagButton (frontend/src/components/PopularTags/TagButton.jsx):**
    - Renders tags as pills, highlights active selection.
    - Renders 'Clear filter' button only if tabName == 'tag'.
    - Dispatches clearTagFilter on click of the control.
- **styles.css:**
    - Styles for "selected"/active tag pill.
    - Styles for 'Clear filter' control matching sidebar look.

## State/Flow
- On tag click: set tabName = 'tag', tagName = selected tag.
- On 'Clear filter': set tabName to guest ('global') or authed ('feed'), tagName = ''.
- On render: sidebar checks FeedContext state to style/appear as appropriate.

## Error Scenarios
- No error states (UI-only); fallback is non-highlighted pills, no breaking impact if missing.

## Test Approach
- (Manual or future Playwright) — Click tag: pill highlights, toggler shows tag, feed is filtered. Click clear: returns to default feed.

## Out of Scope
- No backend/controller/model changes.
- No new tabs/feeds, only selected state/clear control for tags.
