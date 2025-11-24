import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

const CombineNode = ({ data, selected }: NodeProps) => {
  const nodeData = data as any;
  return (
    <div
      className={cn(
        "bg-surface-secondary border-2 rounded-lg shadow-lg min-w-[150px]",
        selected ? "border-primary" : "border-purple-500"
      )}
    >
      <div className="p-3">
        <div className="text-sm font-semibold text-purple-400 mb-2 uppercase">
          Combine {nodeData.mode}
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Inputs</div>
          {/* Fixed 3 inputs for now */}
          <div className="relative h-4">
            <span className="text-xs absolute left-4">Input 1</span>
            <Handle
              type="target"
              position={Position.Left}
              id="input1"
              className="!w-3 !h-3 !border-2 !border-white !bg-purple-500"
            />
          </div>
          <div className="relative h-4">
            <span className="text-xs absolute left-4">Input 2</span>
            <Handle
              type="target"
              position={Position.Left}
              id="input2"
              className="!w-3 !h-3 !border-2 !border-white !bg-purple-500"
            />
          </div>
          <div className="relative h-4">
            <span className="text-xs absolute left-4">Input 3</span>
            <Handle
              type="target"
              position={Position.Left}
              id="input3"
              className="!w-3 !h-3 !border-2 !border-white !bg-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !border-2 !border-white !bg-purple-500"
      />
    </div>
  );
};

export default CombineNode;
