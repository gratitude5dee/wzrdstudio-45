import { FC, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, FileJson } from 'lucide-react';
import { useWorkflowPersistence } from '@/hooks/studio/useWorkflowPersistence';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkflowListModal: FC<WorkflowListModalProps> = ({ open, onOpenChange }) => {
  const { listWorkflows, loadWorkflow, deleteWorkflow, isLoading } = useWorkflowPersistence();
  const [workflows, setWorkflows] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      loadWorkflows();
    }
  }, [open]);

  const loadWorkflows = async () => {
    const data = await listWorkflows();
    setWorkflows(data);
  };

  const handleLoad = async (workflowId: string) => {
    const result = await loadWorkflow(workflowId);
    if (result) {
      onOpenChange(false);
    }
  };

  const handleDelete = async (workflowId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this workflow?');
    if (confirmed) {
      const success = await deleteWorkflow(workflowId);
      if (success) {
        loadWorkflows();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">Your Workflows</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
            </div>
          ) : workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileJson className="h-12 w-12 text-zinc-600 mb-3" />
              <p className="text-zinc-400">No saved workflows yet</p>
              <p className="text-zinc-600 text-sm mt-1">Create your first workflow to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="group bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a] hover:border-[#444] transition-all cursor-pointer"
                  onClick={() => handleLoad(workflow.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{workflow.name}</h3>
                      {workflow.description && (
                        <p className="text-zinc-500 text-sm mt-1 line-clamp-2">
                          {workflow.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(workflow.updated_at || workflow.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(workflow.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
