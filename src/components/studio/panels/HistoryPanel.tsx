import { FC } from 'react';
import { Clock, RotateCcw, Trash2 } from 'lucide-react';
import { useComposerStore, useCanUndo, useCanRedo } from '@/store/studio/useComposerStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistance } from 'date-fns';

interface HistoryEntry {
  timestamp: number;
  nodeCount: number;
  edgeCount: number;
}

export const HistoryPanel: FC = () => {
  const undo = useComposerStore((state) => state.undo);
  const redo = useComposerStore((state) => state.redo);
  const resetHistory = useComposerStore((state) => state.resetHistory);
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  
  const historyPast = useComposerStore((state) => state.history.past);
  const historyFuture = useComposerStore((state) => state.history.future);

  const historyEntries: HistoryEntry[] = historyPast.map((entry, index) => ({
    timestamp: Date.now() - (historyPast.length - index) * 30000, // Mock timestamps
    nodeCount: entry.nodes.length,
    edgeCount: entry.edges.length,
  }));

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-white" />
            <h2 className="text-white font-medium">History</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#666666] hover:text-white"
            onClick={resetHistory}
            disabled={historyPast.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent border-[#333333] text-white hover:bg-[#1a1a1a]"
            onClick={undo}
            disabled={!canUndo}
          >
            <RotateCcw className="h-3 w-3 mr-2" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent border-[#333333] text-white hover:bg-[#1a1a1a]"
            onClick={redo}
            disabled={!canRedo}
          >
            <RotateCcw className="h-3 w-3 mr-2 scale-x-[-1]" />
            Redo
          </Button>
        </div>
      </div>

      {/* History Timeline */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {historyEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-[#333333] mb-3" />
              <p className="text-[#666666] text-sm">No history yet</p>
              <p className="text-[#444444] text-xs mt-1">
                Changes will appear here
              </p>
            </div>
          ) : (
            historyEntries.reverse().map((entry, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] transition-colors border border-[#2a2a2a]"
                onClick={() => {
                  // Undo to this point
                  const stepsBack = index;
                  for (let i = 0; i < stepsBack; i++) {
                    undo();
                  }
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-white text-sm font-medium">
                    Checkpoint {historyEntries.length - index}
                  </span>
                  <span className="text-[#666666] text-xs">
                    {formatDistance(entry.timestamp, Date.now(), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-[#888888]">
                  <span>{entry.nodeCount} nodes</span>
                  <span>{entry.edgeCount} connections</span>
                </div>
              </button>
            ))
          )}

          {historyFuture.length > 0 && (
            <div className="pt-3 border-t border-[#2a2a2a] mt-3">
              <p className="text-[#666666] text-xs mb-2">Future States</p>
              {historyFuture.slice(0, 3).map((entry, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-[#0d0d0d] border border-[#1a1a1a] mb-2 opacity-50"
                >
                  <div className="text-xs text-[#888888]">
                    {entry.nodes.length} nodes · {entry.edges.length} connections
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
