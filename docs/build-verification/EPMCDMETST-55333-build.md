# Build verification — EPMCDMETST-55333

Branch verified: `feature/EPMCDMETST-55333-change-password`

## 1) Install dependencies (repo root)
**Command**
```bash
npm install
```
**Result**: PASS

Verified output (from run):
- `up to date, audited 299 packages in 2s`
- may include `npm audit` vulnerability report (does not fail the install)

## 2) Build frontend (terminating)
**Command**
```bash
npm run build -w frontend
```
**Result**: PASS

Verified output (from run):
- `vite v7.3.5 building client environment for production...`
- `✓ built in 1.12s`

## 3) Backend syntax check (terminating)
Backend is plain Node/Express JS in this repo (no compile step). To verify Story changes, run Node syntax checks on the files changed in this Story.

**Commands**
```bash
node --check backend/controllers/user.js
node --check backend/routes/user.js
```
**Result**: PASS
