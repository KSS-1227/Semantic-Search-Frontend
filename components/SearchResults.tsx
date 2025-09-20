import { SearchResult } from '@/lib/api';
import { SearchResultCard } from '@/components/SearchResultCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Frown } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  query: string;
  showExplainability: boolean;
}

export function SearchResults({ results, loading, query, showExplainability }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl shadow-md" />
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground rounded-2xl border border-dashed border-border/60 bg-card/50 shadow-inner"
      >
        <Frown className="h-16 w-16 mb-4 text-muted-foreground/60" />
        <h3 className="text-xl font-semibold mb-2 text-foreground">No results found</h3>
        <p className="text-lg">Try rephrasing your query or adjusting the filters.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {results.map((result) => (
        <SearchResultCard
          key={result.id || result.url}
          result={result}
          highlightQuery={query}
          showExplainability={showExplainability}
        />
      ))}
    </div>
  );
}
