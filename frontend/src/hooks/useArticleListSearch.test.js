import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useArticleListSearch from './useArticleListSearch';

describe('useArticleListSearch', () => {
  const mockArticles = [
    {
      slug: 'article-1',
      title: 'React Best Practices',
      description: 'Learn React',
      author: { username: 'john' },
      tagList: ['react'],
    },
    {
      slug: 'article-2',
      title: 'TypeScript Guide',
      description: 'Learn TypeScript',
      author: { username: 'jane' },
      tagList: ['typescript'],
    },
  ];

  it('should initialize with empty query', () => {
    const { result } = renderHook(() => useArticleListSearch(mockArticles));
    expect(result.current.query).toBe('');
    expect(result.current.isSearching).toBe(false);
  });

  it('should return all articles when query is empty', () => {
    const { result } = renderHook(() => useArticleListSearch(mockArticles));
    expect(result.current.visibleArticles).toEqual(mockArticles);
  });

  it('should update query when setQuery is called', () => {
    const { result } = renderHook(() => useArticleListSearch(mockArticles));
    
    act(() => {
      result.current.setQuery('react');
    });

    expect(result.current.query).toBe('react');
    expect(result.current.isSearching).toBe(true);
  });

  it('should filter articles based on query', () => {
    const { result } = renderHook(() => useArticleListSearch(mockArticles));
    
    act(() => {
      result.current.setQuery('react');
    });

    expect(result.current.visibleArticles).toHaveLength(1);
    expect(result.current.visibleArticles[0].slug).toBe('article-1');
  });

  it('should update visibleArticles when query changes', () => {
    const { result } = renderHook(() => useArticleListSearch(mockArticles));
    
    act(() => {
      result.current.setQuery('react');
    });
    expect(result.current.visibleArticles).toHaveLength(1);

    act(() => {
      result.current.setQuery('typescript');
    });
    expect(result.current.visibleArticles).toHaveLength(1);
    expect(result.current.visibleArticles[0].slug).toBe('article-2');
  });

  it('should set isSearching to true when query is non-empty', () => {
    const { result } = renderHook(() => useArticleListSearch(mockArticles));
    
    act(() => {
      result.current.setQuery('test');
    });

    expect(result.current.isSearching).toBe(true);
  });

  it('should set isSearching to false when query is empty or whitespace', () => {
    const { result } = renderHook(() => useArticleListSearch(mockArticles));
    
    act(() => {
      result.current.setQuery('   ');
    });

    expect(result.current.isSearching).toBe(false);
  });

  it('should handle articles array updates', () => {
    const { result, rerender } = renderHook(
      ({ articles }) => useArticleListSearch(articles),
      { initialProps: { articles: mockArticles } }
    );

    expect(result.current.visibleArticles).toHaveLength(2);

    const newArticles = [mockArticles[0]];
    rerender({ articles: newArticles });

    expect(result.current.visibleArticles).toHaveLength(1);
  });
});
