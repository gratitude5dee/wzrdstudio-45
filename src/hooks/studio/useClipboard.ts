import { useCallback } from 'react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useReactFlow, Node, Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const useClipboard = () => {
  const { getNodes, getEdges } = useReactFlow();
  const setNodesWithHistory = useComposerStore((state) => state.setNodesWithHistory);
  const setEdgesWithHistory = useComposerStore((state) => state.setEdgesWithHistory);

  const copy = useCallback(async () => {
    const nodes = getNodes().filter((n) => n.selected);
    const edges = getEdges().filter((e) => e.selected);

    if (nodes.length === 0 && edges.length === 0) return;

    const data = {
      nodes,
      edges,
    };

    await navigator.clipboard.writeText(JSON.stringify(data));
    toast.success('Copied to clipboard');
  }, [getNodes, getEdges]);

  const cut = useCallback(async () => {
    const nodes = getNodes().filter((n) => n.selected);
    const edges = getEdges().filter((e) => e.selected);

    if (nodes.length === 0 && edges.length === 0) return;

    const data = {
      nodes,
      edges,
    };

    await navigator.clipboard.writeText(JSON.stringify(data));

    // Delete selected
    const selectedNodeIds = nodes.map((n) => n.id);
    const selectedEdgeIds = edges.map((e) => e.id);

    setNodesWithHistory((currentNodes) =>
      currentNodes.filter((n) => !selectedNodeIds.includes(n.id))
    );
    setEdgesWithHistory((currentEdges) =>
      currentEdges.filter((e) => !selectedEdgeIds.includes(e.id))
    );

    toast.success('Cut to clipboard');
  }, [getNodes, getEdges, setNodesWithHistory, setEdgesWithHistory]);

  const paste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);

      if (!data.nodes && !data.edges) return;

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const idMap = new Map<string, string>();

      // Re-id nodes
      data.nodes?.forEach((node: Node) => {
        const newId = uuidv4();
        idMap.set(node.id, newId);
        newNodes.push({
          ...node,
          id: newId,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          selected: true,
        });
      });

      // Re-id edges and map to new node IDs
      data.edges?.forEach((edge: Edge) => {
        const newSource = idMap.get(edge.source);
        const newTarget = idMap.get(edge.target);
        if (newSource && newTarget) {
          newEdges.push({
            ...edge,
            id: uuidv4(),
            source: newSource,
            target: newTarget,
            selected: true,
          });
        }
      });

      // Deselect current nodes
      setNodesWithHistory((nodes) =>
        [...nodes.map(n => ({ ...n, selected: false })), ...newNodes]
      );
      setEdgesWithHistory((edges) =>
        [...edges.map(e => ({ ...e, selected: false })), ...newEdges]
      );

      toast.success('Pasted from clipboard');
    } catch (error) {
      console.error('Failed to paste:', error);
      // Ignore if not valid JSON or clipboard empty
    }
  }, [setNodesWithHistory, setEdgesWithHistory]);

  return { copy, cut, paste };
};
