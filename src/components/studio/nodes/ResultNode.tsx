import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { Loader2, Image as ImageIcon } from 'lucide-react';

export default function ResultNode({ id, data, selected }: NodeProps) {
  const results = useExecutionStore((state) => state.results);
  const isRunning = useExecutionStore((state) => state.isRunning);
  const progress = useExecutionStore((state) => state.progress);
  const nodeData = data as any;

  const result = results[id];
  const nodeProgress = progress[id];
  const isNodeRunning = isRunning && nodeProgress !== undefined && nodeProgress < 1;

  return (
    <Card className={`min-w-[250px] border-2 ${selected ? 'border-primary' : 'border-border'}`}>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {nodeData.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 min-h-[200px] flex items-center justify-center bg-muted/50">
        {isNodeRunning ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs">Processing... {Math.round((nodeProgress || 0) * 100)}%</span>
          </div>
        ) : result ? (
           result.type === 'image' ? (
            <img src={result.url} alt="Result" className="max-w-full max-h-[300px] object-contain rounded" />
           ) : (
             <div className="p-2 text-xs font-mono whitespace-pre-wrap break-all">
               {JSON.stringify(result, null, 2)}
             </div>
           )
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <ImageIcon className="h-12 w-12" />
            <span className="text-xs">No output</span>
          </div>
        )}
      </CardContent>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-primary" />
    </Card>
  );
}
