import { createContext, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { normalizeSearchParams, toSearchParams } from "../helpers/homeFeedQuery";
import { useAuth } from "./AuthContext";

const FeedContext = createContext();

export function useFeedContext() {
  return useContext(FeedContext);
}

function FeedProvider({ children }) {
  const { isAuth } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse and normalize current URL state
  const { tabName, tagName, pageIndex } = normalizeSearchParams(
    {
      tab: searchParams.get("tab"),
      tag: searchParams.get("tag"),
      page: searchParams.get("page"),
    },
    isAuth
  );

  /**
   * Update feed selection (tab and optionally tag).
   * Always resets page to 0 when changing tabs/tags.
   *
   * @param {Object} next - New feed state
   * @param {string} next.tabName - Tab name (global | feed | tag)
   * @param {string} [next.tagName] - Tag name (required when tabName=tag)
   */
  const setFeed = ({ tabName: newTabName, tagName: newTagName = "" }) => {
    setSearchParams(
      toSearchParams({
        tabName: newTabName,
        tagName: newTagName,
        pageIndex: 0, // Always reset to first page on tab/tag change
      })
    );
  };

  return (
    <FeedContext.Provider value={{ tabName, tagName, pageIndex, setFeed }}>
      {children}
    </FeedContext.Provider>
  );
}

export default FeedProvider;
