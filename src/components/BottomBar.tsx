import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Market, formatVolume } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export function BottomBar({ 
  selectedMarket, 
  selectedCategory, 
  onCategorySelect, 
  onClearSelection,
}: BottomBarProps) {
  const [timeFilter, setTimeFilter] = useState('24h');

  const currentCategory = categories.find(c => c.id === selectedCategory)?.label || 'All';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <motion.div 
        className="max-w-5xl mx-auto bg-card-solid border border-stroke rounded-2xl card-shadow"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="px-5 py-3 flex items-center gap-4">
          {/* Left: Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-2 bg-canvas2 border-stroke hover:border-gold rounded-lg text-sm"
                >
                  {currentCategory}
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card-solid border-stroke rounded-xl">
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id ?? 'all'}
                    onClick={() => onCategorySelect(cat.id)}
                    className={`text-sm ${selectedCategory === cat.id ? 'text-accent-blue font-medium' : ''}`}
                  >
                    {cat.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center bg-canvas2 rounded-lg p-0.5 border border-stroke">
              {timeFilters.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    timeFilter === t
                      ? 'bg-card-solid text-ink shadow-sm'
                      : 'text-muted-ink hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Selected Market */}
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
                    className="h-6 w-6 text-muted-ink hover:text-ink shrink-0"
                    onClick={onClearSelection}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <p className="text-sm text-ink font-medium truncate">
                    {selectedMarket.question}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-ink shrink-0">
                    <span>{formatVolume(selectedMarket.volume)}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">
                      Y {selectedMarket.yesPrice.toFixed(2)}
                    </span>
                    <span className="text-red-500 font-medium">
                      N {selectedMarket.noPrice.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-ink"
                >
                  Select a market or use YES/NO buttons on cards
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Status */}
          <div className="flex items-center gap-2 text-xs text-muted-ink shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Live</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
