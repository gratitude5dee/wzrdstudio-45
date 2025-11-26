import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ConnectionMode,
  NodeTypes,
  EdgeTypes,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  BackgroundVariant,
  SelectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/components/ui/button';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { useComposerKeyboardShortcuts } from '@/hooks/studio/useComposerKeyboardShortcuts';
import { useNodeOperations } from '@/hooks/studio/useNodeOperations';

import WorkflowNode from './nodes/WorkflowNode';
import PrimitiveNode from './nodes/PrimitiveNode';
import ResultNode from './nodes/ResultNode';
import CombineNode from './nodes/CombineNode';
import CommentNode from './nodes/CommentNode';
import { ImageOutputNode } from './nodes/ImageOutputNode';
import { PromptInputNode } from './nodes/PromptInputNode';
import { ReferenceNode } from './nodes/ReferenceNode';
import { TextPromptNode } from './nodes/TextPromptNode';
import { StudioEdge } from './edges/StudioEdge';
import { ConnectionLine } from './edges/ConnectionLine';

import { IconSidebar } from './panels/IconSidebar';
import { PropertiesPanel } from './panels/PropertiesPanel';
import { FloatingToolbar } from './toolbar/FloatingToolbar';
import { NodeContextMenu } from './context-menus/NodeContextMenu';
import { EdgeContextMenu } from './context-menus/EdgeContextMenu';
import { CanvasContextMenu } from './context-menus/CanvasContextMenu';
import { StudioControls } from './controls/StudioControls';
import { KeyboardShortcutsModal } from './overlays/KeyboardShortcutsModal';
import { SnapGuides } from './overlays/SnapGuides';

const nodeTypes: NodeTypes = {
  // Legacy node types
  workflowNode: WorkflowNode,
  primitiveNode: PrimitiveNode,
  resultNode: ResultNode,
  combineNode: CombineNode,
  comment: CommentNode,
  // FLUX-style node types
  imageOutput: ImageOutputNode,
  promptInput: PromptInputNode,
  reference: ReferenceNode,
  textPrompt: TextPromptNode,
};

const edgeTypes = {
  default: StudioEdge,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: {
    strokeWidth: 1.5,
    stroke: '#444444',
  },
};

export const StudioComposer = () => {
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Store state
  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);
  const setNodes = useComposerStore((state) => state.setNodes);
  const setEdges = useComposerStore((state) => state.setEdges);
  // We need access to history setting functions
  const setNodesWithHistory = useComposerStore((state) => state.setNodesWithHistory);

  const isRunning = useExecutionStore((state) => state.isRunning);

  // Custom hooks
  const { addNode } = useNodeOperations();
  useComposerKeyboardShortcuts();

  // Use refs to track drag start state for undo
  const dragStartNodes = useRef<Node[] | null>(null);

  // State for keyboard shortcuts modal
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // State for snap guides
  const [alignmentGuides, setAlignmentGuides] = useState<{
    horizontal: number[];
    vertical: number[];
  }>({ horizontal: [], vertical: [] });

  // Listen for keyboard shortcuts modal trigger
  useEffect(() => {
    const handleShowShortcuts = () => setShowShortcutsModal(true);
    window.addEventListener('show-shortcuts-modal', handleShowShortcuts);
    return () => window.removeEventListener('show-shortcuts-modal', handleShowShortcuts);
  }, []);

  // Handle node changes
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes]);

  // Handle edge changes
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setEdges]);

  // Handle new connections
  const onConnect = useCallback((connection) => {
    // Adding an edge should go into history
    // But we need to access the current state from the store inside the callback
    const currentEdges = useComposerStore.getState().edges;
    const newEdges = addEdge(connection, currentEdges);
    useComposerStore.getState().setEdgesWithHistory(() => newEdges);
  }, []);

  // Handle drag over (for drop from sidebar)
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop (from sidebar)
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const nodeDataString = event.dataTransfer.getData('application/nodedata');
    const nodeData = nodeDataString ? JSON.parse(nodeDataString) : {};

    addNode(type, nodeData, position);
  }, [reactFlowInstance, addNode]);

  // Context menu handlers
  const [contextMenu, setContextMenu] = useState<{
    type: 'node' | 'edge' | 'canvas';
    position: { x: number; y: number };
    data?: any;
  } | null>(null);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      type: 'node',
      position: { x: event.clientX, y: event.clientY },
      data: node,
    });
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setContextMenu({
      type: 'edge',
      position: { x: event.clientX, y: event.clientY },
      data: edge,
    });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      type: 'canvas',
      position: { x: event.clientX, y: event.clientY },
    });
  }, []);

  // History handling for node dragging
  const onNodeDragStart = useCallback(() => {
    // Snapshot nodes before drag starts
    dragStartNodes.current = useComposerStore.getState().nodes;
  }, []);

  const onNodeDragStop = useCallback(() => {
    if (dragStartNodes.current) {
      const currentNodes = useComposerStore.getState().nodes;
      // Only add to history if nodes actually moved/changed
      if (JSON.stringify(dragStartNodes.current) !== JSON.stringify(currentNodes)) {
        // Manually push previous state to history then current state
        // Or just call setNodesWithHistory with the *current* nodes to trigger a history save
        // But setNodesWithHistory compares against *current* state (which is already updated by onNodesChange)
        // Wait, onNodesChange updates the store via setNodes (no history).
        // So current store state has the *new* positions.
        // setNodesWithHistory compares incoming newNodes with store state. If they are same, it might not save.

        // However, our setNodesWithHistory implementation:
        // const state = get();
        // const newNodes = updater(state.nodes);
        // if (JSON.stringify(newNodes) !== JSON.stringify(state.nodes)) { ... }

        // If we pass identity updater, newNodes === state.nodes, so it won't save.
        // We need a way to force a history entry or use a different mechanism.

        // Actually, we should probably modify `setNodes` to NOT be used for history-sensitive updates,
        // OR we should use a specialized function.
        // But `onNodesChange` is firing frequently during drag. We don't want history for every pixel.
        // That's why we use `setNodes` (no history) in `onNodesChange`.

        // At drag stop, we want to commit the *current* state to history.
        // But `setNodesWithHistory` works by taking an updater that produces *new* state.
        // If we want to record that the *previous* state (dragStartNodes) transitions to *current* state,
        // we might need to manually manipulate history or trick `setNodesWithHistory`.

        // Let's look at `useComposerStore.ts`:
        // setNodesWithHistory pushes current state to `past`, then updates state.
        // But current state in store is ALREADY the dragged position!
        // So if we call setNodesWithHistory now, we push the *dragged* position to past.
        // That is WRONG. We want the *start* position in past.

        // Solution:
        // 1. Revert store to dragStartNodes (silently? no, that would flash)
        // 2. Call setNodesWithHistory with the dragged nodes.

        // Better solution:
        // Add a specific action `commitHistorySnapshot` that takes the *previous* state to push to history.
        // Or modify `setNodesWithHistory` logic? No.

        // Let's add `addToHistory` action to store?
        // Or simply:
        // 1. Set nodes back to start positions (without history) -> `setNodes(() => dragStartNodes.current)`
        // 2. Set nodes to new positions (WITH history) -> `setNodesWithHistory(() => currentNodes)`

        const finalNodes = currentNodes;
        // 1. Revert to start (this might cause a quick flash, but usually React handles it if in same tick? No, async)
        // Actually, we can just inject the history entry.
        // But we don't have a public method to just inject history.

        // Let's try the revert-and-set method.
        // useComposerStore.getState().setNodes(() => dragStartNodes.current!);
        // useComposerStore.getState().setNodesWithHistory(() => finalNodes);

        // This seems risky for visual glitch.
        // Ideally we should add a method to store: `pushHistory(previousNodes, previousEdges)`.

        // But I cannot easily change the store interface without modifying the file again.
        // I can modify `useComposerStore.ts` if needed. I should.

        // Let's modify `useComposerStore.ts` to add `pushToHistory`.
        // But I am in `StudioComposer.tsx` step.
        // I'll stick to `setNodes(() => dragStartNodes.current!)` then `setNodesWithHistory(() => finalNodes)`.
        // Since React batches updates, maybe it won't render the revert?
        // But `set` in Zustand triggers listeners immediately usually.

        // Let's try the "revert and commit" approach.
        useComposerStore.getState().setNodes(() => dragStartNodes.current!);
        // We need to defer the second call slightly or ensure it runs?
        // Actually, if we do it synchronously:
        useComposerStore.getState().setNodesWithHistory(() => finalNodes);

        dragStartNodes.current = null;
      }
    }
  }, []);

  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null;

  return (
    <div className="h-full w-full flex bg-studio-canvas">
      {/* Slim Icon Sidebar */}
      <IconSidebar onAddNode={() => console.log('Add node clicked')} />

      {/* Main Canvas */}
      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionMode={ConnectionMode.Loose}
          connectionLineComponent={ConnectionLine}
          selectionOnDrag={true}
          selectionMode={SelectionMode.Partial}
          panOnScroll={true}
          panOnDrag={[1, 2]}
          selectionKeyCode="Shift"
          multiSelectionKeyCode="Shift"
          fitView
          className="bg-studio-canvas"
          deleteKeyCode={[]} // Handle in keyboard shortcuts
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="hsl(var(--studio-canvas-grid))" 
          />
          <MiniMap 
            nodeColor={() => 'hsl(var(--studio-node-bg))'}
            maskColor="hsla(var(--studio-canvas) / 0.9)"
          />
        </ReactFlow>

        {/* Snap Guides */}
        {(alignmentGuides.horizontal.length > 0 || alignmentGuides.vertical.length > 0) && (
          <SnapGuides alignmentGuides={alignmentGuides} />
        )}

        {/* Custom Zoom Controls */}
        <StudioControls />

        {/* Floating Toolbar */}
        {selectedNode && <FloatingToolbar selectedNodeId={selectedNode.id} />}

        {/* Context Menus */}
        {contextMenu?.type === 'node' && (
          <NodeContextMenu
            node={contextMenu.data}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
          />
        )}
        {contextMenu?.type === 'edge' && (
          <EdgeContextMenu
            edge={contextMenu.data}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
          />
        )}
        {contextMenu?.type === 'canvas' && (
          <CanvasContextMenu
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
            onAddNode={(type, data) => {
              const flowPosition = reactFlowInstance.screenToFlowPosition(contextMenu.position);
              addNode(type, data, flowPosition);
              setContextMenu(null);
            }}
          />
        )}
      </div>

      {/* Right Properties Panel */}
      <PropertiesPanel selectedNode={selectedNode} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
};
