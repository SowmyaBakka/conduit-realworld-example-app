import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { highlightMatches } from './highlightMatches';

describe('highlightMatches', () => {
  it('should return original text when query is empty', () => {
    const result = highlightMatches('Hello World', '');
    expect(result).toBe('Hello World');
  });

  it('should return original text when query is whitespace', () => {
    const result = highlightMatches('Hello World', '   ');
    expect(result).toBe('Hello World');
  });

  it('should return original text when text is empty', () => {
    const result = highlightMatches('', 'query');
    expect(result).toBe('');
  });

  it('should highlight single match', () => {
    const result = highlightMatches('Hello World', 'World');
    const { container } = render(<div>{result}</div>);
    const mark = container.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.textContent).toBe('World');
  });

  it('should highlight multiple matches', () => {
    const result = highlightMatches('Hello Hello Hello', 'Hello');
    const { container } = render(<div>{result}</div>);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(3);
    marks.forEach((mark) => {
      expect(mark.textContent).toBe('Hello');
    });
  });

  it('should be case-insensitive', () => {
    const result = highlightMatches('Hello World', 'hello');
    const { container } = render(<div>{result}</div>);
    const mark = container.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.textContent).toBe('Hello');
  });

  it('should preserve original casing in output', () => {
    const result = highlightMatches('Hello WORLD', 'world');
    const { container } = render(<div>{result}</div>);
    const mark = container.querySelector('mark');
    expect(mark.textContent).toBe('WORLD');
  });

  it('should highlight partial matches', () => {
    const result = highlightMatches('JavaScript is awesome', 'Script');
    const { container } = render(<div>{result}</div>);
    const mark = container.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.textContent).toBe('Script');
  });

  it('should handle text with no matches', () => {
    const result = highlightMatches('Hello World', 'xyz');
    const { container } = render(<div>{result}</div>);
    expect(container.textContent).toBe('Hello World');
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(0);
  });

  it('should handle overlapping substrings correctly', () => {
    const result = highlightMatches('aaaa', 'aa');
    const { container } = render(<div>{result}</div>);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(2);
  });
});
