import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Video, Sparkles } from 'lucide-react';
import { ARENA_MODELS } from '@/lib/arena/test-suites';

interface SandboxControlPanelProps {
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  onRun: () => void;
  isGenerating: boolean;
  generationCount: number;
  onClear: () => void;
}

const ASPECT_RATIOS = [
  { value: '1024x1024', label: '1:1' },
  { value: '1152x896', label: '4:3' },
  { value: '896x1152', label: '3:4' },
  { value: '1344x768', label: '16:9' },
  { value: '768x1344', label: '9:16' }
];

export default function SandboxControlPanel({
  selectedModels,
  onModelsChange,
  prompt,
  onPromptChange,
  aspectRatio,
  onAspectRatioChange,
  onRun,
  isGenerating,
  generationCount,
  onClear
}: SandboxControlPanelProps) {
  const [type, setType] = useState<'image' | 'video'>('image');

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelsChange(selectedModels.filter(id => id !== modelId));
    } else {
      onModelsChange([...selectedModels, modelId]);
    }
  };

  const estimatedCost = selectedModels.length * 0.08;

  return (
    <div className="w-80 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4 overflow-y-auto space-y-6">
      {/* Type Toggle */}
      <div className="flex gap-2">
        <Button
          variant={type === 'image' ? 'default' : 'ghost'}
          className={`flex-1 ${type === 'image' ? 'bg-purple-600 hover:bg-purple-700' : 'text-zinc-400'}`}
          onClick={() => setType('image')}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Image
        </Button>
        <Button
          variant={type === 'video' ? 'default' : 'ghost'}
          className={`flex-1 ${type === 'video' ? 'bg-purple-600 hover:bg-purple-700' : 'text-zinc-400'}`}
          onClick={() => setType('video')}
          disabled
        >
          <Video className="w-4 h-4 mr-2" />
          Video
        </Button>
      </div>

      {/* Generation Counter */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{generationCount} generations</span>
        {generationCount > 0 && (
          <Button
            variant="link"
            className="text-xs text-zinc-500 hover:text-zinc-300 h-auto p-0"
            onClick={onClear}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label className="text-sm text-zinc-300 font-medium">Models</Label>
        <div className="space-y-2">
          {Object.values(ARENA_MODELS).slice(0, 6).map(model => (
            <label
              key={model.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedModels.includes(model.id)}
                onCheckedChange={() => toggleModel(model.id)}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{model.name}</div>
                <div className="text-xs text-zinc-500 truncate">{model.id}</div>
              </div>
              {model.isAlpha && (
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs shrink-0">
                  ALPHA
                </Badge>
              )}
              {model.isBeta && !model.isAlpha && (
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs shrink-0">
                  BETA
                </Badge>
              )}
              {model.isFree && (
                <Badge className="bg-green-500/20 text-green-300 text-xs shrink-0 ml-1">
                  1 free
                </Badge>
              )}
            </label>
          ))}
          <Button
            variant="ghost"
            className="w-full text-zinc-400 text-sm hover:bg-zinc-800/50"
            size="sm"
          >
            + Add another model
          </Button>
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <Label className="text-sm text-zinc-300 font-medium">Prompt</Label>
        <Textarea
          placeholder="Interior photography of a Scandinavian living room..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[120px] bg-zinc-800/50 border-zinc-700 text-white resize-none focus:border-purple-500"
        />
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Enhance Prompt
        </Button>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <Label className="text-sm text-zinc-300 font-medium">Aspect Ratio</Label>
        <div className="grid grid-cols-5 gap-2">
          {ASPECT_RATIOS.map(ratio => (
            <button
              key={ratio.value}
              onClick={() => onAspectRatioChange(ratio.value)}
              className={`aspect-square border-2 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                aspectRatio === ratio.value
                  ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/30'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <div className="pt-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-400 mb-2">
          Will run <span className="text-white font-medium">1x</span> on{' '}
          <span className="text-white font-medium">{selectedModels.length} models</span>
        </div>
        <div className="text-sm text-zinc-300 mb-3">
          Est. <span className="text-white font-medium">${estimatedCost.toFixed(2)}</span>
        </div>
        <Button
          onClick={onRun}
          disabled={isGenerating || selectedModels.length === 0 || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-medium"
        >
          {isGenerating ? 'Generating...' : 'Run'}
          {!isGenerating && (
            <kbd className="ml-2 px-2 py-1 bg-purple-700/50 rounded text-xs">⌘↵</kbd>
          )}
        </Button>
      </div>
    </div>
  );
}
