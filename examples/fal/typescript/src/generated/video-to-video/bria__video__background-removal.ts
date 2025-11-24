/**
 * Model: Bria Video Background Removal | Slug: bria/video/background-removal | Category: video-to-video | https://fal.ai/models/bria/video/background-removal
 *
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
    prompt: "The whit...of determination",
    image_url: "https://example.com/input.jpg",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('bria/video/background-removal', { input });
    console.log(result.data);
    return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message);
    throw err;
  }
}

async function main() {
  await run();
}
if (import.meta.main) { void main(); }
