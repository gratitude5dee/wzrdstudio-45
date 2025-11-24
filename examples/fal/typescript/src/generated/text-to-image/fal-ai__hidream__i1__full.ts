/**
 * Model: Hidream I1 Full | Slug: fal-ai/hidream/i1/full | Category: text-to-image | https://fal.ai/models/fal-ai/hidream/i1/full
 * HiDream I1 Full is a text-to-image model offering high-resolution synthesis with stylistic diversity.
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
    const result: { data: Output } = await fal.subscribe('fal-ai/hidream/i1/full', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}

async function main() { await run(); }
if (import.meta.main) { void main(); }
