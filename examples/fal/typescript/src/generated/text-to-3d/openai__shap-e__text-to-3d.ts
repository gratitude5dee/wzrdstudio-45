/**
 * Model: Shap-E Text-to-3D | Slug: openai/shap-e/text-to-3d | Category: text-to-3d | https://fal.ai/models/openai/shap-e/text-to-3d
 * Text-conditioned 3D asset generation (implicit fields → meshes).
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; guidance_scale?: number; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "a sci-fi hover bike with neon accents",
    guidance_scale: 7.5,
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('openai/shap-e/text-to-3d', { input });
    console.log(result.data);
    return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message);
    throw err;
  }
}
async function main() { await run(); }
if (import.meta.main) { void main(); }
