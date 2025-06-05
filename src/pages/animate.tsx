import { useEffect, useState } from 'react';
import Results from '@/components/animate/Results';
import SearchForm from '@/components/animate/Search';
import { useAnimateStore } from '@/components/animate/store';

const Index: React.FC = () => {
  const bangumiResult = useAnimateStore(s => s.bangumiResult);
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    // const unsubHydrate = useAnimateStore.persist.onHydrate(() => setHydrated(false))

    const unsubFinishHydration = useAnimateStore.persist.onFinishHydration(() => setHydrated(true))
    setHydrated(useAnimateStore.persist.hasHydrated())

    return () => {
      // unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Anime Mate
              </h1>
            </div>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            {/* Paste your anime list and get comprehensive data from multiple sources instantly */}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {hydrated && (
            <>
              <SearchForm />
              {bangumiResult.length > 0 && <Results />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
