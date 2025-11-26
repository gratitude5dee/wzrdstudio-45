import { FC, memo, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { ArrowUp } from 'lucide-react';
import { CustomHandle } from '../handles/CustomHandle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface PromptInputNodeData {
  title: string;
  model: string;
  prompt: string;
  references: Array<{ id: string; thumbnail: string }>;
  generationCount: number;
  status?: 'idle' | 'generating' | 'complete';
}

export const PromptInputNode: FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as PromptInputNodeData;
  const { title, model, prompt = '', references = [], generationCount = 1, status = 'idle' } = nodeData;
  const [localPrompt, setLocalPrompt] = useState(prompt);

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
        {/* Reference Thumbnails */}
        {references.length > 0 && (
          <div className="flex gap-2 mb-3">
            {references.map((ref) => (
              <div
                key={ref.id}
                className="w-12 h-12 rounded-lg overflow-hidden border border-[#2a2a2a] flex-shrink-0"
              >
                <img src={ref.thumbnail} alt="Reference" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Prompt Input */}
        <Textarea
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          placeholder="Enter prompt..."
          className="min-h-[100px] bg-transparent border-none text-[#ffffff] placeholder:text-[#555555] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-[#888888]">{generationCount}×</span>
          <Button
            size="icon"
            className={cn(
              'h-8 w-8 rounded-full bg-white text-black hover:bg-white/90',
              status === 'generating' && 'animate-pulse'
            )}
          >
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

PromptInputNode.displayName = 'PromptInputNode';
