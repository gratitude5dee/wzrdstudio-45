import { FC, useState } from 'react';
import { Handle, Position, HandleProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CustomHandleProps extends Omit<HandleProps, 'type'> {
  type: 'source' | 'target';
  position: Position;
  id?: string;
  isConnectable?: boolean;
  dataType?: 'text' | 'image' | 'video' | 'audio' | 'any';
}

export const CustomHandle: FC<CustomHandleProps> = ({
  type,
  position,
  id,
  isConnectable = true,
  dataType = 'any',
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting] = useState(false);

  // Get color based on data type
  const getHandleColor = () => {
    switch (dataType) {
      case 'text': return 'border-blue-400 before:text-blue-400';
      case 'image': return 'border-purple-400 before:text-purple-400';
      case 'video': return 'border-pink-400 before:text-pink-400';
      case 'audio': return 'border-green-400 before:text-green-400';
      default: return 'border-studio-handle-border before:text-studio-handle-border';
    }
  };

  const getHandleHoverColor = () => {
    switch (dataType) {
      case 'text': return 'hover:border-blue-300 hover:before:text-blue-300';
      case 'image': return 'hover:border-purple-300 hover:before:text-purple-300';
      case 'video': return 'hover:border-pink-300 hover:before:text-pink-300';
      case 'audio': return 'hover:border-green-300 hover:before:text-green-300';
      default: return 'hover:border-studio-handle-hover hover:before:text-studio-handle-hover';
    }
  };

  return (
    <Handle
      type={type}
      position={position}
      id={id}
      isConnectable={isConnectable}
      className={cn(
        'w-5 h-5 rounded-full border-2 transition-all duration-150',
        'bg-transparent',
        
        // Type-based colors
        !isHovered && !isConnecting && getHandleColor(),
        getHandleHoverColor(),
        
        // State-based styling
        isConnecting 
          ? 'border-white scale-125 animate-studio-handle-pulse before:text-white' 
          : isHovered 
            ? 'scale-110' 
            : '',
        
        // Plus icon
        'flex items-center justify-center',
        'before:content-["+"] before:text-sm before:font-light',
        
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    />
  );
};
