import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EvaluationResult, EvaluationRun } from '@/types/arena';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, RadarChart, Bar, Line, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ARENA_MODELS } from '@/lib/arena/test-suites';

interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: EvaluationResult[];
  run: EvaluationRun;
}

export function AnalyticsModal({ open, onOpenChange, results, run }: AnalyticsModalProps) {
  const successfulResults = results.filter(r => r.image_url);
  const modelComparison = prepareModelComparison(successfulResults);
  const criteriaBreakdown = prepareCriteriaBreakdown(successfulResults, modelComparison);
  const performanceData = preparePerformanceData(successfulResults);
  const testComparison = prepareTestComparison(successfulResults);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Evaluation Analytics</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Model Comparison</TabsTrigger>
            <TabsTrigger value="criteria">Criteria Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard 
                title="Average Score" 
                value={(successfulResults.reduce((sum, r) => sum + r.judge_score, 0) / successfulResults.length).toFixed(2)}
                suffix="/10"
              />
              <StatCard 
                title="Best Model" 
                value={ARENA_MODELS[modelComparison[0]?.model]?.name || modelComparison[0]?.model || 'N/A'}
                subtitle={`${modelComparison[0]?.avg_score.toFixed(2)}/10`}
              />
              <StatCard 
                title="Avg Generation Time" 
                value={(successfulResults.reduce((sum, r) => sum + r.generation_time_ms, 0) / successfulResults.length).toFixed(0)}
                suffix="ms"
              />
            </div>
            
            {/* Model Rankings */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Model Rankings</h3>
              {modelComparison.map((model, idx) => (
                <div key={model.model} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-2xl font-bold text-muted-foreground w-8">#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium">{ARENA_MODELS[model.model]?.name || model.model}</p>
                    <p className="text-sm text-muted-foreground">{model.results_count} results</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{model.avg_score.toFixed(2)}/10</p>
                    <p className="text-xs text-muted-foreground">Avg {model.avg_time.toFixed(0)}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Model Comparison Tab */}
          <TabsContent value="models" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Score Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={modelComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="model" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => ARENA_MODELS[value]?.name || value}
                  />
                  <YAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    labelFormatter={(value) => ARENA_MODELS[value]?.name || value}
                  />
                  <Legend />
                  <Bar dataKey="avg_score" fill="hsl(var(--primary))" name="Average Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Speed vs Quality</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={modelComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="model" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => ARENA_MODELS[value]?.name || value}
                  />
                  <YAxis yAxisId="left" domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    labelFormatter={(value) => ARENA_MODELS[value]?.name || value}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avg_score" stroke="hsl(var(--primary))" name="Quality Score" />
                  <Line yAxisId="right" type="monotone" dataKey="avg_time" stroke="hsl(var(--chart-2))" name="Generation Time (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Criteria Analysis Tab */}
          <TabsContent value="criteria" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Criteria Radar Chart</h3>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={criteriaBreakdown}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="criterion" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  {modelComparison.slice(0, 5).map((model, idx) => (
                    <Radar
                      key={model.model}
                      name={ARENA_MODELS[model.model]?.name || model.model}
                      dataKey={model.model}
                      stroke={RADAR_COLORS[idx]}
                      fill={RADAR_COLORS[idx]}
                      fillOpacity={0.2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Criteria Breakdown by Model</h3>
              <div className="space-y-4">
                {modelComparison.map(model => (
                  <div key={model.model} className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">{ARENA_MODELS[model.model]?.name || model.model}</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(model.criteria_avg).map(([criterion, score]) => (
                        <div key={criterion} className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">{criterion.replace(/_/g, ' ')}</p>
                          <p className="text-lg font-bold text-primary">{score.toFixed(1)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Generation Time Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="model" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Bar dataKey="min_time" stackId="a" fill="hsl(var(--chart-1))" name="Min Time" />
                  <Bar dataKey="avg_time" stackId="a" fill="hsl(var(--primary))" name="Avg Time" />
                  <Bar dataKey="max_time" stackId="a" fill="hsl(var(--destructive))" name="Max Time" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Test Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={testComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="test_id" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Bar dataKey="avg_score" fill="hsl(var(--chart-2))" name="Average Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ title, value, suffix, subtitle }: any) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold">
        {value}<span className="text-lg text-muted-foreground">{suffix}</span>
      </p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

function prepareModelComparison(results: EvaluationResult[]) {
  const modelData = new Map();
  
  results.forEach(r => {
    if (!modelData.has(r.model_id)) {
      modelData.set(r.model_id, {
        scores: [],
        times: [],
        criteria: { prompt_adherence: [], anatomical_integrity: [], text_accuracy: [], physics_lighting: [] }
      });
    }
    
    const data = modelData.get(r.model_id);
    data.scores.push(r.judge_score);
    data.times.push(r.generation_time_ms);
    
    Object.entries(r.criteria_breakdown).forEach(([key, val]) => {
      if (data.criteria[key]) {
        data.criteria[key].push(val);
      }
    });
  });
  
  return Array.from(modelData.entries())
    .map(([model, data]) => ({
      model,
      avg_score: data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length,
      avg_time: data.times.reduce((a: number, b: number) => a + b, 0) / data.times.length,
      results_count: data.scores.length,
      criteria_avg: Object.fromEntries(
        Object.entries(data.criteria).map(([key, vals]: [string, any]) => [
          key,
          vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0
        ])
      )
    }))
    .sort((a, b) => b.avg_score - a.avg_score);
}

function prepareCriteriaBreakdown(results: EvaluationResult[], modelData: ReturnType<typeof prepareModelComparison>) {
  const criteria = ['prompt_adherence', 'anatomical_integrity', 'text_accuracy', 'physics_lighting'];
  
  return criteria.map(criterion => {
    const dataPoint: any = { criterion: criterion.replace(/_/g, ' ') };
    modelData.forEach(model => {
      dataPoint[model.model] = model.criteria_avg[criterion] || 0;
    });
    return dataPoint;
  });
}

function preparePerformanceData(results: EvaluationResult[]) {
  const modelData = new Map();
  
  results.forEach(r => {
    if (!modelData.has(r.model_id)) {
      modelData.set(r.model_id, []);
    }
    modelData.get(r.model_id).push(r.generation_time_ms);
  });
  
  return Array.from(modelData.entries()).map(([model, times]) => ({
    model: ARENA_MODELS[model]?.name || model,
    min_time: Math.min(...times),
    avg_time: times.reduce((a: number, b: number) => a + b, 0) / times.length,
    max_time: Math.max(...times)
  }));
}

function prepareTestComparison(results: EvaluationResult[]) {
  const testData = new Map();
  
  results.forEach(r => {
    if (!testData.has(r.test_id)) {
      testData.set(r.test_id, []);
    }
    testData.get(r.test_id).push(r.judge_score);
  });
  
  return Array.from(testData.entries()).map(([test_id, scores]) => ({
    test_id,
    avg_score: scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
    count: scores.length
  }));
}

const RADAR_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-1))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
