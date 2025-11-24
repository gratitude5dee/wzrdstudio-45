/**
 * Model: SadTalker (Audio-driven talking head) | Slug: sadtalker/talking-head | Category: audio-to-video | https://fal.ai/models/sadtalker/talking-head
 * Drive a portrait photo with speech audio; outputs a synchronized talking head clip.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { image_url: string; audio_url: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    image_url: "https://example.com/face.jpg",
    audio_url: "https://example.com/voice.wav",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('sadtalker/talking-head', { input });
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
