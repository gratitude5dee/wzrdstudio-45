/**
 * Model: Hidream I1 Fast | Slug: fal-ai/hidream-i1-fast | Category: text-to-image | https://fal.ai/models/fal-ai/hidream-i1-fast
 * HiDream-I1 fast is a new open-source image generative...es state-of-the-art image generation quality within 16 steps.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = { prompt: "A beautiful sunset over the mountains" } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/hidream-i1-fast', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}
async function main() { await run(); }
if (import.meta.main) { void main(); }
