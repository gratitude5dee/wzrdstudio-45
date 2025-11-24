import { useCallback } from 'react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useReactFlow, Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

export const useNodeOperations = () => {
  const setNodesWithHistory = useComposerStore((state) => state.setNodesWithHistory);
  const setEdgesWithHistory = useComposerStore((state) => state.setEdgesWithHistory);
  const { screenToFlowPosition } = useReactFlow();

  const addNode = useCallback((type: string, data: any, position?: { x: number; y: number }) => {
    const newNode: Node = {
      id: uuidv4(),
      type,
      position: position || { x: 0, y: 0 },
      data: { ...data, label: data.label || 'New Node' },
    };

    setNodesWithHistory((nodes) => [...nodes, newNode]);
    return newNode;
  }, [setNodesWithHistory]);

  const deleteSelectedNodes = useCallback(() => {
    const nodes = useComposerStore.getState().nodes;
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedIds = selectedNodes.map((n) => n.id);

    if (selectedIds.length === 0) return;

    setNodesWithHistory((nodes) => nodes.filter((n) => !selectedIds.includes(n.id)));
    setEdgesWithHistory((edges) =>
      edges.filter((e) => !selectedIds.includes(e.source) && !selectedIds.includes(e.target))
    );
  }, [setNodesWithHistory, setEdgesWithHistory]);

  const updateNodeData = useCallback((id: string, data: any) => {
      setNodesWithHistory((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
  }, [setNodesWithHistory]);

  return { addNode, deleteSelectedNodes, updateNodeData };
};
