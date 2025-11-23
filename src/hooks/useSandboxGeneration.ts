import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SandboxGeneration {
  id: string;
  model_id: string;
  model_name: string;
  prompt: string;
  image_url: string;
  generation_time_ms: number;
  cost: number;
  aspect_ratio: string;
  created_at: string;
}

interface GenerateParams {
  prompt: string;
  aspectRatio: string;
  modelIds: string[];
}

export const useSandboxGeneration = () => {
  const [generations, setGenerations] = useState<SandboxGeneration[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const runBatchGeneration = async ({ prompt, aspectRatio, modelIds }: GenerateParams) => {
    if (modelIds.length === 0) {
      toast.error('Please select at least one model');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const totalModels = modelIds.length;
      let completed = 0;

      // Generate for each model in parallel
      const generationPromises = modelIds.map(async (modelId) => {
        const startTime = Date.now();
        
        try {
          // Call FAL.AI through edge function
          const { data, error } = await supabase.functions.invoke('falai-image-generation', {
            body: {
              model_id: modelId,
              prompt,
              image_size: aspectRatio,
              num_inference_steps: 30,
              guidance_scale: 3.5,
              seed: Math.floor(Math.random() * 1000000)
            }
          });

          if (error) throw error;

          const generationTime = Date.now() - startTime;
          const imageUrl = data.images?.[0]?.url || data.image?.url;

          if (!imageUrl) {
            throw new Error('No image URL returned');
          }

          completed++;
          setProgress(Math.round((completed / totalModels) * 100));

          return {
            id: crypto.randomUUID(),
            model_id: modelId,
            model_name: modelId.split('/').pop() || modelId,
            prompt,
            image_url: imageUrl,
            generation_time_ms: generationTime,
            cost: 0.08, // Placeholder cost
            aspect_ratio: aspectRatio,
            created_at: new Date().toISOString()
          };
        } catch (error: any) {
          console.error(`Failed to generate for model ${modelId}:`, error);
          completed++;
          setProgress(Math.round((completed / totalModels) * 100));
          return null;
        }
      });

      const results = await Promise.all(generationPromises);
      const successfulGenerations = results.filter((r): r is NonNullable<typeof r> => r !== null) as SandboxGeneration[];

      if (successfulGenerations.length === 0) {
        toast.error('All generations failed');
      } else {
        setGenerations(prev => [...successfulGenerations, ...prev]);
        toast.success(`Generated ${successfulGenerations.length} images successfully`);
      }
    } catch (error: any) {
      console.error('Batch generation error:', error);
      toast.error('Failed to generate images');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const clearGenerations = () => {
    setGenerations([]);
    toast.success('Cleared all generations');
  };

  return {
    generations,
    isGenerating,
    progress,
    runBatchGeneration,
    clearGenerations
  };
};
