import { create } from 'zustand';

interface ExecutionState {
  isRunning: boolean;
  currentNodeId?: string;
  progress: Record<string, number>; // nodeId -> progress (0-1)
  results: Record<string, any>; // nodeId -> result
  errors: Record<string, string>; // nodeId -> error message
  logs: Array<{ timestamp: number; nodeId?: string; message: string; level: 'info' | 'warn' | 'error' }>;

  // Actions
  startExecution: () => void;
  stopExecution: () => void;
  setNodeProgress: (nodeId: string, progress: number) => void;
  setNodeResult: (nodeId: string, result: any) => void;
  setNodeError: (nodeId: string, error: string) => void;
  addLog: (log: ExecutionState['logs'][0]) => void;
  clearExecution: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isRunning: false,
  progress: {},
  results: {},
  errors: {},
  logs: [],

  startExecution: () => set({
    isRunning: true,
    progress: {},
    results: {},
    errors: {},
    logs: []
  }),

  stopExecution: () => set({ isRunning: false }),

  setNodeProgress: (nodeId, progress) => set((state) => ({
    progress: { ...state.progress, [nodeId]: progress },
    currentNodeId: nodeId,
  })),

  setNodeResult: (nodeId, result) => set((state) => ({
    results: { ...state.results, [nodeId]: result },
  })),

  setNodeError: (nodeId, error) => set((state) => ({
    errors: { ...state.errors, [nodeId]: error },
  })),

  addLog: (log) => set((state) => ({
    logs: [...state.logs, log],
  })),

  clearExecution: () => set({
    progress: {},
    results: {},
    errors: {},
    logs: [],
  }),
}));
