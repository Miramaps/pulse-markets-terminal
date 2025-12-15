import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MobileTabsProps { children: [ReactNode, ReactNode, ReactNode]; labels: [string, string, string]; }

export function MobileTabs({ children, labels }: MobileTabsProps) {
  return (
    <Tabs defaultValue="new" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3 bg-panel border-b border-border rounded-none h-10 shrink-0">
        <TabsTrigger value="new" className="data-[state=active]:bg-card data-[state=active]:text-accent-beige rounded-none text-xs">{labels[0]}</TabsTrigger>
        <TabsTrigger value="ending" className="data-[state=active]:bg-card data-[state=active]:text-accent-beige rounded-none text-xs">{labels[1]}</TabsTrigger>
        <TabsTrigger value="resolved" className="data-[state=active]:bg-card data-[state=active]:text-accent-beige rounded-none text-xs">{labels[2]}</TabsTrigger>
      </TabsList>
      <TabsContent value="new" className="flex-1 mt-0 overflow-hidden">{children[0]}</TabsContent>
      <TabsContent value="ending" className="flex-1 mt-0 overflow-hidden">{children[1]}</TabsContent>
      <TabsContent value="resolved" className="flex-1 mt-0 overflow-hidden">{children[2]}</TabsContent>
    </Tabs>
  );
}
