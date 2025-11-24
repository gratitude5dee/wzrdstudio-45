import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { WorkflowNodeData } from '@/types/studio/nodes';
import { cn } from '@/lib/utils';

export const WorkflowNode = memo<NodeProps<WorkflowNodeData>>(({ data, selected, id }) => {
  const isRunning = data.running;

  return (
    <div
      className={cn(
        "bg-surface-secondary border-2 rounded-lg shadow-lg min-w-[200px]",
        selected ? "border-primary" : "border-border-default",
        isRunning && "animate-pulse",
        data.isPinned && "ring-2 ring-yellow-500"
      )}
      style={{ borderColor: data.color }}
    >
      {/* Thumbnail */}
      {data.thumbnail && (
        <div className="h-32 w-full overflow-hidden rounded-t-lg">
          <img
            src={data.thumbnail}
            alt={data.label}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        <div className="font-semibold text-sm mb-1">{data.workflowName}</div>
        <div className="text-xs text-muted-foreground">{data.label}</div>

        {/* Inputs preview */}
        {!data.isCollapsed && Object.keys(data.inputs).length > 0 && (
          <div className="mt-2 space-y-1">
            {Object.entries(data.inputs).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-muted-foreground">{key}:</span>{' '}
                <span className="font-mono">
                  {typeof value === 'string' ? value.slice(0, 20) : JSON.stringify(value).slice(0, 20)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Handles */}
      {Object.keys(data.inputs).map((inputKey, i) => (
        <Handle
          key={`input-${inputKey}`}
          type="target"
          position={Position.Left}
          id={inputKey}
          style={{
            top: `${((i + 1) / (Object.keys(data.inputs).length + 1)) * 100}%`,
            background: '#3b82f6'
          }}
          className="!w-3 !h-3 !border-2 !border-white"
        />
      ))}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !border-2 !border-white !bg-green-500"
      />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
