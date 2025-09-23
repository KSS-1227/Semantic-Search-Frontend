import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { FiltersSidebar } from '@/components/FiltersSidebar';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { searchApi, SearchResult, SearchFilters } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    contentTypes: [],
    locales: [],
    dateRange: 'all',
  });
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showExplainability, setShowExplainability] = useState(false);

  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setLoading(true);
    const data = await searchApi(searchQuery, searchFilters);
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    // Only perform search if query is not empty and has meaningful content
    if (query && query.trim().length > 0) {
      performSearch(query, filters);
    } else {
      // Clear results if query is empty
      setResults([]);
      setLoading(false);
    }
  }, [query, filters]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const toggleAnalytics = () => {
    setIsAnalyticsOpen((prev) => !prev);
  };

  const toggleExplainability = () => {
    setShowExplainability((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onToggleAnalytics={toggleAnalytics} isAnalyticsOpen={isAnalyticsOpen} onToggleFilters={() => setIsMobileFiltersOpen(true)} />
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Filters */}
          <FiltersSidebar
            onApplyFilters={handleApplyFilters}
            currentFilters={filters}
            isMobile={false}
          />

          {/* Mobile Filters Button */}
          <div className="fixed bottom-4 right-4 lg:hidden z-40">
            <Button
              className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter className="h-6 w-6" />
              <span className="sr-only">Open Filters</span>
            </Button>
          </div>
          <FiltersSidebar
            onApplyFilters={handleApplyFilters}
            currentFilters={filters}
            isMobile={true}
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
          />

          {/* Center Panel - Search Bar & Results */}
          <div className="flex-1 flex flex-col items-center gap-8">
            <SearchBar onSearch={handleSearch} initialQuery={query} />
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                onClick={toggleExplainability}
                className="rounded-full shadow-sm text-sm"
              >
                {showExplainability ? 'Hide Explainability' : 'Show Explainability'}
              </Button>
            </div>
            <SearchResults results={results} loading={loading} query={query} showExplainability={showExplainability} />
          </div>

          {/* Right Panel - Analytics Dashboard */}
          {isAnalyticsOpen && <AnalyticsDashboard />}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
