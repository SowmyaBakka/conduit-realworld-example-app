# Implementation plan — EPMCDMETST-58457

Story: **EPMCDMETST-58457** — As a reader, I want to clear a selected tag and have pagination reset so that switching feeds is predictable.
Epic: **EPMCDMETST-57719**

Linked tasks (via *Relates*):
- **EPMCDMETST-58458** — Add explicit clear control for active tag filter in FeedToggler
- **EPMCDMETST-58459** — Store selected page in FeedContext and reset on tab/tag changes
- **EPMCDMETST-58460** — Wire ArticlesPagination to controlled state using forcePage and update handlers

## Proposed task order, dependencies, and rough effort

1) **EPMCDMETST-58459 — FeedContext: add controlled pagination state + reset logic** (S)
   - Add `currentPage` (0-based) to FeedContext state.
   - Update `changeTab` / tag selection handler to reset `currentPage` to 0 when `tabName` or `tagName` changes.
   - Provide an action like `setPage(pageIndex)` in context.
   - **Dependency:** none (foundational; other tasks consume this state).

2) **EPMCDMETST-58460 — ArticlesPagination: controlled selected page** (S)
   - Pass `forcePage={currentPage}` to `react-paginate`.
   - On click/change, call context `setPage`.
   - Ensure `HomeArticles` (or the component that fetches articles) uses `currentPage` consistently.
   - **Dependency:** requires Task 1 state/actions.

3) **EPMCDMETST-58458 — FeedToggler/UI: clear active tag filter** (S)
   - When `tabName === 'tag'`, show a clear affordance (e.g., `×` button next to the tag pill).
   - Clicking clear returns to default feed (prefer `global` when not logged in; when logged in, preserve existing behavior for `feed` vs `global` based on current tab availability) and resets page to 0.
   - **Dependency:** should reuse Task 1 reset behavior.

## Notes
- No backend/API changes expected.
- Keep changes limited to: `frontend/src/components/Home/*` (FeedContext/FeedToggler/HomeArticles/ArticlesPagination).

## Git/PR metadata
- Branch (fixed convention): `feature/EPMCDMETST-58457`
- PR title: `EPMCDMETST-58457 Clear tag filter + controlled pagination reset`
