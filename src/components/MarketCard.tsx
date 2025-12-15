import { useState, useEffect } from 'react';
import { Activity, Users, Clock, Sparkles, Landmark, Trophy, Music, Laugh, ChevronDown, ChevronUp } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft, formatTimeAgo } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface MarketCardProps {
  market: Market;
  isSelected: boolean;
  onSelect: () => void;
  priceFlash?: boolean;
}

const categoryConfig: Record<Market['category'], { icon: typeof Sparkles; class: string }> = {
  crypto: { icon: Sparkles, class: 'cat-crypto' },
  politics: { icon: Landmark, class: 'cat-politics' },
  sports: { icon: Trophy, class: 'cat-sports' },
  pop: { icon: Music, class: 'cat-pop' },
  memes: { icon: Laugh, class: 'cat-memes' },
};

const presets = [5, 10, 25, 50];

export function MarketCard({ market, isSelected, onSelect, priceFlash }: MarketCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null);
  const [amount, setAmount] = useState(10);
  const [flashPrice, setFlashPrice] = useState(false);
  const { toast } = useToast();

  const { icon: CategoryIcon, class: catClass } = categoryConfig[market.category];
  const isNew = market.status === 'new' && (Date.now() - market.createdAt.getTime()) < 60 * 60 * 1000;

  useEffect(() => {
    if (priceFlash) {
      setFlashPrice(true);
      setTimeout(() => setFlashPrice(false), 400);
    }
  }, [priceFlash]);

  const handleYesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSide('yes');
    setExpanded(true);
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSide('no');
    setExpanded(true);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSide) return;
    
    toast({
      title: `Bought ${selectedSide.toUpperCase()}`,
      description: `${amount} shares at ${selectedSide === 'yes' ? market.yesPrice : market.noPrice}`,
    });
    setExpanded(false);
    setSelectedSide(null);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={`bg-card-solid rounded-2xl border border-stroke p-4 cursor-pointer transition-all duration-200 card-shadow ${
        isSelected ? 'border-accent-blue card-shadow-hover' : 'hover:card-shadow-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Category badge + monogram */}
        <div className="relative">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${catClass}`}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          {isNew && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold pulse-new" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Question */}
          <h3 className="text-[15px] font-medium text-ink leading-snug line-clamp-2 mb-2">
            {market.question}
          </h3>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-muted-ink mb-3">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              {formatVolume(market.volume)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {market.traders}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {market.status === 'resolved' 
                ? 'Ended' 
                : market.status === 'ending' 
                  ? formatTimeLeft(market.resolvesAt)
                  : formatTimeAgo(market.createdAt)
              }
            </span>
          </div>

          {/* YES / NO Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleYesClick}
              className={`flex-1 h-10 rounded-xl font-semibold text-sm transition-all btn-yes ${
                selectedSide === 'yes' ? 'ring-2 ring-green-500/30' : ''
              } ${flashPrice ? 'price-flash' : ''}`}
            >
              YES {market.yesPrice.toFixed(2)}
            </button>
            <button
              onClick={handleNoClick}
              className={`flex-1 h-10 rounded-xl font-semibold text-sm transition-all btn-no ${
                selectedSide === 'no' ? 'ring-2 ring-red-500/30' : ''
              } ${flashPrice ? 'price-flash' : ''}`}
            >
              NO {market.noPrice.toFixed(2)}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-ink hover:text-ink shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Quick Buy Strip */}
          <AnimatePresence>
            {expanded && selectedSide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pt-3 mt-3 border-t border-stroke">
                  <div className="flex items-center gap-2">
                    {/* Amount presets */}
                    <div className="flex items-center gap-1.5">
                      {presets.map((p) => (
                        <button
                          key={p}
                          onClick={() => setAmount(p)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            amount === p
                              ? 'bg-gold text-white'
                              : 'bg-canvas2 text-muted-ink hover:text-ink'
                          }`}
                        >
                          ${p}
                        </button>
                      ))}
                    </div>

                    {/* Buy button */}
                    <Button
                      onClick={handleBuy}
                      size="sm"
                      className={`ml-auto h-9 px-4 font-semibold rounded-xl ${
                        selectedSide === 'yes'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      Buy {selectedSide.toUpperCase()} • ${amount}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
