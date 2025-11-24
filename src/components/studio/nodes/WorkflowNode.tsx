import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow, useEdges } from '@xyflow/react';
import { WorkflowNodeData } from '@/types/studio/nodes';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InputConfig {
  type: string;
  label?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

const WorkflowNode = ({ data, selected, id }: NodeProps) => {
  const nodeData = data as any;
  const isRunning = nodeData.running;
  const { setNodes } = useReactFlow();
  const edges = useEdges();

  // Determine which inputs are connected
  const connectedInputs = new Set(
    edges
      .filter((e) => e.target === id)
      .map((e) => e.targetHandle)
  );

  const handleInputChange = useCallback((key: string, value: unknown) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              inputValues: {
                ...(node.data.inputValues as Record<string, unknown>),
                [key]: value,
              },
            },
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  return (
    <div
      className={cn(
        "bg-card border-2 rounded-lg shadow-lg min-w-[280px] max-w-[320px]",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
        isRunning && "animate-pulse border-blue-500",
        nodeData.isPinned && "ring-2 ring-yellow-500"
      )}
    >
      {/* Header with Thumbnail */}
      <div className="relative">
        {nodeData.thumbnail && (
          <div className="h-24 w-full overflow-hidden rounded-t-md relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <img
              src={nodeData.thumbnail}
              alt={nodeData.label}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 z-20 text-white">
              <div className="font-bold text-sm">{nodeData.workflowName}</div>
              <div className="text-[10px] opacity-80 uppercase tracking-wider font-mono">{nodeData.provider}</div>
            </div>
          </div>
        )}
        {!nodeData.thumbnail && (
          <div className="p-3 border-b bg-muted/30">
            <div className="font-bold text-sm">{nodeData.workflowName}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">{nodeData.provider}</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-4">
        {!nodeData.isCollapsed && Object.keys(nodeData.inputs).length > 0 && (
          <div className="space-y-3">
            {Object.entries(nodeData.inputs).map(([key, rawConfig]) => {
              const config = rawConfig as InputConfig;
              const isConnected = connectedInputs.has(key);
              const currentValue = (nodeData.inputValues as Record<string, unknown>)?.[key] ?? config.defaultValue;

              return (
                <div key={key} className="relative group">
                  {/* Connection Handle */}
                  <div className="absolute -left-[17px] top-[10px] flex items-center">
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={key}
                      className={cn(
                        "!w-3 !h-3 !border-2 !border-background transition-colors",
                        isConnected ? "!bg-primary" : "!bg-muted-foreground group-hover:!bg-primary/50"
                      )}
                    />
                    <span className={cn(
                      "ml-2 text-[10px] font-mono bg-background px-1 rounded border shadow-sm transition-opacity",
                      "opacity-0 group-hover:opacity-100 pointer-events-none absolute left-2 whitespace-nowrap z-50"
                    )}>
                      {key}
                    </span>
                  </div>

                  <div className={cn("space-y-1.5", isConnected && "opacity-50 pointer-events-none grayscale")}>
                    <Label className="text-xs font-medium flex items-center gap-1">
                      {config.label || key}
                      {config.required && <span className="text-red-500">*</span>}
                    </Label>

                    {!isConnected && (
                      <div className="nodrag cursor-text">
                        {config.type === 'boolean' ? (
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={!!currentValue}
                              onCheckedChange={(val) => handleInputChange(key, val)}
                              className="scale-75 origin-left"
                            />
                          </div>
                        ) : config.type === 'select' && config.options ? (
                          <Select
                            value={String(currentValue)}
                            onValueChange={(val) => handleInputChange(key, val)}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {config.options.map((opt: string) => (
                                <SelectItem key={opt} value={opt} className="text-xs">
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : config.type === 'number' && (config.min !== undefined || config.max !== undefined) ? (
                          <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <Slider
                                value={[Number(currentValue) || 0]}
                                min={config.min}
                                max={config.max}
                                step={config.step || 1}
                                onValueChange={(vals) => handleInputChange(key, vals[0])}
                                className="flex-1"
                              />
                              <span className="text-[10px] font-mono w-8 text-right">{currentValue as React.ReactNode}</span>
                            </div>
                          </div>
                        ) : config.type === 'number' ? (
                          <Input
                            type="number"
                            value={currentValue as string | number | readonly string[] | undefined}
                            onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                            className="h-7 text-xs px-2"
                            placeholder={String(config.defaultValue || '')}
                          />
                        ) : (
                          <Input
                            type="text"
                            value={currentValue as string | number | readonly string[] | undefined}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="h-7 text-xs px-2"
                            placeholder={String(config.defaultValue || '')}
                          />
                        )}
                      </div>
                    )}

                    {isConnected && (
                      <div className="h-7 flex items-center px-2 rounded border border-dashed bg-muted/50 text-[10px] text-muted-foreground">
                        Linked to input
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Output Handle */}
      <div className="absolute -right-[6px] top-1/2 -translate-y-1/2">
         <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-3 !h-3 !border-2 !border-background !bg-green-500 hover:!bg-green-400 transition-colors"
        />
      </div>
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-muted-foreground pointer-events-none">
        Output
      </div>
    </div>
  );
};

export default WorkflowNode;
