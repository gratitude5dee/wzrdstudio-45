import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useComposerStore } from '@/store/studio/useComposerStore';
import WorkflowNode from './nodes/WorkflowNode';
import PrimitiveNode from './nodes/PrimitiveNode';
import ResultNode from './nodes/ResultNode';
import { nanoid } from 'nanoid';

const nodeTypes = {
  workflowNode: WorkflowNode,
  primitiveNode: PrimitiveNode,
  resultNode: ResultNode,
};

export const StudioCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);
  const setNodes = useComposerStore((state) => state.setNodes);
  const setEdges = useComposerStore((state) => state.setEdges);
  const addNode = useComposerStore((state) => state.addNode);
  const onNodesChangeProp = useComposerStore((state) => state.onNodesChange);
  const onEdgesChangeProp = useComposerStore((state) => state.onEdgesChange);
  const onConnectProp = useComposerStore((state) => state.onConnect);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!wrapperRef.current || !reactFlowInstance) {
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');
      const dataStr = event.dataTransfer.getData('application/reactflow-data');

      if (!type) return;

      const data = dataStr ? JSON.parse(dataStr) : {};

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: nanoid(),
        type,
        position,
        data: { label: `${type} node`, ...data },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div className="flex-1 h-full w-full" ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeProp}
        onEdgesChange={onEdgesChangeProp}
        onConnect={onConnectProp}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background color="#444" gap={16} variant={BackgroundVariant.Dots} />
        <Controls className="bg-background border border-border fill-foreground" />
        <MiniMap className="bg-background border border-border" />
      </ReactFlow>
    </div>
  );
};
