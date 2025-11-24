/**
 * Model: Luma NeRF (Image-to-3D) | Slug: luma/nerf/image-to-3d | Category: image-to-3d | https://fal.ai/models/luma/nerf/image-to-3d
 * Generate a 3D scene/asset from a set of input images (single or few-shot).
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { image_urls: string[]; subject?: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    image_urls: ["https://example.com/front.jpg", "https://example.com/side.jpg"],
    subject: "toy car",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('luma/nerf/image-to-3d', { input });
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
