import { Trash2 } from 'lucide-react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { Edge } from '@xyflow/react';

interface EdgeContextMenuProps {
  edge: Edge;
  position: { x: number; y: number };
  onClose: () => void;
}

export const EdgeContextMenu = ({ edge, position, onClose }: EdgeContextMenuProps) => {
  const setEdgesWithHistory = useComposerStore((state) => state.setEdgesWithHistory);

  const handleDelete = () => {
    setEdgesWithHistory((edges) => edges.filter((e) => e.id !== edge.id));
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
      className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    >
      <div
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-destructive focus:text-destructive hover:bg-accent hover:text-destructive"
        onClick={handleDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Connection
      </div>

      {/* Backdrop to close menu */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
