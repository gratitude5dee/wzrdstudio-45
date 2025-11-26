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
import { GroupNode } from './nodes/GroupNode';
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
import { CommandPalette } from './overlays/CommandPalette';
import { NodePreview } from './overlays/NodePreview';
import { WorkflowListModal } from './modals/WorkflowListModal';
import { ExportModal } from './modals/ExportModal';
import { StudioTour } from './onboarding/StudioTour';
import { ErrorBoundary } from './ErrorBoundary';
import EmptyCanvasState from './EmptyCanvasState';
import StudioBottomBar from './StudioBottomBar';
import { useSnapToGrid } from '@/hooks/studio/useSnapToGrid';

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
  group: GroupNode,
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
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showWorkflowList, setShowWorkflowList] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [previewNode, setPreviewNode] = useState<{
    nodeId: string;
    imageUrl?: string;
    metadata?: any;
  } | null>(null);

  // State for snap guides
  const [alignmentGuides, setAlignmentGuides] = useState<{
    horizontal: number[];
    vertical: number[];
  }>({ horizontal: [], vertical: [] });
  const [isDraggingNode, setIsDraggingNode] = useState(false);

  // Snap to grid hook
  const { snapToGrid } = useSnapToGrid();

  // Listen for keyboard shortcuts modal trigger
  useEffect(() => {
    const handleShowShortcuts = () => setShowShortcutsModal(true);
    const handleShowCommandPalette = () => setShowCommandPalette(true);
    
    window.addEventListener('show-shortcuts-modal', handleShowShortcuts);
    window.addEventListener('show-command-palette', handleShowCommandPalette);
    
    return () => {
      window.removeEventListener('show-shortcuts-modal', handleShowShortcuts);
      window.removeEventListener('show-command-palette', handleShowCommandPalette);
    };
  }, []);

  // Handle node changes with snapping
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds);
      
      // Apply snapping for position changes during drag
      if (isDraggingNode) {
        return updatedNodes.map((node) => {
          const change = changes.find((c: any) => c.id === node.id && c.type === 'position');
          if (change && (change as any).dragging) {
            const snapResult = snapToGrid(node.position, node.id, updatedNodes, true);
            setAlignmentGuides(snapResult.guides);
            return { ...node, position: snapResult.position };
          }
          return node;
        });
      }
      
      return updatedNodes;
    });
  }, [setNodes, snapToGrid, isDraggingNode]);

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
    setIsDraggingNode(true);
  }, []);

  const onNodeDragStop = useCallback(() => {
    if (dragStartNodes.current) {
      const currentNodes = useComposerStore.getState().nodes;
      // Only add to history if nodes actually moved/changed
      if (JSON.stringify(dragStartNodes.current) !== JSON.stringify(currentNodes)) {
        useComposerStore.getState().setNodes(() => dragStartNodes.current!);
        useComposerStore.getState().setNodesWithHistory(() => currentNodes);
        dragStartNodes.current = null;
      }
    }
    setIsDraggingNode(false);
    setAlignmentGuides({ horizontal: [], vertical: [] });
  }, []);

  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null;

  return (
    <div className="h-full w-full flex flex-col bg-studio-canvas overflow-hidden">
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Slim Icon Sidebar */}
        <IconSidebar onAddNode={() => console.log('Add node clicked')} />

        {/* Main Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 relative min-w-0">
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
          data-tour="canvas"
        >
          {/* Empty State */}
          {nodes.length === 0 && (
            <EmptyCanvasState
              onAddBlock={(type) => {
                const center = reactFlowInstance.screenToFlowPosition({
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                });
                addNode(type === 'text' ? 'textPrompt' : type === 'image' ? 'imageOutput' : 'reference', {}, center);
              }}
              onOpenTemplates={() => setShowTour(true)}
              onStartTour={() => setShowTour(true)}
            />
          )}
          
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
      </div>

      {/* Bottom Bar */}
      <StudioBottomBar />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* Workflow Management Modals */}
      <WorkflowListModal
        open={showWorkflowList}
        onOpenChange={setShowWorkflowList}
      />

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
      />

      {/* Node Preview */}
      {previewNode && (
        <NodePreview
          nodeId={previewNode.nodeId}
          imageUrl={previewNode.imageUrl}
          metadata={previewNode.metadata}
          onClose={() => setPreviewNode(null)}
        />
      )}

      {/* Onboarding Tour */}
      {showTour && (
        <StudioTour onComplete={() => setShowTour(false)} />
      )}
    </div>
  );
};
