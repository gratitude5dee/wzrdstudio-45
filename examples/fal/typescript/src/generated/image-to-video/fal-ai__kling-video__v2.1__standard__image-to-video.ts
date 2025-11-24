/**
 * Model: Kling 2.1 (standard) | Slug: fal-ai/kling-video/v2.1/standard/image-to-video | Category: image-to-video | https://fal.ai/models/fal-ai/kling-video/v2.1/standard/image-to-video
 * Kling 2.1 Standard is a cost-efficient endpoint for t...del, delivering high-quality image-to-video generation
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) {
  throw new Error('Missing FAL_KEY. Copy .env.example to .env and set your key.');
}
fal.config({ credentials: process.env.FAL_KEY! });

interface Input {
  prompt: string;
  image_url: string;
}
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "Th...mination",
    image_url: "https://example.com/input.jpg"
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/kling-video/v2.1/standard/image-to-video', { input });
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
