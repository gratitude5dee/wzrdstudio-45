import { Node } from '@xyflow/react';

export type BaseNodeData = {
  label: string;
  color?: string;
  isPinned?: boolean;
  isCollapsed?: boolean;
  running?: boolean;
};

export type WorkflowNodeData = BaseNodeData & {
  workflowId: string;
  workflowName: string;
  inputs: Record<string, any>;
  outputType?: 'image' | 'video' | 'audio' | 'text';
  thumbnail?: string;
};

export type PrimitiveNodeData = BaseNodeData & {
  valueType: 'text' | 'number' | 'image' | 'video' | 'audio';
  value: any;
};

export type ResultNodeData = BaseNodeData & {
  outputType?: string;
  src?: string; // Preview URL
};

export type CombineNodeData = BaseNodeData & {
  mode: 'images' | 'text' | 'audio';
  inputs: any[];
};

export type CommentNodeData = {
  comment: string;
  color: string;
  width: number;
  height: number;
};

// FLUX-style node types
export type ImageOutputNodeData = BaseNodeData & {
  images: string[];
  selectedIndex?: number;
};

export type PromptInputNodeData = BaseNodeData & {
  prompt: string;
  references: Array<{ id: string; thumbnail: string }>;
  generationCount: number;
  status?: 'idle' | 'generating' | 'complete';
};

export type ReferenceNodeData = BaseNodeData & {
  imageUrl: string;
  type?: 'image' | 'document' | 'chart';
};

export type TextPromptNodeData = BaseNodeData & {
  content: string;
  suggestion?: string;
};

export type StudioNode =
  | Node<WorkflowNodeData, 'workflowNode'>
  | Node<PrimitiveNodeData, 'primitiveNode'>
  | Node<ResultNodeData, 'resultNode'>
  | Node<CombineNodeData, 'combineNode'>
  | Node<CommentNodeData, 'comment'>
  | Node<ImageOutputNodeData, 'imageOutput'>
  | Node<PromptInputNodeData, 'promptInput'>
  | Node<ReferenceNodeData, 'reference'>
  | Node<TextPromptNodeData, 'textPrompt'>;
