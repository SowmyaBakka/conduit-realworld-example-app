import { useState, useMemo } from 'react';
import { filterArticles } from '../helpers/filterArticles';

/**
 * Custom hook for managing article list search functionality.
 * Provides search query state and filtered articles.
 * 
 * @param {Array} articles - Array of articles to filter
 * @returns {Object} Search state and filtered articles
 * @returns {string} return.query - Current search query
 * @returns {Function} return.setQuery - Function to update search query
 * @returns {Array} return.visibleArticles - Filtered articles based on query
 * @returns {boolean} return.isSearching - Whether a search is active
 */
function useArticleListSearch(articles) {
  const [query, setQuery] = useState('');

  const visibleArticles = useMemo(
    () => filterArticles(articles, query),
    [articles, query]
  );

  const isSearching = query.trim().length > 0;

  return {
    query,
    setQuery,
    visibleArticles,
    isSearching,
  };
}

export default useArticleListSearch;
