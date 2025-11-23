import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EvaluationRun, EvaluationResult } from '@/types/arena';
import { toast } from 'sonner';

interface RunEvaluationParams {
  model_ids: string[];
  test_ids: string[];
  mode: 'text-to-image' | 'image-edit';
  parameters: {
    seed?: number;
    resolution: string;
    guidance_scale: number;
    steps: number;
  };
  base_image_url?: string;
}

export function useArenaEvaluation() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentRun, setCurrentRun] = useState<EvaluationRun | null>(null);
  const [results, setResults] = useState<EvaluationResult[] | null>(null);

  const resetResults = () => setResults(null);

  const runEvaluation = async (params: RunEvaluationParams) => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    try {
      // Call batch eval endpoint
      const { data, error } = await supabase.functions.invoke('arena-batch-eval', {
        body: params
      });

      if (error) throw error;

      const runId = data.run_id;
      toast.success('Evaluation started!');

      // Poll for progress
      const pollInterval = setInterval(async () => {
        const { data: run, error: runError } = await supabase
          .from('evaluation_runs')
          .select('*')
          .eq('id', runId)
          .single();

        if (runError) {
          console.error('Failed to fetch run status:', runError);
          return;
        }

        setCurrentRun(run as EvaluationRun);
        setProgress(run.progress || 0);

        if (run.status === 'completed') {
          clearInterval(pollInterval);
          
          // Fetch results
          const { data: resultData, error: resultsError } = await supabase
            .from('evaluation_results')
            .select('*')
            .eq('run_id', runId);

          if (!resultsError && resultData) {
            setResults(resultData.map(r => ({
              ...r,
              criteria_breakdown: r.criteria_breakdown as any
            })) as EvaluationResult[]);
            toast.success('Evaluation complete!');
          }
          
          setIsRunning(false);
        } else if (run.status === 'failed') {
          clearInterval(pollInterval);
          toast.error('Evaluation failed');
          setIsRunning(false);
        }
      }, 2000);

      // Cleanup after 30 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isRunning) {
          setIsRunning(false);
          toast.error('Evaluation timed out');
        }
      }, 30 * 60 * 1000);

    } catch (error) {
      console.error('Failed to start evaluation:', error);
      toast.error('Failed to start evaluation');
      setIsRunning(false);
    }
  };

  return {
    runEvaluation,
    isRunning,
    progress,
    currentRun,
    results,
    resetResults
  };
}
