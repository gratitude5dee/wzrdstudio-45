/**
 * Model: Wav2Lip (Lip Sync) | Slug: wav2lip/lip-sync | Category: audio-to-video | https://fal.ai/models/wav2lip/lip-sync
 * High-quality lip synchronization of a face video to a given speech track.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { video_url: string; audio_url: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    video_url: "https://example.com/face.mp4",
    audio_url: "https://example.com/line.wav",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('wav2lip/lip-sync', { input });
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
