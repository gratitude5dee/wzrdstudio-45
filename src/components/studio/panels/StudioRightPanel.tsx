import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Square, Trash2, Clock, AlertCircle, CheckCircle, Settings, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useExecuteWorkflow } from '@/hooks/studio/useExecuteWorkflow';
import { useFalModels } from '@/hooks/useFalModels';
import ModelSelector from '../ModelSelector';
import { cn } from '@/lib/utils';

const RunTabContent = () => {
  const isRunning = useExecutionStore((state) => state.isRunning);
  const progress = useExecutionStore((state) => state.progress);
  const errors = useExecutionStore((state) => state.errors);
  const logs = useExecutionStore((state) => state.logs);
  const clearExecution = useExecutionStore((state) => state.clearExecution);
  const { execute } = useExecuteWorkflow();

  const hasErrors = Object.keys(errors).length > 0;
  const completedNodes = Object.keys(progress).filter((id) => progress[id] === 1).length;
  const totalNodes = Object.keys(progress).length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border-default">
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

const HistoryTabContent = () => {
  const history = useExecutionStore((state) => state.history);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
        <Clock className="h-12 w-12 mb-2 opacity-20" />
        <div className="text-sm">No history yet</div>
        <div className="text-xs opacity-70 mt-1">Run a workflow to see results here</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {history.map((run) => (
          <div key={run.id} className="bg-surface-secondary border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {run.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs font-mono">
                  {new Date(run.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {(run.duration / 1000).toFixed(1)}s
              </span>
            </div>

            {Object.keys(run.results).length > 0 && (
              <div className="text-xs text-muted-foreground mb-1">
                {Object.keys(run.results).length} outputs
              </div>
            )}

            {Object.keys(run.errors).length > 0 && (
              <div className="text-xs text-red-400 mt-2 pt-2 border-t border-border/50">
                {Object.keys(run.errors).length} errors
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

const PropertiesTabContent = () => {
  const nodes = useComposerStore((state) => state.nodes);
  const setNodes = useComposerStore((state) => state.setNodes);

  const selectedNode = nodes.find((n) => n.selected);

  // Model selector state
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const { models, isLoading: isModelsLoading, error: modelsError } = useFalModels({ autoFetch: true });

  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
        <Settings className="h-12 w-12 mb-2 opacity-20" />
        <div className="text-sm">No node selected</div>
        <div className="text-xs opacity-70 mt-1">Select a node to configure properties</div>
      </div>
    );
  }

  const handleUpdateNode = (data: Record<string, any>) => {
    setNodes((nodes) =>
      nodes.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, ...data } } : n)
    );
  };

  const handleInputUpdate = (key: string, value: any) => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === selectedNode.id) {
           const currentInputs = (n.data.inputValues as Record<string, any>) || {};
           return {
             ...n,
             data: {
               ...n.data,
               inputValues: { ...currentInputs, [key]: value }
             }
           };
        }
        return n;
      })
    );
  };

  const isWorkflowNode = selectedNode.type === 'workflowNode';

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="space-y-1 pb-4 border-b border-border-default">
          <div className="text-xs font-mono text-muted-foreground uppercase">
            {selectedNode.type}
          </div>
          <div className="font-semibold text-lg">
            {selectedNode.data.label as string || 'Untitled Node'}
          </div>
        </div>

        {/* Workflow Node Settings */}
        {isWorkflowNode && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-medium text-zinc-400">Model</Label>
              {isModelsLoading ? (
                 <div className="text-zinc-500 text-sm">Loading models...</div>
              ) : modelsError ? (
                 <div className="text-red-400 text-sm">Error: {modelsError}</div>
              ) : (
                 <ModelSelector
                   models={models}
                   selectedModelId={selectedNode.data.modelId as string || ''}
                   onModelSelect={(id) => handleUpdateNode({ modelId: id })}
                   modelType="image" // Default to image for now, could be dynamic
                   isOpen={isModelDropdownOpen}
                   toggleOpen={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                 />
              )}
            </div>

            {/* Dynamic Inputs from Node Data */}
            {selectedNode.data.inputs && Object.keys(selectedNode.data.inputs).length > 0 && (
               <div className="space-y-4 pt-4 border-t border-border-default">
                 <div className="text-xs font-semibold text-muted-foreground mb-2">PARAMETERS</div>
                 {Object.entries(selectedNode.data.inputs as Record<string, any>).map(([key, config]) => (
                   <div key={key} className="space-y-2">
                     <Label className="text-xs">{config.label || key}</Label>
                     {config.type === 'number' && (
                       config.min !== undefined && config.max !== undefined ? (
                         <div className="space-y-2">
                           <div className="flex items-center justify-between">
                             <span className="text-xs text-muted-foreground">
                               {(selectedNode.data.inputValues as any)?.[key] ?? config.defaultValue}
                             </span>
                           </div>
                           <Slider
                             value={[Number((selectedNode.data.inputValues as any)?.[key] ?? config.defaultValue)]}
                             min={config.min}
                             max={config.max}
                             step={config.step || 1}
                             onValueChange={(vals) => handleInputUpdate(key, vals[0])}
                           />
                         </div>
                       ) : (
                         <Input
                           type="number"
                           value={(selectedNode.data.inputValues as any)?.[key] ?? config.defaultValue}
                           onChange={(e) => handleInputUpdate(key, parseFloat(e.target.value))}
                           className="h-8 text-xs"
                         />
                       )
                     )}
                     {config.type === 'text' && (
                       <Input
                         type="text"
                         value={(selectedNode.data.inputValues as any)?.[key] ?? config.defaultValue}
                         onChange={(e) => handleInputUpdate(key, e.target.value)}
                         className="h-8 text-xs"
                       />
                     )}
                     {config.type === 'boolean' && (
                       // Basic checkbox/switch simulation if UI component not readily available or complex
                       <div className="flex items-center gap-2">
                         <input
                           type="checkbox"
                           checked={(selectedNode.data.inputValues as any)?.[key] ?? config.defaultValue}
                           onChange={(e) => handleInputUpdate(key, e.target.checked)}
                           className="rounded border-zinc-700 bg-zinc-900"
                         />
                         <span className="text-xs text-muted-foreground">Enabled</span>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}

        {/* Other Node Types */}
        {!isWorkflowNode && (
           <div className="space-y-3">
             <Label className="text-xs">Label</Label>
             <Input
               value={selectedNode.data.label as string || ''}
               onChange={(e) => handleUpdateNode({ label: e.target.value })}
             />
           </div>
        )}
      </div>
    </ScrollArea>
  );
};


export const StudioRightPanel = () => {
  const [isOpen, setIsOpen] = useState(true);

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
    <div className="w-96 bg-surface-primary border-l border-border-default flex flex-col bg-background h-full">
      <div className="flex items-center justify-between p-4 border-b border-border-default">
        <h2 className="text-lg font-semibold">Inspector</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border-default px-4 pb-0 bg-transparent h-12">
           <TabsTrigger
            value="properties"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="run"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Run
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 min-h-0 m-0 data-[state=inactive]:hidden">
          <PropertiesTabContent />
        </TabsContent>

        <TabsContent value="run" className="flex-1 min-h-0 m-0 data-[state=inactive]:hidden">
          <RunTabContent />
        </TabsContent>

        <TabsContent value="history" className="flex-1 min-h-0 m-0 data-[state=inactive]:hidden">
          <HistoryTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
