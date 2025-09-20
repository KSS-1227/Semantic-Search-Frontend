import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (query !== initialQuery) { // Only search if query has changed
        onSearch(query);
      }
    }, 500) as unknown as number; // Debounce time

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, onSearch, initialQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex w-full max-w-3xl items-center space-x-3 rounded-2xl border bg-card p-2 shadow-lg focus-within:ring-2 focus-within:ring-primary/50"
    >
      <motion.div
        initial={false}
        animate={{ width: isFocused ? '100%' : 'auto' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex-grow"
      >
        <Input
          type="text"
          placeholder="Ask me anything about the content..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          className="h-12 w-full border-none bg-transparent text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </motion.div>
      <Button
        onClick={handleSearchClick}
        className="h-12 rounded-xl px-6 shadow-md"
      >
        <Search className="mr-2 h-5 w-5" />
        Search
      </Button>
    </motion.div>
  );
}
