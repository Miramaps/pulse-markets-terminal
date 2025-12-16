import { useState, useEffect } from 'react';
import { Activity, Users, Clock } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft, formatTimeAgo } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVisibility = 'both' | 'yes-only' | 'no-only';
type ShapeOption = 'square' | 'circle';

interface MarketRowProps {
  market: Market;
  isSelected: boolean;
  onSelect: () => void;
  priceFlash?: boolean;
  showProgress?: boolean;
  buttonSize?: ButtonSize;
  buttonVisibility?: ButtonVisibility;
  fastBuyAmount?: number | null;
  imageShape?: ShapeOption;
  buttonShape?: ShapeOption;
}

// Generate a deterministic placeholder image URL based on market id
const getMarketImage = (market: Market): string => {
  const categoryImages: Record<Market['category'], string> = {
    crypto: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=1a1a2e,16213e,0f3460`,
    politics: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=2d132c,801336,c72c41`,
    sports: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=1b4332,2d6a4f,40916c`,
    pop: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=3c096c,5a189a,7b2cbf`,
    memes: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=ff6d00,ff8500,ff9100`,
  };
  
  return categoryImages[market.category];
};

export function MarketRow({ 
  market, 
  isSelected, 
  onSelect, 
  priceFlash, 
  showProgress,
  buttonSize = 'medium',
  buttonVisibility = 'both',
  fastBuyAmount,
  imageShape = 'square',
  buttonShape = 'square',
}: MarketRowProps) {
  const [flashYes, setFlashYes] = useState(false);
  const [flashNo, setFlashNo] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
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
    const amount = fastBuyAmount ? ` $${fastBuyAmount}` : '';
    toast({
      title: 'Order Placed',
      description: `Bought${amount} YES at ${market.yesPrice.toFixed(2)}`,
    });
  };

  const handleNo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const amount = fastBuyAmount ? ` $${fastBuyAmount}` : '';
    toast({
      title: 'Order Placed',
      description: `Bought${amount} NO at ${market.noPrice.toFixed(2)}`,
    });
  };

  // Calculate progress for ending markets
  const progress = showProgress ? Math.min(100, Math.max(0, 
    100 - ((market.resolvesAt.getTime() - Date.now()) / (48 * 60 * 60 * 1000)) * 100
  )) : 0;

  const imageUrl = getMarketImage(market);

  // Button size classes
  const buttonSizeClasses = {
    small: buttonShape === 'circle' ? 'w-12 h-12' : 'h-6 px-2 min-w-[55px]',
    medium: buttonShape === 'circle' ? 'w-14 h-14' : 'h-7 px-2.5 min-w-[65px]',
    large: buttonShape === 'circle' ? 'w-16 h-16' : 'h-8 px-3 min-w-[75px]',
  };

  const buttonTextSize = {
    small: 'text-[10px]',
    medium: 'text-[11px]',
    large: 'text-[12px]',
  };

  // Image shape classes
  const imageShapeClass = imageShape === 'circle' ? 'rounded-full' : 'rounded-lg';
  const previewShapeClass = imageShape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  // Render circular button with progress ring
  const renderCircleButton = (type: 'yes' | 'no', price: number, flash: boolean, onClick: (e: React.MouseEvent) => void) => {
    const percentage = price * 100;
    const circumference = 2 * Math.PI * 20;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const isYes = type === 'yes';
    
    const sizes = {
      small: { container: 'w-12 h-12', text: 'text-[10px]', ring: 20 },
      medium: { container: 'w-14 h-14', text: 'text-[11px]', ring: 24 },
      large: { container: 'w-16 h-16', text: 'text-[12px]', ring: 28 },
    };
    
    const s = sizes[buttonSize];
    const ringCircumference = 2 * Math.PI * s.ring;
    const ringOffset = ringCircumference - (percentage / 100) * ringCircumference;
    
    return (
      <button
        onClick={onClick}
        className={`relative ${s.container} rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
          isYes 
            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
        } ${flash ? 'scale-105' : ''}`}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
          {/* Background ring */}
          <circle
            cx="32"
            cy="32"
            r={s.ring}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-20"
          />
          {/* Progress ring */}
          <circle
            cx="32"
            cy="32"
            r={s.ring}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            className="transition-all duration-300"
          />
        </svg>
        {/* Label and price */}
        <span className={`${s.text} font-bold relative z-10`}>{isYes ? 'YES' : 'NO'}</span>
        <span className={`${s.text} font-medium tabular-nums relative z-10`}>{price.toFixed(2)}</span>
      </button>
    );
  };

  // Render square button
  const renderSquareButton = (type: 'yes' | 'no', price: number, flash: boolean, onClick: (e: React.MouseEvent) => void) => {
    const isYes = type === 'yes';
    return (
      <button
        onClick={onClick}
        className={`${buttonSizeClasses[buttonSize]} rounded-lg ${buttonTextSize[buttonSize]} font-medium tabular-nums transition-all duration-200 ${
          isYes 
            ? `btn-yes ${flash ? 'price-flash' : ''}` 
            : `btn-no ${flash ? 'price-flash' : ''}`
        }`}
      >
        {isYes ? 'YES' : 'NO'} {price.toFixed(2)}
      </button>
    );
  };

  const showYes = buttonVisibility === 'both' || buttonVisibility === 'yes-only';
  const showNo = buttonVisibility === 'both' || buttonVisibility === 'no-only';

  return (
    <div
      onClick={onSelect}
      className={`relative group mx-2 my-1 px-3 py-2.5 cursor-pointer transition-all duration-200 rounded-xl ${
        isSelected 
          ? 'bg-row-hover' 
          : 'hover:bg-row-hover'
      }`}
    >
      {/* Accent bar */}
      <div className={`row-accent-bar rounded-l-xl ${isSelected ? 'active' : 'group-hover:hover'}`} />

      <div className="flex items-center gap-3">
        {/* Thumbnail Image with hover preview */}
        <div 
          className="relative shrink-0"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {/* Base image */}
          <div className={`w-10 h-10 ${imageShapeClass} overflow-hidden bg-row/50`}>
            <img 
              src={imageUrl} 
              alt={market.question}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Enlarged preview on hover - 200x200px */}
          <div 
            className={`absolute z-50 -left-2 -top-2 transition-all duration-300 ease-out origin-top-left pointer-events-none ${
              isImageHovered 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-50'
            }`}
          >
            <div className={`w-52 h-52 ${previewShapeClass} overflow-hidden bg-panel border border-stroke/50 shadow-2xl ring-1 ring-white/10`}>
              <img 
                src={imageUrl} 
                alt={market.question}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Question */}
          <p className="text-sm font-medium text-light leading-snug line-clamp-1 mb-1">
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
        <div className={`flex items-center shrink-0 ${buttonShape === 'circle' ? 'gap-2' : 'gap-1.5'}`}>
          {showYes && (
            buttonShape === 'circle' 
              ? renderCircleButton('yes', market.yesPrice, flashYes, handleYes)
              : renderSquareButton('yes', market.yesPrice, flashYes, handleYes)
          )}
          {showNo && (
            buttonShape === 'circle' 
              ? renderCircleButton('no', market.noPrice, flashNo, handleNo)
              : renderSquareButton('no', market.noPrice, flashNo, handleNo)
          )}
        </div>
      </div>
    </div>
  );
}
