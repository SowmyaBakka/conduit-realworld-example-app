# Low-Level Design (LLD) — EPMCDMETST-58154

Jira: https://jiraeu.epam.com/browse/EPMCDMETST-58154

## 1. URL parsing and normalization

### 1.1 Query params
- `tab`: string
- `tag`: string
- `page`: string

### 1.2 Normalization rules
Pseudo:

```js
const DEFAULT_TAB = isAuth ? "feed" : "global";
const allowedTabs = new Set(["global", "feed", "tag"]);

function normalizeSearchParams({ tab, tag, page }, isAuth) {
  let tabName = allowedTabs.has(tab) ? tab : DEFAULT_TAB;
  let tagName = "";

  if (tabName === "feed" && !isAuth) {
    tabName = "global";
  }

  if (tabName === "tag") {
    tagName = (tag ?? "").trim();
    if (!tagName) {
      tabName = DEFAULT_TAB;
    }
  }

  let pageIndex = Number.parseInt(page, 10);
  if (Number.isNaN(pageIndex) || pageIndex < 0) pageIndex = 0;

  return { tabName, tagName, pageIndex };
}
```

### 1.3 Where implemented
Option A (preferred): a small helper module:
- `frontend/src/helpers/homeFeedQuery.js` exporting `normalizeSearchParams` + `toSearchParams`.

Option B: inline normalization in `Home.jsx`.

## 2. FeedContext refactor

### 2.1 Current
`changeTab(e, tabName)` extracts `tagName` from the clicked element.

### 2.2 Target API
Keep context but make it deterministic and testable:

```ts
type TabName = "global" | "feed" | "tag";

type FeedContextValue = {
  tabName: TabName;
  tagName: string;
  setFeed: (next: { tabName: TabName; tagName?: string }) => void;
};
```

Implementation notes:
- `FeedProvider` receives initial values (derived from URL) via props OR reads them itself from `useSearchParams`.
- `setFeed` should **not** fetch; it only updates URL or internal state.

**Important**: Avoid dual sources of truth. Choose one:
- Preferred: `FeedProvider` wraps `useSearchParams` and exposes derived state + setters.
- Alternative: `Home` parses URL and passes down props; context is just a pass-through.

## 3. Updating tab/tag interactions

### 3.1 Feed toggler (`FeedNavLink.jsx`)
Change from:
- `<button onClick={(e)=>changeTab(e, "global")}>Global Feed</button>`

To:
- call `setSearchParams({ tab: "global", page: 0 })` OR `setFeed({tabName:"global"})` (which performs the URL update).

### 3.2 Popular tag button (`TagButton.jsx`)
Change to set:
- `tab=tag`
- `tag=<tagName>`
- `page=0`

## 4. Pagination (URL-driven)

### 4.1 Current
`ArticlesPagination` calls `getArticles` directly.

### 4.2 Target
- Read current `pageIndex` from URL.
- Set `forcePage={pageIndex}` to keep UI in sync during back/forward.
- On click: update `page` query param, do **not** call `getArticles` directly.
  - Fetch should occur from `useArticles` effect when `pageIndex` changes.

Pseudo:

```js
const [searchParams, setSearchParams] = useSearchParams();
const pageIndex = normalize(...).pageIndex;

const handlePageChange = ({ selected }) => {
  setSearchParams(prev => {
    prev.set("page", String(selected));
    return prev;
  });
};

return <ReactPaginate forcePage={pageIndex} onPageChange={handlePageChange} ... />;
```

## 5. useArticles hook changes

### 5.1 Signature
Add `page`:

```js
function useArticles({ location, tabName, tagName, username, page })
```

### 5.2 Effect dependencies
Add `page` to the dependency array and pass through to `getArticles`.

```js
getArticles({ headers, location, tabName, tagName, username, page })
```

## 6. Handling refresh + back/forward
This comes for free if:
- all selection changes update URL,
- all reads derive from URL,
- components are controlled (pagination `forcePage`).

## 7. Edge cases
- Switching tab while on a high page index: always reset to page 0.
- If tag changes but tab remains `tag`, reset page 0.
- If `articlesCount` reduces and current page becomes out of range, optionally clamp to last page (nice-to-have; not required by AC).

## 8. Tests (LLD)

### 8.1 Unit tests (recommended minimum)
- `normalizeSearchParams` cases:
  - unknown tab
  - tab=tag with missing tag
  - page invalid
  - tab=feed while unauthenticated

### 8.2 Component tests
- Render Home at `/?tab=tag&tag=react&page=2` and assert:
  - Tag pill/tab shown
  - Pagination active page = 2 (via `forcePage`)

### 8.3 E2E (only if Playwright exists)
- Navigate with deep link, assert correct selection, paginate, verify URL updates, go back, state restored.

## 9. Open question / documented assumption
- URL `page` is **zero-based** to match existing `react-paginate` `selected`. If product expects 1-based URLs, adapt with +1/-1 conversion and update docs/tests.
