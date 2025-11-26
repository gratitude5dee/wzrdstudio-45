import { Node, Edge } from '@xyflow/react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'image' | 'video' | 'advanced';
  nodes: Partial<Node>[];
  edges: Partial<Edge>[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'text-to-image',
    name: 'Text to Image',
    description: 'Basic prompt to image generation',
    icon: 'FileImage',
    category: 'image',
    nodes: [
      {
        id: 'prompt-1',
        type: 'textPrompt',
        position: { x: 100, y: 200 },
        data: {
          title: 'Image Prompt',
          prompt: '',
          outputs: [{ id: 'output', type: 'text', label: 'Text' }]
        }
      },
      {
        id: 'output-1',
        type: 'imageOutput',
        position: { x: 500, y: 200 },
        data: {
          title: 'Generated Image',
          imageUrl: null,
          inputs: [{ id: 'input', type: 'text', label: 'Prompt' }]
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'prompt-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'default'
      }
    ]
  },
  {
    id: 'image-editing',
    name: 'Image Editing',
    description: 'Edit existing images with prompts',
    icon: 'Wand2',
    category: 'image',
    nodes: [
      {
        id: 'ref-1',
        type: 'reference',
        position: { x: 100, y: 150 },
        data: {
          title: 'Reference Image',
          imageUrl: null,
          outputs: [{ id: 'output', type: 'image', label: 'Image' }]
        }
      },
      {
        id: 'prompt-1',
        type: 'textPrompt',
        position: { x: 100, y: 350 },
        data: {
          title: 'Edit Instructions',
          prompt: '',
          outputs: [{ id: 'output', type: 'text', label: 'Text' }]
        }
      },
      {
        id: 'output-1',
        type: 'imageOutput',
        position: { x: 500, y: 250 },
        data: {
          title: 'Edited Image',
          imageUrl: null,
          inputs: [
            { id: 'image', type: 'image', label: 'Base Image' },
            { id: 'prompt', type: 'text', label: 'Instructions' }
          ]
        }
      }
    ],
    edges: [
      {
        id: 'e1-3',
        source: 'ref-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'image',
        type: 'default'
      },
      {
        id: 'e2-3',
        source: 'prompt-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'prompt',
        type: 'default'
      }
    ]
  },
  {
    id: 'multi-output',
    name: 'Multi-Output',
    description: 'Generate multiple variations',
    icon: 'Grid3x3',
    category: 'image',
    nodes: [
      {
        id: 'prompt-1',
        type: 'textPrompt',
        position: { x: 100, y: 300 },
        data: {
          title: 'Shared Prompt',
          prompt: '',
          outputs: [{ id: 'output', type: 'text', label: 'Text' }]
        }
      },
      {
        id: 'output-1',
        type: 'imageOutput',
        position: { x: 500, y: 150 },
        data: {
          title: 'Variation 1',
          imageUrl: null,
          inputs: [{ id: 'input', type: 'text', label: 'Prompt' }]
        }
      },
      {
        id: 'output-2',
        type: 'imageOutput',
        position: { x: 500, y: 300 },
        data: {
          title: 'Variation 2',
          imageUrl: null,
          inputs: [{ id: 'input', type: 'text', label: 'Prompt' }]
        }
      },
      {
        id: 'output-3',
        type: 'imageOutput',
        position: { x: 500, y: 450 },
        data: {
          title: 'Variation 3',
          imageUrl: null,
          inputs: [{ id: 'input', type: 'text', label: 'Prompt' }]
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'prompt-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'default'
      },
      {
        id: 'e1-3',
        source: 'prompt-1',
        target: 'output-2',
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'default'
      },
      {
        id: 'e1-4',
        source: 'prompt-1',
        target: 'output-3',
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'default'
      }
    ]
  },
  {
    id: 'video-generation',
    name: 'Video Generation',
    description: 'Create videos from prompts',
    icon: 'Video',
    category: 'video',
    nodes: [
      {
        id: 'ref-1',
        type: 'reference',
        position: { x: 100, y: 200 },
        data: {
          title: 'Key Frame',
          imageUrl: null,
          outputs: [{ id: 'output', type: 'image', label: 'Image' }]
        }
      },
      {
        id: 'prompt-1',
        type: 'promptInput',
        position: { x: 100, y: 400 },
        data: {
          title: 'Motion Prompt',
          prompt: '',
          outputs: [{ id: 'output', type: 'text', label: 'Text' }]
        }
      },
      {
        id: 'output-1',
        type: 'imageOutput',
        position: { x: 500, y: 300 },
        data: {
          title: 'Video Output',
          imageUrl: null,
          inputs: [
            { id: 'image', type: 'image', label: 'Start Frame' },
            { id: 'prompt', type: 'text', label: 'Motion' }
          ]
        }
      }
    ],
    edges: [
      {
        id: 'e1-3',
        source: 'ref-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'image',
        type: 'default'
      },
      {
        id: 'e2-3',
        source: 'prompt-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'prompt',
        type: 'default'
      }
    ]
  },
  {
    id: 'advanced-workflow',
    name: 'Advanced Workflow',
    description: 'Complex multi-node workflow',
    icon: 'Sparkles',
    category: 'advanced',
    nodes: [
      {
        id: 'prompt-1',
        type: 'textPrompt',
        position: { x: 100, y: 200 },
        data: {
          title: 'Base Prompt',
          prompt: '',
          outputs: [{ id: 'output', type: 'text', label: 'Text' }]
        }
      },
      {
        id: 'output-1',
        type: 'imageOutput',
        position: { x: 400, y: 200 },
        data: {
          title: 'First Generation',
          imageUrl: null,
          inputs: [{ id: 'input', type: 'text', label: 'Prompt' }],
          outputs: [{ id: 'output', type: 'image', label: 'Image' }]
        }
      },
      {
        id: 'prompt-2',
        type: 'textPrompt',
        position: { x: 400, y: 400 },
        data: {
          title: 'Refinement Prompt',
          prompt: '',
          outputs: [{ id: 'output', type: 'text', label: 'Text' }]
        }
      },
      {
        id: 'output-2',
        type: 'imageOutput',
        position: { x: 700, y: 300 },
        data: {
          title: 'Refined Result',
          imageUrl: null,
          inputs: [
            { id: 'image', type: 'image', label: 'Base' },
            { id: 'prompt', type: 'text', label: 'Refinement' }
          ]
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'prompt-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'default'
      },
      {
        id: 'e2-4',
        source: 'output-1',
        target: 'output-2',
        sourceHandle: 'output',
        targetHandle: 'image',
        type: 'default'
      },
      {
        id: 'e3-4',
        source: 'prompt-2',
        target: 'output-2',
        sourceHandle: 'output',
        targetHandle: 'prompt',
        type: 'default'
      }
    ]
  }
];
