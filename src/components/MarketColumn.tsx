import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Check, ArrowUpDown, Filter, Clock, BadgeCheck, DollarSign, LayoutGrid, Eye, EyeOff, Zap, TrendingUp, Users, CalendarClock, ThumbsUp, ThumbsDown, Sparkles, Bitcoin, Vote, Trophy, Tv, Dog, Circle, Square } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { MarketRow } from './MarketRow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketColumnProps {
  title: string;
  markets: Market[];
  selectedMarketId: string | null;
  onSelectMarket: (market: Market) => void;
  priceFlashes: Record<string, boolean>;
  selectedCategory: string | null;
  showProgress?: boolean;
  onToggleWatchlist?: (marketId: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'volume' | 'ending' | 'traders' | 'yes-high' | 'no-high';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVisibility = 'both' | 'yes-only' | 'no-only';
type ShapeOption = 'square' | 'circle';

interface Filters {
  verifiedOnly: boolean;
  minVolume: number | null;
  maxVolume: number | null;
  minTimeLeft: number | null;
  maxTimeLeft: number | null;
  category: string | null;
}

interface DisplaySettings {
  buttonSize: ButtonSize;
  buttonVisibility: ButtonVisibility;
  showSearchBar: boolean;
  imageShape: ShapeOption;
  buttonShape: ShapeOption;
}

const isVerified = (marketId: string): boolean => {
  let hash = 0;
  for (let i = 0; i < marketId.length; i++) {
    hash = ((hash << 3) - hash) + marketId.charCodeAt(i);
  }
  return Math.abs(hash) % 3 !== 0;
};

// Sort option icons and colors
const sortConfig: Record<SortOption, { icon: React.ReactNode; color: string }> = {
  newest: { icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  oldest: { icon: <Clock className="w-3.5 h-3.5" />, color: 'text-slate-400' },
  volume: { icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
  ending: { icon: <CalendarClock className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  traders: { icon: <Users className="w-3.5 h-3.5" />, color: 'text-sky-400' },
  'yes-high': { icon: <ThumbsUp className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
  'no-high': { icon: <ThumbsDown className="w-3.5 h-3.5" />, color: 'text-rose-400' },
};

// Category icons and colors
const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  crypto: { icon: <Bitcoin className="w-3.5 h-3.5" />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  politics: { icon: <Vote className="w-3.5 h-3.5" />, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  sports: { icon: <Trophy className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  pop: { icon: <Tv className="w-3.5 h-3.5" />, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  memes: { icon: <Dog className="w-3.5 h-3.5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export function MarketColumn({
  title,
  markets,
  selectedMarketId,
  onSelectMarket,
  priceFlashes,
  selectedCategory,
  showProgress,
  onToggleWatchlist,
}: MarketColumnProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [fastBuyAmount, setFastBuyAmount] = useState('')
  const [isFastBuyFocused, setIsFastBuyFocused] = useState(false);
  const [minVolumeInput, setMinVolumeInput] = useState('');
  const [maxVolumeInput, setMaxVolumeInput] = useState('');
  const [minTimeInput, setMinTimeInput] = useState('');
  const [maxTimeInput, setMaxTimeInput] = useState('');
  const [filters, setFilters] = useState<Filters>({
    verifiedOnly: false,
    minVolume: null,
    maxVolume: null,
    minTimeLeft: null,
    maxTimeLeft: null,
    category: null,
  });
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    buttonSize: 'large',
    buttonVisibility: 'both',
    showSearchBar: true,
    imageShape: 'square',
    buttonShape: 'circle',
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.verifiedOnly) count++;
    if (filters.minVolume !== null || filters.maxVolume !== null) count++;
    if (filters.minTimeLeft !== null || filters.maxTimeLeft !== null) count++;
    if (filters.category) count++;
    return count;
  }, [filters]);

  const displayChangedCount = useMemo(() => {
    let count = 0;
    if (displaySettings.buttonSize !== 'large') count++;
    if (displaySettings.buttonVisibility !== 'both') count++;
    if (!displaySettings.showSearchBar) count++;
    if (displaySettings.imageShape !== 'square') count++;
    if (displaySettings.buttonShape !== 'circle') count++;
    return count;
  }, [displaySettings]);

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    if (selectedCategory) {
      result = result.filter((m) => m.category === selectedCategory);
    }

    if (filters.category) {
      result = result.filter((m) => m.category === filters.category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.question.toLowerCase().includes(q));
    }

    if (filters.verifiedOnly) {
      result = result.filter((m) => isVerified(m.id));
    }

    if (filters.minVolume !== null) {
      result = result.filter((m) => m.volume >= filters.minVolume!);
    }

    if (filters.maxVolume !== null) {
      result = result.filter((m) => m.volume <= filters.maxVolume!);
    }

    if (filters.minTimeLeft !== null) {
      const minMs = filters.minTimeLeft * 60 * 60 * 1000;
      result = result.filter((m) => {
        const timeLeft = m.resolvesAt.getTime() - Date.now();
        return timeLeft >= minMs;
      });
    }

    if (filters.maxTimeLeft !== null) {
      const maxMs = filters.maxTimeLeft * 60 * 60 * 1000;
      result = result.filter((m) => {
        const timeLeft = m.resolvesAt.getTime() - Date.now();
        return timeLeft <= maxMs && timeLeft > 0;
      });
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'volume':
        result.sort((a, b) => b.volume - a.volume);
        break;
      case 'ending':
        result.sort((a, b) => a.resolvesAt.getTime() - b.resolvesAt.getTime());
        break;
      case 'traders':
        result.sort((a, b) => b.traders - a.traders);
        break;
      case 'yes-high':
        result.sort((a, b) => b.yesPrice - a.yesPrice);
        break;
      case 'no-high':
        result.sort((a, b) => b.noPrice - a.noPrice);
        break;
    }

    return result;
  }, [markets, selectedCategory, search, sort, filters]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    oldest: 'Oldest',
    volume: 'Volume',
    ending: 'Ending Soon',
    traders: 'Traders',
    'yes-high': 'YES Price',
    'no-high': 'NO Price',
  };

  const categories = ['crypto', 'politics', 'sports', 'pop', 'memes'];

  const clearFilters = () => {
    setFilters({
      verifiedOnly: false,
      minVolume: null,
      maxVolume: null,
      minTimeLeft: null,
      maxTimeLeft: null,
      category: null,
    });
    setMinVolumeInput('');
    setMaxVolumeInput('');
    setMinTimeInput('');
    setMaxTimeInput('');
  };

  const resetDisplaySettings = () => {
    setDisplaySettings({
      buttonSize: 'large',
      buttonVisibility: 'both',
      showSearchBar: true,
      imageShape: 'square',
      buttonShape: 'circle',
    });
  };

  const handleMinVolumeChange = (value: string) => {
    setMinVolumeInput(value);
    const numValue = parseFloat(value);
    setFilters(f => ({ ...f, minVolume: value === '' || isNaN(numValue) ? null : numValue }));
  };

  const handleMaxVolumeChange = (value: string) => {
    setMaxVolumeInput(value);
    const numValue = parseFloat(value);
    setFilters(f => ({ ...f, maxVolume: value === '' || isNaN(numValue) ? null : numValue }));
  };

  const handleMinTimeChange = (value: string) => {
    setMinTimeInput(value);
    const numValue = parseFloat(value);
    setFilters(f => ({ ...f, minTimeLeft: value === '' || isNaN(numValue) ? null : numValue }));
  };

  const handleMaxTimeChange = (value: string) => {
    setMaxTimeInput(value);
    const numValue = parseFloat(value);
    setFilters(f => ({ ...f, maxTimeLeft: value === '' || isNaN(numValue) ? null : numValue }));
  };

  const parsedFastBuyAmount = fastBuyAmount ? parseFloat(fastBuyAmount) : null;

  return (
    <div className="flex flex-col h-full bg-panel2 rounded-xl border border-white/10 overflow-hidden terminal-shadow ring-1 ring-white/5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <h2 className="font-display font-semibold text-xs uppercase tracking-wider text-light">
              {title}
            </h2>
            <span className="text-[10px] font-medium text-light-muted bg-row px-2 py-0.5 rounded-full">
              {filteredMarkets.length}
            </span>
          </div>

          <div className="flex-1" />

          {displaySettings.showSearchBar && (
            <div className="relative max-w-[120px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-light-muted" />
              <Input
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-6 pl-6 pr-6 bg-row border-stroke text-[10px] text-light placeholder:text-light-muted/50 rounded-md w-full"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-light-muted hover:text-light"
                  onClick={() => setSearch('')}
                >
                  <X className="w-2.5 h-2.5" />
                </Button>
              )}
            </div>
          )}

          <div className="flex-1" />

          <div className="relative shrink-0">
            <div className="relative w-[50px]">
              <Zap className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-light-muted pointer-events-none" />
              <Input
                type="number"
                placeholder=""
                value={fastBuyAmount}
                onChange={(e) => setFastBuyAmount(e.target.value)}
                onFocus={() => setIsFastBuyFocused(true)}
                onBlur={() => setIsFastBuyFocused(false)}
                className="h-6 pl-5 pr-1 bg-row border-stroke text-[10px] text-light placeholder:text-light-muted/50 rounded-md w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            {/* Fast Buy Preview Popup */}
            {isFastBuyFocused && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="bg-panel/95 backdrop-blur-xl border border-stroke/50 rounded-xl p-3 shadow-2xl min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold text-light">Fast Buy Amount</span>
                  </div>
                  <div className="text-center py-2 px-3 bg-row/50 rounded-lg mb-2">
                    <span className="text-2xl font-bold text-light tabular-nums">
                      ${fastBuyAmount || '0'}
                    </span>
                  </div>
                  <p className="text-[10px] text-light-muted text-center">
                    Click YES/NO to instantly buy this amount
                  </p>
                  {/* Quick amount buttons */}
                  <div className="flex gap-1 mt-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFastBuyAmount(amt.toString());
                        }}
                        className={`flex-1 py-1 text-[9px] font-medium rounded-md transition-colors ${
                          fastBuyAmount === amt.toString()
                            ? 'bg-light text-panel'
                            : 'bg-row/50 text-light-muted hover:bg-row hover:text-light'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Display Button */}
          <Dialog open={isDisplayOpen} onOpenChange={setIsDisplayOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 hover:bg-row rounded-md relative shrink-0 ${
                  displayChangedCount > 0 ? 'text-light' : 'text-light-muted hover:text-light'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                {displayChangedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-light text-[9px] font-bold rounded-full flex items-center justify-center text-panel">
                    {displayChangedCount}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[280px] p-0 bg-panel/60 backdrop-blur-2xl border-stroke/20 rounded-xl gap-0 shadow-2xl overflow-hidden">
              {/* Header */}
              <DialogHeader className="px-4 py-3 border-b border-stroke/30">
                <DialogTitle className="text-sm font-semibold text-light flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-light-muted" />
                  Display Settings
                  {displayChangedCount > 0 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 text-light-muted border border-stroke/30">
                      {displayChangedCount}
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="max-h-[70vh]">
                {/* Button Size Section */}
                <div className="p-4">
                  <div className="text-[10px] text-light-muted uppercase tracking-wider mb-3">Button Size</div>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as ButtonSize[]).map((size) => {
                      const isActive = displaySettings.buttonSize === size;
                      const sizeIcons = {
                        small: <div className="w-3 h-3 rounded border-2 border-current" />,
                        medium: <div className="w-4 h-4 rounded border-2 border-current" />,
                        large: <div className="w-5 h-5 rounded border-2 border-current" />,
                      };
                      return (
                        <button
                          key={size}
                          onClick={() => setDisplaySettings(d => ({ ...d, buttonSize: size }))}
                          className={`flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-white/5 text-light border border-stroke/50' 
                              : 'text-light-muted hover:text-light hover:bg-row/50'
                          }`}
                        >
                          {sizeIcons[size]}
                          <span className="text-[10px] font-medium capitalize">{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-stroke/50 mx-3" />

                {/* Image Shape Section */}
                <div className="p-4">
                  <div className="text-[10px] text-light-muted uppercase tracking-wider mb-3">Image Shape</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDisplaySettings(d => ({ ...d, imageShape: 'square' }))}
                      className={`flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        displaySettings.imageShape === 'square' 
                          ? 'bg-white/5 text-light border border-stroke/50' 
                          : 'text-light-muted hover:text-light hover:bg-row/50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md border-2 border-current bg-current/20" />
                      <span className="text-[10px] font-medium">Square</span>
                    </button>
                    <button
                      onClick={() => setDisplaySettings(d => ({ ...d, imageShape: 'circle' }))}
                      className={`flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        displaySettings.imageShape === 'circle' 
                          ? 'bg-white/5 text-light border border-stroke/50' 
                          : 'text-light-muted hover:text-light hover:bg-row/50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-current bg-current/20" />
                      <span className="text-[10px] font-medium">Circle</span>
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stroke/50 mx-3" />

                {/* Button Shape Section */}
                <div className="p-4">
                  <div className="text-[10px] text-light-muted uppercase tracking-wider mb-3">Button Shape</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDisplaySettings(d => ({ ...d, buttonShape: 'square' }))}
                      className={`flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        displaySettings.buttonShape === 'square' 
                          ? 'bg-white/5 text-light border border-stroke/50' 
                          : 'text-light-muted hover:text-light hover:bg-row/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-5 h-3 rounded border-2 border-emerald-500/60 bg-emerald-500/20" />
                        <div className="w-5 h-3 rounded border-2 border-rose-500/60 bg-rose-500/20" />
                      </div>
                      <span className="text-[10px] font-medium">Square</span>
                    </button>
                    <button
                      onClick={() => setDisplaySettings(d => ({ ...d, buttonShape: 'circle' }))}
                      className={`flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        displaySettings.buttonShape === 'circle' 
                          ? 'bg-white/5 text-light border border-stroke/50' 
                          : 'text-light-muted hover:text-light hover:bg-row/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500/60 bg-emerald-500/20" />
                        <div className="w-5 h-5 rounded-full border-2 border-rose-500/60 bg-rose-500/20" />
                      </div>
                      <span className="text-[10px] font-medium">Circle</span>
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stroke/50 mx-3" />

                {/* Button Visibility Section */}
                <div className="p-4">
                  <div className="text-[10px] text-light-muted uppercase tracking-wider mb-3">Show Buttons</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setDisplaySettings(d => ({ ...d, buttonVisibility: 'both' }))}
                      className={`flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        displaySettings.buttonVisibility === 'both' 
                          ? 'bg-white/5 text-light border border-stroke/50' 
                          : 'text-light-muted hover:text-light hover:bg-row/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500/30" />
                        <div className="w-4 h-4 rounded border-2 border-rose-500 bg-rose-500/30" />
                      </div>
                      <span className="text-[9px] font-medium">Both</span>
                    </button>
                    <button
                      onClick={() => setDisplaySettings(d => ({ ...d, buttonVisibility: 'yes-only' }))}
                      className={`flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        displaySettings.buttonVisibility === 'yes-only' 
                          ? 'bg-white/5 text-light border border-stroke/50' 
                          : 'text-light-muted hover:text-light hover:bg-row/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500/30" />
                        <div className="w-4 h-4 rounded border-2 border-light-muted/20 bg-light-muted/5" />
                      </div>
                      <span className="text-[9px] font-medium">YES</span>
                    </button>
                    <button
                      onClick={() => setDisplaySettings(d => ({ ...d, buttonVisibility: 'no-only' }))}
                      className={`flex flex-col items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                        displaySettings.buttonVisibility === 'no-only' 
                          ? 'bg-white/5 text-light border border-stroke/50' 
                          : 'text-light-muted hover:text-light hover:bg-row/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded border-2 border-light-muted/20 bg-light-muted/5" />
                        <div className="w-4 h-4 rounded border-2 border-rose-500 bg-rose-500/30" />
                      </div>
                      <span className="text-[9px] font-medium">NO</span>
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stroke/50 mx-3" />

                {/* Search Bar Toggle */}
                <div className="p-4">
                  <button
                    onClick={() => setDisplaySettings(d => ({ ...d, showSearchBar: !d.showSearchBar }))}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      displaySettings.showSearchBar 
                        ? 'bg-white/5 border border-stroke/50' 
                        : 'hover:bg-row/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Search className={`w-3.5 h-3.5 ${displaySettings.showSearchBar ? 'text-light' : 'text-light-muted'}`} />
                      <span className={`text-[11px] font-medium ${displaySettings.showSearchBar ? 'text-light' : 'text-light-muted'}`}>
                        Show Search Bar
                      </span>
                    </span>
                    {/* Toggle */}
                    <div className={`w-8 h-4 rounded-full transition-all duration-200 ${displaySettings.showSearchBar ? 'bg-light' : 'bg-light-muted/20'}`}>
                      <div className={`w-3 h-3 mt-0.5 rounded-full shadow-sm transition-all duration-200 ${displaySettings.showSearchBar ? 'ml-[18px] bg-panel' : 'ml-0.5 bg-light-muted'}`} />
                    </div>
                  </button>
                </div>

                {/* Reset Footer */}
                {displayChangedCount > 0 && (
                  <>
                    <div className="h-px bg-stroke/50" />
                    <div className="p-3">
                      <button
                        onClick={resetDisplaySettings}
                        className="w-full px-3 py-2 text-[11px] font-medium text-light-muted hover:text-light hover:bg-row/50 rounded-lg transition-colors"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Filter Button */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 hover:bg-row rounded-md relative shrink-0 ${
                  activeFilterCount > 0 ? 'text-light' : 'text-light-muted hover:text-light'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-light text-[9px] font-bold rounded-full flex items-center justify-center text-panel">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[300px] max-h-[80vh] p-0 bg-panel/60 backdrop-blur-2xl border-stroke/20 rounded-xl gap-0 shadow-2xl overflow-hidden">
              {/* Header */}
              <DialogHeader className="px-4 py-3 border-b border-stroke/30">
                <DialogTitle className="text-sm font-semibold text-light flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-light-muted" />
                  Sort & Filter
                  {(activeFilterCount > 0 || sort !== 'newest') && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 text-light-muted border border-stroke/30">
                      {activeFilterCount + (sort !== 'newest' ? 1 : 0)} active
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="max-h-[calc(85vh-80px)]">
                {/* Sort Section */}
                <div className="p-4">
                  <div className="text-[10px] text-light-muted uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(sortLabels) as SortOption[]).map((opt) => {
                      const config = sortConfig[opt];
                      const isActive = sort === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setSort(opt)}
                          className={`group relative flex items-center gap-2 px-3 py-2.5 text-[11px] font-medium rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-white/5 text-light border border-stroke/50' 
                              : 'text-light-muted hover:text-light hover:bg-row/50'
                          }`}
                        >
                          <span className={isActive ? config.color : 'text-light-muted'}>
                            {config.icon}
                          </span>
                          <span className="flex-1 text-left">{sortLabels[opt]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-stroke/50 mx-3" />

                {/* Filters Section */}
                <div className="p-4">
                  <div className="text-[10px] text-light-muted uppercase tracking-wider mb-3">Filters</div>

                  {/* Verified Only Toggle */}
                  <button
                    onClick={() => setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all duration-200 mb-3 ${
                      filters.verifiedOnly 
                        ? 'bg-white/5 border border-stroke/50' 
                        : 'bg-row/30 hover:bg-row/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BadgeCheck className={`w-4 h-4 ${filters.verifiedOnly ? 'text-emerald-400' : 'text-light-muted'}`} />
                      <span className={`text-[11px] font-medium ${filters.verifiedOnly ? 'text-light' : 'text-light-muted'}`}>
                        Verified Only
                      </span>
                    </span>
                    <div className={`w-8 h-4 rounded-full transition-all duration-200 ${filters.verifiedOnly ? 'bg-emerald-500' : 'bg-light-muted/20'}`}>
                      <div className={`w-3 h-3 mt-0.5 rounded-full bg-white shadow-sm transition-all duration-200 ${filters.verifiedOnly ? 'ml-[18px]' : 'ml-0.5'}`} />
                    </div>
                  </button>

                  {/* Volume Range */}
                  <div className="mb-3 p-3 rounded-xl bg-row/30 border border-stroke/30">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-light-muted" />
                      <span className="text-[10px] font-medium text-light-muted">Volume Range</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minVolumeInput}
                        onChange={(e) => handleMinVolumeChange(e.target.value)}
                        className="h-8 px-2 bg-panel border-stroke/50 text-[11px] text-light placeholder:text-light-muted/40 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] text-light-muted/50">→</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxVolumeInput}
                        onChange={(e) => handleMaxVolumeChange(e.target.value)}
                        className="h-8 px-2 bg-panel border-stroke/50 text-[11px] text-light placeholder:text-light-muted/40 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Time Left Range */}
                  <div className="mb-3 p-3 rounded-xl bg-row/30 border border-stroke/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5 text-light-muted" />
                      <span className="text-[10px] font-medium text-light-muted">Time Left (hours)</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minTimeInput}
                        onChange={(e) => handleMinTimeChange(e.target.value)}
                        className="h-8 px-2 bg-panel border-stroke/50 text-[11px] text-light placeholder:text-light-muted/40 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] text-light-muted/50">→</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxTimeInput}
                        onChange={(e) => handleMaxTimeChange(e.target.value)}
                        className="h-8 px-2 bg-panel border-stroke/50 text-[11px] text-light placeholder:text-light-muted/40 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="p-3 rounded-xl bg-row/30 border border-stroke/30">
                    <div className="text-[10px] font-medium text-light-muted mb-2">Category</div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setFilters(f => ({ ...f, category: null }))}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-all duration-200 ${
                          filters.category === null
                            ? 'bg-white/5 text-light border border-stroke/50'
                            : 'text-light-muted hover:text-light hover:bg-row/50'
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => {
                        const config = categoryConfig[cat];
                        const isActive = filters.category === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setFilters(f => ({ ...f, category: cat }))}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-all duration-200 capitalize ${
                              isActive
                                ? `${config.bg} ${config.color} border border-current/30`
                                : 'text-light-muted hover:text-light hover:bg-row/50'
                            }`}
                          >
                            {config.icon}
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Clear Filters Footer */}
                {activeFilterCount > 0 && (
                  <>
                    <div className="h-px bg-stroke/50" />
                    <div className="p-3">
                      <button
                        onClick={clearFilters}
                        className="w-full px-3 py-2 text-[11px] font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 divide-stroke">
        <div className="divide-stroke">
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
                  buttonSize={displaySettings.buttonSize}
                  buttonVisibility={displaySettings.buttonVisibility}
                  fastBuyAmount={parsedFastBuyAmount}
                  imageShape={displaySettings.imageShape}
                  buttonShape={displaySettings.buttonShape}
                  onToggleWatchlist={onToggleWatchlist}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredMarkets.length === 0 && (
            <div className="text-center py-12 text-light-muted text-xs">
              No markets found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
