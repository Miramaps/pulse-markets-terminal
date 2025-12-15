import { useState, useEffect } from 'react';
import { Activity, Users, Clock } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft, formatTimeAgo } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface MarketRowProps {
  market: Market;
  isSelected: boolean;
  onSelect: () => void;
  priceFlash?: boolean;
  showProgress?: boolean;
}

// Generate a deterministic placeholder image URL based on market id
const getMarketImage = (market: Market): string => {
  const hash = market.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = (hash % 100) + 1;
  
  // Use different image categories based on market category
  const categoryImages: Record<Market['category'], string> = {
    crypto: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=1a1a2e,16213e,0f3460`,
    politics: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=2d132c,801336,c72c41`,
    sports: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=1b4332,2d6a4f,40916c`,
    pop: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=3c096c,5a189a,7b2cbf`,
    memes: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=ff6d00,ff8500,ff9100`,
  };
  
  return categoryImages[market.category];
};

export function MarketRow({ market, isSelected, onSelect, priceFlash, showProgress }: MarketRowProps) {
  const [flashYes, setFlashYes] = useState(false);
  const [flashNo, setFlashNo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

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

  const imageUrl = getMarketImage(market);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group px-4 py-3 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-row-hover' 
          : 'hover:bg-row-hover'
      }`}
    >
      {/* Accent bar */}
      <div className={`row-accent-bar ${isSelected ? 'active' : 'group-hover:hover'}`} />

      <div className="flex items-center gap-4">
        {/* Thumbnail Image */}
        <div 
          className={`shrink-0 transition-transform duration-200 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-row border border-stroke">
            <img 
              src={imageUrl} 
              alt={market.question}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Question */}
          <p className="text-[15px] font-medium text-light leading-snug line-clamp-1 mb-1.5">
            {market.question}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-light-muted">
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
            className={`h-7 px-2.5 rounded-lg text-[12px] font-medium btn-yes min-w-[70px] tabular-nums ${
              flashYes ? 'price-flash' : ''
            }`}
          >
            YES {market.yesPrice.toFixed(2)}
          </button>
          <button
            onClick={handleNo}
            className={`h-7 px-2.5 rounded-lg text-[12px] font-medium btn-no min-w-[70px] tabular-nums ${
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
