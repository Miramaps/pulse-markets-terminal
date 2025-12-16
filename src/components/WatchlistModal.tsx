import { X, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Market, formatVolume, formatTimeAgo } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WatchlistModalProps {
  open: boolean;
  onClose: () => void;
  markets: Market[];
  onSelectMarket: (market: Market) => void;
  onRemoveFromWatchlist: (marketId: string) => void;
}

export function WatchlistModal({
  open,
  onClose,
  markets,
  onSelectMarket,
  onRemoveFromWatchlist,
}: WatchlistModalProps) {
  const handleSelectMarket = (market: Market) => {
    onSelectMarket(market);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-panel border-stroke max-w-lg p-0 gap-0">
        <DialogHeader className="p-4 border-b border-stroke">
          <DialogTitle className="flex items-center gap-2 text-light">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            Your Watchlist
            <span className="text-sm font-normal text-light-muted">
              ({markets.length} market{markets.length !== 1 ? 's' : ''})
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {markets.length === 0 ? (
            <div className="p-8 text-center">
              <Star className="w-12 h-12 text-light-muted/30 mx-auto mb-3" />
              <p className="text-light-muted text-sm">No markets in your watchlist yet</p>
              <p className="text-light-muted/60 text-xs mt-1">
                Click the star on any market to add it here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stroke">
              {markets.map((market) => (
                <div
                  key={market.id}
                  className="p-3 hover:bg-row-hover transition-colors cursor-pointer group"
                  onClick={() => handleSelectMarket(market)}
                >
                  <div className="flex items-start gap-3">
                    {/* Market Image */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-row/50 shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-light leading-snug line-clamp-2 mb-1">
                        {market.question}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-light-muted">
                        <span>{formatVolume(market.volume)} vol</span>
                        <span>{market.traders} traders</span>
                        <span>{formatTimeAgo(market.createdAt)}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {market.yesPrice >= 0.5 ? (
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-rose-400" />
                          )}
                          <span className={`text-sm font-bold tabular-nums ${
                            market.yesPrice >= 0.5 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {(market.yesPrice * 100).toFixed(0)}¢
                          </span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          market.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          market.status === 'ending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {market.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-light-muted/50 hover:text-yellow-400 hover:bg-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(market.id);
                        }}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {markets.length > 0 && (
          <div className="p-3 border-t border-stroke bg-row/30">
            <p className="text-[11px] text-light-muted text-center">
              Click a market to open • Hover and click ⭐ to remove
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
