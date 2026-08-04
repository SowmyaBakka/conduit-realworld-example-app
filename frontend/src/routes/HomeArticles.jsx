import ArticlesPagination from "../components/ArticlesPagination";
import ArticlesPreview from "../components/ArticlesPreview";
import ArticleListSearch from "../components/ArticleListSearch";
import { useFeedContext } from "../context/FeedContext";
import useArticleList from "../hooks/useArticles";
import useArticleListSearch from "../hooks/useArticleListSearch";

function HomeArticles() {
  const { tabName, tagName } = useFeedContext();

  const { articles, articlesCount, loading, setArticlesData } = useArticleList({
    location: tabName,
    tabName,
    tagName,
  });

  const { query, setQuery, visibleArticles, isSearching } = useArticleListSearch(articles);

  return loading ? (
    <div className="article-preview">
      <em>Loading articles list...</em>
    </div>
  ) : articles.length > 0 ? (
    <>
      <ArticleListSearch
        value={query}
        onChange={setQuery}
        placeholder="Search articles..."
      />

      {visibleArticles.length > 0 ? (
        <>
          <ArticlesPreview
            articles={visibleArticles}
            loading={loading}
            updateArticles={setArticlesData}
            highlightQuery={query}
          />

          {!isSearching && (
            <ArticlesPagination
              articlesCount={articlesCount}
              location={tabName}
              tagName={tagName}
              updateArticles={setArticlesData}
            />
          )}
        </>
      ) : (
        <div className="article-list-empty" data-testid="article-list-empty">
          No articles match your search.
        </div>
      )}
    </>
  ) : (
    <div className="article-preview">Articles not available.</div>
  );
}

export default HomeArticles;
