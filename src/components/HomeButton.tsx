import { Home } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const HomeButton = () => {
  return (
    <Link href="/">
      <Button variant="outline" size="icon" className="fixed top-8 left-8 border-slate-600 bg-slate-800/50 hover:bg-slate-100/50 text-slate-300">
        <Home className="w-4 h-4" />
      </Button>
    </Link>

  );
};

export default HomeButton;