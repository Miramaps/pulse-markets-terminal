import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { MarketRow } from './MarketRow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketColumnProps {
  title: string;
  markets: Market[];
  selectedMarketId: string | null;
  onSelectMarket: (market: Market) => void;
  priceFlashes: Record<string, boolean>;
  selectedCategory: string | null;
  showProgress?: boolean;
}

type SortOption = 'newest' | 'volume' | 'ending';

export function MarketColumn({
  title,
  markets,
  selectedMarketId,
  onSelectMarket,
  priceFlashes,
  selectedCategory,
  showProgress,
}: MarketColumnProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    if (selectedCategory) {
      result = result.filter((m) => m.category === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.question.toLowerCase().includes(q));
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'volume':
        result.sort((a, b) => b.volume - a.volume);
        break;
      case 'ending':
        result.sort((a, b) => a.resolvesAt.getTime() - b.resolvesAt.getTime());
        break;
    }

    return result;
  }, [markets, selectedCategory, search, sort]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    volume: 'Volume',
    ending: 'Ending',
  };

  return (
    <div className="flex flex-col h-full bg-panel2 rounded-lg border border-stroke overflow-hidden terminal-shadow">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stroke flex items-center justify-between bg-panel shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-semibold text-[11px] uppercase tracking-wider text-light">
            {title}
          </h2>
          <span className="text-[10px] font-medium text-light-muted bg-row px-1.5 py-0.5 rounded">
            {filteredMarkets.length}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Search Popover */}
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-light-muted hover:text-light hover:bg-row"
              >
                <Search className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-panel border-stroke rounded-lg" align="end">
              <div className="relative">
                <Input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 bg-row border-stroke text-xs text-light placeholder:text-light-muted"
                  autoFocus
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 text-light-muted"
                    onClick={() => setSearch('')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-light-muted hover:text-light hover:bg-row"
              >
                <SlidersHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-panel border-stroke rounded-lg min-w-[90px]">
              {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setSort(opt)}
                  className={`text-xs ${sort === opt ? 'text-accent-blue' : 'text-light'}`}
                >
                  {sortLabels[opt]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-stroke">
          <AnimatePresence mode="popLayout">
            {filteredMarkets.map((market) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MarketRow
                  market={market}
                  isSelected={selectedMarketId === market.id}
                  onSelect={() => onSelectMarket(market)}
                  priceFlash={priceFlashes[market.id]}
                  showProgress={showProgress}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredMarkets.length === 0 && (
            <div className="text-center py-8 text-light-muted text-xs">
              No markets found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
