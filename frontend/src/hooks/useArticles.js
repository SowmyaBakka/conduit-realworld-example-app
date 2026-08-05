import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import getArticles from "../services/getArticles";

function useArticles({ location, tabName, tagName, username, page = 0 }) {
  const [{ articles, articlesCount }, setArticlesData] = useState({
    articles: [],
    articlesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { headers } = useAuth();

  useEffect(() => {
    if (!headers && tabName === "feed") return;

    setLoading(true);

    getArticles({ headers, location, tabName, tagName, username, page })
      .then(setArticlesData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [headers, location, tabName, tagName, username, page]);

  return { articles, articlesCount, loading, setArticlesData };
}

export default useArticles;
