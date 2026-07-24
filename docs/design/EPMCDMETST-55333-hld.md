# EPMCDMETST-55333 — High-Level Design (Change Password)

## Summary
Implement a change-password feature in Settings.

- **Frontend**: Add “Change Password” section to Settings with required fields and client-side validation.
- **Backend**: Implement `PUT /api/user/password` (JWT required) which verifies current password and updates the stored password hash.

## API design
### Endpoint
- **Method**: `PUT`
- **Path**: `/api/user/password`
- **Auth**: Required (JWT)
- **Purpose**: Change the authenticated user’s password with current-password verification.

### Request
Use wrapped request body:
```json
{
  "user": {
    "currentPassword": "string",
    "newPassword": "string"
  }
}
```

### Success response
Return the standard RealWorld user view (no password fields). **Token behavior matches the existing** `PUT /api/user` **implementation** in this codebase: the response returns the user object with the **existing JWT token unchanged** (the token is copied from the `Authorization` header by auth middleware; it is not re-signed during password change).

```json
{
  "user": {
    "email": "string",
    "username": "string",
    "bio": "string|null",
    "image": "string|null",
    "token": "string"
  }
}
```

### Error responses
- **401 Unauthorized**: missing/invalid JWT
  ```json
  { "errors": { "authorization": ["is required"] } }
  ```

- **422 Unprocessable Entity**: current password incorrect
  ```json
  { "errors": { "currentPassword": ["is incorrect"] } }
  ```

- **422 Unprocessable Entity**: validation errors (missing fields, weak password, etc.)
  ```json
  {
    "errors": {
      "currentPassword": ["is required"],
      "newPassword": ["is required"]
    }
  }
  ```

## Validation rules
### Frontend
- Required fields: current password, new password, confirm new password.
- `newPassword` must equal confirmation.

### Backend
- Required: `user.currentPassword`, `user.newPassword`.
- Basic constraints:
  - `newPassword` must meet minimum length (use existing project standard; if none exists, set to 8).
  - Optional: prevent `newPassword == currentPassword` (nice-to-have).

## Data model changes
- No DB schema changes.
- Update existing `User.passwordHash` / `password` hash field in the users table/collection.

## UX behavior
- On success: show a confirmation message and clear all password fields.
- On failure: show user-friendly errors; “Current password is incorrect” should map to the field error returned by backend.
