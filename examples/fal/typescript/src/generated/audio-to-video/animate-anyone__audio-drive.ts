/**
 * Model: Animate Anyone (Audio-driven) | Slug: animate-anyone/audio-drive | Category: audio-to-video | https://fal.ai/models/animate-anyone/audio-drive
 * Animate a reference character or person to match an input speech track.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { ref_image_url: string; audio_url: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    ref_image_url: "https://example.com/character.png",
    audio_url: "https://example.com/dialogue.wav",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('animate-anyone/audio-drive', { input });
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
