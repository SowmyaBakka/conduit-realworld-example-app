# Implementation plan â€” EPMCDMETST-58005

General goal: Add a client-side search control that filters the currently-loaded article list on Home feed and Profile article lists (ui-only, no backend changes). Search matches title/description/author/username/tags case-insensitively, highlights matches in preview, shows a clear control, and handles a no-results state.

Context
- Epic: EPMCDMETST-58004 â€“ [EPIC] Client-side search within article lists (Home + Profile)
- Story: EPMCDMETST-58005

- Linked Tasks:
  - EPMCDMETST-58006 â€“ Add reusable ArticleListSearch component
  - EPMCDMETST-58007 â€“ Filtering + empty state in HomeArticles
  - EPMODMETST-58008 â€“ Filtering in ProfileArticles + favorites
  - EPMODMETST-58009 â€“ Highlight matches in ArticlesPreview
  - EPMCDMETST-58010 â€” Playwright E2E tests

---

## Implementation steps (at high level)

1) UI component: ArticleListSearch
- Create a small, reusable component (input + clear button) with: value, onChange, onClear, placeholder props.
- Stay consistent with Conduit styling (minimal CSS add if needed).

Eff¢»C¢2Ó†÷W'0 £"’†öÖRfVVC¢f–ÇFW&–ær²æò×&W7VÇG0¢Ò–âF†R†öÖT'F–6ÆW26ö×öæVçBÂ¶VW6V&6…VW'’7FFRæBf–ÇFW"F†R'F–6ÆW2'&’&Vf÷&R&VæFW&–ær&Wf–Ww2à¢Òf–ÇFW"f–VÆG3¢'F–6ÆRçF—FÆRÂ'F–6ÆRæFW67&—F–öâÂ'F–6ÆRæWF†÷"çW6W&æÖRÂ'F–6ÆRçFtÆ—7@¢Ò66RÖ–ç6Vç6—F—fR†RærâFôÆ÷vW$66R‚’¢Òv†VâVW'’æöâÖV×G“ ¢Ò6†÷r6ÆV"6öçG&öÀ¢ÒF—6&ÆR÷"†–FRv–æF–öâ6öçG&öÇ2‡Fòfö–B6öægW6–öã²6–æ6RvRÓ"—2æ÷B6V&6†VB¢Òv†Vâf–ÇFW&VBÆ—7B—2V×G“¢&VæFW"F†RW‡Æ–6—BÖW76vR$æò'F–6ÆW2ÖF6‚–÷W"6V&6‚â  ¤Vfj+´: 2-3 hours

3) Profile lists: reuse filter logic
- Add the same search independently to both:
  - /profile/:username
  - /profile/:username/favorites
- Either extract a small helper (e.g. filterArticles(articles, q)) or a custom hook to avoid duplication.

- Ensure favoriting still works: filtering must apply on the render list only, not mutating the underlying data structures.
effort: 2-3 hours

4) Highlight matches in ArticlesPreview
- Add a highlight function that wraps matched substrings in <mark>.
- Avoid dangerouslySetInnerHTML; use strictly split+ map to render React nodes.
effort: 2-4 hours

5) Playwright E2E tests
- Test home page:
  - type query that filters list
  - clear restores list
  - query with no match shows message
- (Optional) repeat on profile pages with a username that has articles from seed data.
effort: 3-5 hours

---

## Notes
- This is client-side filtering on the current page of articles only. We explicitly avoid network requests to meet the AC
- Pagination behavior: disable while query non-empty, or hide to avoid unclear count.
