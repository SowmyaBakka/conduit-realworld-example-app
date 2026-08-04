import { describe, it, expect } from 'vitest';
import { filterArticles } from './filterArticles';

describe('filterArticles', () => {
  const mockArticles = [
    {
      slug: 'article-1',
      title: 'React Best Practices',
      description: 'Learn how to write better React code',
      author: { username: 'johndoe' },
      tagList: ['react', 'javascript'],
    },
    {
      slug: 'article-2',
      title: 'Introduction to TypeScript',
      description: 'A beginner guide to TypeScript',
      author: { username: 'janedoe' },
      tagList: ['typescript', 'tutorial'],
    },
    {
      slug: 'article-3',
      title: 'Node.js Performance Tips',
      description: 'Optimize your Node.js applications',
      author: { username: 'admin' },
      tagList: ['nodejs', 'performance'],
    },
  ];

  it('should return all articles when query is empty', () => {
    expect(filterArticles(mockArticles, '')).toEqual(mockArticles);
    expect(filterArticles(mockArticles, '   ')).toEqual(mockArticles);
  });

  it('should return all articles when query is null or undefined', () => {
    expect(filterArticles(mockArticles, null)).toEqual(mockArticles);
    expect(filterArticles(mockArticles, undefined)).toEqual(mockArticles);
  });

  it('should filter by title (case-insensitive)', () => {
    const result = filterArticles(mockArticles, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('article-1');
  });

  it('should filter by description (case-insensitive)', () => {
    const result = filterArticles(mockArticles, 'optimize');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('article-3');
  });

  it('should filter by author username (case-insensitive)', () => {
    const result = filterArticles(mockArticles, 'JANEDOE');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('article-2');
  });

  it('should filter by tags (case-insensitive)', () => {
    const result = filterArticles(mockArticles, 'typescript');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('article-2');
  });

  it('should return multiple matches', () => {
    const result = filterArticles(mockArticles, 'doe');
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.slug)).toContain('article-1');
    expect(result.map((a) => a.slug)).toContain('article-2');
  });

  it('should handle partial matches', () => {
    const result = filterArticles(mockArticles, 'type');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('article-2');
  });

  it('should return empty array when no matches', () => {
    const result = filterArticles(mockArticles, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('should handle articles with missing fields', () => {
    const articlesWithMissing = [
      { slug: 'article-4', title: null, description: null, author: null, tagList: null },
      { slug: 'article-5', title: 'Valid Title' },
    ];
    const result = filterArticles(articlesWithMissing, 'valid');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('article-5');
  });

  it('should handle empty articles array', () => {
    expect(filterArticles([], 'query')).toEqual([]);
  });

  it('should handle null articles array', () => {
    expect(filterArticles(null, 'query')).toEqual([]);
  });
});
