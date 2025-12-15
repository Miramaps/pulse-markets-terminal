import { useState } from 'react';
import { ChevronDown, X, Zap } from 'lucide-react';
import { Market, formatVolume } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomBarProps {
  selectedMarket: Market | null;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onClearSelection: () => void;
}

const categories = [
  { id: null, label: 'All' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'politics', label: 'Politics' },
  { id: 'sports', label: 'Sports' },
  { id: 'pop', label: 'Pop' },
  { id: 'memes', label: 'Memes' },
];

const timeFilters = ['24h', '7d', '30d'];
const amounts = [10, 25, 50, 100];

export function BottomBar({ 
  selectedMarket, 
  selectedCategory, 
  onCategorySelect, 
  onClearSelection,
}: BottomBarProps) {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(25);
  const { toast } = useToast();

  const currentCategory = categories.find(c => c.id === selectedCategory)?.label || 'All';

  const handleTrade = () => {
    if (!selectedMarket) return;
    toast({
      title: 'Order Placed',
      description: `Bought ${side.toUpperCase()} $${amount} at ${side === 'yes' ? selectedMarket.yesPrice.toFixed(2) : selectedMarket.noPrice.toFixed(2)}`,
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-panel border-t border-stroke">
      <div className="h-14 px-4 md:px-6 2xl:px-8 flex items-center gap-4">
        {/* Left: Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 gap-1.5 text-light-muted hover:text-light hover:bg-row text-xs px-2"
              >
                {currentCategory}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-panel border-stroke rounded-lg">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.id ?? 'all'}
                  onClick={() => onCategorySelect(cat.id)}
                  className={`text-xs ${selectedCategory === cat.id ? 'text-accent-blue' : 'text-light'}`}
                >
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center bg-row rounded-md p-0.5 border border-stroke">
            {timeFilters.map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                  timeFilter === t
                    ? 'bg-panel text-light'
                    : 'text-light-muted hover:text-light'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-stroke hidden sm:block" />

        {/* Center: Selected Market / Trade Widget */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {selectedMarket ? (
              <motion.div
                key={selectedMarket.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-3"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-light-muted hover:text-light shrink-0"
                  onClick={onClearSelection}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
                
                <p className="text-xs text-light font-medium truncate max-w-[200px] hidden md:block">
                  {selectedMarket.question}
                </p>

                <span className="text-[10px] text-light-muted hidden lg:block">
                  {formatVolume(selectedMarket.volume)} vol
                </span>

                {/* Trade Controls */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* Side Toggle */}
                  <div className="flex items-center bg-row rounded-md p-0.5 border border-stroke">
                    <button
                      onClick={() => setSide('yes')}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors ${
                        side === 'yes'
                          ? 'bg-[hsl(160,50%,16%)] text-[hsl(140,100%,90%)]'
                          : 'text-light-muted hover:text-light'
                      }`}
                    >
                      YES {selectedMarket.yesPrice.toFixed(2)}
                    </button>
                    <button
                      onClick={() => setSide('no')}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors ${
                        side === 'no'
                          ? 'bg-[hsl(12,50%,16%)] text-[hsl(15,100%,93%)]'
                          : 'text-light-muted hover:text-light'
                      }`}
                    >
                      NO {selectedMarket.noPrice.toFixed(2)}
                    </button>
                  </div>

                  {/* Amount */}
                  <div className="hidden sm:flex items-center gap-1">
                    {amounts.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAmount(a)}
                        className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                          amount === a
                            ? 'bg-row text-light'
                            : 'text-light-muted hover:text-light'
                        }`}
                      >
                        ${a}
                      </button>
                    ))}
                  </div>

                  {/* Execute */}
                  <Button
                    onClick={handleTrade}
                    size="sm"
                    className="h-7 px-3 bg-accent text-panel hover:bg-accent/90 rounded-md text-xs font-semibold gap-1.5"
                  >
                    <Zap className="w-3 h-3" />
                    Buy
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-light-muted"
              >
                Select a market to trade
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-1.5 text-[10px] text-light-muted shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span>Live</span>
        </div>
      </div>
    </div>
  );
}
