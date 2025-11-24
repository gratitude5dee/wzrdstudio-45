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
