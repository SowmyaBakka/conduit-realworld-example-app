# EPMCDMETST-55333 — Change password in Settings – Implementation plan

Scope: Implement the story EPMCDMETST-55333 by delivering both linked tasks:
- EPMCDMETST-55334 (Backend) - protected change-password API endpoint
- EPMODMETST-55335 (Frontend) - Settings UI “Change Password” section + integration


## Task order and dependencies

1) **EPMCDMETST-55334 — Backend**
- Depends on: None
- Dependents/UI impact: The Frontend task (EPMCDMETST-55335) depends on this endpoint existing and behaving as specified.
- Deliverables:
  - New protected endpoint under /api (follow repo conventions) to change the current user’s  password
  - JWT required; use existing auth middleware patterns
  - Verify `currentPassword` matches stored credential before updating
  - Update password to `newPassword` using the same hashing strategy already used in register/login
  - Return clear errors:
    - 400 for invalid input (missing fields, etc.)
    - 401/400 for incorrect current password (per codebase conventions)
  - No regression to existing login/register flows

2) **EPMCDMETST-55335 – Frontend**
- Depends on: **EPMCDMETST-55334** because the UI must call the new endpoint and handle its success/error responses.
- Deliverables:
  - Add “Change Password” section to Settings for authenticated users
  - Fields: Current password, New password, Confirm new password, Save action
  - Client-side validation:
    - Required fields non-empty
    - New password and confirmation must match
  - On submit: call backend endpoint with JWT auth
  - On success: show clear confirmation and clear all password fields
  - On failure: show user-friendly error (e.g., “Current password is incorrect.”)


## Rough effort estimates (high-level)

- **EPMODMETST-55334 (Backend)**: ~0.5–1 day
  - Route/controller/service logic, validation, error mapping, sanity checks/manual verification
- **EPMODMETST-55335 (Frontend)**: ~0.5–1 day
  - Settings UI update, client-side validation, API integration, success/error messaging, manual verification

Total: ~0–2 days depending on existing conventions and test coverage expectations.
