import { useState, useEffect, useCallback } from 'react';
import { TopNav } from '@/components/TopNav';
import { BottomBar } from '@/components/BottomBar';
import { MarketColumn } from '@/components/MarketColumn';
import { MarketCard } from '@/components/MarketCard';
import { CreateMarketModal } from '@/components/CreateMarketModal';
import { MobileTabs } from '@/components/MobileTabs';
import { initialMarkets, Market } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';

const Index = () => {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [priceFlashes, setPriceFlashes] = useState<Record<string, boolean>>({});
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
        setTimeout(() => setPriceFlashes({}), 400);

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
      description: 'Your market is now live!',
    });
  }, [toast]);

  const newMarkets = markets.filter((m) => m.status === 'new');
  const endingMarkets = markets.filter((m) => m.status === 'ending');
  const resolvedMarkets = markets.filter((m) => m.status === 'resolved');

  return (
    <div className="min-h-screen relative">
      <TopNav onCreateMarket={() => setIsCreateModalOpen(true)} />

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem-4.5rem)] px-4 py-4">
        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 h-full max-w-7xl mx-auto">
          <MarketColumn
            title="NEW"
            markets={newMarkets}
            selectedMarketId={selectedMarket?.id ?? null}
            onSelectMarket={setSelectedMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
          />
          <MarketColumn
            title="ENDING"
            markets={endingMarkets}
            selectedMarketId={selectedMarket?.id ?? null}
            onSelectMarket={setSelectedMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
          />
          <MarketColumn
            title="RESOLVED"
            markets={resolvedMarkets}
            selectedMarketId={selectedMarket?.id ?? null}
            onSelectMarket={setSelectedMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Mobile: Tabs */}
        <div className="lg:hidden h-full">
          <MobileTabs labels={['New', 'Ending', 'Resolved']}>
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3 pb-24">
                <AnimatePresence mode="popLayout">
                  {newMarkets
                    .filter((m) => !selectedCategory || m.category === selectedCategory)
                    .map((market) => (
                      <MarketCard
                        key={market.id}
                        market={market}
                        isSelected={selectedMarket?.id === market.id}
                        onSelect={() => setSelectedMarket(market)}
                        priceFlash={priceFlashes[market.id]}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3 pb-24">
                <AnimatePresence mode="popLayout">
                  {endingMarkets
                    .filter((m) => !selectedCategory || m.category === selectedCategory)
                    .map((market) => (
                      <MarketCard
                        key={market.id}
                        market={market}
                        isSelected={selectedMarket?.id === market.id}
                        onSelect={() => setSelectedMarket(market)}
                        priceFlash={priceFlashes[market.id]}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3 pb-24">
                <AnimatePresence mode="popLayout">
                  {resolvedMarkets
                    .filter((m) => !selectedCategory || m.category === selectedCategory)
                    .map((market) => (
                      <MarketCard
                        key={market.id}
                        market={market}
                        isSelected={selectedMarket?.id === market.id}
                        onSelect={() => setSelectedMarket(market)}
                        priceFlash={priceFlashes[market.id]}
                      />
                    ))}
                </AnimatePresence>
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
