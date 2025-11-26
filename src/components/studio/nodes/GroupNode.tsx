import { FC, memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeWrapper } from './NodeWrapper';
import { Minimize2, Maximize2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const GroupNode: FC<NodeProps> = memo(({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState((data?.label as string) || 'Group');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    // Update node data
    if (data?.onLabelChange && typeof data.onLabelChange === 'function') {
      data.onLabelChange(e.target.value);
    }
  };

  const width = (data?.width as number) || 400;
  const height = (data?.height as number) || 300;

  return (
    <div 
      className="relative"
      style={{ minWidth: width, minHeight: isCollapsed ? 48 : height }}
    >
      <NodeWrapper
        selected={selected}
        className={cn(
          'bg-transparent border-2 border-dashed border-purple-500/30 backdrop-blur-none shadow-none',
          selected && 'border-purple-500/60',
          isCollapsed && 'h-12'
        )}
      >
        {/* Group Header */}
        <div className="absolute -top-8 left-0 right-0 flex items-center justify-between px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-lg">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={label}
                onChange={handleLabelChange}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="bg-transparent border-none outline-none text-white text-sm px-1"
                autoFocus
              />
            ) : (
              <span className="text-white text-sm font-medium">{label}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-[#666666] hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-[#666666] hover:text-white"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <Maximize2 className="h-3 w-3" />
            ) : (
              <Minimize2 className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Group Content Area */}
        {!isCollapsed && (
          <div className="w-full h-full flex items-center justify-center text-[#444444] text-sm">
            Drop nodes here
          </div>
        )}

        {/* Handles for connections */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-purple-500 border-2 border-[#1a1a1a]"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-purple-500 border-2 border-[#1a1a1a]"
        />
      </NodeWrapper>
    </div>
  );
});

GroupNode.displayName = 'GroupNode';
