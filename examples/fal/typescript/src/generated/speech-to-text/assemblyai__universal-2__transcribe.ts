/**
 * Model: AssemblyAI Universal-2 Transcribe | Slug: assemblyai/universal-2/transcribe | Category: speech-to-text | https://fal.ai/models/assemblyai/universal-2/transcribe
 * High quality multi-domain ASR with punctuation and paragraphing.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) { throw new Error('Missing FAL_KEY.'); }
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { audio_url: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    audio_url: "https://example.com/webinar.mp3",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('assemblyai/universal-2/transcribe', { input });
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
