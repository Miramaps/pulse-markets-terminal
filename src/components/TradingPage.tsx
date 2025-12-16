import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Star, Bell, Share2 } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { TopNav } from './TopNav';

interface TradingPageProps {
  market: Market;
  onBack: () => void;
}

// Generate mock price history
const generatePriceHistory = (currentPrice: number, points: number = 100) => {
  const history: { time: number; price: number }[] = [];
  let price = currentPrice - 0.15 + Math.random() * 0.3;
  
  for (let i = 0; i < points; i++) {
    price = Math.max(0.01, Math.min(0.99, price + (Math.random() - 0.5) * 0.025));
    history.push({ time: Date.now() - (points - i) * 60000, price });
  }
  history.push({ time: Date.now(), price: currentPrice });
  return history;
};

// Generate mock order book
const generateOrderBook = (yesPrice: number) => {
  const bids: { price: number; size: number }[] = [];
  const asks: { price: number; size: number }[] = [];
  
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: Math.max(0.01, yesPrice - 0.01 * (i + 1)),
      size: Math.floor(Math.random() * 8000) + 1000,
    });
    asks.push({
      price: Math.min(0.99, yesPrice + 0.01 * (i + 1)),
      size: Math.floor(Math.random() * 8000) + 1000,
    });
  }
  
  return { bids, asks };
};

// Generate recent trades
const generateRecentTrades = () => {
  const trades = [];
  for (let i = 0; i < 20; i++) {
    trades.push({
      id: i,
      side: Math.random() > 0.5 ? 'yes' : 'no',
      price: 0.5 + (Math.random() - 0.5) * 0.4,
      size: Math.floor(Math.random() * 5000) + 100,
      time: new Date(Date.now() - i * 15000),
    });
  }
  return trades;
};

// Chart component
function PriceChart({ data }: { data: { time: number; price: number }[] }) {
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
    <div className="w-full h-full relative bg-[#0a0b0e] rounded-lg p-2">
      <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between text-[9px] text-white/30 font-mono">
        <span>{maxPrice.toFixed(2)}</span>
        <span>{minPrice.toFixed(2)}</span>
      </div>
      
      <div className="ml-6 h-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {[0, 50, 100].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          ))}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />
          <polyline points={points} fill="none" stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function TradingPage({ market, onBack }: TradingPageProps) {
  const [activeTab, setActiveTab] = useState<'yes' | 'no'>('yes');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('100');
  const [priceHistory, setPriceHistory] = useState<{ time: number; price: number }[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: { price: number; size: number }[]; asks: { price: number; size: number }[] }>({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('1H');
  const { toast } = useToast();

  useEffect(() => {
    setPriceHistory(generatePriceHistory(market.yesPrice));
    setOrderBook(generateOrderBook(market.yesPrice));
    setRecentTrades(generateRecentTrades());
  }, [market.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        if (prev.length === 0) return prev;
        const newPrice = Math.max(0.01, Math.min(0.99, prev[prev.length - 1].price + (Math.random() - 0.5) * 0.015));
        return [...prev.slice(1), { time: Date.now(), price: newPrice }];
      });
      setOrderBook(generateOrderBook(market.yesPrice));
    }, 3000);
    return () => clearInterval(interval);
  }, [market]);

  const currentPrice = activeTab === 'yes' ? market.yesPrice : market.noPrice;
  const shares = amount && currentPrice ? Math.floor(Number(amount) / currentPrice) : 0;
  const potential = shares * 1;
  const lastPrice = priceHistory[priceHistory.length - 1]?.price || market.yesPrice;
  const firstPrice = priceHistory[0]?.price || market.yesPrice;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;
  const isUp = priceChange >= 0;

  const handleTrade = () => {
    toast({
      title: 'Order Placed',
      description: `Bought ${shares} ${activeTab.toUpperCase()} shares at ${currentPrice?.toFixed(2)}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col bg-[#0d0f12] text-white overflow-hidden"
    >
      {/* Top Nav - clicking Discover or logo goes back */}
      <TopNav onCreateMarket={() => {}} onDiscover={onBack} />

      {/* Market Header Bar */}
      <div className="h-10 border-b border-white/10 bg-[#0a0b0e] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-7 px-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
          
          <div className="h-5 w-px bg-white/10" />
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-white/5">
              <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}`} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="font-medium text-xs truncate max-w-[300px]">{market.question}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              market.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
              market.status === 'ending' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {market.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10">
            <Star className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10">
            <Bell className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10">
            <Share2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Fixed Height, No Scroll */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Quick Actions */}
        <div className="w-44 border-r border-white/10 bg-[#0a0b0e] p-2 flex flex-col gap-2 shrink-0">
          <div>
            <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">Quick Buy</div>
            <div className="grid grid-cols-4 gap-0.5">
              {[0.01, 0.1, 1, 10].map((val) => (
                <button key={val} onClick={() => setAmount(String(val * 100))} className="py-1.5 text-[10px] font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded transition-colors">
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">Quick Sell</div>
            <div className="grid grid-cols-4 gap-0.5">
              {['10%', '25%', '50%', '100%'].map((val) => (
                <button key={val} className="py-1.5 text-[10px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors">
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-1.5 text-[10px]">
            <div className="flex justify-between text-white/40">
              <span>Volume</span>
              <span className="text-white">{formatVolume(market.volume)}</span>
            </div>
            <div className="flex justify-between text-white/40">
              <span>Traders</span>
              <span className="text-white">{market.traders}</span>
            </div>
            <div className="flex justify-between text-white/40">
              <span>Ends</span>
              <span className="text-white">{formatTimeLeft(market.resolvesAt)}</span>
            </div>
          </div>
        </div>

        {/* Center - Chart & Order Book */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Price Header */}
          <div className="h-10 border-b border-white/10 bg-[#0a0b0e] px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold tabular-nums">{lastPrice.toFixed(4)}</span>
              <span className={`flex items-center gap-1 text-xs ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex items-center gap-0.5 bg-white/5 rounded p-0.5">
              {['1m', '5m', '1H', '1D'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                    timeframe === tf ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 p-2 min-h-0">
            {priceHistory.length > 0 && <PriceChart data={priceHistory} />}
          </div>

          {/* Order Book & Trades */}
          <div className="h-32 border-t border-white/10 bg-[#0a0b0e] flex shrink-0">
            {/* Order Book */}
            <div className="flex-1 p-2 border-r border-white/10">
              <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Order Book</div>
              <div className="grid grid-cols-2 gap-2 h-[calc(100%-16px)]">
                <div className="space-y-0.5 overflow-hidden">
                  {orderBook.bids.slice(0, 5).map((bid, i) => (
                    <div key={i} className="relative flex justify-between px-1 py-0.5 text-[9px]">
                      <div className="absolute inset-0 bg-green-500/10 rounded-sm" style={{ width: `${Math.min(100, (bid.size / 8000) * 100)}%` }} />
                      <span className="relative text-green-400 tabular-nums">{bid.price.toFixed(2)}</span>
                      <span className="relative text-white/40 tabular-nums">{(bid.size / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {orderBook.asks.slice(0, 5).map((ask, i) => (
                    <div key={i} className="relative flex justify-between px-1 py-0.5 text-[9px]">
                      <div className="absolute inset-0 right-0 bg-red-500/10 rounded-sm" style={{ width: `${Math.min(100, (ask.size / 8000) * 100)}%`, marginLeft: 'auto' }} />
                      <span className="relative text-red-400 tabular-nums">{ask.price.toFixed(2)}</span>
                      <span className="relative text-white/40 tabular-nums">{(ask.size / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recent Trades */}
            <div className="w-48 p-2">
              <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Recent Trades</div>
              <div className="space-y-0.5 overflow-hidden">
                {recentTrades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between text-[9px] py-0.5">
                    <div className="flex items-center gap-1">
                      {trade.side === 'yes' ? <ChevronUp className="w-2.5 h-2.5 text-green-400" /> : <ChevronDown className="w-2.5 h-2.5 text-red-400" />}
                      <span className={trade.side === 'yes' ? 'text-green-400' : 'text-red-400'}>{trade.price.toFixed(2)}</span>
                    </div>
                    <span className="text-white/40 tabular-nums">{trade.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Trading Panel */}
        <div className="w-64 border-l border-white/10 bg-[#0a0b0e] flex flex-col shrink-0">
          {/* YES/NO Buttons */}
          <div className="p-2 border-b border-white/10">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setActiveTab('yes')}
                className={`py-2 rounded-lg text-center transition-all ${
                  activeTab === 'yes' ? 'bg-green-500/20 border border-green-500/40' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`text-base font-bold ${activeTab === 'yes' ? 'text-green-400' : 'text-white/60'}`}>
                  {market.yesPrice.toFixed(2)}
                </div>
                <div className="text-[9px] text-white/40 uppercase">YES</div>
              </button>
              <button
                onClick={() => setActiveTab('no')}
                className={`py-2 rounded-lg text-center transition-all ${
                  activeTab === 'no' ? 'bg-red-500/20 border border-red-500/40' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`text-base font-bold ${activeTab === 'no' ? 'text-red-400' : 'text-white/60'}`}>
                  {market.noPrice.toFixed(2)}
                </div>
                <div className="text-[9px] text-white/40 uppercase">NO</div>
              </button>
            </div>
          </div>

          {/* Order Type */}
          <div className="px-2 pt-2">
            <div className="flex gap-1 bg-white/5 rounded p-0.5">
              <button onClick={() => setOrderType('market')} className={`flex-1 py-1.5 text-[10px] font-medium rounded transition-colors ${orderType === 'market' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                Market
              </button>
              <button onClick={() => setOrderType('limit')} className={`flex-1 py-1.5 text-[10px] font-medium rounded transition-colors ${orderType === 'limit' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                Limit
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="p-2 space-y-2 flex-1">
            <div>
              <label className="text-[9px] text-white/40 uppercase tracking-wider mb-1 block">Amount (USDC)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-9 bg-white/5 border-white/10 text-white text-sm font-medium rounded-lg"
                placeholder="0"
              />
              <div className="flex gap-0.5 mt-1">
                {[10, 50, 100, 500].map((val) => (
                  <button key={val} onClick={() => setAmount(String(val))} className="flex-1 py-1 text-[9px] font-medium text-white/50 bg-white/5 hover:bg-white/10 rounded transition-colors">
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/5 rounded-lg p-2 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Price</span>
                <span className="text-white tabular-nums">${currentPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Shares</span>
                <span className="text-white tabular-nums">{shares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] pt-1.5 border-t border-white/10">
                <span className="text-white/40">Return</span>
                <span className={`font-semibold ${activeTab === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                  ${potential.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleTrade}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'yes' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Buy {activeTab.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
