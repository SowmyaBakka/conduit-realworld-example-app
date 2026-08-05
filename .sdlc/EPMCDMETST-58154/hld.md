# High-Level Design (HLD) — EPMCDMETST-58154

Jira: https://jiraeu.epam.com/browse/EPMCDMETST-58154

## Objective
Make the Home feed (Global / Your Feed / Tag + pagination) **URL-synchronized** so users can:
- refresh without losing selection,
- share/bookmark a link,
- use browser back/forward to restore prior selection.

## Current behavior (gap)
- Feed selection is stored only in `FeedContext` state.
- `changeTab(e, tabName)` reads tag from `e.target.innerText`.
- Pagination directly fetches a page but does not update URL.

## Target behavior
### URL contract
Route: `/`

Query params:
- `tab`: `global | feed | tag`
- `tag`: string (required when `tab=tag`)
- `page`: integer, **zero-based**, default `0`

Examples:
- Global feed page 0: `/?tab=global&page=0`
- Your feed page 1: `/?tab=feed&page=1`
- Tag feed page 2: `/?tab=tag&tag=react&page=2`

### UX rules
- Switching tabs/tags resets `page` to `0`.
- If unauthenticated and `tab=feed`, fallback to `global` (and update URL accordingly).
- Invalid params are sanitized and replaced with defaults.

## Proposed solution (high level)
1. **Move feed state source-of-truth to URL** using React Router `useSearchParams`.
2. **Refactor FeedContext**:
   - Provide explicit API: `setFeed({ tabName, tagName })` (or `changeTab(tabName, tagName)`), not DOM-derived.
   - Context becomes a thin helper around derived URL state (or can be removed later; for this story we keep it to minimize churn).
3. **Home route owns initialization**:
   - Parse query params and compute effective `{ tabName, tagName, page }`.
   - Provide to children via context.
4. **Pagination becomes controlled and URL-driven**:
   - Read `page` from URL.
   - Update `page` param on click.
   - Pass `forcePage={page}` to ReactPaginate.
5. **Fetching logic uses `page`**:
   - `useArticles` accepts `page` and triggers fetch on `page` change.

## Components impacted
- `frontend/src/routes/Home.jsx`
- `frontend/src/context/FeedContext.jsx`
- `frontend/src/routes/HomeArticles.jsx`
- `frontend/src/hooks/useArticles.js`
- `frontend/src/components/FeedToggler/*`
- `frontend/src/components/PopularTags/TagButton.jsx`
- `frontend/src/components/ArticlesPagination/ArticlesPagination.jsx`

## Testing strategy (HLD)
- Unit-level (Vitest):
  - query-param parsing utility (if introduced)
  - context behavior on invalid params
  - pagination’s `forcePage` behavior
- E2E: only if repo already contains Playwright; otherwise, create Vitest + React Testing Library coverage.

## Non-functional considerations
- Compatibility: existing routes remain unchanged (still `/`), only query params added.
- Performance: no additional network calls beyond those already triggered; URL updates should not cause duplicate fetches (ensure a single source-of-truth).

## Rollout / migration
- Backwards compatible: `/?tab=...` optional; no params uses default behavior.
- Existing direct visits to `/` still work.
