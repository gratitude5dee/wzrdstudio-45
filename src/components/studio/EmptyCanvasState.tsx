import { Image, Sparkles, Video, Workflow, MoreHorizontal, FileJson, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface EmptyCanvasStateProps {
  onAddBlock: (type: 'text' | 'image' | 'video') => void;
  onOpenTemplates?: () => void;
  onStartTour?: () => void;
}

const EmptyCanvasState = ({ onAddBlock, onOpenTemplates, onStartTour }: EmptyCanvasStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in fade-in-0 duration-500">
      <div className="text-center pointer-events-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Start Creating</h1>
          <p className="text-sm text-zinc-400">
            ⌘ Double-click anywhere to create a new Block, or get started below
          </p>
        </div>
        
        <div className="flex gap-2 justify-center flex-wrap max-w-2xl">
          <Button
            onClick={() => onAddBlock('image')}
            variant="outline"
            size="sm"
            className="bg-black border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all duration-200"
          >
            <Image className="h-3.5 w-3.5 mr-1.5" />
            Describe an Image
          </Button>
          
          <Button
            onClick={() => onAddBlock('text')}
            variant="outline"
            size="sm"
            className="bg-black border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all duration-200"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Combine ideas
          </Button>
          
          <Button
            onClick={() => onAddBlock('video')}
            variant="outline"
            size="sm"
            className="bg-black border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all duration-200"
          >
            <Video className="h-3.5 w-3.5 mr-1.5" />
            Make a video from an image
          </Button>
          
          <Button
            onClick={onOpenTemplates}
            variant="outline"
            size="sm"
            className="bg-black border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all duration-200"
          >
            <Workflow className="h-3.5 w-3.5 mr-1.5" />
            Explore Templates
          </Button>
          
          <Button
            onClick={onStartTour}
            variant="outline"
            size="sm"
            className="bg-black border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all duration-200"
          >
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Take a Tour
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="link"
            size="sm"
            className="text-zinc-500 hover:text-zinc-300 text-xs"
            onClick={onStartTour}
          >
            <FileJson className="h-3 w-3 mr-1.5" />
            Import Workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCanvasState;
