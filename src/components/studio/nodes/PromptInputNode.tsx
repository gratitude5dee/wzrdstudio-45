import { FC, memo, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { ArrowUp } from 'lucide-react';
import { CustomHandle } from '../handles/CustomHandle';
import { NodeWrapper } from './NodeWrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { NodeStatusBadge, NodeProgressBar } from '../status/NodeStatusBadge';

interface PromptInputNodeData {
  title: string;
  model: string;
  prompt: string;
  references: Array<{ id: string; thumbnail: string }>;
  generationCount: number;
  status?: 'idle' | 'generating' | 'complete';
}

export const PromptInputNode: FC<NodeProps> = memo(({ id, data, selected }) => {
  const nodeData = data as unknown as PromptInputNodeData;
  const { title, model, prompt = '', references = [], generationCount = 1 } = nodeData;
  const [localPrompt, setLocalPrompt] = useState(prompt);

  // Get execution state
  const progress = useExecutionStore((s) => s.progress[id] || 0);
  const error = useExecutionStore((s) => s.errors[id]);
  const isRunning = useExecutionStore((s) => s.isRunning && s.currentNodeId === id);
  
  const status = error ? 'error' : isRunning ? 'generating' : progress >= 1 ? 'complete' : 'idle';

  return (
    <NodeWrapper selected={selected} status={status} className="min-w-[320px] max-w-[400px]">
      <NodeStatusBadge 
        status={isRunning ? 'running' : error ? 'failed' : progress >= 1 ? 'succeeded' : 'idle'} 
        progress={progress * 100}
        error={error}
      />
      {/* Header */}
      <div className="px-4 py-3 border-b border-studio-node-border flex items-center justify-between">
        <span className="text-sm font-medium text-studio-text-primary">{title}</span>
        <span className="text-xs text-studio-text-secondary truncate max-w-[120px]">{model}</span>
      </div>

      {/* Content */}
      <div className="p-4 bg-studio-node-bg-input">
        {/* Reference Thumbnails */}
        {references.length > 0 && (
          <div className="flex gap-2 mb-3">
            {references.map((ref) => (
              <div
                key={ref.id}
                className="w-12 h-12 rounded-lg overflow-hidden border border-studio-node-border flex-shrink-0"
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
          className="min-h-[100px] bg-transparent border-none text-studio-text-primary placeholder:text-studio-text-muted resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-studio-text-secondary">{generationCount}×</span>
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

      {/* Progress Bar */}
      {isRunning && <NodeProgressBar progress={progress * 100} />}

      {/* Handles */}
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </NodeWrapper>
  );
});

PromptInputNode.displayName = 'PromptInputNode';
