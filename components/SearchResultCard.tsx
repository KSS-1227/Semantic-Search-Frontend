import { motion } from 'framer-motion';
import { Book, Package, FileText, HelpCircle, Globe, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SearchResultCardProps {
  result: {
    id: string;
    title: string;
    snippet: string;
    url: string;
    contentType: string;
    locale: string;
    updatedAt: string;
    similarity: number;
    explainability?: string;
  };
  highlightQuery: string;
  showExplainability: boolean;
}

const getTypeIcon = (contentType: string) => {
  const type = contentType.toLowerCase();
  if (type.includes('blog')) return <Book className="h-4 w-4" />;
  if (type.includes('product')) return <Package className="h-4 w-4" />;
  if (type.includes('doc')) return <FileText className="h-4 w-4" />;
  if (type.includes('faq')) return <HelpCircle className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

const formatLocale = (locale: string) => {
  const localeMap: { [key: string]: string } = {
    'en-us': 'English (US)',
    'en-gb': 'English (UK)',
    'es-es': 'Spanish',
    'fr-fr': 'French',
    'de-de': 'German',
    'hi-in': 'Hindi',
    'zh-cn': 'Chinese',
  };
  return localeMap[locale] || locale.toUpperCase();
};

export function SearchResultCard({ result, highlightQuery, showExplainability }: SearchResultCardProps) {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="h-full flex flex-col rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
            >
              {highlightText(result.title, highlightQuery)}
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow text-sm text-muted-foreground">
          <p className="line-clamp-3">
            {highlightText(result.snippet, highlightQuery)}
          </p>
          {showExplainability && result.explainability && (
            <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
              Why this matched: {result.explainability}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow-sm">
              {getTypeIcon(result.contentType)}
              {result.contentType}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow-sm">
              <Globe className="h-3 w-3" />
              {formatLocale(result.locale)}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow-sm">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(result.updatedAt), { addSuffix: true })}
            </Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Similarity:</span>
                  <Progress value={result.similarity * 100} className="h-2 w-24 rounded-full" />
                  <span className="font-semibold text-primary">{(result.similarity * 100).toFixed(0)}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg shadow-lg">
                <p>Similarity score: {(result.similarity * 100).toFixed(2)}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
