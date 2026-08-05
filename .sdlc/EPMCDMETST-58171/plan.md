# Implementation plan — EPMCDMETST-58171

Story: EPMCDMETST-58171 — Article Editor submit loading + inline validation/error summary
Epic: EPMCDMETST-58170

## Linked Tasks (execution order)

1) EPMCDMETST-58172 — **Frontend: add submit pending UX + resilient error summary**
   - Add `isSubmitting` state to `frontend/src/components/ArticleEditorForm/ArticleEditorForm.jsx`.
   - Disable submit button while request is in-flight.
   - Update button label while submitting:
     - create mode: `Publishing…`
     - edit mode: `Updating…`
   - Prevent double-submit (guard early return if already submitting).
   - Error handling:
     - Clear prior error(s) at the start of submit.
     - Render an error summary component/section that tolerates:
       - string error
       - array of strings
       - object-shaped errors (fallback formatting)
   - Ensure UX matches existing conventions used by `FavButton` / `FollowButton` (disable while loading).

2) EPMCDMETST-58173 — **Tests: add Playwright coverage**
   - Add/extend Playwright tests for Article Editor:
     - verify button becomes disabled and label changes during submit (mock delayed network response).
     - verify error summary renders on failed submit and clears on next attempt.
   - Prefer network mocking to avoid backend dependency/flakiness.

## Dependencies
- Task 2 depends on Task 1 (tests require the new UI behavior).
- No backend/API changes required; uses existing `setArticle(...)` calls.

## Rough effort
- EPMCDMETST-58172: 2–4 hours
- EPMCDMETST-58173: 2–4 hours

## Branch & PR
- Branch (fixed convention): `feature/EPMCDMETST-58171`
- PR title: `EPMCDMETST-58171 Article Editor submit UX (loading + errors)`
