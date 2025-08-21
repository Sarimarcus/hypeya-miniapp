// Test component to verify API constants are working correctly
import { 
  API_CONFIG, 
  API_ENDPOINTS, 
  API_REQUESTS, 
  buildApiUrl 
} from '@/constants/api';

export function ApiConstantsTest() {
  // Test API URL building
  const latestArticlesUrl = buildApiUrl(
    API_ENDPOINTS.POSTS, 
    API_REQUESTS.LATEST_ARTICLES().params
  );
  
  const categoriesUrl = buildApiUrl(
    API_ENDPOINTS.CATEGORIES,
    API_REQUESTS.ALL_CATEGORIES().params
  );
  
  const searchUrl = buildApiUrl(
    API_ENDPOINTS.POSTS,
    API_REQUESTS.SEARCH_ARTICLES('nextjs').params
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">API Constants Test</h2>
      
      <div className="grid gap-4">
        <div className="p-3 border rounded">
          <h3 className="font-semibold">Base Configuration</h3>
          <p className="text-sm text-gray-600">Base URL: {API_CONFIG.BASE_URL}</p>
          <p className="text-sm text-gray-600">Timeout: {API_CONFIG.TIMEOUT}ms</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">Latest Articles URL</h3>
          <p className="text-xs text-gray-600 break-all">{latestArticlesUrl}</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">Categories URL</h3>
          <p className="text-xs text-gray-600 break-all">{categoriesUrl}</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">Search URL (NextJS)</h3>
          <p className="text-xs text-gray-600 break-all">{searchUrl}</p>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-semibold">Dynamic Endpoints</h3>
          <p className="text-sm text-gray-600">Post by ID: {API_ENDPOINTS.POST_BY_ID(123)}</p>
          <p className="text-sm text-gray-600">Category by slug: {API_ENDPOINTS.CATEGORY_BY_SLUG('tech')}</p>
        </div>
      </div>
    </div>
  );
}
