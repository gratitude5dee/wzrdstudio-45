import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Image, Video, Music, Type, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WorkflowCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  workflows: WorkflowTemplate[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  outputType: 'image' | 'video' | 'audio' | 'text';
  provider: 'fal' | 'replicate' | 'internal';
  inputs: Record<string, { type: string; required: boolean }>;
}

const workflowCategories: WorkflowCategory[] = [
  {
    id: 'image',
    name: 'Image Generation',
    icon: Image,
    workflows: [
      {
        id: 'flux-pro',
        name: 'FLUX Pro',
        description: 'High-quality text-to-image generation',
        thumbnail: '/workflows/flux-pro.png',
        outputType: 'image',
        provider: 'fal',
        inputs: {
          prompt: { type: 'text', required: true },
          width: { type: 'number', required: false },
          height: { type: 'number', required: false },
        },
      },
      {
        id: 'flux-redux',
        name: 'FLUX Redux',
        description: 'Image-to-image transformation',
        outputType: 'image',
        provider: 'fal',
        inputs: {
          image: { type: 'image', required: true },
          prompt: { type: 'text', required: true },
        },
      },
    ],
  },
  {
    id: 'video',
    name: 'Video Generation',
    icon: Video,
    workflows: [
      {
        id: 'luma-dream',
        name: 'Luma Dream Machine',
        description: 'Text-to-video generation',
        outputType: 'video',
        provider: 'fal',
        inputs: {
          prompt: { type: 'text', required: true },
          duration: { type: 'number', required: false },
        },
      },
      {
        id: 'runway-gen3',
        name: 'Runway Gen-3',
        description: 'Advanced video generation',
        outputType: 'video',
        provider: 'replicate',
        inputs: {
          prompt: { type: 'text', required: true },
          image: { type: 'image', required: false },
        },
      },
    ],
  },
  {
    id: 'audio',
    name: 'Audio & Music',
    icon: Music,
    workflows: [
      {
        id: 'musicgen',
        name: 'MusicGen',
        description: 'AI music generation',
        outputType: 'audio',
        provider: 'replicate',
        inputs: {
          prompt: { type: 'text', required: true },
          duration: { type: 'number', required: false },
        },
      },
    ],
  },
];

export const WorkflowLibrary = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['image', 'video'])
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const onDragStart = (event: React.DragEvent, workflow: WorkflowTemplate) => {
    event.dataTransfer.setData('application/reactflow', 'workflowNode');
    event.dataTransfer.setData('application/nodedata', JSON.stringify({
      workflowId: workflow.id,
      workflowName: workflow.name,
      label: workflow.name,
      inputs: workflow.inputs,
      outputType: workflow.outputType,
      thumbnail: workflow.thumbnail,
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Filter workflows based on search
  const filteredCategories = workflowCategories.map((category) => ({
    ...category,
    workflows: category.workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.workflows.length > 0);

  if (!isOpen) {
    return (
      <div className="w-12 bg-surface-primary border-r border-border-default flex flex-col items-center py-4 bg-background">
        <button
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface-primary border-r border-border-default flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Workflow Library</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Workflow List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary"
              >
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.workflows.length}
                  </Badge>
                </div>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              {/* Workflows */}
              {expandedCategories.has(category.id) && (
                <div className="mt-2 space-y-2">
                  {category.workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, workflow)}
                      className={cn(
                        "p-3 rounded-lg border border-border-default",
                        "cursor-grab active:cursor-grabbing",
                        "hover:border-primary hover:bg-surface-secondary",
                        "transition-colors"
                      )}
                    >
                      {/* Thumbnail */}
                      {workflow.thumbnail && (
                        <div className="mb-2 rounded overflow-hidden">
                          <img
                            src={workflow.thumbnail}
                            alt={workflow.name}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{workflow.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {workflow.provider}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {workflow.description}
                        </p>

                        {/* Required inputs indicator */}
                        <div className="flex items-center gap-1 pt-1">
                          {Object.entries(workflow.inputs)
                            .filter(([_, config]) => config.required)
                            .map(([key, _]) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer - Add primitives */}
      <div className="p-4 border-t border-border-default">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          INPUTS
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: 'text', label: 'Text', icon: Type },
            { type: 'number', label: 'Number', icon: Hash },
            { type: 'image', label: 'Image', icon: Image },
            { type: 'video', label: 'Video', icon: Video },
          ].map((primitive) => (
            <div
              key={primitive.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', 'primitiveNode');
                e.dataTransfer.setData('application/nodedata', JSON.stringify({
                  valueType: primitive.type,
                  label: primitive.label,
                  value: primitive.type === 'number' ? 0 : '',
                }));
              }}
              className={cn(
                "p-2 rounded border border-border-default",
                "cursor-grab active:cursor-grabbing",
                "hover:border-primary hover:bg-surface-secondary",
                "flex items-center gap-2 text-sm"
              )}
            >
              <primitive.icon className="h-4 w-4" />
              <span>{primitive.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
