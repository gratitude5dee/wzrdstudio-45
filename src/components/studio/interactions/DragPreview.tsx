import { FC } from 'react';
import { motion } from 'framer-motion';

interface DragPreviewProps {
  type: string;
  label: string;
  position: { x: number; y: number };
}

export const DragPreview: FC<DragPreviewProps> = ({ label, position }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] animate-studio-drag-preview"
      style={{ 
        left: position.x, 
        top: position.y, 
        transform: 'translate(-50%, -50%)' 
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.7, scale: 1 }}
    >
      <div className="bg-studio-node-bg border border-studio-node-border rounded-xl p-4 shadow-2xl min-w-[200px]">
        <span className="text-studio-text-primary text-sm">{label}</span>
      </div>
    </motion.div>
  );
};
