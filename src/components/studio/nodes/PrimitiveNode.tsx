import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { PrimitiveNodeData } from '@/types/studio/nodes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useComposerStore } from '@/store/studio/useComposerStore';

export const PrimitiveNode = memo<NodeProps<PrimitiveNodeData>>(({ data, selected, id }) => {
  const [value, setValue] = useState(data.value);

  const handleChange = (newValue: any) => {
    setValue(newValue);
    // Update in store
    useComposerStore.getState().setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, value: newValue } }
          : node
      )
    );
  };

  return (
    <div
      className={cn(
        "bg-surface-primary border-2 rounded-lg shadow-lg min-w-[180px]",
        selected ? "border-primary" : "border-border-default"
      )}
    >
      <div className="p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-2">
          {data.valueType.toUpperCase()}
        </div>

        {data.valueType === 'text' && (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter text..."
            className="min-h-[80px] text-sm"
          />
        )}

        {data.valueType === 'number' && (
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            className="text-sm"
          />
        )}

        {data.valueType === 'image' && (
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => handleChange(ev.target?.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="text-sm"
            />
            {value && (
              <img
                src={value}
                alt="Preview"
                className="w-full h-24 object-cover rounded"
              />
            )}
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !border-2 !border-white !bg-blue-500"
      />
    </div>
  );
});

PrimitiveNode.displayName = 'PrimitiveNode';
