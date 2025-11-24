import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useComposerStore } from '@/store/studio/useComposerStore';

export default function PrimitiveNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useComposerStore((state) => state.updateNodeData);
  const fieldType = data.fieldType as any;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { value: e.target.value });
  };

  return (
    <Card className={`min-w-[250px] border-2 ${selected ? 'border-primary' : 'border-border'}`}>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {data.label as string}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">{fieldType?.label}</Label>
          <Input
            className="nodrag"
            type={fieldType?.type === 'number' ? 'number' : 'text'}
            defaultValue={data.value as string}
            onChange={handleChange}
            placeholder={`Enter ${fieldType?.label?.toLowerCase()}...`}
          />
        </div>
      </CardContent>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
    </Card>
  );
}
