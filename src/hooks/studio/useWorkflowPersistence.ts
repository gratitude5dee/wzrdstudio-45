import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Node, Edge } from '@xyflow/react';
import { useComposerStore } from '@/store/studio/useComposerStore';

interface SaveWorkflowParams {
  name?: string;
  description?: string;
}

export const useWorkflowPersistence = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const nodes = useComposerStore((s) => s.nodes);
  const edges = useComposerStore((s) => s.edges);
  const viewport = useComposerStore((s) => s.viewport);
  const meta = useComposerStore((s) => s.meta);
  const loadFromJson = useComposerStore((s) => s.loadFromJson);

  const saveWorkflow = async ({ name, description }: SaveWorkflowParams = {}) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to save workflows',
          variant: 'destructive'
        });
        return null;
      }

      // Save or update workflow
      const workflowData = {
        name: name || meta.title || 'Untitled Workflow',
        description: description || meta.description,
        user_id: user.id,
      };

      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .upsert(meta.workflowId ? { ...workflowData, id: meta.workflowId } : workflowData)
        .select()
        .single();

      if (workflowError) throw workflowError;

      // Delete existing nodes/edges
      await supabase.from('nodes').delete().eq('workflow_id', workflow.id);
      await supabase.from('edges').delete().eq('workflow_id', workflow.id);

      // Save nodes
      if (nodes.length > 0) {
        const nodesToSave = nodes.map(node => ({
          id: node.id,
          workflow_id: workflow.id,
          type: node.type || 'default',
          position_x: node.position.x,
          position_y: node.position.y,
          data: node.data as any,
        }));

        const { error: nodesError } = await supabase
          .from('nodes')
          .insert(nodesToSave);

        if (nodesError) throw nodesError;
      }

      // Save edges
      if (edges.length > 0) {
        const edgesToSave = edges.map(edge => ({
          id: edge.id,
          workflow_id: workflow.id,
          source_node_id: edge.source,
          target_node_id: edge.target,
          data: (edge.data || {}) as any,
        }));

        const { error: edgesError } = await supabase
          .from('edges')
          .insert(edgesToSave);

        if (edgesError) throw edgesError;
      }

      toast({
        title: 'Success',
        description: `Workflow "${workflow.name}" saved successfully`,
      });

      return workflow;
    } catch (error: any) {
      toast({
        title: 'Error saving workflow',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const loadWorkflow = async (workflowId: string) => {
    setIsLoading(true);
    try {
      // Fetch workflow details
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (workflowError) throw workflowError;

      // Fetch nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('nodes')
        .select('*')
        .eq('workflow_id', workflowId);

      if (nodesError) throw nodesError;

      // Fetch edges
      const { data: edgesData, error: edgesError } = await supabase
        .from('edges')
        .select('*')
        .eq('workflow_id', workflowId);

      if (edgesError) throw edgesError;

      // Transform to ReactFlow format
      const flowNodes: Node[] = (nodesData || []).map((node) => ({
        id: node.id,
        type: node.type,
        position: { x: node.position_x, y: node.position_y },
        data: node.data as any,
      }));

      const flowEdges: Edge[] = (edgesData || []).map((edge) => ({
        id: edge.id,
        source: edge.source_node_id,
        target: edge.target_node_id,
        type: 'default',
        data: edge.data as any,
      }));

      // Load into store
      loadFromJson({
        nodes: flowNodes,
        edges: flowEdges,
        viewport: { x: 0, y: 0, zoom: 1 },
        meta: {
          workflowId: workflow.id,
          title: workflow.name,
        }
      });

      toast({
        title: 'Success',
        description: `Workflow "${workflow.name}" loaded successfully`,
      });

      return { workflow, nodes: flowNodes, edges: flowEdges };
    } catch (error: any) {
      toast({
        title: 'Error loading workflow',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const exportWorkflow = () => {
    const data = {
      version: '1.0',
      nodes,
      edges,
      viewport,
      meta,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meta.title || 'workflow'}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Workflow exported',
      description: 'JSON file downloaded successfully',
    });
  };

  const importWorkflow = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.nodes || !data.edges) {
        throw new Error('Invalid workflow file format');
      }

      loadFromJson(data);

      toast({
        title: 'Workflow imported',
        description: 'Workflow loaded successfully',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Import failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
  };

  const listWorkflows = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: 'Error loading workflows',
        description: error.message,
        variant: 'destructive'
      });
      return [];
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      toast({
        title: 'Workflow deleted',
        description: 'Workflow removed successfully',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting workflow',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    saveWorkflow,
    loadWorkflow,
    exportWorkflow,
    importWorkflow,
    listWorkflows,
    deleteWorkflow,
    isSaving,
    isLoading,
  };
};
