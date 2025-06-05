import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as Bangumi from '@/third-services/bangumi';
import { z } from 'zod';

export const searchFormSchema = z.object({
  animeText: z.string().min(1, 'Please enter at least one anime name'),
  tv: z.boolean(),
  ova: z.boolean(),
  movie: z.boolean(),
});
export type SearchFormValues = z.infer<typeof searchFormSchema>;



interface State {
  isLoading: boolean;
  bangumiResult: Bangumi.Subject[];
  formState: SearchFormValues;

  // in localstorage
  bangumiToken: string;
}
interface Actions {
  update: (state: Partial<State>) => void;
}

// persist states
export const useAnimateStore = create<State & Actions>()(persist((set) => ({
  // states
  isLoading: false,
  bangumiToken: '',
  bangumiResult: [],
  formState: {
    animeText: '',
    tv: true,
    ova: false,
    movie: false,
  },
  filterState: { sort: 'score' },

  // actions
  update: set,
}), {
  name: 'animate-storage',
  storage: createJSONStorage(() => localStorage),
}));
