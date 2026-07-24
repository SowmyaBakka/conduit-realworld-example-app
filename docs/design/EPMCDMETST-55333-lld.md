# EPMCDMETST-55333 — Low-Level Design (Change Password)

> Paths and names should follow the existing codebase structure (controllers/services/routes). The intent below is precise about responsibilities, payloads, and error mapping.

## Backend

### Route
- Add route under existing user routes:
  - `PUT /api/user/password`
  - Middleware: `auth.required`

**Example (Express-style):**
```js
router.put('/password', auth.required, userController.changePassword);
```

### Controller: `changePassword(req, res, next)`
**Inputs**
- Authenticated user id from auth middleware (e.g., `req.payload.id` or `req.user.id`).
- Body:
  - `req.body.user.currentPassword`
  - `req.body.user.newPassword`

**Validation (controller-level)**
- If `req.body.user` missing: return 422 with `{ errors: { body: ["is invalid"] } }` (or existing convention).
- If `currentPassword` missing/empty: 422 `{ errors: { currentPassword: ["is required"] } }`
- If `newPassword` missing/empty: 422 `{ errors: { newPassword: ["is required"] } }`

**Flow**
1. Extract `userId` from auth context.
2. Validate input.
3. Call service: `userService.changePassword(userId, currentPassword, newPassword)`.
4. Return 200 with `{ user: <userView> }`.

### Service: `changePassword(userId, currentPassword, newPassword)`
**Responsibilities**
- Load user by id.
- Verify `currentPassword` matches stored hash.
- Hash `newPassword` with the same strategy used in registration.
- Persist updated hash.

**Pseudo-code**
```js
async function changePassword(userId, currentPassword, newPassword) {
  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundOrUnauthorized();

  const ok = await passwordCrypto.compare(currentPassword, user.passwordHash);
  if (!ok) {
    throw new CurrentPasswordIncorrectError();
  }

  // Optional: enforce newPassword length
  // if (newPassword.length < 8) throw new ValidationError({ newPassword: ['is too short'] })

  user.passwordHash = await passwordCrypto.hash(newPassword);
  await userRepo.save(user);

  return toUserView(user); // excludes passwordHash
}
```

### Error mapping
- `CurrentPasswordIncorrectError` → **422**
  ```json
  { "errors": { "currentPassword": ["is incorrect"] } }
  ```
- Validation errors (missing fields, min length) → **422** with field error map.
- Missing/invalid JWT → **401** (existing auth middleware behavior).

### Files to touch (expected)
(Exact locations depend on repo layout.)
- User routes file (e.g., `routes/api/user.js`) — add `PUT /password`.
- User controller (e.g., `controllers/user.js`) — add `changePassword` handler.
- User service (e.g., `services/user.js`) — add `changePassword`.
- Password crypto helper (reuse existing bcrypt helper used by login/register).
- User model/repository (reuse existing user update method).

### Additional test cases (if tests exist)
- 401 when no JWT.
- 422 when current password incorrect.
- 422 when required fields missing.
- 200 when password changed; login with new password succeeds (integration).

## Frontend

### UI placement
Settings page: add a **Change Password** section with three password inputs + Save button.

### State
- `currentPassword`, `newPassword`, `confirmNewPassword`
- `isSubmitting`
- `fieldErrors` (map)
- `successMessage` (string/flag)

### Client-side validation
- Required: all three fields.
- `newPassword === confirmNewPassword`.

### API integration
- Call:
  - `PUT /api/user/password`
  - Body:
    ```json
    { "user": { "currentPassword": "…", "newPassword": "…" } }
    ```
- On 200:
  - Clear all fields.
  - Show success message.
- On 422:
  - Display `errors.currentPassword[0]` under “Current password” field when present.
  - Display other field errors accordingly.

### Files to touch (expected)
- Settings component/page.
- API client user service module (add `changePassword()` method).
- Optional: shared error rendering component.
