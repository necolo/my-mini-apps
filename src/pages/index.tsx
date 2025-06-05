import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <Link 
        href="/animate" 
        className="block p-6 max-w-sm bg-white rounded-lg shadow-md hover:bg-slate-800 transition-colors bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800"
      >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-200">Anime Mate</h2>
        <p className="font-normal text-gray-100">Click to explore animations</p>
      </Link>
    </div>
  );
}
