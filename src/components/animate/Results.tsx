import { CheckCheck, Copy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnimateStore } from './store';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';

const Results = () => {
  const bangumiResult = useAnimateStore(s => s.bangumiResult);
  const update = useAnimateStore(s => s.update);
  const sort = useAnimateStore(s => s.sort);
  const format = useAnimateStore(s => s.format);

  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [sort, bangumiResult]);

  const [showFormatTooltip, setShowTooltip] = useState(false);

  const sortedResults = useMemo(() => {
    return bangumiResult.sort((a, b) => {
      if (sort === 'date') {
        return a.date.localeCompare(b.date);
      } else if (sort === 'score') {
        return a.rating.rank - b.rating.rank;
      } else if (sort === 'total rating') {
        return b.rating.total - a.rating.total;
      } else {
        return 0;
      }
    });
  }, [bangumiResult, sort]);

  const formattedText = useMemo(() => {
    return sortedResults.map(anime => {
      const date = anime.date;
      const score = anime.rating.score;
      const name_cn = anime.name_cn || anime.name;
      const name = anime.name;
      const [year, month, day] = date.split('-');
      const total_rating = anime.rating.total || 0;
      const rank = anime.rating.rank || 0;
      const eps_count = anime.eps_count || 0;
      const eps = anime.eps || 0;
      const { collect, wish, doing, on_hold, dropped } = anime.collection || { collect: 0, wish: 0, doing: 0, on_hold: 0, dropped: 0 };
      return (format || '[{date}][{score}][{name}]').replace('{date}', date)
        .replace('{year}', year)
        .replace('{month}', month)
        .replace('{day}', day)
        .replace('{score}', score.toString())
        .replace('{name_cn}', name_cn)
        .replace('{name}', name)
        .replace('{total_rating}', total_rating.toString())
        .replace('{rank}', rank.toString())
        .replace('{eps_count}', eps_count.toString())
        .replace('{eps}', eps.toString())
        .replace('{collect}', collect.toString())
        .replace('{wish}', wish.toString())
        .replace('{doing}', doing.toString())
        .replace('{on_hold}', on_hold.toString())
        .replace('{dropped}', dropped.toString());
    }).join('\n');
  }, [sortedResults, sort, format]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      toast.success("Copied!", {
        description: "Anime data copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Copy failed", {
        description: "Failed to copy to clipboard",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">
          Found {bangumiResult.length} Anime
        </h2>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4 items-center w-full">
            <div className="flex gap-2 items-center">
              <Label className="text-slate-200 whitespace-nowrap">Sort</Label>
              <Select
                value={sort}
                onValueChange={(value) => update({ sort: value as 'date' | 'score' | 'total rating' })}
              >
                <SelectTrigger className="w-[180px] border-slate-600 text-slate-200 hover:bg-slate-700 h-8 text-sm">
                  <SelectValue placeholder="Select sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="total rating">Total Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center flex-1 relative">
              <Label className="text-slate-200 whitespace-nowrap">Format</Label>
              <Input
                value={format}
                onChange={(e) => update({ format: e.target.value })}
                placeholder="format of the output, eg: [{date}][{score}][{name}]"
                className="w-full border-slate-600 text-slate-200 hover:bg-slate-700 h-8 text-sm"
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
              />
              {showFormatTooltip && (
                <p className="text-slate-200 text-sm whitespace-pre-wrap bg-slate-900/50 p-2 rounded-lg absolute -top-16 z-10">
                  Available Variables: date, score, name, year, month, day, total_rating, rank, eps_count, eps, collect, wish, doing, on_hold, dropped
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded-lg max-h-96 overflow-y-auto">
              {formattedText}
            </pre>

            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="text-slate-200 hover:text-slate-700 absolute top-2 right-2"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default Results;