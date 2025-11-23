import { SandboxGeneration } from '@/hooks/useSandboxGeneration';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Wand2, Download, Clock, DollarSign, Hash, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SandboxGenerationGridProps {
  generations: SandboxGeneration[];
  isGenerating: boolean;
  progress: number;
}

export default function SandboxGenerationGrid({
  generations,
  isGenerating,
  progress
}: SandboxGenerationGridProps) {
  const handleCopy = async (imageUrl: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast.success('Image URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleDownload = (imageUrl: string, id: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generation-${id}.png`;
    link.click();
    toast.success('Download started');
  };

  if (generations.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No generations yet</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          Select models, enter a prompt, and click Run to start generating images
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isGenerating && (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-300">Generating images...</span>
            <span className="text-sm font-medium text-white">{progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {generations.map(gen => (
          <div
            key={gen.id}
            className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors"
          >
            {/* Image */}
            <div className="relative aspect-square bg-zinc-800">
              <img
                src={gen.image_url}
                alt={gen.prompt}
                className="w-full h-full object-cover"
              />

              {/* Action buttons (show on hover) */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 bg-zinc-900/80 backdrop-blur hover:bg-zinc-800"
                  onClick={() => handleCopy(gen.image_url)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 bg-zinc-900/80 backdrop-blur hover:bg-zinc-800"
                  disabled
                >
                  <Wand2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 bg-zinc-900/80 backdrop-blur hover:bg-zinc-800"
                  onClick={() => handleDownload(gen.image_url, gen.id)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="p-3 space-y-2">
              <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                {gen.model_name}
              </Badge>

              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1" title={gen.id}>
                  <Hash className="w-3 h-3" />
                  {gen.id.slice(0, 8)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {(gen.generation_time_ms / 1000).toFixed(1)}s
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {gen.cost.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
