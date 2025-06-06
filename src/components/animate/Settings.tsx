import { Save, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimateStore } from './store';

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bangumiToken = useAnimateStore(s => s.bangumiToken);
  const update = useAnimateStore(s => s.update);

  const [localToken, setLocalToken] = useState(bangumiToken);

  const handleSave = () => {
    update({ bangumiToken: localToken });
    toast.success("Settings Saved", {
      description: "Your API tokens have been saved locally",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-slate-600 bg-slate-800/50 hover:bg-slate-100/50 text-slate-300"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">API Settings</DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure your third-party service tokens. These are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bangumiToken" className="text-slate-300">
              Bangumi Token 
              <a 
                href="https://next.bgm.tv/demo/access-token" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline ml-2"
              >
                ☞ Get
              </a>
            </Label>
            <Input
              id="bangumiToken"
              type="text"
              placeholder="Enter your MAL API token"
              value={localToken}
              onChange={(e) => setLocalToken(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-slate-100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;