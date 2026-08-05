# Architecture — EPMCDMETST-58171

Jira: **EPMCDMETST-58171**  
Epic: **EPMCDMETST-58170**

## Goal
Improve the Article Editor submit experience by:
- preventing duplicate submissions (disable button while request is in-flight)
- providing clear, resilient error summary rendering on failure

## Scope
- **Frontend only** (React)
- No API contract changes
- No backend changes

## Existing components/services (as-is)
- `frontend/src/components/ArticleEditorForm/ArticleEditorForm.jsx`
- `frontend/src/services/articleService.js` (contains `setArticle`)
- `frontend/src/helpers/errorHandler.js` (normalizes API errors; may currently reduce errors to a single string)

## Proposed architecture changes
- Add local UI state to Article Editor form:
  - `isSubmitting: boolean`
  - `submitError: string | string[] | Record<string, string[]> | null`
- Wrap `setArticle(...)` call to:
  - set `isSubmitting=true` at start
  - clear previous `submitError`
  - on success: navigate as it does today
  - on error: capture and display error summary
  - finally: set `isSubmitting=false`

### Component-level flow
```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant F as ArticleEditorForm
  participant S as articleService.setArticle
  participant API as Backend API

  U->>F: Click Publish/Update
  alt isSubmitting == true
    F-->>U: Click ignored (button disabled)
  else isSubmitting == false
    F->>F: setIsSubmitting(true)
    F->>F: clear submitError
    F->>S: setArticle(payload)
    S->>API: POST /api/articles OR PUT /api/articles/:slug
    alt success
      API-->>S: 200/201 + article
      S-->>F: resolve(article)
      F-->>U: Navigate to article page
    else error
      API-->>S: 4xx + errors
      S-->>F: throw(normalizedError)
      F->>F: setSubmitError(error)
      F-->>U: Render error summary
    end
    F->>F: setIsSubmitting(false)
  end
```

## Assumptions / open points (documented for review)
- The backend already returns validation errors in a structure like `{ errors: { field: [msg] } }` per RealWorld spec.
- Current `errorHandler` may flatten errors. We will **not** change backend behavior; any improvement to client-side error presentation should tolerate both flattened and structured errors.

## Non-functional considerations
- Accessibility: error summary should be visible and ideally placed near the top of the form.
- Usability: disabling submit button prevents accidental duplicate posts.
