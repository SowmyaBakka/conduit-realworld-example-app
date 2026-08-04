# Implementation plan – EPMCDMETST-57770

## Scope
Add a page-size selector (3/10/20) to article lists on Home feeds (Global/Your/Tag) and Profile article lists (My Articles/Favorited), wired to fetching and pagination.

## Task order (heads-up dependencies)
1. **UI component** – create reusable `ArticlesPageSizeSelector` that emits a change (values: 3, 10, 20).
2. **Pagination** – remove hard-coded `3` in total pages calculation; accept `limit` as a prop.
3. **Home feeds** – introduce `limit` in `FeedContext`, wire into `useArticles`/`getArticles` calls, reset page to first on change.
4. **Profile lists** – introduce local `limit` state for My Articles and Favorited, wire in the selector, reset page on change.
5. **Tests** – add e2e test for default limit=3, switch to 10 and verify items per page and pagination change.

## Acceptance Criteria checklist
- [ ] Selector shows 3/10/20 on Home feeds and Profile lists
- [ ] Default is 3
- [ ] Change resets to page 1 and re-fetches
- [ ] Pagination total pages is calculated from selectedLimit
- [ ] No hard-coded `3` left in pagination code
