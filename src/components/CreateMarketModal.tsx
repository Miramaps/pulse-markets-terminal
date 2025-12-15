import { useState } from 'react';
import { Calendar, DollarSign, Link2, FileText, Tag } from 'lucide-react';
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
import { Market } from '@/lib/mockData';
import { motion } from 'framer-motion';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question || !resolveDate) return;

    onCreate({
      question,
      category,
      resolvesAt: new Date(resolveDate),
    });

    setQuestion('');
    setCategory('crypto');
    setResolveDate('');
    setLiquidity('1000');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card-solid border-stroke max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-ink flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center">
              <span className="text-white font-bold">+</span>
            </div>
            Create Market
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm text-muted-ink flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Question
            </Label>
            <Input
              id="question"
              placeholder="Will X happen by Y?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-11 bg-canvas2 border-stroke text-ink placeholder:text-muted-ink rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-ink flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
              <SelectTrigger className="h-11 bg-canvas2 border-stroke text-ink rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card-solid border-stroke rounded-xl">
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="pop">Pop Culture</SelectItem>
                <SelectItem value="memes">Memes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolveDate" className="text-sm text-muted-ink flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Resolve Date
            </Label>
            <Input
              id="resolveDate"
              type="datetime-local"
              value={resolveDate}
              onChange={(e) => setResolveDate(e.target.value)}
              className="h-11 bg-canvas2 border-stroke text-ink rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liquidity" className="text-sm text-muted-ink flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Initial Liquidity
            </Label>
            <Input
              id="liquidity"
              type="number"
              min="100"
              step="100"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
              className="h-11 bg-canvas2 border-stroke text-ink font-mono rounded-xl"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 bg-canvas2 border-stroke text-ink hover:bg-canvas2/80 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-ink text-white font-semibold rounded-xl hover:bg-ink/90"
            >
              Create Market
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
