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
    <header className="sticky top-0 z-50 bg-card-solid border-b border-stroke">
      <div className="h-16 px-6 flex items-center justify-between gap-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">P</span>
          </div>
          <span className="font-display font-semibold text-ink tracking-tight text-lg hidden sm:block">
            PULSEMARKETS
          </span>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeNav === item ? 'text-ink' : 'text-muted-ink hover:text-ink'
              }`}
            >
              {item}
              {activeNav === item && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-ink" />
            <Input
              placeholder="Search markets…"
              className="pl-11 h-10 w-56 bg-canvas2 border-stroke rounded-full text-sm placeholder:text-muted-ink focus:ring-2 focus:ring-accent-blue/20"
            />
          </div>

          {/* Chain */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-2 bg-card-solid border-stroke hover:border-gold rounded-xl"
              >
                <span className="font-medium text-sm">{chain}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-ink" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card-solid border-stroke rounded-xl">
              <DropdownMenuItem onClick={() => setChain('SOL')}>
                <span className="mr-2">◎</span> Solana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChain('ETH')}>
                <span className="mr-2">Ξ</span> Ethereum
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Balance */}
          <div className="hidden sm:flex items-center gap-2 px-3 h-9 bg-canvas2 border border-stroke rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-ink">0.033 {chain}</span>
          </div>

          {/* Connect */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-2 bg-card-solid border-stroke hover:border-gold rounded-xl"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Connect</span>
          </Button>

          {/* Create */}
          <Button 
            onClick={onCreateMarket}
            size="sm"
            className="h-9 gap-2 bg-ink text-white hover:bg-ink/90 rounded-xl font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
