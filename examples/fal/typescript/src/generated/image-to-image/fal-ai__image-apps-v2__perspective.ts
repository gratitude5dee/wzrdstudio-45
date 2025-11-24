/**
 * Model: Perspective | Slug: fal-ai/image-apps-v2/perspective | Category: image-to-image | https://fal.ai/models/fal-ai/image-apps-v2/perspective
 * Correct perspective distortions and alignments in images.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) {
  throw new Error('Missing FAL_KEY. Copy .env.example to .env and set your key.');
}
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; image_url: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "Make the dress blue",
    image_url: "https://example.com/input.jpg",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/image-apps-v2/perspective', { input });
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
