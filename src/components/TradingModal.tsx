import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Activity, Users, ChevronUp, ChevronDown } from 'lucide-react';
import { Market, formatVolume } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface TradingModalProps {
  market: Market | null;
  onClose: () => void;
}

// Generate mock price history
const generatePriceHistory = (currentPrice: number, points: number = 50) => {
  const history: { time: number; price: number }[] = [];
  let price = currentPrice - 0.1 + Math.random() * 0.2;
  
  for (let i = 0; i < points; i++) {
    price = Math.max(0.01, Math.min(0.99, price + (Math.random() - 0.5) * 0.03));
    history.push({ time: Date.now() - (points - i) * 60000, price });
  }
  history.push({ time: Date.now(), price: currentPrice });
  return history;
};

// Generate mock order book
const generateOrderBook = (yesPrice: number) => {
  const bids: { price: number; size: number }[] = [];
  const asks: { price: number; size: number }[] = [];
  
  for (let i = 0; i < 8; i++) {
    bids.push({
      price: Math.max(0.01, yesPrice - 0.01 * (i + 1)),
      size: Math.floor(Math.random() * 5000) + 500,
    });
    asks.push({
      price: Math.min(0.99, yesPrice + 0.01 * (i + 1)),
      size: Math.floor(Math.random() * 5000) + 500,
    });
  }
  
  return { bids, asks };
};

// Simple line chart component
function MiniChart({ data, color }: { data: { time: number; price: number }[]; color: string }) {
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const range = maxPrice - minPrice || 0.1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.price - minPrice) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const lastPoint = data[data.length - 1];
  const firstPoint = data[0];
  const isUp = lastPoint.price >= firstPoint.price;

  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        ))}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={`url(#gradient-${color})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={isUp ? '#22c55e' : '#ef4444'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute top-1 right-2 text-[10px] text-light-muted">{maxPrice.toFixed(2)}</div>
      <div className="absolute bottom-1 right-2 text-[10px] text-light-muted">{minPrice.toFixed(2)}</div>
    </div>
  );
}

export function TradingModal({ market, onClose }: TradingModalProps) {
  const [activeTab, setActiveTab] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('100');
  const [priceHistory, setPriceHistory] = useState<{ time: number; price: number }[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: { price: number; size: number }[]; asks: { price: number; size: number }[] }>({ bids: [], asks: [] });

  useEffect(() => {
    if (market) {
      setPriceHistory(generatePriceHistory(market.yesPrice));
      setOrderBook(generateOrderBook(market.yesPrice));
    }
  }, [market?.id]);

  useEffect(() => {
    if (!market) return;
    
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        if (prev.length === 0) return prev;
        const newPrice = Math.max(0.01, Math.min(0.99, prev[prev.length - 1].price + (Math.random() - 0.5) * 0.02));
        return [...prev.slice(1), { time: Date.now(), price: newPrice }];
      });
      setOrderBook(generateOrderBook(market.yesPrice));
    }, 2000);

    return () => clearInterval(interval);
  }, [market]);

  const currentPrice = activeTab === 'yes' ? market?.yesPrice : market?.noPrice;
  const shares = amount && currentPrice ? Math.floor(Number(amount) / currentPrice) : 0;
  const potential = shares * 1;

  return (
    <AnimatePresence>
      {market && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#0d0f12] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0b0e]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5">
                  <img 
                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{market.question}</h2>
                  <div className="flex items-center gap-4 mt-1 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {formatVolume(market.volume)} volume
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {market.traders} traders
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Chart Section */}
              <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-white/10">
                {/* Price Display */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-white tabular-nums">
                      {market.yesPrice.toFixed(2)}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${
                      priceHistory.length > 1 && priceHistory[priceHistory.length - 1]?.price >= priceHistory[0]?.price 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {priceHistory.length > 1 && priceHistory[priceHistory.length - 1]?.price >= priceHistory[0]?.price 
                        ? <TrendingUp className="w-4 h-4" />
                        : <TrendingDown className="w-4 h-4" />
                      }
                      {priceHistory.length > 1 ? ((priceHistory[priceHistory.length - 1]?.price - priceHistory[0]?.price) / priceHistory[0]?.price * 100).toFixed(2) : '0.00'}%
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['1H', '24H', '7D', 'ALL'].map((period) => (
                      <button
                        key={period}
                        className="px-3 py-1 text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="h-48 bg-white/5 rounded-xl overflow-hidden mb-6">
                  {priceHistory.length > 0 && <MiniChart data={priceHistory} color="main" />}
                </div>

                {/* Order Book */}
                <div>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Order Book</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Bids */}
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex justify-between px-2">
                        <span>Price</span>
                        <span>Size</span>
                      </div>
                      <div className="space-y-0.5">
                        {orderBook.bids.slice(0, 6).map((bid, i) => (
                          <div key={i} className="relative flex justify-between px-2 py-1 text-xs">
                            <div 
                              className="absolute inset-0 bg-green-500/10 rounded"
                              style={{ width: `${(bid.size / 5000) * 100}%` }}
                            />
                            <span className="relative text-green-400 tabular-nums">{bid.price.toFixed(2)}</span>
                            <span className="relative text-white/50 tabular-nums">{bid.size.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Asks */}
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex justify-between px-2">
                        <span>Price</span>
                        <span>Size</span>
                      </div>
                      <div className="space-y-0.5">
                        {orderBook.asks.slice(0, 6).map((ask, i) => (
                          <div key={i} className="relative flex justify-between px-2 py-1 text-xs">
                            <div 
                              className="absolute inset-0 right-0 bg-red-500/10 rounded"
                              style={{ width: `${(ask.size / 5000) * 100}%`, marginLeft: 'auto' }}
                            />
                            <span className="relative text-red-400 tabular-nums">{ask.price.toFixed(2)}</span>
                            <span className="relative text-white/50 tabular-nums">{ask.size.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Panel */}
              <div className="p-6 bg-[#0a0b0e]">
                {/* YES/NO Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('yes')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'yes'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    YES {market.yesPrice.toFixed(2)}
                  </button>
                  <button
                    onClick={() => setActiveTab('no')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'no'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    NO {market.noPrice.toFixed(2)}
                  </button>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="text-xs text-white/50 mb-2 block">Amount (USDC)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white text-lg font-medium rounded-xl pr-24"
                      placeholder="0"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      {[10, 50, 100].map((val) => (
                        <button
                          key={val}
                          onClick={() => setAmount(String(val))}
                          className="px-2 py-1 text-[10px] font-medium text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trade Summary */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Price per share</span>
                    <span className="text-white tabular-nums">${currentPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Shares</span>
                    <span className="text-white tabular-nums">{shares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                    <span className="text-white/50">Potential return</span>
                    <span className={`font-semibold tabular-nums ${activeTab === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                      ${potential.toLocaleString()} ({amount && Number(amount) > 0 ? ((potential / Number(amount) - 1) * 100).toFixed(0) : 0}%)
                    </span>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  className={`w-full py-4 rounded-xl text-base font-semibold transition-all ${
                    activeTab === 'yes'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Buy {activeTab.toUpperCase()} shares
                </button>

                {/* Recent Trades */}
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Recent Trades</h3>
                  <div className="space-y-2">
                    {[
                      { side: 'yes', price: 0.67, size: 1250, time: '2s ago' },
                      { side: 'no', price: 0.33, size: 800, time: '5s ago' },
                      { side: 'yes', price: 0.66, size: 2100, time: '12s ago' },
                      { side: 'yes', price: 0.65, size: 450, time: '18s ago' },
                    ].map((trade, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {trade.side === 'yes' ? (
                            <ChevronUp className="w-3 h-3 text-green-400" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-red-400" />
                          )}
                          <span className={trade.side === 'yes' ? 'text-green-400' : 'text-red-400'}>
                            {trade.side.toUpperCase()}
                          </span>
                          <span className="text-white tabular-nums">{trade.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/50">
                          <span className="tabular-nums">{trade.size}</span>
                          <span>{trade.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
