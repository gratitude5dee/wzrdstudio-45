/**
 * Model: WhisperX Transcribe | Slug: fal-ai/whisperx/transcribe | Category: speech-to-text | https://fal.ai/models/fal-ai/whisperx/transcribe
 * Accurate ASR with word-level timestamps and optional diarization alignment.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY. Copy .env.example to .env and set your key.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { audio_url: string; language?: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    audio_url: "https://example.com/sample.mp3",
    language: "en",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/whisperx/transcribe', { input });
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
