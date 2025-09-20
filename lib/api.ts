// Backend API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://your-backend-url.com' // Update this with your production URL
    : 'http://localhost:3000');

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  contentType: string;
  locale: string;
  updatedAt: string;
  similarity: number;
  explainability?: string;
}

export interface SearchFilters {
  contentTypes: string[];
  locales: string[];
  dateRange: string;
}

export interface AnalyticsData {
  topQueries: { name: string; value: number }[];
  searchSuccessRate: { name: string; value: number }[];
  queryTrends: { name: string; queries: number }[];
  totalQueriesToday: number;
  topLocale: string;
  wordCloud: { text: string; value: number }[];
}

// Utility function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Search API function with fallback
export const searchApi = async (
  query: string,
  filters: SearchFilters
): Promise<SearchResult[]> => {
  try {
    const response = await apiCall('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        filters,
        limit: 20,
        threshold: 0.5,
      }),
    });

    // Transform backend response to match frontend interface
    return response.results.map((result: any) => ({
      id: result.id,
      title: result.title,
      snippet: result.snippet,
      url: result.url,
      contentType: result.contentType,
      locale: result.locale,
      updatedAt: result.updatedAt || new Date().toISOString(),
      similarity: result.similarity,
      explainability: `Similarity score: ${(result.similarity * 100).toFixed(1)}%`,
    }));
  } catch (error) {
    console.warn('Backend search failed, using mock data:', error);
    // Fallback to mock data if backend is not available
    return getMockSearchResults(query, filters);
  }
};

// Get filter options from backend with fallback
export const getFilterOptions = async () => {
  try {
    const response = await apiCall('/api/filters');
    return response.filters;
  } catch (error) {
    console.warn('Backend filters failed, using mock data:', error);
    // Fallback filter options
    return {
      contentTypes: [
        { value: 'blog_post', label: 'Blog Post' },
        { value: 'product', label: 'Product' },
        { value: 'documentation', label: 'Documentation' },
        { value: 'faq', label: 'FAQ' },
      ],
      locales: [
        { value: 'en-us', label: 'English (US)' },
        { value: 'hi-in', label: 'Hindi (हिन्दी)' },
        { value: 'bn-in', label: 'Bengali (বাংলা)' },
        { value: 'ta-in', label: 'Tamil (தமிழ்)' },
        { value: 'te-in', label: 'Telugu (తెలుగు)' },
        { value: 'mr-in', label: 'Marathi (मराठी)' },
      ],
    };
  }
};

// Analytics API function with fallback
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    const response = await apiCall('/api/analytics/dashboard?days=7');
    
    // Transform backend analytics to match frontend interface
    const topQueries = response.topQueries?.slice(0, 5).map((item: any) => ({
      name: item.query,
      value: item.count,
    })) || [];

    const searchSuccessRate = [
      { name: 'Successful', value: Math.round(response.successRate?.successRate || 85) },
      { name: 'Unsuccessful', value: Math.round(100 - (response.successRate?.successRate || 85)) },
    ];

    const queryTrends = response.trends?.map((item: any) => ({
      name: new Date(item.date).toLocaleDateString('en', { month: 'short' }),
      queries: item.count,
    })) || [];

    return {
      topQueries,
      searchSuccessRate,
      queryTrends,
      totalQueriesToday: response.summary?.totalQueries || 0,
      topLocale: 'en-us',
      wordCloud: response.wordCloud?.slice(0, 20) || [],
    };
  } catch (error) {
    console.warn('Backend analytics failed, using mock data:', error);
    return getMockAnalyticsData();
  }
};

// Mock data fallbacks
const getMockSearchResults = (query: string, filters: SearchFilters): SearchResult[] => {
  const mockResults = [
    {
      id: '1',
      title: 'AI Content Strategy: A Deep Dive',
      snippet: 'Learn how to integrate AI into your content workflow to boost efficiency and engagement.',
      url: 'https://cms.example.com/entry/ai-content-strategy',
      contentType: 'blog_post',
      locale: 'en-us',
      updatedAt: '2023-10-26T10:00:00Z',
      similarity: 0.92,
      explainability: 'Similarity score: 92.0%',
    },
    {
      id: '2',
      title: 'Product Feature: Semantic Search Integration',
      snippet: 'Our latest product update includes a powerful semantic search integration.',
      url: 'https://cms.example.com/entry/semantic-search-feature',
      contentType: 'product',
      locale: 'en-us',
      updatedAt: '2024-07-15T14:30:00Z',
      similarity: 0.88,
      explainability: 'Similarity score: 88.0%',
    },
  ];

  // Simple filtering for mock data
  return mockResults.filter(result => {
    const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                        result.snippet.toLowerCase().includes(query.toLowerCase());
    const matchesContentType = filters.contentTypes.length === 0 || 
                               filters.contentTypes.includes(result.contentType);
    const matchesLocale = filters.locales.length === 0 || 
                         filters.locales.includes(result.locale);
    return matchesQuery && matchesContentType && matchesLocale;
  });
};

const getMockAnalyticsData = (): AnalyticsData => {
  return {
    topQueries: [
      { name: 'AI Content', value: 120 },
      { name: 'Semantic Search', value: 90 },
      { name: 'Embeddings Guide', value: 75 },
    ],
    searchSuccessRate: [
      { name: 'Successful', value: 85 },
      { name: 'Unsuccessful', value: 15 },
    ],
    queryTrends: [
      { name: 'Jan', queries: 150 },
      { name: 'Feb', queries: 170 },
      { name: 'Mar', queries: 200 },
    ],
    totalQueriesToday: 42,
    topLocale: 'en-us',
    wordCloud: [
      { text: 'search', value: 50 },
      { text: 'content', value: 30 },
      { text: 'AI', value: 25 },
    ],
  };
};
