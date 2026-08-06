# Architecture — EPMCDMETST-58457

Jira: **Story** [EPMCDMETST-58457](https://jiraeu.epam.com/browse/EPMCDMETST-58457)  
Epic: **EPMCDMETST-57719**

## Goal
Add an explicit way to clear an active Home feed tag filter and make pagination predictable by controlling the selected page and resetting it when switching tabs/tags.

## Current architecture (relevant slice)
- Frontend: React (Vite) application under `frontend/src`.
- Feed state: `frontend/src/context/FeedContext.jsx` stores `{tabName, tagName}` and exposes `changeTab()`.
- Articles data fetching: `frontend/src/hooks/useArticles.js` calls `frontend/src/services/getArticles.js`.
- Pagination UI: `frontend/src/components/ArticlesPagination/ArticlesPagination.jsx` uses `react-paginate` and triggers `getArticles()` on selection.

## Target architecture
### Key decisions
- Keep this change **frontend-only** (no API/DB changes).
- Move pagination state to `FeedContext` as a single source of truth:
  - `currentPage: number` (0-based index, compatible with `react-paginate`)
  - `setCurrentPage(page: number)`
  - Reset page to `0` whenever:
    - tab changes (Global/Your Feed/Tag)
    - tag is cleared
    - a new tag is selected
- Make pagination controlled:
  - `ArticlesPagination` receives `currentPage` and invokes `onPageChange` (context setter + data fetch)
  - Use `forcePage={currentPage}` to keep UI in sync.
- Add explicit “Clear” affordance in `FeedToggler` when a tag is active.

### Component / data flow diagram (Mermaid)
```mermaid
flowchart LR
  subgraph UI[Home Page UI]
    FT[FeedToggler]
    HA[HomeArticles]
    AP[ArticlesPagination]
    PT[PopularTags]
  end

  subgraph Ctx[React Context]
    FC[FeedContext\n(tabName, tagName, currentPage)]
  end

  subgraph Data[Data layer]
    UA[useArticles hook]
    GA[getArticles service]
    API[(Backend API\nGET /api/articles)]
  end

  PT -- select tag --> FC
  FT -- switch tab / clear tag --> FC
  AP -- set page --> FC

  FC -- (tabName, tagName, currentPage) --> UA
  UA -- calls --> GA
  GA -- HTTP --> API
  UA -- setArticlesData --> HA
  HA -- props (count, currentPage) --> AP
```

## Non-functional considerations
- Accessibility: "Clear" control should be keyboard accessible and have an `aria-label`.
- Consistency: continue using existing patterns (`FeedNavLink` for tabs) and existing data fetching service (`getArticles`).

## Out of scope
- Changing backend paging size/strategy.
- Introducing URL-driven state (query params) for tab/tag/page.
