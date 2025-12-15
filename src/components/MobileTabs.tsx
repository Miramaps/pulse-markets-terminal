import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface MobileTabsProps {
  labels: string[];
  children: React.ReactNode[];
}

export function MobileTabs({ labels, children }: MobileTabsProps) {
  const [activeTab, setActiveTab] = useState(labels[0]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      <TabsList className="w-full justify-start bg-panel border-b border-stroke rounded-none p-0 h-10 shrink-0">
        {labels.map((label) => (
          <TabsTrigger
            key={label}
            value={label}
            className="flex-1 h-full rounded-none border-b-2 border-transparent text-xs font-medium text-light-muted data-[state=active]:border-accent data-[state=active]:text-light data-[state=active]:bg-transparent"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {labels.map((label, index) => (
        <TabsContent
          key={label}
          value={label}
          className="flex-1 mt-0 overflow-hidden"
        >
          {children[index]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
