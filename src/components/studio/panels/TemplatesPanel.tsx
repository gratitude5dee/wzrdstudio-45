import { FC } from 'react';
import { FileImage, Wand2, Grid3x3, Video, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const handleTemplateClick = (templateId: string) => {
    console.log('Template selected:', templateId);
    // TODO: Implement template loading logic
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
          {templates.map((template) => (
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
