import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { CommentNodeData } from '@/types/studio/nodes';
import { cn } from '@/lib/utils';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { Textarea } from '@/components/ui/textarea';

export const CommentNode = memo<NodeProps<CommentNodeData>>(({ data, selected, id }) => {
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
        borderColor: data.color || '#8b5cf6',
        backgroundColor: `${data.color}20` || '#8b5cf620',
        width: data.width || 300,
        height: data.height || 200
      }}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="text-xs font-semibold text-muted-foreground mb-1" style={{ color: data.color }}>
          COMMENT
        </div>
        <Textarea
          value={data.comment}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-sm"
          placeholder="Add a comment..."
        />
      </div>
    </div>
  );
});

CommentNode.displayName = 'CommentNode';
