# EPMCDMETST-56876 — Follow/Unfollow + “Your Feed” (Documentation Summary)

## Story intent (from Jira)
**Story:** EPMCDMETST-56876

Problem:
- Users can view profiles, but cannot manage follow relationships or access a personalized “Your Feed”.

Solution (target behavior):
- Follow/unfollow authors from Profile page.
- Add “Your Feed” tab on Home page listing articles authored by followed users.
- Ensure profile payload indicates whether the current user follows the profile owner.

Linked Tasks (via Jira issue links → Relates):
- EPMCDMETST-56877 — Backend: follow/unfollow + personalized feed APIs
- EPMCDMETST-56878 — Frontend: follow/unfollow UI + “Your Feed” wiring

Parent Epic (Epic Link field):
- EPMCDMETST-56875 (from Jira field **Epic Link** / `customfield_14500`)

## Design documentation
**Checked path:** `docs/design/`
- No design docs present in repo at time of writing this summary (see compliance section).

## Code delivered on this branch
No feature code commits for EPMCDMETST-56876 were present at the time of writing.

## How to run locally (from repo root `package.json`)
- Dev (frontend + backend): `npm run dev`
- Run Vitest: `npm test`
- Sequelize CLI (backend workspace): `npm run sqlz -- <command>`
  - Example: `npm run sqlz -- db:migrate`

## Known gaps / risks observed during documentation pass
- **Branch/PR traceability:** No Planning comment was present on the Story indicating an existing branch/PR.
- **Design docs:** `docs/design/` directory is empty (no `*-architecture.md`, `*-hld.md`, `*-lld.md`, `*-wireframes.md`).

