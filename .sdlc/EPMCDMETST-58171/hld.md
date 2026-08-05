# High-Level Design (HLD) — EPMCDMETST-58171

Jira: **EPMCDMETST-58171**  
Epic: **EPMCDMETST-58170**

## Feature overview
Enhance the Article Editor submission UX by adding:
1. A submit loading state (`isSubmitting`) that disables the submit button and changes its label.
2. A resilient error summary component/section that can display validation errors returned by the API without crashing.
3. Error clearing when a new submit attempt begins.

## User experience
### Create article
- Button label: **Publish Article** → **Publishing…** during submission
- Button disabled while submitting

### Edit article
- Button label: **Update Article** → **Updating…** during submission
- Button disabled while submitting

### Failure
- Shows an error summary above the form fields
- Summary can render:
  - a single string
  - a list of strings
  - a structured map of field → messages

## System interactions
- No changes to API endpoints.
- Uses existing `articleService.setArticle(...)` which performs:
  - create: `POST /api/articles`
  - edit: `PUT /api/articles/:slug`

## Error handling strategy (tolerant)
Because existing `errorHandler` may sometimes flatten errors to a string, the UI will:
- accept `unknown` caught value
- normalize to an array of human-readable lines for display

Example display lines:
- `title can't be blank`
- `description is too short`
- `body can't be blank`

## Out of scope
- Field-level inline errors next to each input (can be a future iteration)
- Backend changes (validation rules, error payload format)

## Risks & mitigations
- **Risk:** double-submit causes duplicate article creation
  - **Mitigation:** disable button while `isSubmitting=true`
- **Risk:** error shapes vary and UI crashes
  - **Mitigation:** error-normalization function in the form/component to support multiple shapes

## Testing approach (HLD)
- Unit/component-level test (Vitest) or UI test (if Playwright exists) to verify:
  - button disabled during submit
  - label changes during submit
  - errors render and clear on retry

> Note: repo stack reference indicates Vitest exists; Playwright may not. Testing approach will align to existing test tooling in repo.
