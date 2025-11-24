import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ResultNodeData } from '@/types/studio/nodes';
import { cn } from '@/lib/utils';
import { useExecutionStore } from '@/store/studio/useExecutionStore';

export const ResultNode = memo<NodeProps<ResultNodeData>>(({ data, selected, id }) => {
  const result = useExecutionStore((state) => state.results[id]);
  const error = useExecutionStore((state) => state.errors[id]);

  return (
    <div
      className={cn(
        "bg-surface-secondary border-2 rounded-lg shadow-lg min-w-[200px]",
        selected ? "border-primary" : "border-green-500"
      )}
    >
      <div className="p-3">
        <div className="text-sm font-semibold text-green-400 mb-2">OUTPUT</div>

        {error && (
          <div className="text-xs text-red-400 p-2 bg-red-950/20 rounded">
            Error: {error}
          </div>
        )}

        {result && !error && (
          <div className="space-y-2">
            {data.outputType === 'image' && result.url && (
              <img
                src={result.url}
                alt="Result"
                className="w-full rounded"
              />
            )}

            {data.outputType === 'video' && result.url && (
              <video
                src={result.url}
                controls
                className="w-full rounded"
              />
            )}

            {data.outputType === 'text' && (
              <div className="text-xs font-mono p-2 bg-black/20 rounded">
                {result.text || result}
              </div>
            )}
          </div>
        )}

        {!result && !error && (
          <div className="text-xs text-muted-foreground">
            No output yet
          </div>
        )}
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !border-2 !border-white !bg-green-500"
      />
    </div>
  );
});

ResultNode.displayName = 'ResultNode';
