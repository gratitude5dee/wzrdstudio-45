import { FC, useState } from 'react';
import { Handle, Position, HandleProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CustomHandleProps extends Omit<HandleProps, 'type'> {
  type: 'source' | 'target';
  position: Position;
  id?: string;
  isConnectable?: boolean;
}

export const CustomHandle: FC<CustomHandleProps> = ({
  type,
  position,
  id,
  isConnectable = true,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting] = useState(false);

  return (
    <Handle
      type={type}
      position={position}
      id={id}
      isConnectable={isConnectable}
      className={cn(
        'w-5 h-5 rounded-full border-2 transition-all duration-150',
        'bg-transparent',
        
        // State-based styling
        isConnecting 
          ? 'border-studio-handle-hover scale-125 animate-studio-handle-pulse' 
          : isHovered 
            ? 'border-studio-handle-hover scale-110' 
            : 'border-studio-handle-border',
        
        // Plus icon
        'flex items-center justify-center',
        'before:content-["+"] before:text-sm before:font-light',
        isHovered || isConnecting 
          ? 'before:text-studio-handle-hover' 
          : 'before:text-studio-handle-border',
        
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    />
  );
};
