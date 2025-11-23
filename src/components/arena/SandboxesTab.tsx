import { useState, useEffect } from 'react';
import SandboxControlPanel from './SandboxControlPanel';
import SandboxGenerationGrid from './SandboxGenerationGrid';
import { useSandboxGeneration } from '@/hooks/useSandboxGeneration';

export default function SandboxesTab() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1024x1024');

  const {
    generations,
    isGenerating,
    progress,
    runBatchGeneration,
    clearGenerations
  } = useSandboxGeneration();

  const handleRun = () => {
    runBatchGeneration({
      prompt,
      aspectRatio,
      modelIds: selectedModels
    });
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating && selectedModels.length > 0 && prompt.trim()) {
          handleRun();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating, selectedModels, prompt, aspectRatio]);

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Left Sidebar - Control Panel */}
      <SandboxControlPanel
        selectedModels={selectedModels}
        onModelsChange={setSelectedModels}
        prompt={prompt}
        onPromptChange={setPrompt}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        onRun={handleRun}
        isGenerating={isGenerating}
        generationCount={generations.length}
        onClear={clearGenerations}
      />

      {/* Main Grid Area */}
      <div className="flex-1 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6 overflow-y-auto">
        <SandboxGenerationGrid
          generations={generations}
          isGenerating={isGenerating}
          progress={progress}
        />
      </div>
    </div>
  );
}
