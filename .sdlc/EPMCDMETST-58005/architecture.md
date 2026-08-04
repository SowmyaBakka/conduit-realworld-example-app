# Architecture — Client-side article list search (EPMCDMETST-58005)

## Scope
Frontend-only enhancement to the Conduit RealWorld app to allow users to search within the *currently loaded* article lists (no additional API calls).

- Pages/views affected:
  - Home feed article list ("/")
  - Profile article list (`/profile/:username`)
  - Profile favorites list (`/profile/:username/favorites`)
- Behavior: filter the already-fetched articles array in memory (case-insensitive, match in title, description, author username, tags), and highlight matches in preview title/description.

## Context (existing system)
- Frontend: React + Vite (SWC) in `/frontend/src`
- Backend: Express + Sequelize (PostgreSQL) in `/backend`
- Article listing endpoints already exist (Global/Feed/Tag/Author/Favorited); this story does not change APIs.

## Component/Module architecture

Flow of data from fetch to render with client-side search:

```mermaid
flowchart LR
  U[User] -->|types query| S[ArticleListSearch
(controlled input + clear)]

  subgraph Pages
    H[HomeArticles route]
    P[ProfileArticles route]
    PF[ProfileFavArticles route]
  end

  subgraph State
    Q[searchQuery (string)]
    A[articles (array)
from existing service calls]
  end

  subgraph Logic
    F[filterArticles(articles, query)
case-insensitive match on:
- title
- description
- author.username
- tagList[]]
    HL[highlightMatches(text, query)
render as text+<mark> spans]
  end

  subgraph UI
    L[ArticlesPreview list]
    E[Empty state:
"No articles match your search."]
    Pg[Pagination]
  end

  H --> A
  P --> A
  PF --> A

  S --> Q
  Q --> F
  A --> F

  F -->|filtered list| L
  F -->|0 results & query non-empty| E

  L --> HL

  Q -->|query non-empty| Pg
  Pg -.->|UX decision:
disable/hide or keep but consistent| H
```

### Key design decisions
- **No new backend/API calls**: filtering is performed on the article array already loaded for the current page.
- **Single reusable search UI component**: `ArticleListSearch` is shared across Home and Profile pages.
- **Deterministic filtering**: pure function (`filterArticles`) enables reuse + unit testing.
- **Highlighting is presentational**: avoid `dangerouslySetInnerHTML`; render with React nodes (`<mark>`) built from string splits.
- **Favoriting unaffected**: filtered rendering still passes the original article objects and callbacks so favorite toggles work.

### Non-goals
- Server-side search across all pages/results.
- URL query param sync/persistence.
- Search within full article body.

## Risks & mitigations
- **Pagination + filtering confusion**: when query is non-empty, pagination should be disabled/hidden or clearly labeled as operating on the unfiltered server page.
  - Proposed: hide/disable pagination when query is non-empty (documented in HLD/LLD).
- **Highlight rendering safety**: avoid HTML injection by using tokenized rendering.

## Observability
- No new telemetry.
- Optional: add `data-testid` hooks to improve E2E stability (search input and empty state).
