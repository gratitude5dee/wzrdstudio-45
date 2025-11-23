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
  console.log(`[Judge] Multi-criteria evaluation for ${modelId}...`);
  
  // Multi-pass evaluation for detailed criteria
  const queries = {
    overall: `Evaluate this image overall quality from the prompt: "${prompt}". Score 1-10. Format: "Score: X/10. Reasoning: [analysis]"`,
    prompt_adherence: `How well does this image match the prompt: "${prompt}"? Score 1-10. Format: "Score: X/10. Reasoning: [analysis]"`,
    anatomical_integrity: `Evaluate anatomical accuracy and structural coherence. Check for distortions, correct proportions, realistic physics. Score 1-10. Format: "Score: X/10. Reasoning: [analysis]"`,
    physics_lighting: `Evaluate lighting, colors, textures, and overall technical execution. Score 1-10. Format: "Score: X/10. Reasoning: [analysis]"`
  };
  
  // Execute all evaluations in parallel
  const [overallResult, promptResult, anatomyResult, technicalResult] = await Promise.all([
    executeFalModel('fal-ai/moondream2/visual-query', { image_url: imageUrl, query: queries.overall }),
    executeFalModel('fal-ai/moondream2/visual-query', { image_url: imageUrl, query: queries.prompt_adherence }),
    executeFalModel('fal-ai/moondream2/visual-query', { image_url: imageUrl, query: queries.anatomical_integrity }),
    executeFalModel('fal-ai/moondream2/visual-query', { image_url: imageUrl, query: queries.physics_lighting })
  ]);
  
  const parseScore = (text: string) => {
    const match = text.match(/Score:\s*(\d+)\/10/i);
    return match ? parseInt(match[1]) : 7;
  };
  
  const parseReasoning = (text: string) => {
    const match = text.match(/Reasoning:\s*(.+)/is);
    return match ? match[1].trim().substring(0, 300) : text.substring(0, 300);
  };
  
  const outputs = {
    overall: overallResult.success ? (overallResult.data as any)?.output || '' : '',
    prompt_adherence: promptResult.success ? (promptResult.data as any)?.output || '' : '',
    anatomical_integrity: anatomyResult.success ? (anatomyResult.data as any)?.output || '' : '',
    physics_lighting: technicalResult.success ? (technicalResult.data as any)?.output || '' : ''
  };
  
  const scores = {
    overall: parseScore(outputs.overall),
    prompt_adherence: parseScore(outputs.prompt_adherence),
    anatomical_integrity: parseScore(outputs.anatomical_integrity),
    physics_lighting: parseScore(outputs.physics_lighting)
  };
  
  const reasoning = {
    overall: parseReasoning(outputs.overall),
    prompt_adherence: parseReasoning(outputs.prompt_adherence),
    anatomical_integrity: parseReasoning(outputs.anatomical_integrity),
    physics_lighting: parseReasoning(outputs.physics_lighting)
  };
  
  const avgScore = Math.round((scores.overall + scores.prompt_adherence + scores.anatomical_integrity + scores.physics_lighting) / 4);

  return {
    model_id: modelId,
    overall_score: avgScore,
    confidence: "High" as const,
    criteria: {
      prompt_adherence: scores.prompt_adherence,
      anatomical_integrity: scores.anatomical_integrity,
      text_accuracy: scores.overall,
      physics_lighting: scores.physics_lighting
    },
    detailed_reasoning: reasoning,
    reasoning: reasoning.overall,
    rank: 0
  };
}
