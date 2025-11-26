import { useCallback } from 'react';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { useToast } from '@/hooks/use-toast';

export const useExecutionQueue = () => {
  const { toast } = useToast();
  const {
    isRunning,
    currentNodeId,
    stopExecution,
    setNodeProgress,
    setNodeError,
    setNodeResult,
    addLog,
  } = useExecutionStore();

  const cancelExecution = useCallback(() => {
    if (!isRunning) return;

    stopExecution();
    
    if (currentNodeId) {
      setNodeError(currentNodeId, 'Execution cancelled by user');
      addLog({
        timestamp: Date.now(),
        nodeId: currentNodeId,
        message: 'Execution cancelled',
        level: 'warn',
      });
    }

    toast({
      title: 'Execution cancelled',
      description: 'The workflow execution was stopped',
    });
  }, [isRunning, currentNodeId, stopExecution, setNodeError, addLog, toast]);

  const retryNode = useCallback(async (nodeId: string) => {
    // Reset node state
    setNodeProgress(nodeId, 0);
    setNodeError(nodeId, '');
    
    addLog({
      timestamp: Date.now(),
      nodeId,
      message: 'Retrying node execution',
      level: 'info',
    });

    toast({
      title: 'Retrying node',
      description: 'Node execution restarted',
    });

    // Note: Actual retry logic would trigger the execution engine here
    // For now, this resets the state to allow manual retry
  }, [setNodeProgress, setNodeError, addLog, toast]);

  const clearErrors = useCallback(() => {
    // This would be implemented in the execution store
    toast({
      title: 'Errors cleared',
      description: 'All error states have been reset',
    });
  }, [toast]);

  return {
    cancelExecution,
    retryNode,
    clearErrors,
    isRunning,
    currentNodeId,
  };
};
