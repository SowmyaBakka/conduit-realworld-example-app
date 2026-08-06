import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FeedContext = createContext();

export function useFeedContext() {
  return useContext(FeedContext);
}

function FeedProvider({ children }) {
  const { isAuth } = useAuth();
  const [{ tabName, tagName, currentPage }, setTab] = useState({
    tabName: isAuth ? "feed" : "global",
    tagName: "",
    currentPage: 0,
  });

  useEffect(() => {
    setTab((tab) => ({ 
      ...tab, 
      tabName: isAuth ? "feed" : "global",
      tagName: "",
      currentPage: 0,
    }));
  }, [isAuth]);

  const changeTab = async (e, tabName) => {
    const tagName = e.target.innerText.trim();

    setTab({ tabName, tagName, currentPage: 0 });
  };

  const clearTagFilter = () => {
    if (tabName !== "tag") return;

    const defaultTab = isAuth ? "feed" : "global";
    setTab({ tabName: defaultTab, tagName: "", currentPage: 0 });
  };

  const setCurrentPage = (page) => {
    setTab((tab) => ({ ...tab, currentPage: page }));
  };

  return (
    <FeedContext.Provider 
      value={{ 
        changeTab, 
        clearTagFilter, 
        tabName, 
        tagName, 
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export default FeedProvider;
