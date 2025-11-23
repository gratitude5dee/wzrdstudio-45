import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { PortalHeader } from '@/components/ui/portal-header';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useArenaEvaluation } from '@/hooks/useArenaEvaluation';
import { WZRD_TEST_SUITE, ARENA_MODELS } from '@/lib/arena/test-suites';
import { Loader2, Image, Layers, Compass, Hash, Trophy, Download, RefreshCw, BarChart, Rocket, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

  const hasResults = results && results.length > 0;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <PortalHeader
        title="Model Evaluation Arena"
        subtitle="Compare frontier image generation models with VLM-powered judging"
        cosmic={true}
        actions={
          <GlassButton variant="stellar" size="sm">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </GlassButton>
        }
      />

      {!hasResults ? (
        <>
          {/* Step 1: Model Selection */}
          <GlassCard variant="cosmic" depth="deep" glow="medium" particle shimmer>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <GlassCardTitle className="text-2xl glow-text-cosmic flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-stellar to-cosmic-temporal flex items-center justify-center font-display text-xl">
                    1
                  </div>
                  Select Models
                </GlassCardTitle>
                <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.4)] px-4 py-1.5 text-sm">
                  {selectedModels.length} selected
                </Badge>
              </div>
            </GlassCardHeader>

            <GlassCardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.values(ARENA_MODELS).map(model => (
                  <motion.div
                    key={model.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GlassCard
                      variant={selectedModels.includes(model.id) ? "stellar" : "void"}
                      depth="shallow"
                      glow={selectedModels.includes(model.id) ? "medium" : "none"}
                      interactive="none"
                      className={cn(
                        "cursor-pointer transition-all duration-300",
                        selectedModels.includes(model.id) && 
                        "ring-2 ring-cosmic-stellar shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                      )}
                      onClick={() => toggleModel(model.id)}
                    >
                      <GlassCardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Checkbox 
                            checked={selectedModels.includes(model.id)}
                            className="data-[state=checked]:bg-cosmic-stellar data-[state=checked]:border-cosmic-stellar pointer-events-none"
                          />
                          {model.isBeta && (
                            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
                              BETA
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-white">{model.name}</div>
                          <div className="text-xs text-zinc-400 font-mono">{model.id}</div>
                        </div>

                        {selectedModels.includes(model.id) && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cosmic-stellar animate-pulse" />
                        )}
                      </GlassCardContent>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Step 2: Test Selection */}
          <GlassCard variant="nebula" depth="deep" glow="medium" shimmer>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <GlassCardTitle className="text-2xl glow-text-primary flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-nebula to-cosmic-plasma flex items-center justify-center font-display text-xl">
                    2
                  </div>
                  Select Tests
                </GlassCardTitle>
                <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.4)] px-4 py-1.5 text-sm">
                  {selectedTests.length}/{WZRD_TEST_SUITE.length} selected
                </Badge>
              </div>
            </GlassCardHeader>

            <GlassCardContent>
              <Accordion type="multiple" defaultValue={['consistency', 'detail']}>
                {Object.entries(
                  WZRD_TEST_SUITE.reduce((acc, test) => {
                    if (!acc[test.vector]) acc[test.vector] = [];
                    acc[test.vector].push(test);
                    return acc;
                  }, {} as Record<string, typeof WZRD_TEST_SUITE>)
                ).map(([vector, tests]) => (
                  <AccordionItem key={vector} value={vector} className="border-zinc-800/50">
                    <AccordionTrigger className="hover:bg-zinc-800/30 px-4 rounded-lg hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                          vector === 'consistency' && "bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-400/30",
                          vector === 'detail' && "bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-300 border border-green-400/30",
                          vector === 'text' && "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 text-yellow-300 border border-yellow-400/30",
                          vector === 'synthesis' && "bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30"
                        )}>
                          {vector.charAt(0).toUpperCase()}
                        </div>

                        <div className="text-left">
                          <div className="font-semibold text-white capitalize">{vector}</div>
                          <div className="text-xs text-zinc-400">{tests.length} tests</div>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-3 pb-4 px-4">
                      <div className="space-y-2">
                        {tests.map(test => (
                          <Label
                            key={test.id}
                            htmlFor={test.id}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                              "hover:bg-zinc-800/40 group",
                              selectedTests.includes(test.id) && "bg-zinc-800/50 ring-1 ring-purple-500/30"
                            )}
                          >
                            <Checkbox
                              id={test.id}
                              checked={selectedTests.includes(test.id)}
                              onCheckedChange={() => toggleTest(test.id)}
                              className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />

                            <div className="flex-1">
                              <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                                {test.name}
                              </div>
                              <div className="text-xs text-zinc-400 mt-1">{test.description}</div>
                            </div>

                            {selectedTests.includes(test.id) && (
                              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            )}
                          </Label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlassCardContent>
          </GlassCard>

          {/* Step 3: Parameters */}
          <GlassCard variant="quantum" depth="medium" glow="subtle" particle>
            <GlassCardHeader>
              <GlassCardTitle className="text-2xl glow-text-primary flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-quantum to-cosmic-plasma flex items-center justify-center font-display text-xl">
                  3
                </div>
                Configure Parameters
              </GlassCardTitle>
            </GlassCardHeader>

            <GlassCardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Resolution */}
                <div className="space-y-3">
                  <Label className="text-sm text-zinc-300 font-semibold flex items-center gap-2">
                    <Image className="w-4 h-4 text-purple-400" />
                    Resolution
                  </Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-colors h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700/50">
                      <SelectItem value="1024x1024">1024×1024 (Square)</SelectItem>
                      <SelectItem value="1536x1024">1536×1024 (Landscape)</SelectItem>
                      <SelectItem value="1024x1536">1024×1536 (Portrait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <Label className="text-sm text-zinc-300 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-green-400" />
                      Inference Steps
                    </span>
                    <Badge className="bg-green-500/20 text-green-300 border border-green-400/30 text-xs">
                      {steps}
                    </Badge>
                  </Label>
                  <Slider
                    value={[steps]}
                    onValueChange={([v]) => setSteps(v)}
                    min={1}
                    max={50}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Fast (1)</span>
                    <span>Quality (50)</span>
                  </div>
                </div>

                {/* Guidance */}
                <div className="space-y-3">
                  <Label className="text-sm text-zinc-300 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-blue-400" />
                      Guidance Scale
                    </span>
                    <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
                      {guidanceScale.toFixed(1)}
                    </Badge>
                  </Label>
                  <Slider
                    value={[guidanceScale]}
                    onValueChange={([v]) => setGuidanceScale(v)}
                    min={1}
                    max={20}
                    step={0.5}
                    className="py-4"
                  />
                </div>

                {/* Seed */}
                <div className="space-y-3">
                  <Label className="text-sm text-zinc-300 font-semibold flex items-center gap-2">
                    <Hash className="w-4 h-4 text-yellow-400" />
                    Seed (Optional)
                  </Label>
                  <Input
                    type="number"
                    value={seed || ''}
                    onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Random"
                    className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-sm h-12 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Command Center */}
          <GlassCard variant="stellar" depth="deep" glow="intense" shimmer particle>
            <GlassCardContent className="p-8">
              <div className="flex items-center justify-between gap-8">
                {/* Metrics Dashboard */}
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Est. Time
                    </div>
                    <div className="text-2xl font-bold text-white font-display">
                      ~{estimatedTime}m
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-3 h-3" />
                      Est. Cost
                    </div>
                    <div className="text-2xl font-bold text-cosmic-stellar font-display">
                      ${estimatedCost.toFixed(2)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      Total Runs
                    </div>
                    <div className="text-2xl font-bold text-purple-400 font-display">
                      {selectedModels.length * selectedTests.length}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {selectedModels.length} models × {selectedTests.length} tests
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <GlassButton
                  variant="cosmic"
                  size="xl"
                  glow="intense"
                  onClick={handleRunEvaluation}
                  disabled={isRunning || selectedModels.length === 0 || selectedTests.length === 0}
                  className={cn(
                    "px-12 h-16 text-lg font-bold relative overflow-hidden group",
                    "shadow-[0_0_30px_rgba(168,85,247,0.5)]",
                    isRunning && "animate-pulse"
                  )}
                  particle
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="font-display">RUNNING... {progress}%</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-6 h-6 group-hover:translate-y-[-4px] transition-transform" />
                      <span className="font-display">INITIATE EVALUATION</span>
                    </>
                  )}
                </GlassButton>
              </div>

              {/* Progress Bar */}
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 space-y-3"
                >
                  <div className="relative h-2 bg-zinc-900/50 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="text-xs text-zinc-400 text-center font-mono">
                    Processing generation {Math.floor(progress / 100 * (selectedModels.length * selectedTests.length))} 
                    of {selectedModels.length * selectedTests.length}
                  </div>
                </motion.div>
              )}
            </GlassCardContent>
          </GlassCard>
        </>
      ) : (
        <GlassCard variant="void" depth="deep" className="p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Success Header */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cosmic-stellar to-cosmic-temporal flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.4)]"
              >
                <Trophy className="w-12 h-12 text-cosmic-void" />
              </motion.div>

              <h2 className="text-4xl font-bold text-white mt-6 font-display glow-text-cosmic">
                EVALUATION COMPLETE
              </h2>

              <p className="text-lg text-zinc-400 mt-3">
                Generated and judged <span className="text-purple-400 font-semibold">{results.length}</span> images 
                across <span className="text-purple-400 font-semibold">{selectedTests.length}</span> test vectors
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <GlassButton variant="stellar" size="lg" onClick={resetResults}>
                <RefreshCw className="w-5 h-5" />
                New Evaluation
              </GlassButton>

              <GlassButton variant="outline" size="lg">
                <Download className="w-5 h-5" />
                Export Results
              </GlassButton>

              <GlassButton variant="cosmic" size="lg">
                <BarChart className="w-5 h-5" />
                View Analytics
              </GlassButton>
            </div>

            {/* Results Gallery */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {results.slice(0, 9).map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    variant="stellar"
                    depth="medium"
                    glow="subtle"
                    className="group cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <img
                        src={result.image_url}
                        alt={result.test_id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Score Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={cn(
                            "text-lg font-bold px-3 py-1.5",
                            result.judge_score >= 8 
                              ? "bg-green-500/90 text-white border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                              : result.judge_score >= 6
                              ? "bg-yellow-500/90 text-white border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.6)]"
                              : "bg-red-500/90 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                          )}
                        >
                          {result.judge_score}/10
                        </Badge>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-left">
                          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Judge Reasoning</div>
                          <div className="text-sm text-white line-clamp-2">{result.judge_reasoning}</div>
                        </div>
                      </div>
                    </div>

                    <GlassCardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs">
                          {result.model_id.split('/').pop()}
                        </Badge>
                        <div className="text-xs text-zinc-500 font-mono">
                          {result.generation_time_ms}ms
                        </div>
                      </div>

                      <div className="text-sm text-zinc-300 font-medium">{result.test_id}</div>

                      {/* Criteria Breakdown */}
                      {result.criteria_breakdown && (
                        <div className="flex gap-1 pt-2">
                          {Object.entries(result.criteria_breakdown).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden"
                              title={`${key}: ${value}/10`}
                            >
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                                style={{ width: `${(value as number / 10) * 100}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </GlassCard>
      )}
    </div>
  );
}
