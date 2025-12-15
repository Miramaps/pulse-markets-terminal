import { useState } from 'react';
import { X } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateMarketModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (market: Omit<Market, 'id' | 'yesPrice' | 'noPrice' | 'volume' | 'traders' | 'createdAt' | 'status'>) => void;
}

const categories: Market['category'][] = ['crypto', 'politics', 'sports', 'pop', 'memes'];

export function CreateMarketModal({ open, onClose, onCreate }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Market['category']>('crypto');
  const [resolveDate, setResolveDate] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !resolveDate) return;

    onCreate({
      question,
      category,
      resolvesAt: new Date(resolveDate),
      sourceUrl: sourceUrl || undefined,
    });

    setQuestion('');
    setResolveDate('');
    setSourceUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-panel border-stroke rounded-lg max-w-md p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-stroke">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display font-semibold text-sm text-light">
              Create Market
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-light-muted hover:text-light"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-light-muted">Question</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Will X happen by Y date?"
              className="h-9 bg-row border-stroke text-sm text-light placeholder:text-light-muted"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-light-muted">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
                <SelectTrigger className="h-9 bg-row border-stroke text-sm text-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-panel border-stroke">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-sm text-light capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-light-muted">Resolve Date</Label>
              <Input
                type="date"
                value={resolveDate}
                onChange={(e) => setResolveDate(e.target.value)}
                className="h-9 bg-row border-stroke text-sm text-light"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-light-muted">Source URL (optional)</Label>
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="h-9 bg-row border-stroke text-sm text-light placeholder:text-light-muted"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 text-light-muted hover:text-light text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 bg-accent text-panel hover:bg-accent/90 text-xs font-medium px-4"
            >
              Create Market
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
