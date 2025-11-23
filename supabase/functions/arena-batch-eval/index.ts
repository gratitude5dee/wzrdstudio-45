import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest, AuthError } from '../_shared/auth.ts';
import { corsHeaders, errorResponse, successResponse, handleCors } from '../_shared/response.ts';
import { executeFalModel } from '../_shared/falai-client.ts';

interface BatchEvalRequest {
  test_ids: string[];
  model_ids: string[];
  mode: 'text-to-image' | 'image-edit';
  parameters: {
    seed?: number;
    resolution: string;
    guidance_scale: number;
    steps: number;
  };
  base_image_url?: string;
}

const TEST_SUITE_DATA = [
  {
    id: 'test-1-anchor',
    name: 'The Anchor Character',
    prompt: 'A photorealistic medium-shot portrait of a 35-year-old South Asian woman with long straight black hair, warm brown eyes, olive skin, wearing a simple white button-up shirt. She has a small scar above her left eyebrow. Soft natural lighting, neutral gray background, direct eye contact with camera.'
  },
  {
    id: 'test-2-pose-stress',
    name: 'Pose Stress Test',
    prompt: 'The same woman, now dancing energetically in a sunlit park, arms raised above her head mid-spin, hair flowing, wearing casual jeans and t-shirt. Motion blur on the background but sharp focus on her face, showing the same scar and features.'
  },
  {
    id: 'test-3-multi-subject',
    name: 'Multi-Subject Consistency',
    prompt: 'The woman having coffee with a tall Black man at an outdoor café. Both subjects clearly visible, engaged in conversation.'
  },
  {
    id: 'test-4-macro-detail',
    name: 'Macro Detail Test',
    prompt: 'Extreme close-up of a human eye, showing individual eyelashes, iris texture with visible limbal ring, subtle veins in the sclera, and a perfect reflection of a window in the pupil. Photorealistic 8K macro photography.'
  },
  {
    id: 'test-5-complex-materials',
    name: 'Material Complexity',
    prompt: 'A still life on a mahogany table: a crystal wine glass half-filled with red wine, condensation droplets on the glass, a polished silver fork, a silk napkin with embroidered patterns, and a slice of chocolate cake with visible layers and glossy ganache.'
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCors();
  }

  try {
    const user = await authenticateRequest(req.headers);
    const userId = user.id;

    const { test_ids, model_ids, mode, parameters, base_image_url }: BatchEvalRequest = await req.json();

    console.log(`[Batch Eval] Starting evaluation for ${model_ids.length} models x ${test_ids.length} tests`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: run, error: runError } = await supabase
      .from('evaluation_runs')
      .insert({
        user_id: userId,
        status: 'running',
        mode,
        models: model_ids,
        tests: test_ids,
        parameters,
        progress: 0,
        total_generations: model_ids.length * test_ids.length
      })
      .select()
      .single();

    if (runError || !run) {
      console.error('[Batch Eval] Failed to create run:', runError);
      return errorResponse('Failed to create evaluation run', 500);
    }

    console.log(`[Batch Eval] Created run ${run.id}`);

    processEvaluation(run.id, test_ids, model_ids, parameters, supabase, req.headers).catch(error => {
      console.error('[Batch Eval] Error processing evaluation:', error);
    });

    return successResponse({
      run_id: run.id,
      status: 'running',
      total_generations: run.total_generations
    });

  } catch (error: any) {
    console.error('[Batch Eval] Error:', error);
    
    if (error instanceof AuthError) {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse(error?.message || 'Failed to start evaluation', 500);
  }
});

async function processEvaluation(
  runId: string,
  testIds: string[],
  modelIds: string[],
  parameters: any,
  supabase: any,
  headers: Headers
) {
  const totalTests = testIds.length;
  let completedTests = 0;

  try {
    for (const testId of testIds) {
      const test = TEST_SUITE_DATA.find(t => t.id === testId);
      if (!test) {
        console.error(`[Batch Eval] Test ${testId} not found`);
        continue;
      }

      console.log(`[Batch Eval] Processing test ${testId}: ${test.name}`);

      const generations = await Promise.all(
        modelIds.map(async (modelId) => {
          const startTime = Date.now();
          
          try {
            const result = await executeFalModel(modelId, {
              prompt: test.prompt,
              image_size: parameters.resolution,
              num_inference_steps: parameters.steps,
              guidance_scale: parameters.guidance_scale,
              seed: parameters.seed
            });

            if (!result.success) {
              throw new Error(result.error || 'Generation failed');
            }

            const resultData: any = result.data;
            const imageUrl = resultData?.images?.[0]?.url || resultData?.image?.url;
            const generationTime = Date.now() - startTime;

            return {
              model_id: modelId,
              image_url: imageUrl,
              generation_time_ms: generationTime,
              error: null
            };
          } catch (error: any) {
            console.error(`[Batch Eval] Generation failed for ${modelId}:`, error);
            return {
              model_id: modelId,
              image_url: null,
              generation_time_ms: Date.now() - startTime,
              error: error?.message || 'Unknown error'
            };
          }
        })
      );

      const successfulGenerations = generations.filter(g => g.image_url);

      if (successfulGenerations.length === 0) {
        console.error(`[Batch Eval] All generations failed for test ${testId}`);
        completedTests++;
        continue;
      }

      const judgeResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/arena-judge-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.get('authorization') || ''
        },
        body: JSON.stringify({
          prompt: test.prompt,
          images: successfulGenerations.map(g => ({
            model_id: g.model_id,
            url: g.image_url!
          })),
          test_id: testId
        })
      });

      if (!judgeResponse.ok) {
        console.error(`[Batch Eval] Judging failed for test ${testId}`);
        completedTests++;
        continue;
      }

      const judgeResult = await judgeResponse.json();

      // Insert both successful and failed results
      const resultsToInsert = [
        ...successfulGenerations.map(gen => {
          const modelScore = judgeResult.model_scores[gen.model_id];
          return {
            run_id: runId,
            test_id: testId,
            model_id: gen.model_id,
            image_url: gen.image_url!,
            generation_time_ms: gen.generation_time_ms,
            judge_score: modelScore?.overall_score,
            judge_reasoning: modelScore?.reasoning,
            judge_confidence: modelScore?.confidence,
            criteria_breakdown: modelScore?.criteria,
            detailed_reasoning: modelScore?.detailed_reasoning,
            generation_error: null
          };
        }),
        // Add failed generations
        ...generations.filter(g => !g.image_url).map(gen => ({
          run_id: runId,
          test_id: testId,
          model_id: gen.model_id,
          image_url: null,
          generation_time_ms: gen.generation_time_ms,
          judge_score: null,
          judge_reasoning: null,
          judge_confidence: null,
          criteria_breakdown: null,
          detailed_reasoning: null,
          generation_error: gen.error
        }))
      ];

      const { error: insertError } = await supabase
        .from('evaluation_results')
        .insert(resultsToInsert);

      if (insertError) {
        console.error('[Batch Eval] Failed to store results:', insertError);
      }

      completedTests++;
      const progress = Math.round((completedTests / totalTests) * 100);
      
      await supabase
        .from('evaluation_runs')
        .update({ progress })
        .eq('id', runId);

      console.log(`[Batch Eval] Progress: ${progress}%`);
    }

    await supabase
      .from('evaluation_runs')
      .update({ 
        status: 'completed',
        progress: 100
      })
      .eq('id', runId);

    console.log(`[Batch Eval] Completed run ${runId}`);

  } catch (error: any) {
    console.error('[Batch Eval] Fatal error:', error);
    
    await supabase
      .from('evaluation_runs')
      .update({ status: 'failed' })
      .eq('id', runId);
  }
}
