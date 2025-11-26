import { useState } from 'react';
import { Settings, ChevronRight, CircleDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { useComposerStore } from '@/store/studio/useComposerStore';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress?: number;
}

const StudioBottomBar = () => {
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  
  // Get execution state
  const isRunning = useExecutionStore((s) => s.isRunning);
  const progress = useExecutionStore((s) => s.progress);
  const errors = useExecutionStore((s) => s.errors);
  const nodes = useComposerStore((s) => s.nodes);
  
  // Build tasks from execution progress
  const tasks: Task[] = Object.entries(progress).map(([nodeId, prog]) => {
    const node = nodes.find(n => n.id === nodeId);
    const hasError = errors[nodeId];
    
    return {
      id: nodeId,
      name: (node?.data?.title as string) || (node?.data?.label as string) || 'Node',
      status: hasError ? 'failed' : prog >= 1 ? 'completed' : 'active',
      progress: prog * 100,
    };
  });
  
  const activeTaskCount = tasks.filter(task => task.status === 'active').length;
  

  return (
    <div className="w-full bg-[#0a0a0a] border-t border-[#1a1a1a] px-6 py-2 flex items-center justify-between">
      {/* Left: Credits & Token Count */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-6 w-6 text-[#666666] hover:text-white">
          <Settings className="h-4 w-4" />
        </Button>
        <span className="text-sm text-[#888888]">88.1M</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-[#666666] hover:text-white">
          <CircleDashed className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Right: Queue Status */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className={cn(
            "h-8 text-[#888888] hover:text-white text-sm",
            activeTaskCount > 0 && "text-white"
          )}
          onClick={() => setIsTasksExpanded(!isTasksExpanded)}
        >
          Queue <span className={cn("ml-2", activeTaskCount > 0 ? "text-blue-400" : "text-[#555555]")}>{activeTaskCount} active</span>
        </Button>
        <ChevronRight className={cn(
          "h-4 w-4 text-[#555555] transition-transform", 
          isTasksExpanded && "rotate-90"
        )} />
        
        {isTasksExpanded && activeTaskCount > 0 && (
          <div className="absolute bottom-14 right-6 bg-[#1a1a1a] border border-[#333333] rounded-xl p-4 shadow-2xl w-80 backdrop-blur-lg">
            <h3 className="text-sm font-medium text-white mb-4">Active Generations</h3>
            <div className="space-y-3">
              {tasks.filter(task => task.status === 'active').map(task => (
                <div key={task.id} className="flex items-center gap-3">
                  <CircleDashed className="h-4 w-4 text-blue-400 animate-spin flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white truncate">{task.name}</div>
                    <div className="h-1.5 bg-[#0d0d0d] rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioBottomBar;
