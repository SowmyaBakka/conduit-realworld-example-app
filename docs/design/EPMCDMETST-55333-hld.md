# EPMCDMETST-55333 — High-Level Design (HLD) — Change Password

## Summary
Add a “Change Password” capability to Settings.

- Backend: new authenticated endpoint `PUT /api/user/password`
- Frontend: new Settings section to submit current/new/confirm passwords
- On success: return **full user object with a fresh token**, same shape as `PUT /api/user`


## Requirements
1. Only authenticated users can change password.
2. Must verify `currentPassword` before updating.
3. Must validate `confirmPassword` server-side and client-side.
4. Password minimum length must match the registration endpoint’s rule; if registration enforces none, default to **mn length 8**.
 5. Issue a **fresh JWT** and return the user response in the same shape as `PUT /api/user`.


## API Design

### Endpoint

| Method | Path | Auth | Purpose |
|----|----|---:
| PUT | `/api/user/password` | Required | Verify current password, update password hash, return updated user with fresh token |


### Request body
RealWorld-style wrapper:

```json
{
  "user": {
    "currentPassword": "OldPassword!",
    "newPassword": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }
}
```


### Success response
Must match the existing response shape from `PUT /api/user` (commonly):

```json
{
  "user": {
    "email": "user@example.com",
    "username": "alice",
    "bio": "",
    "image": null,
    "token": "<fresh-jwt>"
  }
}
```

### Error responses
Use existing API error format used across the codebase (typical RealWorld):

#### 401 Unauthorized
- Missing/invalid JWT

#### 422 Unprocessable Entity
- Validation errors:
  - missing fields
  - `confirmPassword` mismatch
  - `newPassword` too short per policy
  - `currentPassword` incorrect
  - (recommended) `newPassword == currentPassword`

Example:
```json
{
  "errors": {
    "currentPassword": ["is incorrect"]
  }
}
```

Example:
```json
{
  "errors": {
    "confirmPassword": ["does not match newPassword"]
  }
}
```


## Data model / persistence
- **No schema changes**.
- Update the existing hashed password field for the authenticated user:
  - `passwordHash` or `password` (depends on implementation).

## Backend changes (high level)
- Add route for `PUT /api/user/password`.
- Add controller action: `changePassword` .
m- Add service method: verify current password, validate new password policy, persist new hash.
m- Reissue JWT after update (fresh token).
- Reuse existing validation + error response patterns.

## Frontend changes (high level)
- Settings page: add “Change Password” section with 3 fields and submit button.
m- Client validation:
  - required fields
  - confirm matches
  - min length (use registration policy or default 8)
- API integration:
  - call `PUT /api/user/password`
  - on success: update current user in app state (token + user fields)
  - show success and clear password fields
  - on error: show server errors per field

## Compatibility considerations
- Must not break existing Settings profile update flow (`PUT /api/user`).
- Keep response shape consistent with existing user update endpoint.
