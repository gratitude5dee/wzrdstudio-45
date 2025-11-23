import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EvaluationResult } from '@/types/arena';
import { AlertCircle } from 'lucide-react';

interface ResultCardProps {
  result: EvaluationResult;
  index: number;
  expanded: boolean;
  onExpand: () => void;
}

export function ResultCard({ result, index, expanded, onExpand }: ResultCardProps) {
  // Failed generation card
  if (result.generation_error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <GlassCard variant="void" className="border-destructive/30">
          <GlassCardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <Badge className="bg-destructive/20 text-destructive border-destructive/30 mb-2">Failed</Badge>
                <p className="text-sm text-foreground font-medium mb-1">{result.model_id}</p>
                <p className="text-xs text-destructive/80">{result.generation_error}</p>
                <p className="text-xs text-muted-foreground mt-2">Test: {result.test_id}</p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    );
  }

  // Successful generation card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard
        variant="stellar"
        depth="medium"
        glow="subtle"
        className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
        onClick={onExpand}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <img
            src={result.image_url}
            alt={result.test_id}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
          {!expanded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="text-left">
                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Click to expand</div>
                <div className="text-sm text-white line-clamp-2">{result.judge_reasoning}</div>
              </div>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <GlassCardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">
              {result.model_id.split('/').pop()}
            </Badge>
            <div className="text-xs text-muted-foreground font-mono">
              {result.generation_time_ms}ms
            </div>
          </div>

          <div className="text-sm text-foreground font-medium">{result.test_id}</div>

          {/* Criteria Breakdown Preview */}
          {result.criteria_breakdown && (
            <div className="flex gap-1 pt-2">
              {Object.entries(result.criteria_breakdown).map(([key, value]) => (
                <div
                  key={key}
                  className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"
                  title={`${key}: ${value}/10`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/80"
                    style={{ width: `${(value as number / 10) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          )}
        </GlassCardContent>

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3 border-t border-border bg-muted/30">
                {/* Criteria Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Criteria Breakdown</h4>
                  {Object.entries(result.criteria_breakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-32 capitalize">{key.replace(/_/g, ' ')}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/80"
                          style={{ width: `${(value as number / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-foreground w-8 text-right font-mono">{value}/10</span>
                    </div>
                  ))}
                </div>
                
                {/* Detailed Reasoning */}
                {result.detailed_reasoning && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase">Judge Analysis</h4>
                    {Object.entries(result.detailed_reasoning).map(([key, text]) => (
                      <div key={key} className="text-xs">
                        <span className="text-muted-foreground font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                        <p className="text-foreground/80 mt-1">{text}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>{result.model_id}</span>
                  <span>{result.generation_time_ms}ms</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
