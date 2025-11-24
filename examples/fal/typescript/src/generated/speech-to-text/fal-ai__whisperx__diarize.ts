/**
 * Model: WhisperX Diarize | Slug: fal-ai/whisperx/diarize | Category: speech-to-text | https://fal.ai/models/fal-ai/whisperx/diarize
 * Transcription with speaker diarization (who-spoke-when).
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { audio_url: string; language?: string; speakers?: number; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    audio_url: "https://example.com/meeting.wav",
    language: "en",
    speakers: 2,
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('fal-ai/whisperx/diarize', { input });
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
