import { CheckCheck, Copy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnimateStore } from './_store';

const filterFormSchema = z.object({
  sort: z.enum(['year', 'score', 'popular']),
});
type FilterFormValues = z.infer<typeof filterFormSchema>;


const Results = () => {
  const bangumiResult = useAnimateStore(s => s.bangumiResult);

  const form = useForm<FilterFormValues>({
    defaultValues: {
      sort: 'score',
    },
  });
  const sort = form.watch('sort');

  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [sort, bangumiResult]);

  const sortedResults = useMemo(() => {
    return bangumiResult.sort((a, b) => {
      if (sort === 'year') {
        return a.date.localeCompare(b.date);
      } else if (sort === 'score') {
        return a.rating.rank - b.rating.rank;
      } else if (sort === 'popular') {
        return b.rating.total - a.rating.total;
      } else {
        return 0;
      }
    });
  }, [bangumiResult, sort]);

  const formattedText = useMemo(() => sortedResults.map(anime => `[${anime.date}][${anime.rating.score}][${anime.name_cn || anime.name}]`).join('\n'), [sortedResults, sort]);

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
        {/* <CardHeader className="flex justify-between">
          <CardTitle className="text-slate-100"> Title </CardTitle>
        </CardHeader> */}
        <CardContent className="flex flex-col gap-4">
          <Form {...form}>
            <form className="flex flex-wrap items-center gap-4">
              <FormField
                control={form.control}
                name="sort"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="text-slate-200 text-sm whitespace-nowrap">Sort:</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px] border-slate-600 text-slate-200 hover:bg-slate-700 h-8 text-sm">
                          <SelectValue placeholder="Select sort" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="year">Year</SelectItem>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="popular">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded-lg max-h-96 overflow-y-auto relative">
            {formattedText}
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="text-slate-200 hover:text-slate-700 absolute top-2 right-2"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </pre>

        </CardContent>
      </Card>
    </div>
  );
}

export default Results;