import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { Textarea } from '@/components/ui/textarea';

const CommentNode = ({ data, selected, id }: NodeProps) => {
  const nodeData = data as any;
  const handleChange = (comment: string) => {
    useComposerStore.getState().setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, comment } }
          : node
      )
    );
  };

  return (
    <div
      className={cn(
        "bg-surface-secondary/50 border-2 rounded-lg shadow-sm",
        selected ? "border-primary" : "border-border-default"
      )}
      style={{
        borderColor: nodeData.color || '#8b5cf6',
        backgroundColor: `${nodeData.color}20` || '#8b5cf620',
        width: nodeData.width || 300,
        height: nodeData.height || 200
      }}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="text-xs font-semibold text-muted-foreground mb-1" style={{ color: nodeData.color }}>
          COMMENT
        </div>
        <Textarea
          value={nodeData.comment}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-sm"
          placeholder="Add a comment..."
        />
      </div>
    </div>
  );
};

export default CommentNode;
