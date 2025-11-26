import { FC, useEffect, useState } from 'react';
import { Wand2, Settings, Sparkles, RotateCcw, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useComposerStore, useCanUndo, useCanRedo } from '@/store/studio/useComposerStore';
import { useReactFlow } from '@xyflow/react';

interface FloatingToolbarProps {
  selectedNodeId: string;
  position?: { x: number; y: number };
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({ selectedNodeId, position: initialPosition }) => {
  const { getNode } = useReactFlow();
  const undo = useComposerStore((state) => state.undo);
  const redo = useComposerStore((state) => state.redo);
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const [position, setPosition] = useState(initialPosition || { x: window.innerWidth / 2, y: 80 });

  // Dynamically update position based on selected node
  useEffect(() => {
    const node = getNode(selectedNodeId);
    if (node) {
      const nodeElement = document.querySelector(`[data-id="${selectedNodeId}"]`);
      if (nodeElement) {
        const bounds = nodeElement.getBoundingClientRect();
        setPosition({
          x: bounds.left + bounds.width / 2,
          y: bounds.top - 20,
        });
      }
    }
  }, [selectedNodeId, getNode]);

  return (
    <div
      className="fixed z-50 bg-[rgba(30,30,30,0.95)] backdrop-blur-lg rounded-3xl px-4 py-2 flex items-center gap-2 shadow-2xl border border-[#2a2a2a] transition-all duration-200"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Undo */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-white hover:bg-white/10 disabled:opacity-30"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Cmd+Z)"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      {/* Redo */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-white hover:bg-white/10 disabled:opacity-30"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Cmd+Shift+Z)"
      >
        <RotateCcw className="h-4 w-4 scale-x-[-1]" />
      </Button>

      <div className="h-6 w-px bg-[#444444]" />

      {/* Magic Wand */}
      <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
        <Wand2 className="h-4 w-4" />
      </Button>

      {/* Aspect Ratio */}
      <Select defaultValue="auto">
        <SelectTrigger className="h-8 w-[100px] bg-transparent border-none text-white text-sm focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-[#333333]">
          <SelectItem value="auto">Auto</SelectItem>
          <SelectItem value="1:1">1:1</SelectItem>
          <SelectItem value="16:9">16:9</SelectItem>
          <SelectItem value="9:16">9:16</SelectItem>
          <SelectItem value="4:3">4:3</SelectItem>
        </SelectContent>
      </Select>

      {/* Model Selector */}
      <Select defaultValue="nano-banana-pro">
        <SelectTrigger className="h-8 w-[160px] bg-transparent border-none text-white text-sm focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-[#333333]">
          <SelectItem value="nano-banana-pro">Nano Banana Pro</SelectItem>
          <SelectItem value="reve">Reve</SelectItem>
          <SelectItem value="hunyuan-v3">Hunyuan V3</SelectItem>
          <SelectItem value="seedream-v4">SeeDream V4</SelectItem>
          <SelectItem value="ideogram-v3">Ideogram V3</SelectItem>
        </SelectContent>
      </Select>

      {/* Settings */}
      <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
        <Settings className="h-4 w-4" />
      </Button>

      {/* AI Enhance */}
      <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
        <Sparkles className="h-4 w-4" />
      </Button>
    </div>
  );
};
