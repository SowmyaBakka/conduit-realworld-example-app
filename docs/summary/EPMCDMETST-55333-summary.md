# EPMCDMETST-55333 — Change Password (Settings)

## Story
**[STORY] As an authenticated user, I want to change my password in Settings so that I can keep my account secure** (EPMCDMETST-55333)

Problem (from Jira): Settings currently doesn’t offer a change-password flow, and the backend lacks a dedicated secured operation to change a password with current-password verification.

Solution (from Jira): Add UI controls in Settings to submit current/new password, and implement a protected API endpoint that verifies the current password, enforces basic validation, and updates the stored password securely.

Linked tasks (Jira issue links):
- EPMCDMETST-55334 — [TASK] Backend: Add authenticated change-password endpoint with current password verification
- EPMCDMETST-55335 — [TASK] Frontend: Add “Change Password” section to Settings and integrate with API

Branch / PR (from Jira comments):
- Branch: `feature/EPMCDMETST-55333-change-password`
- PR: https://github.com/SowmyaBakka/conduit-realworld-example-app/pull/1

## Design documentation (committed)
- `docs/design/EPMCDMETST-55333-architecture.md`
- `docs/design/EPMCDMETST-55333-hld.md`
- `docs/design/EPMCDMETST-55333-lld.md`
- `docs/design/EPMCDMETST-55333-wireframes.md`

## What was built (verified in code)
### Backend (implemented)
Commit: `02ec223` — `feat(user): add change password endpoint (EPMCDMETST-55334)`

Files changed in that commit:
- `backend/controllers/user.js`
- `backend/routes/user.js`

Also updated:
- `docs/design/EPMCDMETST-55333-hld.md` (token behavior alignment, per Jira comment)

Verified Jira note on the **task** (EPMCDMETST-55334) comments:
- No explicit test-gap note.
- There *is* a reminder that local-only env modifications were left uncommitted: `backend/config/config.js`, `package.json`.

> Note: Frontend task (EPMCDMETST-55335) is **not implemented** on this branch based on the commit history checked.

## How to run / test locally (from repo scripts)
From repo root:

- Start dev servers (frontend + backend):
  ```bash
  npm run dev
  ```
- Run tests:
  ```bash
  npm run test
  ```
- DB utilities (Sequelize CLI):
  ```bash
  npm run sqlz -- db:create
  npm run sqlz -- db:migrate
  npm run sqlz -- db:seed:all
  ```

## Known gaps / follow-ups (from Jira + repo checks)
- **Frontend UI** for Change Password is not present yet (task EPMCDMETST-55335 remains Open in Jira and no corresponding frontend commits were found on this branch).
- **README** was not updated for this feature (repo README remains generic / project-level).

---

## Evidence: commits on this branch
- `215d953` docs(summary): add story summary (EPMCDMETST-55333)
- `02ec223` feat(user): add change password endpoint (EPMCDMETST-55334)
- `dcc3902` docs(design): add EPMCDMETST-55333 design docs
- `85b98aa` docs(EPMCDMETST-55333): add high-level design
- `c41c1ed` docs(EPMCDMETST-55333): add architecture design
- `1816ee5` docs(plan): add implementation plan (EPMCDMETST-55333)
