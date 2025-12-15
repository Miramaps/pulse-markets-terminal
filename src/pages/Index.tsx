import { useState, useEffect, useCallback } from 'react';
import { TopNav } from '@/components/TopNav';
import { BottomBar } from '@/components/BottomBar';
import { MarketColumn } from '@/components/MarketColumn';
import { MarketRow } from '@/components/MarketRow';
import { CreateMarketModal } from '@/components/CreateMarketModal';
import { MobileTabs } from '@/components/MobileTabs';
import { initialMarkets, Market } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [priceFlashes, setPriceFlashes] = useState<Record<string, boolean>>({});
  const [positions, setPositions] = useState<Array<{ marketId: string; side: 'yes' | 'no'; amount: number }>>([]);
  const { toast } = useToast();

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) => {
        const updated = [...prev];
        const numUpdates = Math.floor(Math.random() * 3) + 2;
        const indices = new Set<number>();
        
        while (indices.size < numUpdates) {
          indices.add(Math.floor(Math.random() * updated.length));
        }

        const newFlashes: Record<string, boolean> = {};

        indices.forEach((idx) => {
          const market = updated[idx];
          const delta = (Math.random() - 0.5) * 0.04;
          const newYesPrice = Math.max(0.01, Math.min(0.99, market.yesPrice + delta));
          
          updated[idx] = {
            ...market,
            yesPrice: Number(newYesPrice.toFixed(2)),
            noPrice: Number((1 - newYesPrice).toFixed(2)),
            volume: market.volume + Math.floor(Math.random() * 500),
          };

          newFlashes[market.id] = true;
        });

        setPriceFlashes(newFlashes);
        setTimeout(() => setPriceFlashes({}), 250);

        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Update selected market when prices change
  useEffect(() => {
    if (selectedMarket) {
      const updated = markets.find(m => m.id === selectedMarket.id);
      if (updated) setSelectedMarket(updated);
    }
  }, [markets, selectedMarket?.id]);

  const handleBuy = useCallback((marketId: string, side: 'yes' | 'no', amount: number) => {
    setPositions((prev) => [...prev, { marketId, side, amount }]);
  }, []);

  const handleCreateMarket = useCallback((marketData: Omit<Market, 'id' | 'yesPrice' | 'noPrice' | 'volume' | 'traders' | 'createdAt' | 'status'>) => {
    const newMarket: Market = {
      id: `market-new-${Date.now()}`,
      yesPrice: 0.5,
      noPrice: 0.5,
      volume: 0,
      traders: 0,
      createdAt: new Date(),
      status: 'new',
      ...marketData,
    };

    setMarkets((prev) => [newMarket, ...prev]);
    
    toast({
      title: 'Market Created',
      description: 'Your market is now live.',
    });
  }, [toast]);

  const newMarkets = markets.filter((m) => m.status === 'new');
  const endingMarkets = markets.filter((m) => m.status === 'ending');
  const resolvedMarkets = markets.filter((m) => m.status === 'resolved');

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <TopNav onCreateMarket={() => setIsCreateModalOpen(true)} />

      {/* Main Content */}
      <main className="h-[calc(100vh-3rem-4rem)]">
        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 h-full divide-x divide-border">
          <MarketColumn
            title="NEW"
            markets={newMarkets}
            selectedMarket={selectedMarket}
            onSelectMarket={setSelectedMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
          />
          <MarketColumn
            title="ENDING"
            markets={endingMarkets}
            selectedMarket={selectedMarket}
            onSelectMarket={setSelectedMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
          />
          <MarketColumn
            title="RESOLVED"
            markets={resolvedMarkets}
            selectedMarket={selectedMarket}
            onSelectMarket={setSelectedMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Mobile: Tabs */}
        <div className="lg:hidden h-full">
          <MobileTabs labels={['New', 'Ending', 'Resolved']}>
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2 pb-20">
                {newMarkets
                  .filter((m) => !selectedCategory || m.category === selectedCategory)
                  .map((market) => (
                    <MarketRow
                      key={market.id}
                      market={market}
                      isSelected={selectedMarket?.id === market.id}
                      onSelect={setSelectedMarket}
                      priceFlash={priceFlashes[market.id]}
                    />
                  ))}
              </div>
            </ScrollArea>
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2 pb-20">
                {endingMarkets
                  .filter((m) => !selectedCategory || m.category === selectedCategory)
                  .map((market) => (
                    <MarketRow
                      key={market.id}
                      market={market}
                      isSelected={selectedMarket?.id === market.id}
                      onSelect={setSelectedMarket}
                      priceFlash={priceFlashes[market.id]}
                    />
                  ))}
              </div>
            </ScrollArea>
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2 pb-20">
                {resolvedMarkets
                  .filter((m) => !selectedCategory || m.category === selectedCategory)
                  .map((market) => (
                    <MarketRow
                      key={market.id}
                      market={market}
                      isSelected={selectedMarket?.id === market.id}
                      onSelect={setSelectedMarket}
                      priceFlash={priceFlashes[market.id]}
                    />
                  ))}
              </div>
            </ScrollArea>
          </MobileTabs>
        </div>
      </main>

      <BottomBar
        selectedMarket={selectedMarket}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onClearSelection={() => setSelectedMarket(null)}
        onBuy={handleBuy}
      />

      <CreateMarketModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateMarket}
      />
    </div>
  );
};

export default Index;
