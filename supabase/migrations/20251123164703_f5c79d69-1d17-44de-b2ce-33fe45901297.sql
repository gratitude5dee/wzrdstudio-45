-- Create evaluation_runs table to track batch evaluations
CREATE TABLE IF NOT EXISTS evaluation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  mode TEXT NOT NULL CHECK (mode IN ('text-to-image', 'image-edit')) DEFAULT 'text-to-image',
  models TEXT[] NOT NULL,
  tests TEXT[] NOT NULL,
  parameters JSONB DEFAULT '{}'::jsonb,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_generations INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create evaluation_results table to store individual test results
CREATE TABLE IF NOT EXISTS evaluation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES evaluation_runs(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  generation_time_ms INTEGER,
  judge_score INTEGER CHECK (judge_score >= 1 AND judge_score <= 10),
  judge_reasoning TEXT,
  judge_confidence TEXT CHECK (judge_confidence IN ('High', 'Medium', 'Low')),
  criteria_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(run_id, test_id, model_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_evaluation_runs_user_id ON evaluation_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_runs_status ON evaluation_runs(status);
CREATE INDEX IF NOT EXISTS idx_evaluation_results_run_id ON evaluation_results(run_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_results_model_id ON evaluation_results(model_id);

-- Enable RLS
ALTER TABLE evaluation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for evaluation_runs
CREATE POLICY "Users can view own evaluation runs" 
  ON evaluation_runs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluation runs" 
  ON evaluation_runs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluation runs" 
  ON evaluation_runs FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for evaluation_results
CREATE POLICY "Users can view own evaluation results" 
  ON evaluation_results FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM evaluation_runs 
      WHERE id = evaluation_results.run_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert evaluation results" 
  ON evaluation_results FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM evaluation_runs 
      WHERE id = evaluation_results.run_id 
      AND user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_evaluation_run_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_evaluation_runs_timestamp
  BEFORE UPDATE ON evaluation_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_evaluation_run_timestamp();