import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster />
      <TooltipProvider>
        <Component {...pageProps} />
      </TooltipProvider>
    </>
  );
}
