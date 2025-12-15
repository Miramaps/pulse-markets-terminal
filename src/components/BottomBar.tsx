import { useState } from 'react';
import { Market } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomBarProps {
  selectedMarket: Market | null;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onClearSelection: () => void;
  onBuy: (marketId: string, side: 'yes' | 'no', amount: number) => void;
}

const categories = [
  { id: null, label: 'All' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'politics', label: 'Politics' },
  { id: 'sports', label: 'Sports' },
  { id: 'pop', label: 'Pop' },
  { id: 'memes', label: 'Memes' },
];

const presets = [5, 10, 25, 50];

export function BottomBar({ 
  selectedMarket, 
  selectedCategory, 
  onCategorySelect, 
  onClearSelection,
  onBuy 
}: BottomBarProps) {
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(10);
  const { toast } = useToast();

  const handleBuy = () => {
    if (!selectedMarket) return;
    
    onBuy(selectedMarket.id, side, amount);
    toast({
      title: `Bought ${side.toUpperCase()}`,
      description: `${amount} shares at ${side === 'yes' ? selectedMarket.yesPrice : selectedMarket.noPrice}`,
    });
    onClearSelection();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-panel/95 glass-blur">
      <div className="h-full flex items-center justify-between px-5 gap-6">
        {/* Left: Categories */}
        <div className="flex items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id ?? 'all'}
              onClick={() => onCategorySelect(cat.id)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-accent-beige text-background font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Center/Right: Trade UI */}
        <AnimatePresence mode="wait">
          {selectedMarket ? (
            <motion.div
              key="trade"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-4"
            >
              {/* Market Info */}
              <div className="flex items-center gap-3 max-w-xs">
                <button 
                  onClick={onClearSelection}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className="text-xs text-foreground/80 truncate">
                  {selectedMarket.question}
                </p>
              </div>

              {/* YES/NO Toggle */}
              <div className="flex items-center bg-card rounded-md p-0.5 border border-border">
                <button
                  onClick={() => setSide('yes')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    side === 'yes'
                      ? 'bg-accent-beige-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  YES
                </button>
                <button
                  onClick={() => setSide('no')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    side === 'no'
                      ? 'bg-accent-beige-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  NO
                </button>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`w-8 h-7 text-[11px] font-mono rounded border transition-colors ${
                      amount === preset
                        ? 'bg-accent-beige text-background border-accent-beige'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border-hover'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="w-24 hidden xl:block">
                <Slider
                  value={[amount]}
                  onValueChange={([v]) => setAmount(v)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Price Info */}
              <div className="text-[10px] font-mono text-muted-foreground hidden lg:block">
                Y {selectedMarket.yesPrice.toFixed(2)} • N {selectedMarket.noPrice.toFixed(2)}
              </div>

              {/* Buy Button */}
              <Button
                onClick={handleBuy}
                size="sm"
                className="h-8 px-4 bg-accent-beige text-background hover:bg-accent-beige/90 text-xs font-medium"
              >
                Buy {side.toUpperCase()} • ${amount}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              Select a market to trade
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Status */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="font-mono">24h</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
