import { useCallback } from 'react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useExecutionStore } from '@/store/studio/useExecutionStore';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';

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
 * Collect inputs for a node from its connected edges
 */
async function collectNodeInputs(
  nodeId: string,
  edges: Edge[],
  results: Record<string, any>
): Promise<Record<string, any>> {
  const inputs: Record<string, any> = {};

  const incomingEdges = edges.filter((edge) => edge.target === nodeId);

  for (const edge of incomingEdges) {
    const result = results[edge.source];
    if (result !== undefined) {
      const handleId = edge.targetHandle || 'input';
      inputs[handleId] = result;
    }
  }

  return inputs;
}

/**
 * Execute a workflow node (calls AI API)
 */
async function executeWorkflowNode(
  node: Node,
  inputs: Record<string, any>,
  onProgress: (progress: number) => void
): Promise<any> {
  // This would call your AI service (Fal.ai, Replicate, etc.)
  // const workflowId = node.data.workflowId;

  // Simulate API call with progress
  onProgress(0.25);
  await new Promise(resolve => setTimeout(resolve, 1000));

  onProgress(0.5);
  await new Promise(resolve => setTimeout(resolve, 1000));

  onProgress(0.75);
  await new Promise(resolve => setTimeout(resolve, 1000));

  onProgress(1);

  return {
    url: 'https://placehold.co/600x400',
    type: node.data.outputType || 'image',
    text: 'Executed successfully'
  };
}

/**
 * Execute a combine node (merge inputs)
 */
async function executeCombineNode(
  node: Node,
  inputs: Record<string, any>
): Promise<any> {
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

  const execute = useCallback(async () => {
    try {
      startExecution();
      addLog({ timestamp: Date.now(), message: 'Starting workflow execution...', level: 'info' });

      // Sort nodes by dependencies
      const sortedNodes = topologicalSort(nodes, edges);

      addLog({
        timestamp: Date.now(),
        message: `Execution order: ${sortedNodes.map(n => n.data.label).join(' → ')}`,
        level: 'info'
      });

      // Execute each node
      for (const node of sortedNodes) {
        addLog({
          timestamp: Date.now(),
          nodeId: node.id,
          message: `Executing ${node.data.label}...`,
          level: 'info'
        });

        setNodeProgress(node.id, 0);

        try {
          // Get inputs from connected nodes
          const inputs = await collectNodeInputs(node.id, edges, useExecutionStore.getState().results);

          // Execute based on node type
          let result;
          switch (node.type) {
            case 'primitiveNode':
              result = node.data.value;
              break;

            case 'workflowNode':
              result = await executeWorkflowNode(node, inputs, (progress) => {
                setNodeProgress(node.id, progress);
              });
              break;

            case 'combineNode':
              result = await executeCombineNode(node, inputs);
              break;

            default:
              result = inputs[Object.keys(inputs)[0]]; // Pass-through
          }

          setNodeResult(node.id, result);
          setNodeProgress(node.id, 1);

          addLog({
            timestamp: Date.now(),
            nodeId: node.id,
            message: `✓ ${node.data.label} completed`,
            level: 'info'
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          setNodeError(node.id, errorMessage);
          addLog({
            timestamp: Date.now(),
            nodeId: node.id,
            message: `✗ ${node.data.label} failed: ${errorMessage}`,
            level: 'error'
          });
          throw error; // Stop execution on error
        }
      }

      addLog({ timestamp: Date.now(), message: '✓ Workflow completed successfully', level: 'info' });
      toast.success('Workflow Complete', {
        description: 'All nodes executed successfully',
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
    } finally {
      stopExecution();
    }
  }, [nodes, edges, startExecution, stopExecution, setNodeProgress, setNodeResult, setNodeError, addLog]);

  return { execute };
};
