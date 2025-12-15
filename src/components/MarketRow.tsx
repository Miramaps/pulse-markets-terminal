import { useState, useEffect } from 'react';
import { Activity, Users, Clock, Sparkles, Landmark, Trophy, Music, Laugh } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft, formatTimeAgo } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface MarketRowProps {
  market: Market;
  isSelected: boolean;
  onSelect: () => void;
  priceFlash?: boolean;
  showProgress?: boolean;
}

const categoryConfig: Record<Market['category'], { icon: typeof Sparkles }> = {
  crypto: { icon: Sparkles },
  politics: { icon: Landmark },
  sports: { icon: Trophy },
  pop: { icon: Music },
  memes: { icon: Laugh },
};

export function MarketRow({ market, isSelected, onSelect, priceFlash, showProgress }: MarketRowProps) {
  const [flashYes, setFlashYes] = useState(false);
  const [flashNo, setFlashNo] = useState(false);
  const { toast } = useToast();

  const { icon: CategoryIcon } = categoryConfig[market.category];

  useEffect(() => {
    if (priceFlash) {
      setFlashYes(true);
      setFlashNo(true);
      const t = setTimeout(() => {
        setFlashYes(false);
        setFlashNo(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [priceFlash, market.yesPrice, market.noPrice]);

  const handleYes = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: 'Order Placed',
      description: `Bought YES at ${market.yesPrice.toFixed(2)}`,
    });
  };

  const handleNo = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: 'Order Placed',
      description: `Bought NO at ${market.noPrice.toFixed(2)}`,
    });
  };

  // Calculate progress for ending markets
  const progress = showProgress ? Math.min(100, Math.max(0, 
    100 - ((market.resolvesAt.getTime() - Date.now()) / (48 * 60 * 60 * 1000)) * 100
  )) : 0;

  return (
    <div
      onClick={onSelect}
      className={`relative group px-3 py-2.5 cursor-pointer transition-all duration-150 ${
        isSelected 
          ? 'bg-row-hover' 
          : 'hover:bg-row-hover'
      }`}
    >
      {/* Accent bar */}
      <div className={`row-accent-bar ${isSelected ? 'active' : 'group-hover:hover'}`} />

      <div className="flex items-center gap-3">
        {/* Category icon */}
        <div className="shrink-0">
          <CategoryIcon className="w-5 h-5 text-light-muted" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Question */}
          <p className="text-sm font-medium text-light leading-tight line-clamp-1 mb-1">
            {market.question}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-light-muted">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {formatVolume(market.volume)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {market.traders}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {market.status === 'resolved' 
                ? 'Ended' 
                : market.status === 'ending' 
                  ? formatTimeLeft(market.resolvesAt)
                  : formatTimeAgo(market.createdAt)
              }
            </span>
          </div>

          {/* Progress bar for ending markets */}
          {showProgress && market.status === 'ending' && (
            <div className="progress-bar mt-2">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* YES/NO Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleYes}
            className={`h-7 px-2.5 rounded-md text-xs font-semibold btn-yes transition-all min-w-[72px] tabular-nums ${
              flashYes ? 'price-flash' : ''
            }`}
          >
            YES {market.yesPrice.toFixed(2)}
          </button>
          <button
            onClick={handleNo}
            className={`h-7 px-2.5 rounded-md text-xs font-semibold btn-no transition-all min-w-[72px] tabular-nums ${
              flashNo ? 'price-flash' : ''
            }`}
          >
            NO {market.noPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
