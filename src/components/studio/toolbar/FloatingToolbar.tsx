import { FC } from 'react';
import { Wand2, Settings, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FloatingToolbarProps {
  selectedNodeId: string;
  position?: { x: number; y: number };
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({ selectedNodeId, position }) => {
  return (
    <div
      className="fixed z-50 bg-[rgba(30,30,30,0.95)] backdrop-blur-lg rounded-3xl px-4 py-2 flex items-center gap-2 shadow-2xl border border-[#2a2a2a]"
      style={{
        top: position ? `${position.y - 60}px` : '50px',
        left: position ? `${position.x}px` : '50%',
        transform: position ? 'translateX(-50%)' : 'translateX(-50%)',
      }}
    >
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
