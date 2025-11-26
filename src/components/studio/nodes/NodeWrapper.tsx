import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NodeWrapperProps {
  selected?: boolean;
  status?: 'idle' | 'generating' | 'complete' | 'error';
  children: ReactNode;
  className?: string;
}

export const NodeWrapper: FC<NodeWrapperProps> = ({ 
  selected, 
  status = 'idle', 
  children, 
  className 
}) => {
  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-200',
        'bg-studio-node-bg border backdrop-blur-sm',
        
        // Border states
        selected 
          ? 'border-studio-node-border-selected shadow-xl' 
          : 'border-studio-node-border',
        
        // Status states
        status === 'generating' && 'animate-studio-generating',
        status === 'complete' && 'animate-studio-success-flash',
        status === 'error' && 'border-red-500/50',
        
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.15 }
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
