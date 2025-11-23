import { EvaluationTest, EvaluationVector } from '@/types/arena';

export const WZRD_TEST_SUITE: EvaluationTest[] = [
  {
    id: 'test-1-anchor',
    vector: 'consistency',
    name: 'The Anchor Character',
    description: 'Establishes consistent character identity across generations',
    prompt: 'A photorealistic medium-shot portrait of a 35-year-old South Asian woman with long straight black hair, warm brown eyes, olive skin, wearing a simple white button-up shirt. She has a small scar above her left eyebrow. Soft natural lighting, neutral gray background, direct eye contact with camera.',
    expected_attributes: ['scar location', 'eye color', 'skin tone', 'facial features'],
    mode: 'text-to-image'
  },
  {
    id: 'test-2-pose-stress',
    vector: 'consistency',
    name: 'Pose Stress Test',
    description: 'Maintains identity while changing pose dramatically',
    prompt: 'The same woman, now dancing energetically in a sunlit park, arms raised above her head mid-spin, hair flowing, wearing casual jeans and t-shirt. Motion blur on the background but sharp focus on her face, showing the same scar and features.',
    expected_attributes: ['identity consistency', 'motion handling', 'anatomical accuracy'],
    mode: 'text-to-image'
  },
  {
    id: 'test-3-multi-subject',
    vector: 'consistency',
    name: 'Multi-Subject Consistency',
    description: 'Maintains both subjects accurately in interaction',
    prompt: 'The woman having coffee with a tall Black man at an outdoor café. Both subjects clearly visible, engaged in conversation.',
    expected_attributes: ['dual character consistency', 'interaction realism', 'spatial reasoning'],
    mode: 'text-to-image'
  },
  {
    id: 'test-4-macro-detail',
    vector: 'detail',
    name: 'Macro Detail Test',
    description: 'Extreme close-up revealing fine details',
    prompt: 'Extreme close-up of a human eye, showing individual eyelashes, iris texture with visible limbal ring, subtle veins in the sclera, and a perfect reflection of a window in the pupil. Photorealistic 8K macro photography.',
    expected_attributes: ['texture fidelity', 'micro-detail', 'optical accuracy'],
    mode: 'text-to-image'
  },
  {
    id: 'test-5-complex-materials',
    vector: 'detail',
    name: 'Material Complexity',
    description: 'Multiple challenging materials in one scene',
    prompt: 'A still life on a mahogany table: a crystal wine glass half-filled with red wine, condensation droplets on the glass, a polished silver fork, a silk napkin with embroidered patterns, and a slice of chocolate cake with visible layers and glossy ganache.',
    expected_attributes: ['material rendering', 'lighting interaction', 'subsurface scattering'],
    mode: 'text-to-image'
  }
];

export const VECTOR_INFO = {
  consistency: {
    name: 'Cross-Image Consistency',
    description: 'Evaluates ability to maintain subject identity, features, and style across multiple generations',
    color: 'hsl(var(--success))'
  },
  detail: {
    name: 'Photorealistic Detail',
    description: 'Tests rendering quality, material accuracy, and fine detail reproduction at high resolution',
    color: 'hsl(var(--primary))'
  },
  text: {
    name: 'Text Rendering',
    description: 'Assesses accurate text generation, typography, and integration within images',
    color: 'hsl(var(--warning))'
  },
  synthesis: {
    name: 'Conceptual Synthesis',
    description: 'Measures understanding of abstract concepts and ability to create cohesive surreal imagery',
    color: 'hsl(var(--accent))'
  }
};

export const ARENA_MODELS: Record<string, { id: string; name: string; category: string; isBeta?: boolean; isAlpha?: boolean; isFree?: boolean }> = {
  'fal-ai/alpha-image-232/text-to-image': { id: 'fal-ai/alpha-image-232/text-to-image', name: 'Alpha-232 T2I (Internal)', category: 'text-to-image', isAlpha: true, isFree: true },
  'fal-ai/alpha-image-232/edit-image': { id: 'fal-ai/alpha-image-232/edit-image', name: 'Alpha-232 Edit (Internal)', category: 'image-editing', isAlpha: true, isFree: true },
  'fal-ai/beta-image-232': { id: 'fal-ai/beta-image-232', name: 'Beta-232 T2I (Internal)', category: 'text-to-image', isBeta: true, isFree: true },
  'fal-ai/beta-image-232/edit': { id: 'fal-ai/beta-image-232/edit', name: 'Beta-232 Edit (Internal)', category: 'image-editing', isBeta: true, isFree: true },
  'fal-ai/reve': { id: 'fal-ai/reve', name: 'Reve', category: 'text-to-image' },
  'fal-ai/hidream-i1-fast': { id: 'fal-ai/hidream-i1-fast', name: 'Hidream I1 Fast', category: 'text-to-image' },
  'fal-ai/hidream-i1-dev': { id: 'fal-ai/hidream-i1-dev', name: 'Hidream I1 Dev', category: 'text-to-image' },
  'fal-ai/nano-banana-pro': { id: 'fal-ai/nano-banana-pro', name: 'Nano Banana Pro', category: 'text-to-image' },
  'fal-ai/bytedance/seedream/v4/text-to-image': { id: 'fal-ai/bytedance/seedream/v4/text-to-image', name: 'SeeDream V4', category: 'text-to-image' },
  'fal-ai/hunyuan-image/v3/text-to-image': { id: 'fal-ai/hunyuan-image/v3/text-to-image', name: 'Hunyuan Image V3', category: 'text-to-image' },
  'fal-ai/ideogram/v3': { id: 'fal-ai/ideogram/v3', name: 'Ideogram V3', category: 'text-to-image' },
  'fal-ai/minimax/image-01': { id: 'fal-ai/minimax/image-01', name: 'MiniMax Image-01', category: 'text-to-image' }
};
