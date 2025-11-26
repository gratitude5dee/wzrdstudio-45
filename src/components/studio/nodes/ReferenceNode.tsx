import { FC, memo, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { Download, MoreHorizontal } from 'lucide-react';
import { CustomHandle } from '../handles/CustomHandle';
import { NodeWrapper } from './NodeWrapper';
import { Button } from '@/components/ui/button';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { NodeStatusBadge, NodeProgressBar } from '../status/NodeStatusBadge';

interface ReferenceNodeData {
  title: string;
  imageUrl: string;
  type?: 'image' | 'document' | 'chart';
}

export const ReferenceNode: FC<NodeProps> = memo(({ id, data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeData = data as unknown as ReferenceNodeData;
  const { title, imageUrl } = nodeData;

  // Get execution state
  const progress = useExecutionStore((s) => s.progress[id] || 0);
  const error = useExecutionStore((s) => s.errors[id]);
  const isRunning = useExecutionStore((s) => s.isRunning && s.currentNodeId === id);
  
  const status = error ? 'error' : isRunning ? 'generating' : progress >= 1 ? 'complete' : 'idle';

  return (
    <NodeWrapper selected={selected} status={status} className="w-[200px]">
      <NodeStatusBadge 
        status={isRunning ? 'running' : error ? 'failed' : progress >= 1 ? 'succeeded' : 'idle'} 
        progress={progress * 100}
        error={error}
      />
      {/* Title */}
      <div className="px-3 py-2 border-b border-studio-node-border">
        <span className="text-xs font-medium text-studio-text-secondary uppercase tracking-wider">{title}</span>
      </div>

      {/* Image */}
      <div 
        className="relative aspect-square"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        
        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isRunning && <NodeProgressBar progress={progress * 100} />}

      {/* Output Handle */}
      <CustomHandle type="source" position={Position.Right} />
    </NodeWrapper>
  );
});

ReferenceNode.displayName = 'ReferenceNode';
