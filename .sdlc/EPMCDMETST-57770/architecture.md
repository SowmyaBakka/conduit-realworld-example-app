# Architecture — EPMCDMETST-57770

## Scope
Frontend-only enhancement: add a page-size selector (3/10/20) for article lists on Home feeds (Global/Your/Tag) and Profile article lists (My Articles/Favorited), wiring it to fetching and pagination.

## Context (repo-grounded)
- Frontend: React + Vite (SWC) under `frontend/src`
- Article fetch: `frontend/src/services/getArticles.js` supports `limit` (default 3)
- Pagination: `frontend/src/components/ArticlesPagination/ArticlesPagination.jsx` currently hard-codes 3 in total page calc
- Home feed state: `frontend/src/context/FeedContext.jsx` (tabName, tagName)

## Architectural approach
**State flow**
1. UI selector chooses `limit` → store in context (Home) or local state (Profile)
2. On limit change: reset page to 0 and refetch
3. Fetch articles using `getArticles({ limit, page, ... })`
4. Pagination computes `totalPages = ceil(articlesCount / limit)`

## Mermaid: Component + Data-flow
```mermaid
flowchart LR
  subgraph UI[Frontend UI]
    PS[ArticlesPageSizeSelector
(3/10/20)]
    LIST[ArticlesList / Feed view]
    PAG[ArticlesPagination]
  end

  subgraph STATE[State]
    FC[FeedContext
(tabName, tagName, limit)]
    PL[Profile local state
(limit, page)]
  end

  subgraph DATA[Data Access]
    UA[useArticles hook]
    GA[getArticles service
(limit, page, location, tagName, username)]
  end

  subgraph API[Backend API]
    END[/GET /api/articles
GET /api/articles/feed/]
  end

  PS -->|setLimit| FC
  PS -->|setLimit| PL

  FC --> UA
  PL --> UA

  UA -->|calls| GA --> END
  END -->|{articles, articlesCount}| UA --> LIST

  PAG -->|onPageChange(page)| UA
  FC -->|limit| PAG
  PL -->|limit| PAG
  UA -->|updateArticles| PAG
```

## Key design decisions
- **Single source of truth for `limit` per page**:
  - Home: in `FeedContext` so switching tabs preserves the selected limit for that session.
  - Profile lists: local `limit` state per profile page (kept independent from Home).
- **Limit change resets page**: enforce `page = 0` when `limit` changes to avoid requesting offsets beyond the end.
- **No backend changes**: backend already supports `limit`.

## NFRs / constraints
- Minimal UI footprint; reuse existing styling classes.
- Accessibility: use `<label>` + `<select>` semantics.
- Backwards compatible: default remains 3.
