# Low-Level Design (LLD) — EPMCDMETST-58171

Jira: **EPMCDMETST-58171**  
Epic: **EPMCDMETST-58170**

## Target file(s)
- `frontend/src/components/ArticleEditorForm/ArticleEditorForm.jsx`

Optional (only if needed to match repo patterns; prefer local helper inside component):
- `frontend/src/helpers/normalizeSubmitError.js` (new) — **ONLY** if the form becomes too noisy

## State additions
In `ArticleEditorForm`:
- `const [isSubmitting, setIsSubmitting] = useState(false)`
- `const [submitError, setSubmitError] = useState(null)`

## Submit handler changes (pseudocode)
```js
const onSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return; // extra guard

  setIsSubmitting(true);
  setSubmitError(null);

  try {
    const article = await setArticle({ /* existing payload */ });
    // existing navigation behavior
  } catch (err) {
    setSubmitError(err);
  } finally {
    setIsSubmitting(false);
  }
};
```

## Button behavior
- `disabled={isSubmitting}`
- `className` unchanged except optional additional style (prefer existing styling)
- label:
  - create mode: `isSubmitting ? 'Publishing…' : 'Publish Article'`
  - edit mode: `isSubmitting ? 'Updating…' : 'Update Article'`

Edit vs create is inferred the same way as existing logic (likely by presence of `slug` / `isEdit`).

## Error summary rendering
Add a block above the form fields:

```jsx
{submitError && (
  <ul className="error-messages">
    {toErrorLines(submitError).map((line) => (
      <li key={line}>{line}</li>
    ))}
  </ul>
)}
```

### `toErrorLines` normalization (tolerant)
Implement a local function in the component:
- If `err` is a string → `[err]`
- If `err` is an array of strings → `err`
- If `err` is an object like `{ errors: { field: [msg] } }` → flatten into `['field msg', ...]`
- If `err` is an object like `{ field: [msg] }` → same flatten
- Else → `['Unexpected error occurred']`

Pseudocode:
```js
function toErrorLines(err) {
  if (!err) return [];
  if (typeof err === 'string') return [err];
  if (Array.isArray(err)) return err.map(String);

  const obj = err?.errors ?? err;
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) => {
      if (Array.isArray(v)) return v.map((m) => `${k} ${m}`);
      return [`${k} ${String(v)}`];
    });
  }

  return ['Unexpected error occurred'];
}
```

## Clearing errors
- Clear on submit start (`setSubmitError(null)`)
- Optionally clear on any input change (out of scope for now; only if requested)

## Edge cases
- Rapid multi-click: both UI disable + handler guard prevent duplicate requests.
- Navigation away while submitting: if component unmounts, state updates may warn; optional `isMounted` guard is usually unnecessary for short-lived requests, but can be added if the repo has a pattern.

## Telemetry/logging
- None (no logging introduced).

## Definition of Done mapping to AC
- AC1–3: `isSubmitting` + disabled + guard
- AC4: error summary tolerant rendering
- AC5: clear error on submit start
