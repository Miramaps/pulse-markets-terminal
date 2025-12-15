import { useState } from 'react';
import { Calendar, DollarSign, Link2, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Market } from '@/lib/mockData';

interface CreateMarketModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (market: Omit<Market, 'id' | 'yesPrice' | 'noPrice' | 'volume' | 'traders' | 'createdAt' | 'status'>) => void;
}

export function CreateMarketModal({ open, onClose, onCreate }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Market['category']>('crypto');
  const [resolveDate, setResolveDate] = useState('');
  const [liquidity, setLiquidity] = useState('1000');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !resolveDate) return;
    onCreate({ question, category, resolvesAt: new Date(resolveDate) });
    setQuestion(''); setCategory('crypto'); setResolveDate(''); setLiquidity('1000'); setSourceUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-panel border-border max-w-sm">
        <DialogHeader><DialogTitle className="text-sm font-medium text-foreground">Create Market</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground flex items-center gap-1.5"><FileText className="w-3 h-3" />Question</Label>
            <Input placeholder="Will X happen by Y?" value={question} onChange={(e) => setQuestion(e.target.value)} className="h-8 text-xs bg-card border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Tag className="w-3 h-3" />Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
              <SelectTrigger className="h-8 text-xs bg-card border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-panel border-border">
                <SelectItem value="crypto" className="text-xs">Crypto</SelectItem>
                <SelectItem value="politics" className="text-xs">Politics</SelectItem>
                <SelectItem value="sports" className="text-xs">Sports</SelectItem>
                <SelectItem value="pop" className="text-xs">Pop Culture</SelectItem>
                <SelectItem value="memes" className="text-xs">Memes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" />Resolve Date</Label>
            <Input type="datetime-local" value={resolveDate} onChange={(e) => setResolveDate(e.target.value)} className="h-8 text-xs bg-card border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-3 h-3" />Initial Liquidity</Label>
            <Input type="number" min="100" step="100" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} className="h-8 text-xs bg-card border-border font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Link2 className="w-3 h-3" />Source URL</Label>
            <Input type="url" placeholder="https://…" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className="h-8 text-xs bg-card border-border" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-8 text-xs bg-card border-border">Cancel</Button>
            <Button type="submit" className="flex-1 h-8 bg-accent-beige text-background hover:bg-accent-beige/90 text-xs font-medium">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
