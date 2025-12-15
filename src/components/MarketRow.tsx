import { Users, TrendingUp, Clock } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft, formatTimeAgo } from '@/lib/mockData';
import { motion } from 'framer-motion';

interface MarketRowProps {
  market: Market;
  isSelected: boolean;
  onSelect: (market: Market) => void;
  priceFlash?: boolean;
}

export function MarketRow({ market, isSelected, onSelect, priceFlash }: MarketRowProps) {
  return (
    <motion.button
      onClick={() => onSelect(market)}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={`w-full text-left px-4 py-4 rounded-lg border transition-all duration-150 ${
        isSelected 
          ? 'bg-card border-accent-beige/40 shadow-[0_0_20px_hsl(42_35%_74%/0.06)]' 
          : 'bg-card/50 border-border hover:border-border-hover hover:bg-card'
      } ${priceFlash ? 'animate-price-flash' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-md bg-accent-beige-muted flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-medium text-accent-beige">
            {market.question.charAt(0)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug line-clamp-2 text-foreground/90">
            {market.question}
          </p>
          
          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
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
        </div>

        {/* Prices */}
        <div className="text-right shrink-0">
          <div className="text-xs font-mono text-muted-foreground">
            <span className="text-foreground/70">Y</span> {market.yesPrice.toFixed(2)}
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-0.5">
            <span className="text-foreground/70">N</span> {market.noPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
