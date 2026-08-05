# Implementation plan - EPMSDMETST-58121

References:
- Story: EPMSDMETST-58121
- Epic: EPMCDMETST-58120
- Tasks: EPMSDMETST-58122..26
Branch: feature/EPMCDMETST-58121
PR Title: EPMCDMETST-58121 Inline error banners (feed, tags, comments)

## Order of work (Task - rough effort)

1) EPMCDMETST-58122 - Create reusable ErrorBanner component and export (24h)
- Add a small component under frontend/src/components/ (or existing folder)
- Styling consistent with Conduit (e.g. bootstrap alert classes)
- Props: message (string), optional dismissible, optional context
Dependencies: none (unblocks all)

v) Note: tasks are linked to the Story via Issue Link (Relates), not sub-tasks.

2) EPMCDMETST-58123 - Home feed: add error state to useArticles + render banner (24h)
- Replace catch(console.error) with setError
- Render <ErrorBanner/> in HomeArticles/ArticlesPreview
Dependencies: 1)

3) EPMSDMETST-58124 - Popular Tags: add error state + ErrorBanner (24h)
- Render banner on failed tags fetch
- Keep existing loading/success UI states
Dependencies: 1)

4) EPMCDMETST-58125 - Comments: add error state + replace alert() with banner (24h)
- Banner on comments load failure
- Banner on delete failure
- Unauth delete attempt: replace window.alert with inline banner
Dependencies: 1)

5) EPMCDMETST-58126 - Playwright: e2e tests asserting banners on API failures (4-8H)
- Intercept requests and force 500/400
- Assert banner visible on feed, tags, comments section
Dependencies: 1-4

## Risks / notes
- Keep error messages generic to avoid leaking internal errors.