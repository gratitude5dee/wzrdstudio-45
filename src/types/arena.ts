export type EvaluationVector = 'consistency' | 'detail' | 'text' | 'synthesis';

export interface EvaluationTest {
  id: string;
  vector: EvaluationVector;
  name: string;
  description: string;
  prompt: string;
  reference_context?: string;
  expected_attributes: string[];
  mode: 'text-to-image' | 'image-edit';
}

export interface CriteriaScore {
  prompt_adherence: number;
  anatomical_integrity: number;
  text_accuracy: number;
  identity_consistency?: number;
  physics_lighting: number;
}

export interface ModelScore {
  model_id: string;
  overall_score: number;
  confidence: 'High' | 'Medium' | 'Low';
  criteria: CriteriaScore;
  reasoning: string;
  rank: number;
}

export interface EvaluationResult {
  id: string;
  run_id: string;
  test_id: string;
  model_id: string;
  image_url: string;
  generation_time_ms: number;
  judge_score: number;
  judge_reasoning: string;
  judge_confidence: 'High' | 'Medium' | 'Low';
  criteria_breakdown: CriteriaScore;
  created_at: string;
}

export interface EvaluationRun {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  mode: 'text-to-image' | 'image-edit';
  models: string[];
  tests: string[];
  parameters: {
    seed?: number;
    resolution: string;
    guidance_scale: number;
    steps: number;
  };
  progress: number;
  total_generations: number;
  metadata?: any;
}

export interface LeaderboardEntry {
  model_id: string;
  model_name: string;
  avg_score: number;
  tests_won: number;
  total_tests: number;
  rank: number;
}

export interface ArenaModel {
  id: string;
  name: string;
  category: 'text-to-image' | 'image-edit';
  description?: string;
}
