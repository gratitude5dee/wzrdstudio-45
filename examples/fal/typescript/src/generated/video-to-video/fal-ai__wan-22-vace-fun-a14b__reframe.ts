/**
 * Model: Wan 2.2 VACE Fun A14B (Reframe) | Slug: fal-ai/wan-22-vace-fun-a14b/reframe | Category: video-to-video | https://fal.ai/models/fal-ai/wan-22-vace-fun-a14b/reframe
 * Reframe videos for different aspect ratios with motion-aware cropping.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) {
  throw new Error('Missing FAL_KEY. Copy .env.example to .env and set your key.');
}
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; video_url: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "Add dynamic motion effects",
    video_url: "https://example.com/input.mp4",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/wan-22-vace-fun-a14b/reframe', { input });
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
