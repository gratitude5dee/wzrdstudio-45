/**
 * Model: ThreeStudio DreamFusion | Slug: threestudio/dreamfusion | Category: text-to-3d | https://fal.ai/models/threestudio/dreamfusion
 * Score distillation sampling to optimize a NeRF from a text prompt (reference implementation).
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; iters?: number; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "a stylized bonsai tree on a pedestal",
    iters: 500,
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('threestudio/dreamfusion', { input });
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
