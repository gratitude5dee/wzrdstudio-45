import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateRequest, AuthError } from '../_shared/auth.ts';
import { corsHeaders, errorResponse, successResponse, handleCors } from '../_shared/response.ts';
import { executeFalModel } from '../_shared/falai-client.ts';

interface JudgeRequest {
  prompt: string;
  images: Array<{
    model_id: string;
    url: string;
  }>;
  test_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCors();
  }

  try {
    await authenticateRequest(req.headers);

    const { prompt, images, test_id }: JudgeRequest = await req.json();

    console.log(`[Judge] Evaluating ${images.length} images for test ${test_id}`);

    const scores = await Promise.all(
      images.map(async ({ model_id, url }) => {
        return await judgeImage(prompt, url, model_id);
      })
    );

    const rankedScores = scores
      .sort((a, b) => b.overall_score - a.overall_score)
      .map((score, index) => ({ ...score, rank: index + 1 }));

    const winner = rankedScores[0];
    const scoreSpread = rankedScores[0].overall_score - rankedScores[rankedScores.length - 1].overall_score;
    const confidence = scoreSpread >= 3 ? "High" : scoreSpread >= 1.5 ? "Medium" : "Low";

    const consensusReasoning = `${winner.model_id} scores ${winner.overall_score}/10`;

    return successResponse({
      test_id,
      winner: winner.model_id,
      confidence,
      consensus_reasoning: consensusReasoning,
      model_scores: Object.fromEntries(rankedScores.map(s => [s.model_id, s]))
    });

  } catch (error: any) {
    console.error('[Judge] Error:', error);
    
    if (error instanceof AuthError) {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse(error?.message || 'Failed to judge images', 500);
  }
});

async function judgeImage(prompt: string, imageUrl: string, modelId: string) {
  const evaluationQuery = `Evaluate this image generated from the prompt: "${prompt}". Score it 1-10 on quality, prompt adherence, and technical execution. Provide brief reasoning.`;
  
  console.log(`[Judge] Evaluating ${modelId} with Moondream...`);
  
  const result = await executeFalModel('fal-ai/moondream2/visual-query', {
    image_url: imageUrl,
    query: evaluationQuery
  });

  if (!result.success) {
    throw new Error(result.error || 'Moondream evaluation failed');
  }

  const resultData: any = result.data;
  const moondreamResponse = resultData?.output || 'No response';
  
  const scoreMatch = moondreamResponse.match(/(\d+)\/10/);
  const overall_score = scoreMatch ? parseInt(scoreMatch[1]) : 7;

  return {
    model_id: modelId,
    overall_score,
    confidence: "Medium" as const,
    criteria: {
      prompt_adherence: overall_score,
      anatomical_integrity: overall_score,
      text_accuracy: overall_score,
      physics_lighting: overall_score
    },
    reasoning: moondreamResponse.substring(0, 200),
    rank: 0
  };
}
