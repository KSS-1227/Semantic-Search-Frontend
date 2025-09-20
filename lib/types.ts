export type ContentType = 'blog_post' | 'documentation' | 'product' | 'faq' | 'tutorial' | 'guide';
export type Locale = 'en-us' | 'en-gb' | 'es-es' | 'fr-fr' | 'de-de' | 'hi-in' | 'zh-cn';
export type DateRange = '7d' | '30d' | 'all' | 'recent' | 'last_7_days';

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  contentType: string; // Backend uses contentType
  locale: string;
  updatedAt: string; // ISO
  similarity: number; // Backend uses similarity instead of score
  explainability?: string;
}

export interface SearchFilters {
  contentTypes: string[]; // More flexible to handle any content type from backend
  locales: string[]; // More flexible to handle any locale from backend
  dateRange: DateRange;
  smart?: 'trending' | 'recent' | 'high';
}

export interface QueryData {
  name: string;
  value: number;
}

export interface QueryTrendData {
  name: string;
  queries: number;
}

export interface AnalyticsData {
  topQueries: QueryData[];
  searchSuccessRate: QueryData[];
  queryTrends: QueryTrendData[];
  totalQueriesToday: number;
  topLocale: string;
  wordCloud: { text: string; value: number }[];
}
