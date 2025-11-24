import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Image, Video, Music, Type, Hash, Box } from 'lucide-react';
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
  outputType: 'image' | 'video' | 'audio' | 'text' | '3d';
  provider: 'fal' | 'replicate' | 'internal';
  modelId?: string; // The actual model ID/path on the provider
  inputs: Record<string, {
    type: string;
    label: string;
    required: boolean;
    defaultValue?: string | number | boolean;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  }>;
}

const workflowCategories: WorkflowCategory[] = [
  {
    id: 'image',
    name: 'Image Generation',
    icon: Image,
    workflows: [
      {
        id: 'flux-pro',
        name: 'FLUX.1 [pro]',
        description: 'State-of-the-art image generation with great prompt adherence',
        thumbnail: 'https://fal.media/files/koala/chJ_x_tK7s7p9e1_s5H7I.png',
        outputType: 'image',
        provider: 'fal',
        modelId: 'fal-ai/flux-pro',
        inputs: {
          prompt: { type: 'text', label: 'Prompt', required: true },
          image_size: {
            type: 'select',
            label: 'Image Size',
            required: false,
            defaultValue: 'landscape_4_3',
            options: ['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9']
          },
          num_inference_steps: { type: 'number', label: 'Steps', required: false, defaultValue: 28, min: 1, max: 50 },
          guidance_scale: { type: 'number', label: 'Guidance Scale', required: false, defaultValue: 3.5, min: 1, max: 20, step: 0.1 },
        },
      },
      {
        id: 'flux-schnell',
        name: 'FLUX.1 [schnell]',
        description: 'Fastest version of FLUX for rapid iteration',
        thumbnail: 'https://fal.media/files/monkey/v7_2_d7s8_a9.png',
        outputType: 'image',
        provider: 'fal',
        modelId: 'fal-ai/flux/schnell',
        inputs: {
          prompt: { type: 'text', label: 'Prompt', required: true },
          num_images: { type: 'number', label: 'Number of Images', required: false, defaultValue: 1, min: 1, max: 4 },
          enable_safety_checker: { type: 'boolean', label: 'Safety Checker', required: false, defaultValue: true },
        },
      },
      {
        id: 'sd3-medium',
        name: 'Stable Diffusion 3 Medium',
        description: 'Balanced performance and quality from Stability AI',
        outputType: 'image',
        provider: 'fal',
        modelId: 'fal-ai/stable-diffusion-v3-medium',
        inputs: {
          prompt: { type: 'text', label: 'Prompt', required: true },
          negative_prompt: { type: 'text', label: 'Negative Prompt', required: false },
          aspect_ratio: {
            type: 'select',
            label: 'Aspect Ratio',
            required: false,
            defaultValue: '1:1',
            options: ['1:1', '16:9', '9:16', '3:2', '2:3', '4:5', '5:4']
          },
        },
      },
       {
        id: 'ideogram-v2',
        name: 'Ideogram v2',
        description: 'Excellent typography and complex prompt adherence',
        outputType: 'image',
        provider: 'replicate',
        modelId: 'ideogram-ai/ideogram-v2',
        inputs: {
          prompt: { type: 'text', label: 'Prompt', required: true },
          aspect_ratio: {
            type: 'select',
            label: 'Aspect Ratio',
            required: false,
            defaultValue: '1:1',
            options: ['1:1', '16:9', '9:16', '3:2', '2:3']
          },
          magic_prompt: { type: 'boolean', label: 'Magic Prompt', required: false, defaultValue: true },
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
        id: 'luma-dream-machine',
        name: 'Luma Dream Machine',
        description: 'High-quality text-to-video generation',
        thumbnail: 'https://fal.media/files/zebra/luma-thumb.jpg', // Placeholder
        outputType: 'video',
        provider: 'fal',
        modelId: 'fal-ai/luma-dream-machine',
        inputs: {
          prompt: { type: 'text', label: 'Prompt', required: true },
          aspect_ratio: {
            type: 'select',
            label: 'Aspect Ratio',
            required: false,
            defaultValue: '16:9',
            options: ['16:9', '9:16', '1:1']
          },
          loop: { type: 'boolean', label: 'Loop', required: false, defaultValue: false },
        },
      },
      {
        id: 'kling-video',
        name: 'Kling',
        description: 'Realistic video generation',
        outputType: 'video',
        provider: 'fal',
        modelId: 'fal-ai/kling-video/v1/standard/text-to-video',
        inputs: {
          prompt: { type: 'text', label: 'Prompt', required: true },
          duration: { type: 'select', label: 'Duration', required: false, defaultValue: '5', options: ['5', '10'] },
          aspect_ratio: {
            type: 'select',
            label: 'Aspect Ratio',
            required: false,
            defaultValue: '16:9',
            options: ['16:9', '9:16', '1:1']
          },
        },
      },
      {
        id: 'runway-gen3',
        name: 'Runway Gen-3 Alpha',
        description: 'Latest generation video model from Runway',
        outputType: 'video',
        provider: 'replicate', // Assuming Replicate hosting for this example
        modelId: 'runwayml/gen-3-alpha-turbo',
        inputs: {
          prompt_text: { type: 'text', label: 'Prompt', required: true },
          input_image: { type: 'image', label: 'Input Image (Optional)', required: false },
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
        id: 'stable-audio',
        name: 'Stable Audio',
        description: 'Music and sound effect generation',
        outputType: 'audio',
        provider: 'fal',
        modelId: 'fal-ai/stable-audio',
        inputs: {
          prompt: { type: 'text', label: 'Prompt', required: true },
          seconds_total: { type: 'number', label: 'Duration (s)', required: false, defaultValue: 30, min: 1, max: 180 },
        },
      },
    ],
  },
  {
    id: '3d',
    name: '3D Assets',
    icon: Box,
    workflows: [
      {
        id: 'triposr',
        name: 'TripoSR',
        description: 'Fast 3D object generation from image',
        outputType: '3d',
        provider: 'replicate',
        modelId: 'camenduru/triposr',
        inputs: {
          image_path: { type: 'image', label: 'Input Image', required: true },
        },
      },
    ],
  }
];

export const WorkflowLibrary = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['image', 'video', 'audio', '3d'])
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
      provider: workflow.provider,
      modelId: workflow.modelId,
      inputs: workflow.inputs, // Pass the schema definition
      inputValues: {}, // Empty values initially
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
    <div className="w-80 bg-surface-primary border-r border-border-default flex flex-col bg-background h-full">
      {/* Header */}
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Library</h2>
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
            placeholder="Search models..."
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
                className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary group"
              >
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
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
                        "hover:border-primary hover:bg-accent/5",
                        "transition-all duration-200"
                      )}
                    >
                      {/* Thumbnail */}
                      {workflow.thumbnail && (
                        <div className="mb-2 rounded-md overflow-hidden h-24 bg-muted">
                          <img
                            src={workflow.thumbnail}
                            alt={workflow.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{workflow.name}</h3>
                          <Badge variant="outline" className="text-[10px] px-1 h-4 uppercase">
                            {workflow.provider}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {workflow.description}
                        </p>

                        {/* Required inputs indicator */}
                        <div className="flex flex-wrap gap-1 pt-2">
                          {Object.entries(workflow.inputs)
                            .slice(0, 3) // Show first 3 inputs
                            .map(([key, config]) => (
                              <span
                                key={key}
                                className={cn(
                                  "text-[10px] px-1 rounded border",
                                  config.required
                                    ? "bg-primary/10 border-primary/20 text-primary"
                                    : "bg-muted border-transparent text-muted-foreground"
                                )}
                              >
                                {config.label || key}
                              </span>
                            ))}
                          {Object.keys(workflow.inputs).length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{Object.keys(workflow.inputs).length - 3} more
                            </span>
                          )}
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
      <div className="p-4 border-t border-border-default bg-muted/10">
        <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Primitives
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: 'text', label: 'Text Input', icon: Type },
            { type: 'number', label: 'Number', icon: Hash },
            { type: 'image', label: 'Image Upload', icon: Image },
            { type: 'video', label: 'Video Upload', icon: Video },
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
                "p-2 rounded-md border border-border-default bg-background",
                "cursor-grab active:cursor-grabbing",
                "hover:border-primary hover:text-primary",
                "flex items-center gap-2 text-xs font-medium transition-colors"
              )}
            >
              <primitive.icon className="h-3.5 w-3.5" />
              <span>{primitive.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
