// Test component to verify all type definitions are working correctly
import { WordPressArticle } from '@/types/wordpress';
import { Article } from '@/types/article';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';
import { ApiResponse } from '@/types/api';

export function TypeTest() {
  // Test WordPress API types
  const mockWordPressArticle: WordPressArticle = {
    id: 1,
    date: '2024-01-01T00:00:00Z',
    date_gmt: '2024-01-01T00:00:00Z',
    guid: { rendered: 'https://hypeya.xyz/article/1' },
    modified: '2024-01-01T00:00:00Z',
    modified_gmt: '2024-01-01T00:00:00Z',
    slug: 'test-article',
    status: 'publish',
    type: 'post',
    link: 'https://hypeya.xyz/article/1',
    title: { rendered: 'Test Article' },
    content: { rendered: '<p>Test content</p>', protected: false },
    excerpt: { rendered: '<p>Test excerpt</p>', protected: false },
    author: 1,
    featured_media: 1,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: {},
    categories: [1],
    tags: [1],
    class_list: []
  };

  // Test application types
  const mockArticle: Article = {
    id: 1,
    title: 'Test Article',
    excerpt: 'Test excerpt',
    content: 'Test content',
    slug: 'test-article',
    publishedAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    author: {
      id: 1,
      name: 'Test Author',
      slug: 'test-author'
    },
    featuredImage: {
      id: 1,
      url: 'https://example.com/image.jpg',
      alt: 'Test image',
      width: 800,
      height: 600
    },
    categories: [{ id: 1, name: 'Tech', slug: 'tech', description: 'Tech articles', count: 5, color: '#3B82F6' }],
    tags: [{ id: 1, name: 'NextJS', slug: 'nextjs', description: 'NextJS articles', count: 3 }]
  };

  const mockCategory: Category = {
    id: 1,
    name: 'Technology',
    slug: 'tech',
    description: 'Tech articles',
    count: 10,
    color: '#3B82F6'
  };

  const mockTag: Tag = {
    id: 1,
    name: 'NextJS',
    slug: 'nextjs',
    description: 'NextJS articles',
    count: 5
  };

  const mockApiResponse: ApiResponse<Article[]> = {
    data: [mockArticle],
    success: true,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 10,
      itemsPerPage: 10,
      hasNext: false,
      hasPrevious: false
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Type Test Results</h2>
      
      <div className="grid gap-4">
        <div className="p-3 border rounded">
          <h3 className="font-semibold">WordPress Article Type</h3>
          <p className="text-sm text-gray-600">ID: {mockWordPressArticle.id}</p>
          <p className="text-sm text-gray-600">Title: {mockWordPressArticle.title.rendered}</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">Application Article Type</h3>
          <p className="text-sm text-gray-600">ID: {mockArticle.id}</p>
          <p className="text-sm text-gray-600">Title: {mockArticle.title}</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">Category Type</h3>
          <p className="text-sm text-gray-600">Name: {mockCategory.name}</p>
          <p className="text-sm text-gray-600">Count: {mockCategory.count}</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">Tag Type</h3>
          <p className="text-sm text-gray-600">Name: {mockTag.name}</p>
          <p className="text-sm text-gray-600">Count: {mockTag.count}</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">API Response Type</h3>
          <p className="text-sm text-gray-600">Success: {mockApiResponse.success ? 'Yes' : 'No'}</p>
          <p className="text-sm text-gray-600">Data Length: {mockApiResponse.data.length}</p>
        </div>
      </div>
    </div>
  );
}
