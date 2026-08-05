# Plan for EPMCDMETST-58032

## Goal
Replace `window.confirm()` for comment deletion with an in-app confirmation UI, plus per-comment loading/disabled state and user-visible error feedback.

## Linked Jira
- Story: EPMCDMETST-58032
- Tasks: EPMCDMETST-58033, EPMCDMETST-58034, EPMCDMETST-58035, EPMCDMETST-58036
- Epic: EPMCDMETST-58031

## Implementation order
1. **Frontend UX + state plumbing** (EPMCDMETST-58033)
   - Introduce per-comment UI state (confirming, deleting, error).
   - Disable delete controls while deleting.
2. **In-app confirm UI** (EPMCDMETST-58034)
   - Inline confirmation block (keep styles minimal, reuse existing CSS where possible).
3. **Error feedback** (EPMCDMETST-58035)
   - Display inline error message on delete failure; allow retry/cancel.
4. **E2E coverage** (EPMCDMETST-58036)
   - Playwright tests for cancel/confirm/success.
   - Failure path if feasible by request stubbing/mocking.

## Notes
- Keep API layer as-is (`frontend/src/services/deleteComment.js`).
- Aim for minimal component surface area; prefer local state in Comment component/list.
