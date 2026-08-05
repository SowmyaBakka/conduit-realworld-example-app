# Implementation plan — EPMCDMETST-58154

Story: **EPMCDMETST-58154** — URL-synced Home feed (tab/tag/page) deep-linking
Epic: **EPMCDMETST-58066**

## Linked Tasks (execution order)

1. **EPMCDMETST-58155 — Parse and initialize Home feed state from URL query params** (S)
   - Introduce URL as source-of-truth for `tab`, `tag`, `page`.
   - Add robust parsing + defaults:
     - `tab` ∈ {`global`, `feed`, `tag`} else default `global`
     - if `tab=tag` and no `tag`, fall back to `global`
     - `page` must be integer ≥ 0 else default `0`

2. **EPMCDMETST-58156 — Refactor FeedContext API to accept explicit tabName/tagName** (S)
   - Remove reliance on `e.target.innerText`.
   - Provide explicit setter(s) that work both from UI actions and URL-init.

3. **EPMCDMETST-58157 — Update feed toggler + tag buttons to set URL query params (reset page)** (S)
   - Replace `<button onClick={changeTab(e, ...)}` pattern with navigation that updates `searchParams`.
   - Ensure switching tab/tag resets `page=0`.
   - For unauthenticated users: `tab=feed` should degrade gracefully (e.g., route to `global`).

4. **EPMCDMETST-58159 — Ensure article fetching uses URL page value when calling getArticles** (S)
   - Connect the Home feed fetch logic to URL-driven state.
   - Ensure correct `offset = page * limit` when `page` changes via URL.

5. **EPMCDMETST-58158 — Make pagination URL-driven (page param + ReactPaginate forcePage)** (M)
   - Update pagination component to:
     - set `page` query param on page click
     - read current `page` from URL to control active page via `forcePage`
   - Verify browser back/forward re-renders the correct page without extra clicks.

6. **EPMCDMETST-58160 — Add Playwright tests for feed deep-linking, pagination URL, and back/forward** (M)
   - Add e2e coverage for:
     - direct open `/?tab=tag&tag=react&page=1` restores state
     - clicking tag/pagination updates URL
     - back/forward restores prior feed state
     - invalid params fall back to defaults

## Dependencies / notes
- Tasks 1–3 establish URL state + setters; pagination and fetching depend on those.
- No backend changes required (existing `getArticles` supports tag/limit/offset).

## Effort (rough)
- Total: **~2–3 days**
  - URL parsing + context refactor: ~0.5–1 day
  - Pagination + fetch wiring: ~0.5–1 day
  - Playwright tests: ~1 day

## Branch / PR
- Branch: `feature/EPMCDMETST-58154`
- PR title: `EPMCDMETST-58154 URL-synced Home feed deep-linking`
