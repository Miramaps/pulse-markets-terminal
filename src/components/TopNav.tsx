import { useState } from 'react';
import { Search, ChevronDown, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TopNavProps { onCreateMarket: () => void; }

export function TopNav({ onCreateMarket }: TopNavProps) {
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');
  const navItems = ['Discover', 'Pulse', 'Trackers', 'Markets', 'Portfolio', 'Rewards'];

  return (
    <header className="sticky top-0 z-50 h-12 border-b border-border bg-panel/90 glass-blur">
      <div className="flex h-full items-center justify-between px-5 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-accent-beige flex items-center justify-center">
            <span className="text-background font-semibold text-xs">P</span>
          </div>
          <span className="text-accent-beige font-medium text-sm tracking-tight">PULSEMARKETS</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-8">
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item} className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">{item}</button>
            ))}
          </nav>
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search markets…" className="pl-9 h-8 bg-card border-border text-xs placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                {chain}<ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-panel border-border min-w-[100px]">
              <DropdownMenuItem onClick={() => setChain('SOL')} className="text-xs">Solana</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChain('ETH')} className="text-xs">Ethereum</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="h-7 px-2.5 rounded-md bg-card border border-border text-xs font-mono text-muted-foreground flex items-center">0.033</div>
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Wallet className="w-3 h-3" /><span className="hidden sm:inline">Connect</span>
          </Button>
          <Button onClick={onCreateMarket} size="sm" className="h-7 gap-1 bg-accent-beige text-background hover:bg-accent-beige/90 text-xs font-medium">
            <Plus className="w-3 h-3" />Create
          </Button>
        </div>
      </div>
    </header>
  );
}
