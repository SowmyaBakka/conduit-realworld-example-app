# HLD — Client-side article list search (EPMCDMETST-58005)

## Goals
Implement a UI-only “Search articles” capability that filters the **currently loaded** set of articles on:
- Home feed (`/`)
- Profile articles (`/profile/:username`)
- Profile favorites (`/profile/:username/favorites`)

This is **client-side filtering only** (no new API calls).

## User experience
### Placement
- A search input is displayed **above the article preview list**, below the feed toggles (Home) or below the profile header (Profile).

### Behavior
- Typing updates the list in real-time.
- Case-insensitive match on:
  - `article.title`
  - `article.description`
  - `article.author.username`
  - `article.tagList[]`
- When query is non-empty:
  - A **Clear** control is shown; it resets query to empty.
  - **Pagination is hidden/disabled** to avoid confusing “page of filtered results” (since we only filter the current page’s items).
- When filtered results are empty:
  - show: **“No articles match your search.”**

### Highlighting
- In each `ArticlesPreview` item:
  - Highlight query matches in **title** and **description**.
  - Use `<mark>` styling (CSS) and React-safe token rendering (no HTML injection).

## High-level architecture
### New shared UI component
- `ArticleListSearch` (frontend component)
  - controlled input, emits `onChange(query)`
  - shows Clear button when `query.length > 0`

### Reused list rendering
- Existing route components continue to fetch articles via existing services.
- Each route component applies:
  - `const filtered = filterArticles(articles, query)`
  - Conditional rendering of:
    - `ArticlesPreview` list for `filtered`
    - empty state message
  - Conditional rendering of pagination:
    - show only when `query === ''`

### Cross-cutting helper logic
- `filterArticles(articles, query)`
- `highlightMatches(text, query)`

## Data flow
1. Route loads articles as today (network request).
2. `ArticleListSearch` updates `searchQuery` state.
3. `filterArticles` derives `visibleArticles`.
4. `ArticlesPreview` renders `visibleArticles`.
5. Title/description are rendered through `highlightMatches` to wrap matching tokens.

## Performance considerations
- Filtering is O(n * m) where n = articles on the current page (small, typically 10) and m = fields checked.
- Use `useMemo` for `visibleArticles` and for highlight tokenization if needed, but keep it simple.

## Accessibility
- Search input has a visible label or `aria-label="Search articles"`.
- Clear button is keyboard-focusable and has `aria-label="Clear search"`.
- Highlight uses semantic `<mark>`.

## Acceptance criteria mapping
- AC1/AC7: Search input on Home + Profile routes.
- AC2/AC3: Client-side filter, case-insensitive across required fields.
- AC4: Clear control + pagination hidden/disabled when searching.
- AC5: Empty state message.
- AC6: Highlight in title/description.
- AC8: Favoriting remains functional because original callbacks/IDs are preserved.
