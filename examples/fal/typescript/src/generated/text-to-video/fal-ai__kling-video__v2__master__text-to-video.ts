/**
 * Model: Kling 2.0 Master | Slug: fal-ai/kling-video/v2/master/text-to-video | Category: text-to-video | https://fal.ai/models/fal-ai/kling-video/v2/master/text-to-video
 * Generate video clips from your prompts using Kling 2.0 Master
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = { prompt: "A cinematic aerial shot of a city skyline at night" } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/kling-video/v2/master/text-to-video', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}
async function main() { await run(); }
if (import.meta.main) { void main(); }
