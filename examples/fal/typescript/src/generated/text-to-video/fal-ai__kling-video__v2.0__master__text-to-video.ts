/**
 * Model: Kling 2.0 Master (Text-to-Video) | Slug: fal-ai/kling-video/v2.0/master/text-to-video | Category: text-to-video | https://fal.ai/models/fal-ai/kling-video/v2.0/master/text-to-video
 * Master-tier Kling text-to-video with rich motion synthesis and scene depth.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY. Copy .env.example to .env and set your key.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "A beautiful sunset over the mountains",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/kling-video/v2.0/master/text-to-video', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}

async function main() { await run(); }
if (import.meta.main) { void main(); }
