/**
 * Model: Video Understanding | Slug: fal-ai/video-understanding | Category: vision | https://fal.ai/models/fal-ai/video-understanding
 * A video understanding model to analyze video content ...ns about what's happening in the video based on user prompts.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = { prompt: "Hello world" } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/video-understanding', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}
async function main() { await run(); }
if (import.meta.main) { void main(); }
