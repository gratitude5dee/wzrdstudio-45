import { DragEvent } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Box, FileText, Image as ImageIcon, Layers, Mic, Video, Wand2 } from 'lucide-react';

const NODE_TYPES = [
  {
    category: 'Models',
    items: [
      { type: 'workflowNode', label: 'AI Model', icon: Wand2, data: { label: 'New Model' } },
    ]
  },
  {
    category: 'Inputs',
    items: [
      { type: 'primitiveNode', label: 'Text Input', icon: FileText, data: { fieldType: { type: 'text', name: 'text_input', label: 'Text' } } },
      { type: 'primitiveNode', label: 'Image Input', icon: ImageIcon, data: { fieldType: { type: 'image', name: 'image_input', label: 'Image' } } },
      { type: 'primitiveNode', label: 'Number Input', icon: Layers, data: { fieldType: { type: 'number', name: 'number_input', label: 'Number' } } },
    ]
  },
  {
    category: 'Outputs',
    items: [
      { type: 'resultNode', label: 'Preview Result', icon: Box, data: { label: 'Result' } },
    ]
  }
];

export const StudioLeftPanel = () => {
  const onDragStart = (event: DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-data', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-surface-primary border-r border-border-default flex flex-col h-full bg-background border-r-2">
      <div className="p-4 border-b border-border-default font-semibold text-lg">
        Library
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['Models', 'Inputs', 'Outputs']} className="space-y-4">
            {NODE_TYPES.map((category) => (
              <AccordionItem value={category.category} key={category.category} className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                  {category.category}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-0">
                  <div className="grid grid-cols-1 gap-2">
                    {category.items.map((item) => (
                      <Card
                        key={item.label}
                        className="p-3 cursor-grab hover:bg-accent transition-colors border-border-default flex items-center gap-3"
                        draggable
                        onDragStart={(e) => onDragStart(e, item.type, item.data)}
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};
