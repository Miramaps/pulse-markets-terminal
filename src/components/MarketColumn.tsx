import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { MarketCard } from './MarketCard';
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
import { AnimatePresence } from 'framer-motion';

interface MarketColumnProps {
  title: string;
  markets: Market[];
  selectedMarketId: string | null;
  onSelectMarket: (market: Market) => void;
  priceFlashes: Record<string, boolean>;
  selectedCategory: string | null;
}

type SortOption = 'newest' | 'volume' | 'ending';

export function MarketColumn({
  title,
  markets,
  selectedMarketId,
  onSelectMarket,
  priceFlashes,
  selectedCategory,
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
    <div className="flex flex-col h-full bg-card-solid rounded-2xl border border-stroke card-shadow overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stroke flex items-center justify-between bg-card2-solid">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-semibold text-xs uppercase tracking-wider text-ink">
            {title}
          </h2>
          <span className="text-xs font-medium text-muted-ink bg-canvas2 px-2 py-0.5 rounded-full">
            {filteredMarkets.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Search Popover */}
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-ink hover:text-ink"
              >
                <Search className="w-3.5 h-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-card-solid border-stroke rounded-xl" align="end">
              <div className="relative">
                <Input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 bg-canvas2 border-stroke text-sm"
                  autoFocus
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-ink"
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
                className="h-7 w-7 text-muted-ink hover:text-ink"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card-solid border-stroke rounded-xl min-w-[100px]">
              {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setSort(opt)}
                  className={`text-sm ${sort === opt ? 'text-accent-blue font-medium' : ''}`}
                >
                  {sortLabels[opt]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 scroll-shadow">
        <div className="p-3 space-y-3 pb-24">
          <AnimatePresence mode="popLayout">
            {filteredMarkets.map((market) => (
              <MarketCard
                key={market.id}
                market={market}
                isSelected={selectedMarketId === market.id}
                onSelect={() => onSelectMarket(market)}
                priceFlash={priceFlashes[market.id]}
              />
            ))}
          </AnimatePresence>
          {filteredMarkets.length === 0 && (
            <div className="text-center py-12 text-muted-ink text-sm">
              No markets found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
