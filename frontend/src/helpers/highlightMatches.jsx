/**
 * Highlight matching text within a string.
 * Returns React elements with matched text wrapped in <mark> tags.
 * 
 * @param {string} text - The text to search within
 * @param {string} query - The search query to highlight
 * @returns {React.ReactNode} Text with highlighted matches
 */
export function highlightMatches(text = '', query = '') {
  const q = query.trim();
  if (!q || !text) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = q.toLowerCase();

  const parts = [];
  let currentIndex = 0;

  while (true) {
    const matchIndex = lowerText.indexOf(lowerQuery, currentIndex);
    
    if (matchIndex === -1) {
      // No more matches, add remaining text
      if (currentIndex < text.length) {
        parts.push(text.slice(currentIndex));
      }
      break;
    }

    // Add text before match
    if (matchIndex > currentIndex) {
      parts.push(text.slice(currentIndex, matchIndex));
    }

    // Add matched text with <mark> tag
    const matchedText = text.slice(matchIndex, matchIndex + q.length);
    parts.push(<mark key={matchIndex}>{matchedText}</mark>);

    currentIndex = matchIndex + q.length;
  }

  return <>{parts}</>;
}
