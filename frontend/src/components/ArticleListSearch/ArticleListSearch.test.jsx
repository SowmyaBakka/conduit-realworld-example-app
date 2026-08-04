import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleListSearch from './ArticleListSearch';

describe('ArticleListSearch', () => {
  it('should render search input', () => {
    render(<ArticleListSearch value="" onChange={() => {}} />);
    const input = screen.getByRole('searchbox', { name: /search articles/i });
    expect(input).toBeTruthy();
  });

  it('should display the provided value', () => {
    render(<ArticleListSearch value="test query" onChange={() => {}} />);
    const input = screen.getByRole('searchbox');
    expect(input.value).toBe('test query');
  });

  it('should call onChange when typing', () => {
    const handleChange = vi.fn();
    render(<ArticleListSearch value="" onChange={handleChange} />);
    const input = screen.getByRole('searchbox');
    
    fireEvent.change(input, { target: { value: 'new query' } });
    expect(handleChange).toHaveBeenCalledWith('new query');
  });

  it('should not show clear button when value is empty', () => {
    render(<ArticleListSearch value="" onChange={() => {}} />);
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    expect(clearButton).toBeNull();
  });

  it('should not show clear button when value is only whitespace', () => {
    render(<ArticleListSearch value="   " onChange={() => {}} />);
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    expect(clearButton).toBeNull();
  });

  it('should show clear button when value is non-empty', () => {
    render(<ArticleListSearch value="test" onChange={() => {}} />);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeTruthy();
  });

  it('should call onChange with empty string when clear button is clicked', () => {
    const handleChange = vi.fn();
    render(<ArticleListSearch value="test query" onChange={handleChange} />);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    
    fireEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('should use custom placeholder', () => {
    render(
      <ArticleListSearch
        value=""
        onChange={() => {}}
        placeholder="Find articles..."
      />
    );
    const input = screen.getByPlaceholderText('Find articles...');
    expect(input).toBeTruthy();
  });

  it('should use custom aria-label', () => {
    render(
      <ArticleListSearch
        value=""
        onChange={() => {}}
        ariaLabel="Filter articles"
      />
    );
    const input = screen.getByRole('searchbox', { name: 'Filter articles' });
    expect(input).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ArticleListSearch
        value=""
        onChange={() => {}}
        className="custom-class"
      />
    );
    const searchDiv = container.querySelector('.article-list-search');
    expect(searchDiv.className).toContain('custom-class');
  });

  it('should have data-testid attribute', () => {
    render(<ArticleListSearch value="" onChange={() => {}} />);
    const searchDiv = screen.getByTestId('article-list-search');
    expect(searchDiv).toBeTruthy();
  });
});
