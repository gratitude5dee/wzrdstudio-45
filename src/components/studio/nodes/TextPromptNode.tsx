import { FC, memo, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { ArrowUp } from 'lucide-react';
import { CustomHandle } from '../handles/CustomHandle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextPromptNodeData {
  title: string;
  model: string;
  content: string;
  suggestion?: string;
}

export const TextPromptNode: FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as TextPromptNodeData;
  const { title, model, content = '', suggestion } = nodeData;
  const [localContent, setLocalContent] = useState(content);

  return (
    <div
      className={cn(
        'min-w-[320px] max-w-[400px] rounded-xl overflow-hidden transition-all',
        'bg-[#1a1a1a] border backdrop-blur-sm',
        selected ? 'border-[#666666] shadow-xl' : 'border-[#333333]',
        'hover:border-[#505050] hover:-translate-y-0.5'
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
        <span className="text-sm font-medium text-[#ffffff]">{title}</span>
        <span className="text-xs text-[#888888] truncate max-w-[120px]">{model}</span>
      </div>

      {/* Content */}
      <div className="p-4 bg-[#0d0d0d]">
        <Textarea
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          placeholder="Enter text prompt or instructions..."
          className="min-h-[120px] bg-transparent border-none text-[#ffffff] placeholder:text-[#555555] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />

        {/* Suggestion */}
        {suggestion && (
          <div className="mt-3 text-xs text-[#555555] italic">
            Try "<span className="text-[#888888]">{suggestion}</span>"
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-3">
          <Button size="icon" className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Handles */}
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </div>
  );
});

TextPromptNode.displayName = 'TextPromptNode';
