import { useParams } from "react-router-dom";
import ArticlesPagination from "../../components/ArticlesPagination";
import ArticlesPreview from "../../components/ArticlesPreview";
import ArticleListSearch from "../../components/ArticleListSearch";
import useArticleList from "../../hooks/useArticles";
import useArticleListSearch from "../../hooks/useArticleListSearch";

function ProfileFavArticles() {
  const { username } = useParams();

  const { articles, articlesCount, loading, setArticlesData } = useArticleList({
    location: "favorites",
    username,
  });

  const { query, setQuery, visibleArticles, isSearching } = useArticleListSearch(articles);

  return loading ? (
    <div className="article-preview">
      <em>Loading {username} favorites articles...</em>
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
              location="favorites"
              updateArticles={setArticlesData}
              username={username}
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
    <div className="article-preview">{username} doesn't have favorites.</div>
  );
}

export default ProfileFavArticles;
