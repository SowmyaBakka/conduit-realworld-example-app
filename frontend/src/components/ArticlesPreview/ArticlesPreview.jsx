import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ArticleMeta from "../ArticleMeta";
import ArticleTags from "../ArticleTags";
import FavButton from "../FavButton";
import { highlightMatches } from "../../helpers/highlightMatches";

function ArticlesPreview({ articles, loading, updateArticles, highlightQuery = '' }) {
  const handleFav = (article) => {
    const items = [...articles];

    const updatedArticles = items.map((item) =>
      item.slug === article.slug ? { ...item, ...article } : item,
    );

    updateArticles((prev) => ({ ...prev, articles: updatedArticles }));
  };

  return articles?.length > 0 ? (
    articles.map((article) => {
      return (
        <div className="article-preview" key={article.slug}>
          <ArticleMeta author={article.author} createdAt={article.createdAt}>
            <FavButton
              favorited={article.favorited}
              favoritesCount={article.favoritesCount}
              handler={handleFav}
              right
              slug={article.slug}
            />
          </ArticleMeta>
          <Link
            to={`/article/${article.slug}`}
            state={article}
            className="preview-link"
          >
            <h1>{highlightQuery ? highlightMatches(article.title, highlightQuery) : article.title}</h1>
            <p>{highlightQuery ? highlightMatches(article.description, highlightQuery) : article.description}</p>
            <span>Read more...</span>
            <ArticleTags tagList={article.tagList} />
          </Link>
        </div>
      );
    })
  ) : loading ? (
    <div className="article-preview">Loading article...</div>
  ) : (
    <div className="article-preview">No articles available.</div>
  );
}

ArticlesPreview.propTypes = {
  articles: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  updateArticles: PropTypes.func.isRequired,
  highlightQuery: PropTypes.string,
};

export default ArticlesPreview;
