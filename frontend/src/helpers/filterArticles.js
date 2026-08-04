/**
 * Filter articles based on a search query.
 * Matches case-insensitively against title, description, author username, and tags.
 * 
 * @param {Array} articles - Array of article objects to filter
 * @param {string} query - Search query string
 * @returns {Array} Filtered array of articles
 */
export function filterArticles(articles, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return articles;

  return (articles || []).filter((article) => {
    const haystacks = [
      article?.title,
      article?.description,
      article?.author?.username,
      Array.isArray(article?.tagList) ? article.tagList.join(' ') : '',
    ].map((s) => (s || '').toLowerCase());

    return haystacks.some((haystack) => haystack.includes(q));
  });
}
