import { useCallback } from 'react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';
import * as fal from '@fal-ai/serverless-client';

// Initialize Fal client (ensure you have the proxy set up or key exposed if client-side safe)
fal.config({
  // For client-side only prototypes without a proxy, this might be needed,
  // but in production use a proxy.
  // proxyUrl: '/api/fal/proxy',
});

/**
 * Topological sort to determine execution order
 */
function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const adjList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize
  nodes.forEach((node) => {
    adjList.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  // Build adjacency list and in-degree map
  edges.forEach((edge) => {
    adjList.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  // Kahn's algorithm
  const queue: Node[] = [];
  nodes.forEach((node) => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node);
    }
  });

  const result: Node[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    adjList.get(node.id)?.forEach((neighborId) => {
      const newDegree = (inDegree.get(neighborId) || 0) - 1;
      inDegree.set(neighborId, newDegree);

      if (newDegree === 0) {
        const neighborNode = nodes.find((n) => n.id === neighborId);
        if (neighborNode) queue.push(neighborNode);
      }
    });
  }

  // Check for cycles
  if (result.length !== nodes.length) {
    throw new Error('Workflow contains cycles');
  }

  return result;
}

/**
 * Collect inputs for a node from its connected edges AND local state
 */
async function collectNodeInputs(
  node: Node,
  edges: Edge[],
  results: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const inputs: Record<string, unknown> = {};

  // 1. Start with local input values from node data
  const localInputs = (node.data.inputValues as Record<string, unknown>) || {};
  Object.assign(inputs, localInputs);

  // 2. Override with connected inputs from upstream nodes
  const incomingEdges = edges.filter((edge) => edge.target === node.id);

  for (const edge of incomingEdges) {
    const result = results[edge.source] as Record<string, unknown> | string | null;
    if (result !== undefined) {
      const handleId = edge.targetHandle || 'input';

      // If result is an object with a specific output handle (complex node),
      // we might need to extract just that part.
      // For now, we assume result is the direct value or the main output object.

      // Special handling if the source is a result node passing through
      // We check if result is an object and has 'url' property to extract it
      if (result && typeof result === 'object' && 'url' in result) {
         inputs[handleId] = result.url;
      } else {
         inputs[handleId] = result;
      }
    }
  }

  // 3. Apply defaults if missing
  const configInputs = (node.data.inputs as Record<string, { defaultValue: unknown }>) || {};
  for (const [key, config] of Object.entries(configInputs)) {
    if (inputs[key] === undefined && config.defaultValue !== undefined) {
      inputs[key] = config.defaultValue;
    }
  }

  return inputs;
}

/**
 * Execute a workflow node (calls AI API)
 */
async function executeWorkflowNode(
  node: Node,
  inputs: Record<string, unknown>,
  onProgress: (progress: number) => void,
  addLog: (message: string, level?: 'info' | 'warn' | 'error') => void
): Promise<unknown> {
  const provider = node.data.provider;
  const modelId = node.data.modelId;

  if (!modelId) {
    throw new Error(`Node ${node.data.label} missing model ID`);
  }

  if (provider === 'fal') {
    addLog(`Calling Fal.ai model: ${modelId as string}`);

    try {
      // Fal client handles polling automatically
      const result = await fal.subscribe(modelId as string, {
        input: inputs,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            // Map progress if available, otherwise fake it or just show indeterminate
            // update.logs.map((log) => addLog(`[Remote] ${log.message}`));
          }
        },
      });

      onProgress(1);

      // Extract primary output (usually 'images' array or 'video' object)
      // We cast result to any because specific model outputs vary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyResult = result as any;

      if (anyResult.images && Array.isArray(anyResult.images) && anyResult.images.length > 0) {
        return {
          url: anyResult.images[0].url,
          type: 'image',
          raw: result
        };
      }

      if (anyResult.video && anyResult.video.url) {
        return {
          url: anyResult.video.url,
          type: 'video',
          raw: result
        };
      }

      if (anyResult.audio_file && anyResult.audio_file.url) {
        return {
          url: anyResult.audio_file.url,
          type: 'audio',
          raw: result
        };
      }

      return result;

    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Fal error: ${(error as any).message || error}`);
    }
  } else if (provider === 'replicate') {
     addLog(`Calling Replicate model: ${modelId as string} (Simulated/Proxy needed)`);

     // NOTE: Direct Replicate calls from browser are insecure without a proxy.
     // For this demo, we will simulate success or throw if no proxy is configured.

     // Simulation for demo purposes since we don't have a backend proxy route in this Vite template
     await new Promise(resolve => setTimeout(resolve, 2000));
     onProgress(1);

     return {
        url: 'https://replicate.delivery/pbxt/I2z1C5555555/out.png', // Placeholder
        type: 'image',
        text: 'Replicate execution simulated (proxy required)'
     };
  }

  throw new Error(`Unknown provider: ${provider as string}`);
}

/**
 * Execute a combine node (merge inputs)
 */
async function executeCombineNode(
  node: Node,
  inputs: Record<string, unknown>
): Promise<unknown> {
  const values = Object.values(inputs);

  switch (node.data.mode) {
    case 'text':
      return values.join(' ');
    case 'images':
      return { type: 'image-grid', images: values };
    default:
      return values[0];
  }
}

export const useExecuteWorkflow = () => {
  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);

  const startExecution = useExecutionStore((state) => state.startExecution);
  const stopExecution = useExecutionStore((state) => state.stopExecution);
  const setNodeProgress = useExecutionStore((state) => state.setNodeProgress);
  const setNodeResult = useExecutionStore((state) => state.setNodeResult);
  const setNodeError = useExecutionStore((state) => state.setNodeError);
  const addLog = useExecutionStore((state) => state.addLog);
  const addToHistory = useExecutionStore((state) => state.addToHistory);

  const execute = useCallback(async () => {
    const startTime = Date.now();
    try {
      startExecution();
      addLog({ timestamp: Date.now(), message: 'Starting workflow execution...', level: 'info' });

      // Sort nodes by dependencies
      const sortedNodes = topologicalSort(nodes, edges);

      addLog({
        timestamp: Date.now(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: `Execution order: ${sortedNodes.map(n => (n.data as any).label || n.id).join(' → ')}`,
        level: 'info'
      });

      // Execute each node
      for (const node of sortedNodes) {
        // Skip comment/annotation nodes
        if (node.type === 'comment') continue;

        addLog({
          timestamp: Date.now(),
          nodeId: node.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          message: `Executing ${(node.data as any).label || node.id}...`,
          level: 'info'
        });

        setNodeProgress(node.id, 0);

        try {
          // Get inputs from connected nodes and local state
          const inputs = await collectNodeInputs(node, edges, useExecutionStore.getState().results);

          // Execute based on node type
          let result;
          switch (node.type) {
            case 'primitiveNode':
              // Primitive nodes just output their configured value
              result = node.data.value;
              break;

            case 'workflowNode':
              result = await executeWorkflowNode(
                node,
                inputs,
                (progress) => setNodeProgress(node.id, progress),
                (msg, level = 'info') => addLog({ timestamp: Date.now(), nodeId: node.id, message: msg, level })
              );
              break;

            case 'combineNode':
              result = await executeCombineNode(node, inputs);
              break;

            case 'resultNode':
              // Result node just passes through input for display
              // It essentially acts as a sink
              result = inputs['input'];
              break;

            default:
              // Pass-through for unknown nodes
              {
                const keys = Object.keys(inputs);
                result = keys.length > 0 ? inputs[keys[0]] : null;
              }
          }

          setNodeResult(node.id, result);
          setNodeProgress(node.id, 1);

          addLog({
            timestamp: Date.now(),
            nodeId: node.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message: `✓ ${(node.data as any).label || node.id} completed`,
            level: 'info'
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          setNodeError(node.id, errorMessage);
          addLog({
            timestamp: Date.now(),
            nodeId: node.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message: `✗ ${(node.data as any).label || node.id} failed: ${errorMessage}`,
            level: 'error'
          });
          throw error; // Stop execution on error
        }
      }

      addLog({ timestamp: Date.now(), message: '✓ Workflow completed successfully', level: 'info' });
      toast.success('Workflow Complete', {
        description: 'All nodes executed successfully',
      });

      addToHistory({
        id: crypto.randomUUID(),
        timestamp: startTime,
        duration: Date.now() - startTime,
        status: 'success',
        results: useExecutionStore.getState().results,
        errors: {},
      });

    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `✗ Workflow failed: ${error instanceof Error ? error.message : String(error)}`,
        level: 'error'
      });
      toast.error('Workflow Failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });

      addToHistory({
        id: crypto.randomUUID(),
        timestamp: startTime,
        duration: Date.now() - startTime,
        status: 'failed',
        results: useExecutionStore.getState().results,
        errors: useExecutionStore.getState().errors,
      });
    } finally {
      stopExecution();
    }
  }, [nodes, edges, startExecution, stopExecution, setNodeProgress, setNodeResult, setNodeError, addLog, addToHistory]);

  return { execute };
};
