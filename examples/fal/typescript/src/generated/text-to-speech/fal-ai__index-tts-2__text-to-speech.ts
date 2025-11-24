/**
 * Model: Index TTS 2.0 | Slug: fal-ai/index-tts-2/text-to-speech | Category: text-to-speech | https://fal.ai/models/fal-ai/index-tts-2/text-to-speech
 *
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = { prompt: "Hello world" } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/index-tts-2/text-to-speech', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}
async function main() { await run(); }
if (import.meta.main) { void main(); }
