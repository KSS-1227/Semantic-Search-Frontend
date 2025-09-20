import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart2, Menu, X, Wifi, WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useBackendStatus } from '@/hooks/use-backend-status';

interface NavbarProps {
  onToggleAnalytics: () => void;
  isAnalyticsOpen: boolean;
  onToggleFilters: () => void;
}

export function Navbar({ onToggleAnalytics, isAnalyticsOpen, onToggleFilters }: NavbarProps) {
  const { isConnected, isLoading, error } = useBackendStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-sm border-b border-border/40 shadow-sm"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Semantic Search</h1>
          {/* Backend Status Indicator */}
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className="ml-2 flex items-center gap-1"
          >
            {isLoading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : isConnected ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {isLoading ? 'Connecting...' : isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-4 md:flex">
          <Button
            variant="ghost"
            onClick={onToggleAnalytics}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <BarChart2 className="h-4 w-4" />
            {isAnalyticsOpen ? 'Hide Stats' : 'Show Stats'}
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] rounded-l-2xl">
              <div className="flex flex-col space-y-6 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onToggleAnalytics();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start gap-3 rounded-lg px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <BarChart2 className="h-5 w-5" />
                  {isAnalyticsOpen ? 'Hide Stats' : 'Show Stats'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onToggleFilters();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start gap-3 rounded-lg px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Search className="h-5 w-5" />
                  Show Filters
                </Button>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-base font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
