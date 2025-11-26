import { useState, useCallback } from 'react';

interface DragPreviewState {
  type: string;
  label: string;
  position: { x: number; y: number };
}

export const useDragPreview = () => {
  const [preview, setPreview] = useState<DragPreviewState | null>(null);
  
  const startDrag = useCallback((type: string, label: string, e: DragEvent | React.DragEvent) => {
    setPreview({ 
      type, 
      label, 
      position: { x: e.clientX, y: e.clientY } 
    });
  }, []);
  
  const updatePosition = useCallback((e: DragEvent | React.DragEvent) => {
    setPreview(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        position: { x: e.clientX, y: e.clientY } 
      };
    });
  }, []);
  
  const endDrag = useCallback(() => {
    setPreview(null);
  }, []);
  
  return { 
    preview, 
    startDrag, 
    updatePosition, 
    endDrag 
  };
};
