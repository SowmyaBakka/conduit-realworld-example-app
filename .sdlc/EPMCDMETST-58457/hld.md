# High-level design (HLD) — EPMCDMETST-58457

Jira: [EPMCDMETST-58457](https://jiraeu.epam.com/browse/EPMCDMETST-58457)

## Problem statement
When a user selects a popular tag on the Home page, the feed switches to a tag-filtered list. There is no explicit way to clear this filter, and pagination selection is not controlled, leading to confusing behavior when switching between feeds/tags.

## Goals / acceptance criteria mapping
1. **Explicitly clear selected tag**
   - Show a clear control when `tabName === 'tag'`.
   - Clicking it returns to default feed (Your Feed if authenticated, else Global Feed) and clears `tagName`.

2. **Pagination resets predictably**
   - Keep the selected page in shared state.
   - Reset to page 0 when the user changes feed or tag.

## Proposed solution overview
### State management
Extend `FeedContext` to include `currentPage` and expose setter(s):
- `currentPage: number` (0-based)
- `setCurrentPage(page: number)`
- Update `changeTab` and `clearTagFilter` to reset `currentPage` to 0.

### UI changes
- **FeedToggler**
  - When in tag mode, show the tag pill plus a small "Clear" action.
  - Clear action calls `clearTagFilter()`.

- **ArticlesPagination**
  - Convert to a controlled pagination component:
    - `forcePage={currentPage}`
    - `onPageChange` updates `currentPage` and triggers `getArticles`.

- **HomeArticles**
  - Pass `currentPage` and `setCurrentPage` (or a handler) into `ArticlesPagination`.

## User flows
### Select tag
1. User clicks a tag in Popular Tags.
2. Feed switches to Tag tab.
3. Current page resets to 0.
4. Articles list reloads.

### Clear tag
1. User clicks Clear while viewing a tag.
2. Feed switches back to default tab.
3. Current page resets to 0.
4. Articles list reloads.

### Switch feed tab
1. User clicks Global Feed or Your Feed.
2. Current page resets to 0.
3. Articles list reloads.

## Risks and mitigations
- **Risk:** `changeTab` reads `e.target.innerText` which may include icon text or nested elements.
  - **Mitigation:** keep existing behavior but consider a future improvement: pass explicit tag value from TagButton.

## Rollout / testing strategy
- Unit tests (if present) are minimal in this repo; validate via manual testing:
  - Select tag, go to page 2, switch to Global Feed => pagination shows page 1 and fetches first page.
  - Select tag, go to page 2, click Clear => returns to default feed, page resets.
  - Ensure "Clear" control is keyboard accessible.
