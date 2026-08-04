# LLD — Client-side article list search (EPMCDMETST-58005)

## Proposed file changes (frontend)
> Exact paths may be adjusted to match existing repo conventions, but intent remains.

### 1) New component: `ArticleListSearch`
- **Path**: `frontend/src/components/ArticleListSearch/ArticleListSearch.jsx`
- **Exports**: default `ArticleListSearch`
- **Props**:
  - `value: string` — current query
  - `onChange: (nextValue: string) => void`
  - `placeholder?: string` (default: `"Search articles..."`)
  - `ariaLabel?: string` (default: `"Search articles"`)
  - `className?: string` (optional)
- **Rendering**:
  - Input type `search` (or `text`) controlled by `value`
  - Clear button shown when `value.trim().length > 0`

**Pseudo-code**
```jsx
function ArticleListSearch({ value, onChange, placeholder = 'Search articles...', ariaLabel = 'Search articles' }) {
  const showClear = value.trim().length > 0;

  return (
    <div className="article-list-search" data-testid="article-list-search">
      <input
        type="search"
        className="form-control"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
      />

      {showClear && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          Clear
        </button>
      )}
    </div>
  );
}
```

### 2) New helper: `filterArticles`
- **Path**: `frontend/src/helpers/filterArticles.js`
- **Signature**: `filterArticles(articles: Article[], query: string): Article[]`
- **Algorithm**:
  - `q = query.trim().toLowerCase()`
  - if empty => return original `articles`
  - for each article:
    - build searchable fields:
      - `title`, `description`, `author.username`, `tagList.join(' ')`
    - return true if any includes `q`

**Pseudo-code**
```js
export function filterArticles(articles, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return articles;

  return (articles || []).filter((a) => {
    const haystacks = [
      a?.title,
      a?.description,
      a?.author?.username,
      Array.isArray(a?.tagList) ? a.tagList.join(' ') : ''
    ].map((s) => (s || '').toLowerCase());

    return haystacks.some((h) => h.includes(q));
  });
}
```

### 3) New helper: `highlightMatches`
- **Path**: `frontend/src/helpers/highlightMatches.jsx` (or `.js` returning React nodes)
- **Signature**: `highlightMatches(text: string, query: string): ReactNode`
- **Rules**:
  - If query is blank => return original text
  - Case-insensitive highlighting; preserve original casing in output
  - Implementation: find match indices, produce array of strings + `<mark>` segments

**Pseudo-code**
```jsx
export function highlightMatches(text = '', query = '') {
  const q = query.trim();
  if (!q) return text;

  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();

  const parts = [];
  let i = 0;
  while (true) {
    const idx = lower.indexOf(qLower, i);
    if (idx === -1) {
      parts.push(text.slice(i));
      break;
    }
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(<mark key={idx}>{text.slice(idx, idx + q.length)}</mark>);
    i = idx + q.length;
  }

  return <>{parts}</>;
}
```

### 4) Route integration points
#### Home
- **Likely path**: `frontend/src/routes/Home/HomeArticles.jsx` (verify actual)
- Add `searchQuery` state, render `ArticleListSearch`.
- Derive `visibleArticles = useMemo(() => filterArticles(articles, searchQuery), [articles, searchQuery])`
- Hide pagination when `searchQuery.trim()` is non-empty.

#### Profile
- **Likely paths**:
  - `frontend/src/routes/Profile/ProfileArticles.jsx`
  - `frontend/src/routes/Profile/ProfileFavArticles.jsx`
- Same integration as Home; consider a shared hook:
  - `useArticleListSearch(articles)` returning `{ query, setQuery, visibleArticles, isSearching }`

### 5) ArticlesPreview highlight
- **Path**: `frontend/src/components/ArticlesPreview/ArticlesPreview.jsx`
- Add optional prop `highlightQuery?: string`
- When rendering title/description, wrap via `highlightMatches`.

## CSS
- Minimal CSS in existing `frontend/src/styles.css`:
  - `.article-list-search { display:flex; gap: 0.5rem; align-items:center; margin: 1rem 0; }`
  - `mark { background: #fff3cd; padding: 0 0.1rem; }` (tune to match theme)

## Edge cases
- Null/undefined article fields handled safely.
- Query with leading/trailing whitespace should behave as trimmed match.
- If query contains regex characters, no special handling needed since we use `indexOf`.

## Testing hooks
- Add `data-testid="article-list-search"` and `data-testid="article-list-empty"` to stabilize E2E.
