import { FC } from 'react';
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
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      isConnectable={isConnectable}
      className={cn(
        'w-5 h-5 rounded-full border-2 transition-all',
        'bg-transparent border-[#666666]',
        'hover:border-white',
        'flex items-center justify-center',
        'before:content-["+"] before:text-[#666666] before:text-sm before:font-light',
        'hover:before:text-white',
        className
      )}
      {...props}
    />
  );
};
