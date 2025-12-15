import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { MarketRow } from './MarketRow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MarketColumnProps {
  title: string;
  markets: Market[];
  selectedMarket: Market | null;
  onSelectMarket: (market: Market) => void;
  priceFlashes: Record<string, boolean>;
  selectedCategory: string | null;
}

type SortOption = 'newest' | 'volume' | 'ending';

export function MarketColumn({ title, markets, selectedMarket, onSelectMarket, priceFlashes, selectedCategory }: MarketColumnProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredMarkets = useMemo(() => {
    let result = [...markets];
    if (selectedCategory) result = result.filter((m) => m.category === selectedCategory);
    if (search) { const q = search.toLowerCase(); result = result.filter((m) => m.question.toLowerCase().includes(q)); }
    switch (sort) {
      case 'newest': result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); break;
      case 'volume': result.sort((a, b) => b.volume - a.volume); break;
      case 'ending': result.sort((a, b) => a.resolvesAt.getTime() - b.resolvesAt.getTime()); break;
    }
    return result;
  }, [markets, selectedCategory, search, sort]);

  const sortLabels: Record<SortOption, string> = { newest: 'Recent', volume: 'Volume', ending: 'Ending' };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider">{title}</h2>
          <span className="text-[10px] font-mono text-muted-foreground">{filteredMarkets.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground">
                <SlidersHorizontal className="w-3 h-3 mr-1" />{sortLabels[sort]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-panel border-border min-w-[80px]">
              {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                <DropdownMenuItem key={opt} onClick={() => setSort(opt)} className={`text-xs ${sort === opt ? 'text-accent-beige' : ''}`}>{sortLabels[opt]}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground"><Search className="w-3 h-3" /></Button></PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2 bg-panel border-border">
              <Input placeholder="Filter…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 text-xs bg-card border-border" autoFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2 pb-20">
          {filteredMarkets.map((market) => (
            <MarketRow key={market.id} market={market} isSelected={selectedMarket?.id === market.id} onSelect={onSelectMarket} priceFlash={priceFlashes[market.id]} />
          ))}
          {filteredMarkets.length === 0 && <div className="text-center py-12 text-muted-foreground text-xs">No markets</div>}
        </div>
      </ScrollArea>
    </div>
  );
}
