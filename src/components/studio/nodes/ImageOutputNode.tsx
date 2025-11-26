import { FC, memo, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { Download, Shuffle, MoreHorizontal } from 'lucide-react';
import { CustomHandle } from '../handles/CustomHandle';
import { NodeWrapper } from './NodeWrapper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageOutputNodeData {
  title: string;
  model: string;
  images: string[];
  selectedIndex?: number;
}

export const ImageOutputNode: FC<NodeProps> = memo(({ data, selected }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const nodeData = data as unknown as ImageOutputNodeData;
  const { title, model, images = [], selectedIndex = 0 } = nodeData;

  const gridCols = images.length === 1 ? 1 : images.length <= 4 ? 2 : 3;

  return (
    <NodeWrapper selected={selected} className="min-w-[320px] max-w-[400px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-studio-node-border flex items-center justify-between">
        <span className="text-sm font-medium text-studio-text-primary">{title}</span>
        <span className="text-xs text-studio-text-secondary truncate max-w-[120px]">{model}</span>
      </div>

      {/* Image Grid */}
      <div className="p-3">
        <div
          className={cn('grid gap-2', {
            'grid-cols-1': gridCols === 1,
            'grid-cols-2': gridCols === 2,
            'grid-cols-3': gridCols === 3,
          })}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={image}
                alt={`Generated ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedIndex === index && (
                <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg pointer-events-none" />
              )}
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Output Handle */}
      <CustomHandle type="source" position={Position.Right} />
    </NodeWrapper>
  );
});

ImageOutputNode.displayName = 'ImageOutputNode';
