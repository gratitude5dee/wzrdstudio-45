import { Plus, MessageSquare } from 'lucide-react';

interface CanvasContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAddNode: (type: string, data: any) => void;
}

export const CanvasContextMenu = ({
  position,
  onClose,
  onAddNode
}: CanvasContextMenuProps) => {

  const handleAddPrimitive = (type: string) => {
    onAddNode('primitiveNode', {
      valueType: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: type === 'number' ? 0 : '',
    });
  };

  const handleAddComment = () => {
    onAddNode('comment', {
      comment: '',
      color: '#8b5cf6',
      width: 400,
      height: 300,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
      className="z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    >
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
        ADD INPUT
      </div>

      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleAddPrimitive('text')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Text Input
      </div>
      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleAddPrimitive('number')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Number Input
      </div>
      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleAddPrimitive('image')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Image Input
      </div>
      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleAddPrimitive('video')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Video Input
      </div>

      <div className="-mx-1 my-1 h-px bg-border" />

      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
        onClick={handleAddComment}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Add Comment
      </div>

      {/* Backdrop to close menu */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
