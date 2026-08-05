/**
 * Helper functions for Home feed URL query parameter parsing and normalization.
 * Used to sync Home feed state (tab, tag, page) with URL query params.
 */

/**
 * Normalizes URL search params for Home feed state.
 * Handles fallbacks and validation.
 *
 * @param {Object} params - Raw query params from URLSearchParams
 * @param {string} params.tab - Tab name (global | feed | tag)
 * @param {string} params.tag - Tag name (required when tab=tag)
 * @param {string} params.page - Page index (zero-based)
 * @param {boolean} isAuth - Whether user is authenticated
 * @returns {Object} Normalized state { tabName, tagName, pageIndex }
 */
export function normalizeSearchParams({ tab, tag, page }, isAuth) {
  const DEFAULT_TAB = isAuth ? "feed" : "global";
  const allowedTabs = new Set(["global", "feed", "tag"]);

  let tabName = allowedTabs.has(tab) ? tab : DEFAULT_TAB;
  let tagName = "";

  // If user wants "feed" tab but is not authenticated, fallback to global
  if (tabName === "feed" && !isAuth) {
    tabName = "global";
  }

  // If tab is "tag", validate that tag param exists
  if (tabName === "tag") {
    tagName = (tag ?? "").trim();
    if (!tagName) {
      tabName = DEFAULT_TAB;
    }
  }

  // Parse and validate page index (zero-based)
  let pageIndex = Number.parseInt(page, 10);
  if (Number.isNaN(pageIndex) || pageIndex < 0) {
    pageIndex = 0;
  }

  return { tabName, tagName, pageIndex };
}

/**
 * Converts feed state to URL search params object.
 *
 * @param {Object} state - Feed state
 * @param {string} state.tabName - Tab name (global | feed | tag)
 * @param {string} state.tagName - Tag name (only used when tabName=tag)
 * @param {number} state.pageIndex - Page index (zero-based)
 * @returns {Object} Search params object ready for setSearchParams
 */
export function toSearchParams({ tabName, tagName, pageIndex }) {
  const params = { tab: tabName };

  if (tabName === "tag" && tagName) {
    params.tag = tagName;
  }

  if (pageIndex > 0) {
    params.page = String(pageIndex);
  }

  return params;
}
