import { useState } from 'react';
import { Search, ChevronDown, Wallet, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TopNavProps {
  onCreateMarket: () => void;
  onDiscover?: () => void;
  onWatchlist?: () => void;
  watchlistCount?: number;
}

const navItems = ['Discover', 'Pulse', 'Trackers', 'Markets', 'Portfolio', 'Rewards'];

export function TopNav({ onCreateMarket, onDiscover, onWatchlist, watchlistCount = 0 }: TopNavProps) {
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');
  const [activeNav, setActiveNav] = useState('Discover');

  const handleNavClick = (item: string) => {
    setActiveNav(item);
    if (item === 'Discover' && onDiscover) {
      onDiscover();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-panel border-b border-stroke shrink-0">
      <div className="h-12 px-4 md:px-6 2xl:px-8 flex items-center gap-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-4 shrink-0">
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={onDiscover}
          >
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-panel font-display font-bold text-xs">P</span>
            </div>
            <span className="font-display font-semibold text-light tracking-tight text-sm hidden sm:block">
              PULSEMARKETS
            </span>
          </div>

          {/* Nav Links - closer to logo */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`px-2.5 py-1.5 text-[13px] font-medium transition-colors rounded-md ${
                  activeNav === item 
                    ? 'text-light bg-row' 
                    : 'text-light-muted hover:text-light hover:bg-row/50'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center">
          <div className="relative hidden md:block w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
            <Input
              placeholder="Search markets…"
              className="pl-10 h-9 w-full bg-row border-stroke rounded-lg text-sm text-light placeholder:text-light-muted focus:ring-1 focus:ring-accent-blue/50"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Watchlist Button */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onWatchlist}
                  className="h-8 gap-1.5 text-light-muted hover:text-yellow-400 hover:bg-row text-xs px-2.5 relative"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Watchlist</span>
                  {watchlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-panel">
                      {watchlistCount > 99 ? '99+' : watchlistCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your Watchlist ({watchlistCount})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Chain */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-row text-xs px-2.5"
              >
                {chain}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-panel border-stroke rounded-lg min-w-[120px]">
              <DropdownMenuItem onClick={() => setChain('SOL')} className="text-light text-xs">
                <span className="mr-2 text-light-muted">◎</span> Solana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChain('ETH')} className="text-light text-xs">
                <span className="mr-2 text-light-muted">Ξ</span> Ethereum
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Balance */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-8 bg-row border border-stroke rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-light tabular-nums">0.033</span>
          </div>

          {/* Connect */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-row text-xs px-2.5"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connect</span>
          </Button>

          {/* Create */}
          <Button 
            onClick={onCreateMarket}
            size="sm"
            className="h-8 gap-1.5 bg-accent text-panel hover:bg-accent/90 rounded-lg text-xs font-medium px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
