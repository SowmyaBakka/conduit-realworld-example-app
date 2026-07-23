# EPMCDMETST-55333 — Wireframes (Change Password)

## Screen: Settings (authenticated)

### Add section: “Change Password”
Place below existing Settings/profile fields (or near any existing password-related controls).

**Section header**
- Title: `Change Password`
- Optional inline helper text: `Update your password by entering your current password.`

**Form controls (vertical stack)**
1. **Current password**
   - Label: `Current password`
   - Input: password field
   - Placeholder: `Current password`
   - Inline error region below input (examples):
     - `Current password is incorrect` (mapped from 422 `{ errors: { currentPassword: ["is incorrect"] } }`)
     - `Current password is required`

2. **New password**
   - Label: `New password`
   - Input: password field
   - Placeholder: `New password`
   - Inline error examples:
     - `New password is required`
     - `New password is too short`

3. **Confirm new password**
   - Label: `Confirm new password`
   - Input: password field
   - Placeholder: `Confirm new password`
   - Inline error (client-side):
     - `Passwords do not match`

**Primary action**
- Button: `Save Password`
  - Disabled when:
    - any required field is empty
    - new password and confirmation do not match
   -  request is submitting
  - Shows loading state while submitting

**Success feedback**
- After successful update:
  - Show a success banner/toast near the section header: `Password updated successfully.`
  - Clear all three inputs.

**Failure feedback**
- Field-level errors shown beneath relevant inputs.
- Optional generic error banner for unexpected errors: `Unable to update password. Please try again.`

## Interaction notes
- Do not send confirm password to backend; it is a client-side validation only.
- Preserve existing Settings page behavior/style (use existing form components and error styling).
