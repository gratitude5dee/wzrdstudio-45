import { useState } from 'react';
import { Play, Square, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { useExecuteWorkflow } from '@/hooks/studio/useExecuteWorkflow';
import { cn } from '@/lib/utils';

export const ExecutionPanel = () => {
  const [isOpen, setIsOpen] = useState(true);

  const isRunning = useExecutionStore((state) => state.isRunning);
  // const currentNodeId = useExecutionStore((state) => state.currentNodeId);
  const progress = useExecutionStore((state) => state.progress);
  const errors = useExecutionStore((state) => state.errors);
  const logs = useExecutionStore((state) => state.logs);
  const clearExecution = useExecutionStore((state) => state.clearExecution);

  const { execute } = useExecuteWorkflow();

  const hasErrors = Object.keys(errors).length > 0;
  const completedNodes = Object.keys(progress).filter((id) => progress[id] === 1).length;
  const totalNodes = Object.keys(progress).length;

  if (!isOpen) {
    return (
      <div className="w-12 bg-surface-primary border-l border-border-default flex flex-col items-center py-4 bg-background border-l-2">
        <button
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-surface-primary border-l border-border-default flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Execution</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={execute}
            disabled={isRunning}
            className="flex-1"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Workflow'}
          </Button>

          {isRunning && (
            <Button
              onClick={() => useExecutionStore.getState().stopExecution()}
              variant="destructive"
              size="sm"
            >
              <Square className="h-4 w-4" />
            </Button>
          )}

          {!isRunning && logs.length > 0 && (
            <Button
              onClick={clearExecution}
              variant="ghost"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress Summary */}
        {(isRunning || logs.length > 0) && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress: {completedNodes} / {totalNodes} nodes
              </span>
              {hasErrors && (
                <Badge variant="destructive" className="text-xs">
                  {Object.keys(errors).length} errors
                </Badge>
              )}
            </div>
            <Progress
              value={totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0}
              className="h-2"
            />
          </div>
        )}
      </div>

      {/* Logs */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No execution logs yet
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 rounded text-xs font-mono",
                  log.level === 'error' && "bg-red-950/20 text-red-400",
                  log.level === 'warn' && "bg-yellow-950/20 text-yellow-400",
                  log.level === 'info' && "bg-surface-secondary text-foreground"
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="flex-1">{log.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Node Progress Details */}
      {isRunning && Object.keys(progress).length > 0 && (
        <div className="p-4 border-t border-border-default">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            NODE PROGRESS
          </div>
          <div className="space-y-2">
            {Object.entries(progress).map(([nodeId, prog]) => (
              <div key={nodeId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate">Node {nodeId.slice(0, 8)}</span>
                  <span>{Math.round(prog * 100)}%</span>
                </div>
                <Progress value={prog * 100} className="h-1" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
