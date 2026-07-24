# Deployment Verification — EPMCDMETST-55333

Branch: `feature/EPMCDMETST-55333-change-password`

## Scope
Verify backend API runs locally and the **Change Password** feature works end-to-end via real HTTP requests.

> Note: During deployment verification, two **pre-existing local configuration bugs** were discovered and fixed. These are unrelated to the change-password feature itself, but they blocked local runtime DB connectivity.

## Pre-existing config bugs found (fixed)

### 1) DEV_DB_PORT was not read by Sequelize config (fixed)
**Symptom:** local Postgres on a non-default port could not be reached from the running backend.

**Fix commit:** `1003b7d` — `fix(config): read DB port from env for local Postgres setup`

**Change:** added the following line to `backend/config/config.js` development config:
```js
port: process.env.DEV_DB_PORT,
```

### 2) DEV_DB_LOGGING env var was not coerced to a valid Sequelize option (fixed)
**Symptom:** runtime requests that touch DB returned 500 with:
`options.logging is not a function`

**Fix commit:** `f6463ef` — `fix(config): coerce DB logging env var to valid Sequelize option`

**Change:** replaced the development logging line in `backend/config/config.js`:
```js
logging: process.env.DEV_DB_LOGGING === 'true' ? console.log : false,
```

## DB connectivity / migrations pre-flight
Because stdout capture was inconsistent for sequelize-cli in this environment, DB connectivity and migration status were validated via redirected log output:

Command:
```bat
cd backend && npx sequelize-cli db:migrate:status > ..\tmp-sqlz.log 2>&1
```

Observed in `tmp-sqlz.log`:
- Successful DB ping: `Executing (default): SELECT 1+1 AS result`
- Migration status lines:
  - `up 20220129140530-create-tag.js`
  - `up 20220129140808-create-article.js`
  - `up 20220129140956-create-user.js`
  - `up 20220129141319-create-comment.js`

(Temporary `tmp-sqlz.log` was deleted after verification.)

## Backend start (backgrounded)
Backend started using PowerShell `Start-Process` (never foreground-blocking), with stdout/stderr redirected.

Example command used:
```powershell
$p = Start-Process -FilePath node -ArgumentList 'index.js' -WorkingDirectory 'backend' \
  -RedirectStandardOutput 'backend\backend-EPMCDMETST-55333-3.log' \
  -RedirectStandardError 'backend\backend-EPMCDMETST-55333-3.err.log' \
  -PassThru
```

Log evidence:
- `Server running on http://localhost:3001`

## Functional verification — real HTTP requests/responses
Base URL: `http://localhost:3001/api`

### 1) Register user (DB-touching request)
Request:
```bash
curl -i -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d "{\"user\":{\"username\":\"deploy55333\",\"email\":\"deploy55333@example.com\",\"password\":\"OldPass!123\"}}"
```
Response:
```
HTTP/1.1 201 Created
...
{"user":{"email":"deploy55333@example.com","username":"deploy55333","bio":null,"image":null,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlcGxveTU1MzMzIiwiZW1haWwiOiJkZXBsb3k1NTMzM0BleGFtcGxlLmNvbSIsImlhdCI6MTc4NDg4MTg1NX0.CEOb_8FfOkeJWIMcYZ953fyfxNQm6WM_K4wGMnE1PTc"}}
```

### 2) Login (old password)
Request:
```bash
curl -i -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"user\":{\"email\":\"deploy55333@example.com\",\"password\":\"OldPass!123\"}}"
```
Response:
```
HTTP/1.1 200 OK
...
{"user":{"email":"deploy55333@example.com","username":"deploy55333","bio":null,"image":null,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlcGxveTU1MzMzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzg0ODgxODU4fQ.I0HF1tgas82-a_IGLwCUDzXrj91rSXCGAevI8VURFVA"}}
```

Token used below:
```
Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlcGxveTU1MzMzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzg0ODgxODU4fQ.I0HF1tgas82-a_IGLwCUDzXrj91rSXCGAevI8VURFVA
```

### 3) Change password with WRONG current password (expect 422)
Request:
```bash
curl -i -X PUT http://localhost:3001/api/user/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlcGxveTU1MzMzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzg0ODgxODU4fQ.I0HF1tgas82-a_IGLwCUDzXrj91rSXCGAevI8VURFVA" \
  -d "{\"user\":{\"currentPassword\":\"WrongPass!999\",\"newPassword\":\"NewPass!123\"}}"
```
Response:
```
HTTP/1.1 422 Unprocessable Entity
...
{"errors":{"currentPassword":["is incorrect"]}}
```

### 4) Change password with CORRECT current password (expect 200)
Request:
```bash
curl -i -X PUT http://localhost:3001/api/user/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlcGxveTU1MzMzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzg0ODgxODU4fQ.I0HF1tgas82-a_IGLwCUDzXrj91rSXCGAevI8VURFVA" \
  -d "{\"user\":{\"currentPassword\":\"OldPass!123\",\"newPassword\":\"NewPass!123\"}}"
```
Response:
```
HTTP/1.1 200 OK
...
{"user":{"username":"deploy55333","bio":null,"image":null,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlcGxveTU1MzMzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzg0ODgxODU4fQ.I0HF1tgas82-a_IGLwCUDzXrj91rSXCGAevI8VURFVA"}}
```

### 5) Confirm OLD password login now fails (expect 422)
Request:
```bash
curl -i -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"user\":{\"email\":\"deploy55333@example.com\",\"password\":\"OldPass!123\"}}"
```
Response:
```
HTTP/1.1 422 Unprocessable Entity
...
{"errors":{"body":["Wrong email/password combination"]}}
```

### 6) Confirm NEW password login succeeds (expect 200)
Request:
```bash
curl -i -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"user\":{\"email\":\"deploy55333@example.com\",\"password\":\"NewPass!123\"}}"
```
Response:
```
HTTP/1.1 200 OK
...
{"user":{"email":"deploy55333@example.com","username":"deploy55333","bio":null,"image":null,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlcGxveTU1MzMzQGV4YW1wbGUuY29tIiwiaWF0IjoxNzg0ODgxODczfQ.P1qnGErRanUSoZ0L1H2GDtg-Nvt12ZPiWAYwSBNN3Rc"}}
```

## Result
**PASS** — Change-password endpoint works as expected:
- wrong current password returns **422** with `{ "errors": { "currentPassword": ["is incorrect"] } }`
- correct current password returns **200**
- old password login fails; new password login succeeds

## Cleanup
All backend processes started during this verification were terminated, and port `3001` was confirmed free afterward.
