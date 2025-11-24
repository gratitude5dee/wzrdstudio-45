import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Node, Edge, Viewport } from '@xyflow/react';

interface ComposerState {
  // Core React Flow state
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;

  // Metadata
  meta: {
    workflowId?: string;
    title: string;
    description?: string;
    thumbnail?: string;
  };

  // UI state
  draggingType?: string;
  isDragging: boolean;

  // History (undo/redo)
  history: {
    past: Array<{ nodes: Node[]; edges: Edge[] }>;
    future: Array<{ nodes: Node[]; edges: Edge[] }>;
  };

  // Actions
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  setNodesWithHistory: (updater: (nodes: Node[]) => Node[]) => void;
  setEdgesWithHistory: (updater: (edges: Edge[]) => Edge[]) => void;
  setNodesAndEdgesWithHistory: (
    nodeUpdater: (nodes: Node[]) => Node[],
    edgeUpdater: (edges: Edge[]) => Edge[]
  ) => void;
  setViewport: (viewport: Viewport) => void;
  setMeta: (meta: Partial<ComposerState['meta']>) => void;
  
  // React Flow handlers
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: any) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetHistory: () => void;

  // Utility
  clear: () => void;
  loadFromJson: (data: any) => void;
  toJson: () => any;
}

export const useComposerStore = create<ComposerState>()(
  devtools(
    (set, get) => ({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      meta: { title: 'Untitled Workflow' },
      isDragging: false,
      history: { past: [], future: [] },

      setNodes: (updater) => set((state) => ({
        nodes: updater(state.nodes)
      })),

      setEdges: (updater) => set((state) => ({
        edges: updater(state.edges)
      })),

      setNodesWithHistory: (updater) => {
        const state = get();
        const newNodes = updater(state.nodes);

        // Only add to history if nodes actually changed
        if (JSON.stringify(newNodes) !== JSON.stringify(state.nodes)) {
          set({
            nodes: newNodes,
            history: {
              past: [
                ...state.history.past,
                { nodes: state.nodes, edges: state.edges }
              ].slice(-50), // Keep max 50 history items
              future: [], // Clear future on new action
            },
          });
        }
      },

      setEdgesWithHistory: (updater) => {
        const state = get();
        const newEdges = updater(state.edges);

        if (JSON.stringify(newEdges) !== JSON.stringify(state.edges)) {
          set({
            edges: newEdges,
            history: {
              past: [
                ...state.history.past,
                { nodes: state.nodes, edges: state.edges }
              ].slice(-50),
              future: [],
            },
          });
        }
      },

      setNodesAndEdgesWithHistory: (nodeUpdater, edgeUpdater) => {
        const state = get();
        const newNodes = nodeUpdater(state.nodes);
        const newEdges = edgeUpdater(state.edges);

        set({
          nodes: newNodes,
          edges: newEdges,
          history: {
            past: [
              ...state.history.past,
              { nodes: state.nodes, edges: state.edges }
            ].slice(-50),
            future: [],
          },
        });
      },

      setViewport: (viewport) => set({ viewport }),
      setMeta: (meta) => set((state) => ({
        meta: { ...state.meta, ...meta }
      })),

      undo: () => {
        const state = get();
        if (state.history.past.length === 0) return;

        const previous = state.history.past[state.history.past.length - 1];
        set({
          nodes: previous.nodes,
          edges: previous.edges,
          history: {
            past: state.history.past.slice(0, -1),
            future: [
              { nodes: state.nodes, edges: state.edges },
              ...state.history.future,
            ],
          },
        });
      },

      redo: () => {
        const state = get();
        if (state.history.future.length === 0) return;

        const next = state.history.future[0];
        set({
          nodes: next.nodes,
          edges: next.edges,
          history: {
            past: [
              ...state.history.past,
              { nodes: state.nodes, edges: state.edges },
            ],
            future: state.history.future.slice(1),
          },
        });
      },

      canUndo: false, // Computed in render
      canRedo: false, // Computed in render

      resetHistory: () => set({ history: { past: [], future: [] } }),

      clear: () => set({
        nodes: [],
        edges: [],
        history: { past: [], future: [] },
      }),

      loadFromJson: (data) => set({
        nodes: data.nodes || [],
        edges: data.edges || [],
        viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
        meta: data.meta || { title: 'Untitled Workflow' },
        history: { past: [], future: [] },
      }),

      toJson: () => {
        const state = get();
        return {
          nodes: state.nodes,
          edges: state.edges,
          viewport: state.viewport,
          meta: state.meta,
        };
      },

      // React Flow handlers
      addNode: (node) => {
        set((state) => ({
          nodes: [...state.nodes, node],
          history: {
            past: [...state.history.past, { nodes: state.nodes, edges: state.edges }].slice(-50),
            future: [],
          },
        }));
      },

      updateNodeData: (id, data) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
          ),
        }));
      },

      onNodesChange: (changes) => {
        set((state) => {
          const newNodes = changes.reduce((nodes: Node[], change: any) => {
            if (change.type === 'remove') {
              return nodes.filter((node) => node.id !== change.id);
            }
            if (change.type === 'position' && change.position) {
              return nodes.map((node) =>
                node.id === change.id ? { ...node, position: change.position } : node
              );
            }
            if (change.type === 'select') {
              return nodes.map((node) =>
                node.id === change.id ? { ...node, selected: change.selected } : node
              );
            }
            return nodes;
          }, state.nodes);
          
          return { nodes: newNodes };
        });
      },

      onEdgesChange: (changes) => {
        set((state) => {
          const newEdges = changes.reduce((edges: any[], change: any) => {
            if (change.type === 'remove') {
              return edges.filter((edge) => edge.id !== change.id);
            }
            if (change.type === 'select') {
              return edges.map((edge) =>
                edge.id === change.id ? { ...edge, selected: change.selected } : edge
              );
            }
            return edges;
          }, state.edges);
          
          return { edges: newEdges };
        });
      },

      onConnect: (connection) => {
        set((state) => ({
          edges: [
            ...state.edges,
            {
              ...connection,
              id: `${connection.source}-${connection.target}`,
              type: 'default',
            },
          ],
          history: {
            past: [...state.history.past, { nodes: state.nodes, edges: state.edges }].slice(-50),
            future: [],
          },
        }));
      },
    }),
    { name: 'ComposerStore' }
  )
);

// Computed selectors
export const useCanUndo = () => useComposerStore(
  (state) => state.history.past.length > 0
);

export const useCanRedo = () => useComposerStore(
  (state) => state.history.future.length > 0
);
