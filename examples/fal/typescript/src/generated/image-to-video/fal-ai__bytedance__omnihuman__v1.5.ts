/**
 * Model: Bytedance OmniHuman v1.5 | Slug: fal-ai/bytedance/omnihuman/v1.5 | Category: image-to-video | https://fal.ai/models/fal-ai/bytedance/omnihuman/v1.5
 * Generate subject consistent videos using Lynx from ByteDance!
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; image_url: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "The white dragon w...mination",
    image_url: "https://example.com/input.jpg"
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/bytedance/omnihuman/v1.5', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}
async function main() { await run(); }
if (import.meta.main) { void main(); }
