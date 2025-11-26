import { useState } from 'react';
import { Copy, Trash2, Pin, PinOff, Maximize2, Minimize2, Palette } from 'lucide-react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

interface NodeContextMenuProps {
  node: Node;
  position: { x: number; y: number };
  onClose: () => void;
}

const colorOptions = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#eab308' },
];

export const NodeContextMenu = ({ node, position, onClose }: NodeContextMenuProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const setNodesWithHistory = useComposerStore((state) => state.setNodesWithHistory);
  const setEdgesWithHistory = useComposerStore((state) => state.setEdgesWithHistory);

  const handleDuplicate = () => {
    const newNode = {
      ...node,
      id: uuidv4(),
      position: {
        x: node.position.x + 20,
        y: node.position.y + 20,
      },
      selected: true,
    };

    setNodesWithHistory((nodes) => [
      ...nodes.map((n) => ({ ...n, selected: false })),
      newNode,
    ]);

    onClose();
  };

  const handleDelete = () => {
    setNodesWithHistory((nodes) => nodes.filter((n) => n.id !== node.id));
    setEdgesWithHistory((edges) =>
      edges.filter((e) => e.source !== node.id && e.target !== node.id)
    );
    onClose();
  };

  const handleTogglePin = () => {
    setNodesWithHistory((nodes) =>
      nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              draggable: !n.draggable,
              data: { ...n.data, isPinned: !n.data.isPinned },
            }
          : n
      )
    );
    onClose();
  };

  const handleToggleCollapse = () => {
    setNodesWithHistory((nodes) =>
      nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              data: { ...n.data, isCollapsed: !n.data.isCollapsed },
            }
          : n
      )
    );
    onClose();
  };

  const handleColorChange = (color: string) => {
    setNodesWithHistory((nodes) =>
      nodes.map((n) =>
        n.id === node.id
          ? { ...n, data: { ...n.data, color } }
          : n
      )
    );
    setShowColorPicker(false);
    onClose();
  };

  // Using a portal or fixed positioning directly since ContextMenuContent is typically used within a ContextMenuTrigger.
  // However, for React Flow, we are rendering it conditionally based on state.
  // The provided snippet used StandaloneMenuContent which might be a custom component wrapper around standard context menu content or similar.
  // I'll simulate a standalone menu using fixed positioning div if StandaloneMenuContent doesn't exist (it likely doesn't in standard shadcn).
  // I'll create a simple wrapper.

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
      className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    >
      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
        onClick={handleDuplicate}
      >
        <Copy className="mr-2 h-4 w-4" />
        <span className="flex-1">Duplicate</span>
        <kbd className="ml-4 px-1.5 py-0.5 text-xs font-mono bg-muted border border-border rounded opacity-60">
          Cmd+D
        </kbd>
      </div>

      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
        onClick={handleTogglePin}
      >
        {node.data.isPinned ? (
          <>
            <PinOff className="mr-2 h-4 w-4" />
            Unpin
          </>
        ) : (
          <>
            <Pin className="mr-2 h-4 w-4" />
            Pin
          </>
        )}
      </div>

      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
        onClick={handleToggleCollapse}
      >
        {node.data.isCollapsed ? (
          <>
            <Maximize2 className="mr-2 h-4 w-4" />
            Expand
          </>
        ) : (
          <>
            <Minimize2 className="mr-2 h-4 w-4" />
            Collapse
          </>
        )}
      </div>

      <div className="-mx-1 my-1 h-px bg-border" />

      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
        onClick={() => setShowColorPicker(!showColorPicker)}
      >
        <Palette className="mr-2 h-4 w-4" />
        Change Color
      </div>

      {showColorPicker && (
        <div className="px-2 py-2 flex gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className="w-6 h-6 rounded-full border-2 border-white hover:scale-110 transition-transform"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      )}

      <div className="-mx-1 my-1 h-px bg-border" />

      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive hover:bg-accent hover:text-destructive"
        onClick={handleDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        <span className="flex-1">Delete</span>
        <kbd className="ml-4 px-1.5 py-0.5 text-xs font-mono bg-muted border border-border rounded opacity-60">
          Del
        </kbd>
      </div>

      {/* Backdrop to close menu */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
