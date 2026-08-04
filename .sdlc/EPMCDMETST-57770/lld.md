# Low-Level Design (LLD) — EPMCDMETST-57770

## Proposed API / props contracts

### 1) `ArticlesPageSizeSelector` (new)
**Path**: `frontend/src/components/ArticlesPageSizeSelector/ArticlesPageSizeSelector.jsx`

**Props**
- `value: number` — current limit (3/10/20)
- `onChange: (newLimit: number) => void`
- `options?: number[]` — default `[3,10,20]`
- `id?: string` — for label association

**Rendering**
- `<label htmlFor={id}>Articles per page</label>`
- `<select id={id} value={value} onChange={...}>`

**Change handling**
- Parse `e.target.value` to integer
- Call `onChange(parsed)`

### 2) `FeedContext` update
**File**: `frontend/src/context/FeedContext.jsx`

**State**
- Extend existing state object from `{ tabName, tagName }` to `{ tabName, tagName, limit }`.
- Initialize `limit: 3`.

**Provider value**
- Add `limit`
- Add `changeLimit(newLimit)`
  - updates state: `setTab((prev) => ({ ...prev, limit: newLimit }))`

**Interactions**
- When `isAuth` changes and tabName resets, preserve `limit`.
  - Example: `setTab((tab) => ({ ...tab, tabName: isAuth ? 'feed' : 'global' }))`

### 3) Article list fetch integration
**Existing service**: `frontend/src/services/getArticles.js`
- Already supports `limit = 3`
- Ensure callers pass `limit`.

**Offset note**
- Current implementation uses `offset=${page}`.
- Keep as-is for this story; pass `page` unchanged.

### 4) `ArticlesPagination` update
**File**: `frontend/src/components/ArticlesPagination/ArticlesPagination.jsx`

**New prop**
- `limit: number` (required, defaulted at call sites to 3 if needed)

**Change**
- `const totalPages = Math.ceil(articlesCount / limit)`
- In `handlePageChange`, call:
  - `getArticles({ headers, location, page, username, tagName, limit })`

### 5) Home feed wiring
Locate the Home page articles component(s) that render pagination and list.

**Add selector**
- Read `limit` from `useFeedContext()`.
- Render `ArticlesPageSizeSelector value={limit} onChange={handleLimitChange}`.
- `handleLimitChange(newLimit)`:
  - `changeLimit(newLimit)` (context)
  - reset pagination UI to first page (depends on how current page state is stored; if held inside hook/component, set to 0)
  - refetch with `page=0` + `limit=newLimit`

### 6) Profile wiring
In profile article list components (My Articles / Favorited):
- Maintain local `limit` state: `const [limit, setLimit] = useState(3)`
- Render selector
- On change:
  - `setLimit(newLimit)`
  - set page 0
  - refetch

## Files to change / add
- Add: `frontend/src/components/ArticlesPageSizeSelector/ArticlesPageSizeSelector.jsx`
- Add (optional): `frontend/src/components/ArticlesPageSizeSelector/index.js` for clean imports
- Edit: `frontend/src/context/FeedContext.jsx`
- Edit: `frontend/src/components/ArticlesPagination/ArticlesPagination.jsx`
- Edit: Home feed container component(s) to pass `limit` into pagination + fetch
- Edit: Profile article list components to pass `limit` into pagination + fetch

## Testing notes (design-level)
- Unit-level (Vitest):
  - Selector renders options and calls `onChange` with parsed number.
  - Pagination uses provided `limit` to compute `pageCount`.
- Integration-level:
  - Changing selector triggers a fetch with new `limit` and resets page.

## Definition of Done (for implementation)
- No occurrences of `/ 3` page calc remain in pagination logic.
- Selector shown on required pages.
- Manual QA checklist:
  - Default 3 shows and behaves as before.
  - Switch to 10 → list shows up to 10; pagination decreases.
  - Switch to 20 → list shows up to 20; pagination decreases further.
