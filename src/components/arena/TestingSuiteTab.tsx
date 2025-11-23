import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Download } from 'lucide-react';
import { useArenaEvaluation } from '@/hooks/useArenaEvaluation';
import { toast } from 'sonner';
import { WZRD_TEST_SUITE, ARENA_MODELS } from '@/lib/arena/test-suites';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function TestingSuiteTab() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [resolution, setResolution] = useState('1024x1024');
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(3.5);
  const [seed, setSeed] = useState<number | undefined>(undefined);

  const { runEvaluation, results, isRunning, progress, resetResults } = useArenaEvaluation();

  const handleRunEvaluation = async () => {
    if (selectedModels.length === 0 || selectedTests.length === 0) {
      toast.error('Please select at least one model and one test');
      return;
    }

    await runEvaluation({
      model_ids: selectedModels,
      test_ids: selectedTests,
      mode: 'text-to-image',
      parameters: {
        resolution,
        steps,
        guidance_scale: guidanceScale,
        seed
      }
    });
  };

  const estimatedCost = selectedModels.length * selectedTests.length * 0.08;
  const estimatedTime = Math.ceil(selectedModels.length * selectedTests.length * 10 / 60);

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const toggleTest = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const vectorTests = {
    consistency: WZRD_TEST_SUITE.filter(t => t.vector === 'consistency'),
    detail: WZRD_TEST_SUITE.filter(t => t.vector === 'detail'),
    text: WZRD_TEST_SUITE.filter(t => t.vector === 'text'),
    synthesis: WZRD_TEST_SUITE.filter(t => t.vector === 'synthesis')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Model Evaluation Arena
          </h2>
          <p className="text-muted-foreground mt-1">
            Compare frontier image generation models with VLM-powered judging
          </p>
        </div>
      </div>

      {!results ? (
        <div className="space-y-6">
          {/* Model Selection */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center justify-between">
              Step 1: Select Models
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                {selectedModels.length} selected
              </Badge>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.values(ARENA_MODELS).map(model => (
                <div key={model.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={model.id}
                    checked={selectedModels.includes(model.id)}
                    onCheckedChange={() => toggleModel(model.id)}
                  />
                  <Label htmlFor={model.id} className="cursor-pointer flex items-center gap-2 text-zinc-200">
                    {model.name}
                    {model.isBeta && (
                      <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">BETA</Badge>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Test Selection */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center justify-between">
              Step 2: Select Tests
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                {selectedTests.length}/9 selected
              </Badge>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(vectorTests).map(([vector, tests]) => (
                <div key={vector} className="space-y-3">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-primary">
                    Vector {vector.charAt(0).toUpperCase()}: {vector}
                  </h4>
                  {tests.map(test => (
                    <div key={test.id} className="flex items-start space-x-2 ml-2">
                      <Checkbox
                        id={test.id}
                        checked={selectedTests.includes(test.id)}
                        onCheckedChange={() => toggleTest(test.id)}
                      />
                      <Label htmlFor={test.id} className="cursor-pointer">
                        <div className="font-medium text-zinc-200">{test.name}</div>
                        <div className="text-xs text-zinc-400">{test.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Step 3: Parameters</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Resolution</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024x1024">1024x1024</SelectItem>
                    <SelectItem value="896x1152">896x1152</SelectItem>
                    <SelectItem value="1152x896">1152x896</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Steps</Label>
                <Input 
                  type="number" 
                  value={steps} 
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  min={1}
                  max={50}
                  className="bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Guidance Scale</Label>
                <Input 
                  type="number" 
                  value={guidanceScale} 
                  onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                  min={1}
                  max={20}
                  step={0.1}
                  className="bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Seed (optional)</Label>
                <Input 
                  type="number" 
                  value={seed || ''} 
                  onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Random"
                  className="bg-zinc-800/50 border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Run Button */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400 space-y-1">
                <div>Estimated time: ~{estimatedTime} minutes</div>
                <div>Estimated cost: ${estimatedCost.toFixed(2)}</div>
                <div className="text-xs">
                  {selectedModels.length} models × {selectedTests.length} tests = {selectedModels.length * selectedTests.length} generations
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={handleRunEvaluation}
                disabled={isRunning || selectedModels.length === 0 || selectedTests.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                {isRunning ? `Running... ${progress}%` : '🚀 Run Evaluation'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-8">
          <div className="text-center space-y-4">
            <Trophy className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold text-white">Evaluation Complete!</h2>
            <p className="text-zinc-400">
              Generated and judged {results.length} images across {selectedTests.length} tests
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetResults}>
                Run New Evaluation
              </Button>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
            
            {/* Simple results preview */}
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-white">Results Preview</h3>
              <div className="grid gap-4">
                {results.slice(0, 5).map(result => (
                  <div key={result.id} className="border border-zinc-800 rounded-lg p-4 text-left bg-zinc-900/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-zinc-200">{result.model_id}</div>
                        <div className="text-sm text-zinc-400">{result.test_id}</div>
                      </div>
                      <Badge variant={result.judge_score >= 8 ? 'default' : result.judge_score >= 6 ? 'secondary' : 'destructive'}>
                        {result.judge_score}/10
                      </Badge>
                    </div>
                    <img src={result.image_url} alt="Generated" className="mt-3 rounded-md w-full max-h-48 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
