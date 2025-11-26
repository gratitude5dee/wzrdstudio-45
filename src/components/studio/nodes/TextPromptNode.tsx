import { FC, memo, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { ArrowUp } from 'lucide-react';
import { CustomHandle } from '../handles/CustomHandle';
import { NodeWrapper } from './NodeWrapper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { NodeStatusBadge, NodeProgressBar } from '../status/NodeStatusBadge';

interface TextPromptNodeData {
  title: string;
  model: string;
  content: string;
  suggestion?: string;
}

export const TextPromptNode: FC<NodeProps> = memo(({ id, data, selected }) => {
  const nodeData = data as unknown as TextPromptNodeData;
  const { title, model, content = '', suggestion } = nodeData;
  const [localContent, setLocalContent] = useState(content);

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
        <Textarea
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          placeholder="Enter text prompt or instructions..."
          className="min-h-[120px] bg-transparent border-none text-studio-text-primary placeholder:text-studio-text-muted resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />

        {/* Suggestion */}
        {suggestion && (
          <div className="mt-3 text-xs text-studio-text-muted italic">
            Try "<span className="text-studio-text-secondary">{suggestion}</span>"
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-3">
          <Button size="icon" className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90">
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

TextPromptNode.displayName = 'TextPromptNode';
