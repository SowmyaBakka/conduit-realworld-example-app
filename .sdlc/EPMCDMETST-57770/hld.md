# High-Level Design (HLD) — EPMCDMETST-57770

## Objectives
- Provide a page-size selector with options **3 / 10 / 20**.
- Default remains **3**.
- Changing page size resets pagination to the **first page** and triggers a **refetch**.
- Remove remaining hard-coded assumptions of page size `3` (notably in pagination total pages).

## In-scope surfaces
1. **Home** page feeds:
   - Global Feed
   - Your Feed (authenticated)
   - Tag feed
2. **Profile** page article lists:
   - My Articles
   - Favorited Articles

## UX / UI placement (non-invasive)
- Place selector near the article list controls (same area as tabs) or directly above the list.
- Use a compact `<select>` with label “Articles per page”.

## Data & control flow
### Inputs
- `location`: which feed/list (global/feed/tag/profile/favorites)
- `page`: selected page index (existing behavior)
- `limit`: selected page size (new)

### Behavior
- Initial render uses `limit=3`.
- When user selects a new limit:
  - Set `limit` in state (context for Home; local state for Profile).
  - Reset `page` to 0.
  - Trigger `getArticles({ limit, page: 0, ... })`.
- Pagination:
  - Uses `totalPages = ceil(articlesCount / limit)`.
  - When page changes, fetch uses the current `limit`.

## State ownership
- **Home**: store `limit` in `FeedContext` alongside `tabName`, `tagName`.
  - Rationale: limit is a feed preference and should persist while user switches feed tabs.
- **Profile**: store `limit` in the profile page component state.
  - Rationale: keep feature isolated; profile pages don’t currently use `FeedContext`.

## Components/modules impacted
- `frontend/src/context/FeedContext.jsx`
  - Add `limit` state + `changeLimit` function.
- `frontend/src/services/getArticles.js`
  - Already accepts `limit` with default 3; ensure callers pass selected limit.
- `frontend/src/components/ArticlesPagination/ArticlesPagination.jsx`
  - Accept `limit` prop, remove hard-coded 3.
  - Pass `limit` to `getArticles` on page changes.
- New component: `frontend/src/components/ArticlesPageSizeSelector/ArticlesPageSizeSelector.jsx`
  - Stateless UI (controlled component) or minimal internal handling.

## Non-functional requirements
- Accessibility: label + select; keyboard accessible.
- Performance: minimal rerenders; avoid extra fetches (only on selection change).
- Compatibility: no backend changes; no API contract change.

## Risks & mitigations
- **Offset semantics**: current code uses `offset=${page}` (page index) instead of `page*limit`.
  - This story does not redefine semantics; keep behavior consistent with existing UI.
  - If product expects true offset semantics, address in a separate story.
- **Keeping pagination and list in sync**: enforce page reset on limit changes.

## Acceptance criteria mapping
- Selector present on Home + Profile lists → implemented via shared selector component.
- Default 3 → state initialization.
- Limit change resets to first page → page state reset + refetch.
- No hard-coded 3 in pagination total pages → prop-driven calculation.
