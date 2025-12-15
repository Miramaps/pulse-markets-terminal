import { useState } from 'react';
import { Search, ChevronDown, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopNavProps {
  onCreateMarket: () => void;
}

const navItems = ['Discover', 'Pulse', 'Trackers', 'Markets', 'Portfolio', 'Rewards'];

export function TopNav({ onCreateMarket }: TopNavProps) {
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');
  const [activeNav, setActiveNav] = useState('Markets');

  return (
    <header className="sticky top-0 z-50 bg-panel border-b border-stroke">
      <div className="h-12 px-4 md:px-6 2xl:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-panel font-display font-bold text-xs">P</span>
          </div>
          <span className="font-display font-semibold text-light tracking-tight text-sm hidden sm:block">
            PULSEMARKETS
          </span>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`px-3 py-1.5 text-[13px] font-medium transition-colors rounded-md ${
                activeNav === item 
                  ? 'text-light bg-row' 
                  : 'text-light-muted hover:text-light hover:bg-row/50'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-light-muted" />
            <Input
              placeholder="Search…"
              className="pl-9 h-8 w-44 bg-row border-stroke rounded-lg text-xs text-light placeholder:text-light-muted focus:ring-1 focus:ring-accent-blue/50"
            />
          </div>

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
