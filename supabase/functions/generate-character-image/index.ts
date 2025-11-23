
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, errorResponse, successResponse, handleCors } from '../_shared/response.ts';
import { getCharacterVisualSystemPrompt, getCharacterVisualUserPrompt } from '../_shared/prompts.ts';

// Fetch with retry and timeout helper
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  retries = 3, 
  timeout = 30000
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // If not ok and we have retries left, continue
      if (attempt < retries - 1) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`Request failed (status ${response.status}), retrying in ${backoffMs}ms... (attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt < retries - 1) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 5000);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`Request error: ${errorMessage}, retrying in ${backoffMs}ms... (attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}

interface RequestBody {
  character_id: string;
  project_id?: string;
}

interface CharacterData {
  name: string;
  description: string | null;
  project?: {
    genre?: string | null;
    tone?: string | null;
    video_style?: string | null;
    cinematic_inspiration?: string | null;
  } | {
    genre?: string | null;
    tone?: string | null;
    video_style?: string | null;
    cinematic_inspiration?: string | null;
  }[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return handleCors();

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    const { character_id, project_id }: RequestBody = await req.json();
    if (!character_id) return errorResponse('character_id is required', 400);

    console.log(`Generating image for character ID: ${character_id}`);
    
    // Update character status to generating
    await supabaseClient
      .from('characters')
      .update({ 
        image_status: 'generating',
        image_generation_error: null
      })
      .eq('id', character_id);

    // 1. Fetch Character Data and Project Context
    let query = supabaseClient
      .from('characters')
      .select(`
        name,
        description,
        project:projects (
          genre,
          tone,
          video_style,
          cinematic_inspiration
        )
      `)
      .eq('id', character_id)
      .single();

    const { data: charData, error: fetchError } = await query;

    if (fetchError || !charData) {
      console.error('Error fetching character:', fetchError?.message);
      return errorResponse('Character not found', 404, fetchError?.message);
    }

    // 2. Generate Visual Prompt using Lovable AI with Gemini 2.5 Flash
    console.log(`Generating visual prompt for character: ${charData.name}`);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return errorResponse('LOVABLE_API_KEY not configured', 500);
    }

    const visualPromptSystem = getCharacterVisualSystemPrompt();
    const projectData = Array.isArray(charData.project) ? charData.project[0] : charData.project;
    const visualPromptUser = getCharacterVisualUserPrompt(
      charData.name,
      charData.description,
      projectData
    );

    const promptResponse = await fetchWithRetry('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: visualPromptSystem },
          { role: 'user', content: visualPromptUser }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    }, 3, 30000);

    if (!promptResponse.ok) {
      console.error('Failed to generate visual prompt:', promptResponse.status);
      return errorResponse('Failed to generate visual prompt', 500);
    }

    const promptData = await promptResponse.json();
    const visualPrompt = promptData.choices?.[0]?.message?.content?.trim();

    if (!visualPrompt) {
      console.error('No visual prompt received');
      return errorResponse('Failed to generate visual prompt', 500);
    }

    console.log(`Generated visual prompt: ${visualPrompt}`);

    // 3. Generate Image using FAL.AI with beta-image-232
    console.log('Calling FAL.AI with beta-image-232 for character image generation...');
    
    const { data: functionData, error: functionError } = await supabaseClient.functions.invoke('falai-image-generation', {
      body: {
        prompt: visualPrompt,
        image_size: '1024x1024',
        model_id: 'fal-ai/beta-image-232',
        num_inference_steps: 30,
        guidance_scale: 3.5,
        enable_safety_checker: true
      }
    });

    if (functionError || !functionData?.success) {
      console.error('FAL.AI generation failed:', functionError || functionData?.error);
      return errorResponse(functionData?.error || functionError?.message || 'Failed to generate character image', 500);
    }

    const imageUrl = functionData.data?.images?.[0]?.url;
    if (!imageUrl) {
      console.error('No image URL returned from FAL.AI');
      return errorResponse('Failed to generate character image', 500);
    }
    console.log(`Generated Image URL from FAL.AI: ${imageUrl.substring(0, 50)}...`);

    // 4. Return immediate response and update DB in background
    const successResponseData = { 
      success: true, 
      character_id: character_id, 
      image_url: imageUrl,
      visual_prompt: visualPrompt
    };

    // Update character record in background using waitUntil
    // @ts-ignore - EdgeRuntime is available in Deno Deploy
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(
        (async () => {
          const { error: updateError } = await supabaseClient
            .from('characters')
            .update({ 
              image_url: imageUrl,
              image_status: 'completed',
              image_generation_error: null
            })
            .eq('id', character_id);

          if (updateError) {
            console.error(`Background update failed for character ${character_id}:`, updateError);
          } else {
            console.log(`Successfully updated character ${character_id} with image URL and status`);
          }
        })()
      );
    } else {
      // Fallback for environments without EdgeRuntime.waitUntil
      const { error: updateError } = await supabaseClient
        .from('characters')
        .update({ 
          image_url: imageUrl,
          image_status: 'completed',
          image_generation_error: null
        })
        .eq('id', character_id);

      if (updateError) {
        console.error(`Failed to update character ${character_id} with image URL:`, updateError);
      }
    }

    return successResponse(successResponseData);

  } catch (error) {
    console.error(`Error in generate-character-image:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Update character status to failed
    try {
      const { character_id } = await req.json();
      if (character_id) {
        await supabaseClient
          .from('characters')
          .update({ 
            image_status: 'failed',
            image_generation_error: errorMessage
          })
          .eq('id', character_id);
      }
    } catch (updateError) {
      console.error('Failed to update character error status:', updateError);
    }
    
    return errorResponse(errorMessage || 'Failed to generate character image', 500);
  }
});

