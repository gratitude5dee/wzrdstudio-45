/**
 * Model: ElevenLabs TTS Turbo v2.5 | Slug: fal-ai/elevenlabs/tts/turbo-v2.5 | Category: text-to-speech | https://fal.ai/models/fal-ai/elevenlabs/tts/turbo-v2.5
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
    const result: { data: Output } = await fal.subscribe('fal-ai/elevenlabs/tts/turbo-v2.5', { input });
    console.log(result.data); return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FAL example failed:', message); throw err;
  }
}
async function main() { await run(); }
if (import.meta.main) { void main(); }
