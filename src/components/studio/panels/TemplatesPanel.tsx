import { FC } from 'react';
import { FileImage, Wand2, Grid3x3, Video, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { workflowTemplates } from '@/data/workflowTemplates';
import { useReactFlow } from '@xyflow/react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'image' | 'video' | 'advanced';
}

const templates: WorkflowTemplate[] = [
  {
    id: 'text-to-image',
    name: 'Text to Image',
    description: 'Basic prompt to image generation',
    icon: <FileImage className="h-5 w-5" />,
    category: 'image',
  },
  {
    id: 'image-editing',
    name: 'Image Editing',
    description: 'Edit existing images with prompts',
    icon: <Wand2 className="h-5 w-5" />,
    category: 'image',
  },
  {
    id: 'multi-output',
    name: 'Multi-Output',
    description: 'Generate multiple variations',
    icon: <Grid3x3 className="h-5 w-5" />,
    category: 'image',
  },
  {
    id: 'video-generation',
    name: 'Video Generation',
    description: 'Create videos from prompts',
    icon: <Video className="h-5 w-5" />,
    category: 'video',
  },
  {
    id: 'advanced-workflow',
    name: 'Advanced Workflow',
    description: 'Complex multi-node workflow',
    icon: <Sparkles className="h-5 w-5" />,
    category: 'advanced',
  },
];

export const TemplatesPanel: FC = () => {
  const { fitView } = useReactFlow();
  const { toast } = useToast();
  const setNodesAndEdgesWithHistory = useComposerStore((s) => s.setNodesAndEdgesWithHistory);
  const nodes = useComposerStore((s) => s.nodes);
  const edges = useComposerStore((s) => s.edges);

  const handleTemplateClick = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Generate unique IDs for new nodes
    const idMap = new Map<string, string>();
    const newNodes = template.nodes.map((node, idx) => {
      const newId = `${node.type}-${Date.now()}-${idx}`;
      idMap.set(node.id!, newId);
      return {
        ...node,
        id: newId,
        position: {
          x: node.position!.x + 50,
          y: node.position!.y + 50,
        },
      };
    });

    // Update edge IDs to match new node IDs
    const newEdges = template.edges.map((edge, idx) => ({
      ...edge,
      id: `e-${Date.now()}-${idx}`,
      source: idMap.get(edge.source!) || edge.source!,
      target: idMap.get(edge.target!) || edge.target!,
    }));

    // Add to existing canvas
    setNodesAndEdgesWithHistory(
      (currentNodes) => [...currentNodes, ...newNodes as any],
      (currentEdges) => [...currentEdges, ...newEdges as any]
    );

    // Center view on new nodes
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 100);

    toast({
      title: 'Template loaded',
      description: `${template.name} added to canvas`,
    });
  };

  return (
    <div className="h-full flex flex-col bg-studio-canvas">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <h2 className="text-sm font-medium text-studio-text-primary">Workflow Templates</h2>
        <p className="text-xs text-studio-text-secondary mt-1">
          Start with a pre-built workflow
        </p>
      </div>

      {/* Templates List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {workflowTemplates.map((template) => (
            <Button
              key={template.id}
              variant="ghost"
              onClick={() => handleTemplateClick(template.id)}
              className="w-full h-auto p-4 flex items-start gap-3 text-left hover:bg-[rgba(255,255,255,0.05)] rounded-xl"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#666666]">
                {template.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-studio-text-primary mb-1">
                  {template.name}
                </div>
                <div className="text-xs text-studio-text-secondary">
                  {template.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#1a1a1a]">
        <Button
          variant="outline"
          className="w-full h-9 bg-transparent border-[#2a2a2a] text-studio-text-secondary hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          Save Current as Template
        </Button>
      </div>
    </div>
  );
};
