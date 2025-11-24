/**
 * Model: TripoSR Text-to-3D | Slug: tripo-ai/tripoSR/text-to-3d | Category: text-to-3d | https://fal.ai/models/tripo-ai/tripoSR/text-to-3d
 * Generate coarse meshes from text prompts using single-view priors (fast preview quality).
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; steps?: number; seed?: number; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "a cute low-poly robot with antennae",
    steps: 30,
    seed: 42,
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('tripo-ai/tripoSR/text-to-3d', { input });
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
