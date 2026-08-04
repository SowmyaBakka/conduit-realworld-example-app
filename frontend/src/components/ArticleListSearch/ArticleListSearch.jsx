import PropTypes from 'prop-types';

/**
 * ArticleListSearch component provides a search input with a clear button.
 * Allows users to filter articles in real-time.
 * 
 * @param {Object} props
 * @param {string} props.value - Current search query
 * @param {Function} props.onChange - Callback when query changes
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.ariaLabel - ARIA label for accessibility
 * @param {string} props.className - Additional CSS classes
 */
function ArticleListSearch({
  value,
  onChange,
  placeholder = 'Search articles...',
  ariaLabel = 'Search articles',
  className = '',
}) {
  const showClear = value.trim().length > 0;

  return (
    <div
      className={`article-list-search ${className}`.trim()}
      data-testid="article-list-search"
    >
      <input
        type="search"
        className="form-control"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
      />

      {showClear && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          Clear
        </button>
      )}
    </div>
  );
}

ArticleListSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default ArticleListSearch;
