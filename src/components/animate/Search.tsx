import { Loader2, Search } from 'lucide-react';
import { useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BangumiClient, Subject, SubjectType } from '@/third-services/bangumi';
import { SearchFormValues, useAnimateStore } from './store';
import Settings from './Settings';

const labels = {
  tv: 'TV',
  ova: 'OVA',
  movie: '剧场版',
};

const CheckboxForm = (props: { name: 'tv' | 'ova' | 'movie' }) => {
  const form = useFormContext<SearchFormValues>();
  const { name } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="text-slate-300">{labels[name]}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const SearchForm = () => {
  const isLoading = useAnimateStore(s => s.isLoading);
  const bangumiToken = useAnimateStore(s => s.bangumiToken);
  const formState = useAnimateStore(s => s.formState);
  const update = useAnimateStore(s => s.update);

  const form = useForm<SearchFormValues>({
    defaultValues: formState,
  });

  const bangumiClient = useMemo(() => new BangumiClient(bangumiToken), [bangumiToken]);

  const onSubmit = async (values: SearchFormValues) => {
    update({ isLoading: true, formState: values });

    const megaTags: string[] = [];
    if (values.tv) megaTags.push('TV');
    if (values.ova) megaTags.push('OVA');
    if (values.movie) megaTags.push('剧场版');

    const animeList = values.animeText.split('\n').filter(line => line.trim() !== '');
    const specs: Parameters<BangumiClient['searchSubjects']>[1] = {
      type: [SubjectType.anime],
      meta_tags: megaTags,
    };

    try {
      const responses = await Promise.all(animeList.map(name => bangumiClient.searchSubjects(name, specs)));

      // flatten results
      const results: Subject[] = [];
      for (let i = 0; i < animeList.length; i++) {
        const response = responses[i].data;
        const name = animeList[i];
        const exactMatch = response.find(item => item.name === name || item.name_cn === name);

        let target = response[0];
        if (exactMatch) target = exactMatch;
        else {
          const highestRated = response.reduce((prev, current) => {
            return (current.rating.total > prev.rating.total) ? current : prev;
          }, response[0]);
          target = highestRated;
        }

        if (!target) console.warn(name, response);
        else results.push(target);
      }
      update({ bangumiResult: results });
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      update({ isLoading: false });
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between">
            <div className="flex space-x-4 items-center">
              <CheckboxForm name="tv" />
              <CheckboxForm name="ova" />
              <CheckboxForm name="movie" />
            </div>
            <Settings />
          </div>

          <FormField
            control={form.control}
            name="animeText"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={`进击的巨人\n鬼灭之刃\n你的名字\n千与千寻`}
                    className="min-h-32 bg-slate-900/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-purple-400 transition-colors"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>Anime List (one per line)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Anime
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;