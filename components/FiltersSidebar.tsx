import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { SearchFilters, getFilterOptions } from '@/lib/api';

interface FiltersSidebarProps {
  onApplyFilters: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FiltersSidebar({
  onApplyFilters,
  currentFilters,
  isMobile = false,
  isOpen,
  onClose,
}: FiltersSidebarProps) {
  const [contentTypes, setContentTypes] = useState<string[]>(currentFilters.contentTypes);
  const [locales, setLocales] = useState<string[]>(currentFilters.locales);
  const [dateRange, setDateRange] = useState<string>(currentFilters.dateRange);
  const [availableContentTypes, setAvailableContentTypes] = useState<{value: string, label: string}[]>([]);
  const [availableLocales, setAvailableLocales] = useState<{value: string, label: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setContentTypes(currentFilters.contentTypes);
    setLocales(currentFilters.locales);
    setDateRange(currentFilters.dateRange);
  }, [currentFilters]);

  useEffect(() => {
    // Load filter options from backend
    const loadFilterOptions = async () => {
      try {
        const options = await getFilterOptions();
        setAvailableContentTypes(options.contentTypes || []);
        setAvailableLocales(options.locales || []);
      } catch (error) {
        console.error('Failed to load filter options:', error);
        // Fallback to default options
        setAvailableContentTypes([
          { value: 'blog_post', label: 'Blog Post' },
          { value: 'product', label: 'Product' },
          { value: 'documentation', label: 'Documentation' },
          { value: 'faq', label: 'FAQ' },
        ]);
        setAvailableLocales([
          { value: 'en-us', label: 'English (US)' },
          { value: 'es-es', label: 'Spanish' },
          { value: 'fr-fr', label: 'French' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleContentTypeChange = (type: string, checked: boolean) => {
    setContentTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type)
    );
  };

  const handleLocaleChange = (locale: string) => {
    setLocales([locale]); // Assuming single locale selection for simplicity
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  const applyFilters = () => {
    onApplyFilters({ contentTypes, locales, dateRange });
    onClose?.();
  };

  const clearFilters = () => {
    setContentTypes([]);
    setLocales([]);
    setDateRange('all');
    onApplyFilters({ contentTypes: [], locales: [], dateRange: 'all' });
    onClose?.();
  };

  const content = (
    <div className="flex h-full flex-col p-4">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Filters</h3>
      <Accordion type="multiple" defaultValue={['content-type', 'locale', 'date-range']} className="w-full">
        <AccordionItem value="content-type" className="border-b border-border/40">
          <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
            Content Type
          </AccordionTrigger>
          <AccordionContent className="py-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading content types...</div>
            ) : (
              <div className="grid gap-2">
                {availableContentTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.value}`}
                      checked={contentTypes.includes(type.value)}
                      onCheckedChange={(checked) =>
                        handleContentTypeChange(type.value, checked as boolean)
                      }
                      className="rounded-sm"
                    />
                    <Label htmlFor={`type-${type.value}`} className="text-muted-foreground">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="locale" className="border-b border-border/40">
          <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
            Locale
          </AccordionTrigger>
          <AccordionContent className="py-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading locales...</div>
            ) : (
              <Select value={locales[0] || ''} onValueChange={handleLocaleChange}>
                <SelectTrigger className="w-full rounded-lg shadow-sm bg-input text-foreground">
                  <SelectValue placeholder="Select a locale" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg">
                  {availableLocales.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date-range" className="border-b border-border/40">
          <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
            Date Range
          </AccordionTrigger>
          <AccordionContent className="py-3">
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-full rounded-lg shadow-sm bg-input text-foreground">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="recent">Last 24 Hours</SelectItem>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator className="my-6 bg-border/40" />
      <div className="flex flex-col gap-3">
        <Button onClick={applyFilters} className="w-full rounded-xl shadow-md">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-full rounded-xl shadow-md">
          Clear Filters
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
          <SheetHeader className="flex flex-row items-center justify-between pb-4">
            <SheetTitle className="text-2xl font-bold text-foreground">Filters</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Close filters</span>
              </Button>
            </SheetClose>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="hidden lg:block w-full max-w-xs rounded-2xl border bg-card p-6 shadow-lg"
    >
      {content}
    </motion.div>
  );
}
