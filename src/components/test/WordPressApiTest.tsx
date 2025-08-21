// Test component to verify WordPress API service functionality
'use client';

import { useState } from 'react';
import { wordpressApi } from '@/services/wordpress';
import { Article } from '@/types/article';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';
import { Button } from '@/components/ui/button';

export function WordPressApiTest() {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testLatestArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wordpressApi.getLatestArticles(1, 3);
      if (response.success) {
        setArticles(response.data);
        console.log('Latest Articles Response:', response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      console.error('API Error:', err);
    }
    setLoading(false);
  };

  const testCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wordpressApi.getCategories();
      if (response.success) {
        setCategories(response.data.slice(0, 5)); // Show only first 5
        console.log('Categories Response:', response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      console.error('API Error:', err);
    }
    setLoading(false);
  };

  const testTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wordpressApi.getTags();
      if (response.success) {
        setTags(response.data.slice(0, 5)); // Show only first 5
        console.log('Tags Response:', response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      console.error('API Error:', err);
    }
    setLoading(false);
  };

  const clearResults = () => {
    setArticles([]);
    setCategories([]);
    setTags([]);
    setError(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">WordPress API Test</h2>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={testLatestArticles} 
          disabled={loading}
          size="sm"
        >
          {loading ? 'Loading...' : 'Test Articles'}
        </Button>
        <Button 
          onClick={testCategories} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? 'Loading...' : 'Test Categories'}
        </Button>
        <Button 
          onClick={testTags} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? 'Loading...' : 'Test Tags'}
        </Button>
        <Button 
          onClick={clearResults}
          variant="destructive"
          size="sm"
        >
          Clear
        </Button>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 rounded text-red-700">
          <h3 className="font-semibold">Error:</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {articles.length > 0 && (
        <div className="p-3 border rounded">
          <h3 className="font-semibold mb-2">Latest Articles ({articles.length})</h3>
          <div className="space-y-2">
            {articles.map(article => (
              <div key={article.id} className="p-2 bg-gray-50 rounded">
                <h4 className="font-medium text-sm">{article.title}</h4>
                <p className="text-xs text-gray-600">
                  ID: {article.id} | Slug: {article.slug}
                </p>
                <p className="text-xs text-gray-600">
                  Categories: {article.categories.map(c => c.name).join(', ') || 'None'}
                </p>
                <p className="text-xs text-gray-600">
                  Tags: {article.tags.map(t => t.name).join(', ') || 'None'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="p-3 border rounded">
          <h3 className="font-semibold mb-2">Categories ({categories.length})</h3>
          <div className="grid grid-cols-1 gap-2">
            {categories.map(category => (
              <div key={category.id} className="p-2 bg-blue-50 rounded">
                <span className="font-medium text-sm">{category.name}</span>
                <span className="text-xs text-gray-600 ml-2">
                  ({category.count} posts)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="p-3 border rounded">
          <h3 className="font-semibold mb-2">Tags ({tags.length})</h3>
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <span 
                key={tag.id} 
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
              >
                {tag.name} ({tag.count})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border rounded bg-yellow-50">
        <h3 className="font-semibold text-sm">Note:</h3>
        <p className="text-xs text-gray-600">
          You need to add WP_API_USERNAME and WP_API_KEY to .env.local for authenticated requests.
          The service will work for public endpoints without authentication.
        </p>
      </div>
    </div>
  );
}
