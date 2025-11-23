-- Make image_url nullable in evaluation_results to allow storing failed generations
ALTER TABLE evaluation_results
ALTER COLUMN image_url DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN evaluation_results.image_url IS 'URL of generated image, NULL if generation failed';