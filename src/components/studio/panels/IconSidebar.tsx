import { FC, useState } from 'react';
import { Plus, Blocks, Clock, Link2, Sparkles, MessageCircle, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WorkflowLibrary } from './WorkflowLibrary';
import { HistoryPanel } from './HistoryPanel';

interface IconSidebarProps {
  onAddNode?: () => void;
}

export const IconSidebar: FC<IconSidebarProps> = ({ onAddNode }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const togglePanel = (panelId: string) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  return (
    <>
      {/* Icon Bar */}
      <div className="w-12 bg-transparent flex flex-col items-center py-3 gap-1 border-r border-[#1a1a1a]">
        {/* Primary Action - Add Node */}
        <Button
          size="icon"
          onClick={onAddNode}
          className="h-10 w-10 rounded-xl bg-[#2a2a2a] text-white hover:bg-[#333333]"
        >
          <Plus className="h-5 w-5" />
        </Button>

        <div className="h-px w-8 bg-[#2a2a2a] my-2" />

        {/* Browse Blocks */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => togglePanel('blocks')}
          className={cn(
            'h-10 w-10 rounded-xl text-[#666666] hover:bg-[rgba(255,255,255,0.05)] hover:text-white',
            activePanel === 'blocks' && 'bg-[rgba(255,255,255,0.05)] text-white'
          )}
        >
          <Blocks className="h-5 w-5" />
        </Button>

        {/* History */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => togglePanel('history')}
          className={cn(
            'h-10 w-10 rounded-xl text-[#666666] hover:bg-[rgba(255,255,255,0.05)] hover:text-white',
            activePanel === 'history' && 'bg-[rgba(255,255,255,0.05)] text-white'
          )}
        >
          <Clock className="h-5 w-5" />
        </Button>

        {/* Connections */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-[#666666] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <Link2 className="h-5 w-5" />
        </Button>

        {/* AI Tools */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-[#666666] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <Sparkles className="h-5 w-5" />
        </Button>

        {/* Comments */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-[#666666] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-[#666666] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <div className="flex-1" />

        {/* User Avatar */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full text-[#666666] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>

      {/* Slide-out Panel */}
      {activePanel === 'blocks' && (
        <div className="w-80 border-r border-[#1a1a1a] animate-in slide-in-from-left duration-200">
          <WorkflowLibrary />
        </div>
      )}

      {activePanel === 'history' && (
        <div className="w-80 border-r border-[#1a1a1a] animate-in slide-in-from-left duration-200">
          <HistoryPanel />
        </div>
      )}
    </>
  );
};
