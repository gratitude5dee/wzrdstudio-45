import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PropertiesPanelProps {
  selectedNode?: any;
}

export const PropertiesPanel: FC<PropertiesPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) return null;

  return (
    <div className="w-60 bg-[rgba(20,20,20,0.9)] backdrop-blur-lg border-l border-[#1a1a1a] p-4">
      <h3 className="text-sm font-medium text-[#888888] mb-4">Properties</h3>

      <div className="space-y-4">
        {/* Model */}
        <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
          <span className="text-xs text-[#888888]">Model</span>
          <Select defaultValue="nano-banana-pro">
            <SelectTrigger className="h-7 w-[140px] bg-transparent border-none text-white text-xs focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333333]">
              <SelectItem value="nano-banana-pro">Nano Banana Pro</SelectItem>
              <SelectItem value="reve">Reve</SelectItem>
              <SelectItem value="hunyuan-v3">Hunyuan V3</SelectItem>
              <SelectItem value="seedream-v4">SeeDream V4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Aspect Ratio */}
        <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
          <span className="text-xs text-[#888888]">Aspect Ratio</span>
          <Select defaultValue="auto">
            <SelectTrigger className="h-7 w-[140px] bg-transparent border-none text-white text-xs focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333333]">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="1:1">1:1</SelectItem>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="9:16">9:16</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resolution */}
        <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
          <span className="text-xs text-[#888888]">Resolution</span>
          <Select defaultValue="1k">
            <SelectTrigger className="h-7 w-[140px] bg-transparent border-none text-white text-xs focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333333]">
              <SelectItem value="1k">1K</SelectItem>
              <SelectItem value="2k">2K</SelectItem>
              <SelectItem value="4k">4K</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
