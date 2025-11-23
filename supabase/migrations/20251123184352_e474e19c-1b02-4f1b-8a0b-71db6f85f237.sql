-- Add detailed_reasoning and generation_error columns to evaluation_results
ALTER TABLE evaluation_results 
ADD COLUMN IF NOT EXISTS detailed_reasoning jsonb,
ADD COLUMN IF NOT EXISTS generation_error text;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_evaluation_results_run_model 
ON evaluation_results(run_id, model_id);

CREATE INDEX IF NOT EXISTS idx_evaluation_results_score 
ON evaluation_results(judge_score DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_evaluation_results_test 
ON evaluation_results(test_id);

-- Add comment for documentation
COMMENT ON COLUMN evaluation_results.detailed_reasoning IS 'Structured reasoning breakdown from VLM judge for each evaluation criterion';
COMMENT ON COLUMN evaluation_results.generation_error IS 'Error message if image generation failed for this result';