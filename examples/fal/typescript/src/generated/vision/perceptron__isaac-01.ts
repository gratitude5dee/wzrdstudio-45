/**
 * Model: Isaac 01 | Slug: perceptron/isaac-01 | Category: vision | https://fal.ai/models/perceptron/isaac-01
 * Multimodal vision-language model for general visual reasoning tasks.
 */
import 'dotenv/config';
import { fal } from '@fal-ai/client';

if (!process.env.FAL_KEY) {
  throw new Error('Missing FAL_KEY. Copy .env.example to .env and set your key.');
}
fal.config({ credentials: process.env.FAL_KEY! });

interface Input { prompt: string; }
type Output = unknown;

export async function run(customInput?: Partial<Input>) {
  const input: Input = {
    prompt: "Hello world",
    ...customInput
  } as Input;

  try {
    const result: { data: Output } = await fal.subscribe('perceptron/isaac-01', { input });
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
