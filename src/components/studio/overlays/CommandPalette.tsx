import { FC, useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Plus, Play, Copy, Trash2, FileText, Image, Video, Sparkles } from 'lucide-react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useNodeOperations } from '@/hooks/studio/useNodeOperations';
import { useExecuteWorkflow } from '@/hooks/studio/useExecuteWorkflow';
import { useClipboard } from '@/hooks/studio/useClipboard';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const nodes = useComposerStore((state) => state.nodes);
  const { addNode, deleteSelectedNodes } = useNodeOperations();
  const { execute } = useExecuteWorkflow();
  const { copy, paste } = useClipboard();

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const handleDuplicate = () => {
    copy();
    setTimeout(() => paste(), 100);
  };

  const nodeTemplates = [
    { type: 'prompt', label: 'Add Prompt Node', icon: FileText },
    { type: 'image-output', label: 'Add Image Output', icon: Image },
    { type: 'video-output', label: 'Add Video Output', icon: Video },
    { type: 'reference', label: 'Add Reference Node', icon: Sparkles },
  ];

  const actions = [
    { label: 'Run Workflow', icon: Play, shortcut: '⌘ Enter', action: execute },
    { label: 'Copy Selection', icon: Copy, shortcut: '⌘ C', action: copy },
    { label: 'Paste', icon: Plus, shortcut: '⌘ V', action: paste },
    { label: 'Duplicate Selection', icon: Copy, shortcut: '⌘ D', action: handleDuplicate },
    { label: 'Delete Selection', icon: Trash2, shortcut: 'Del', action: deleteSelectedNodes },
  ];

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      label="Command Palette"
    >
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl shadow-2xl backdrop-blur-lg overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a]">
          <Search className="h-5 w-5 text-[#666666]" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search nodes, actions..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#666666]"
          />
          <kbd className="px-2 py-1 text-xs font-mono bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#888888]">
            Esc
          </kbd>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-[#666666] text-sm">
            No results found.
          </Command.Empty>

          {/* Add Nodes */}
          <Command.Group
            heading="Add Nodes"
            className="text-xs text-[#888888] font-semibold uppercase tracking-wider px-2 py-2"
          >
            {nodeTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Command.Item
                  key={template.type}
                  onSelect={() => handleAction(() => addNode(template.type, {}, { x: 100, y: 100 }))}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] data-[selected=true]:bg-[#1a1a1a] text-white mb-1"
                >
                  <Icon className="h-4 w-4 text-[#888888]" />
                  <span>{template.label}</span>
                </Command.Item>
              );
            })}
          </Command.Group>

          {/* Actions */}
          <Command.Group
            heading="Actions"
            className="text-xs text-[#888888] font-semibold uppercase tracking-wider px-2 py-2 mt-2"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Command.Item
                  key={action.label}
                  onSelect={() => handleAction(action.action)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] data-[selected=true]:bg-[#1a1a1a] text-white mb-1"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[#888888]" />
                    <span>{action.label}</span>
                  </div>
                  <kbd className="px-2 py-1 text-xs font-mono bg-[#0a0a0a] border border-[#2a2a2a] rounded text-[#666666]">
                    {action.shortcut}
                  </kbd>
                </Command.Item>
              );
            })}
          </Command.Group>

          {/* Navigate to Nodes */}
          {nodes.length > 0 && (
            <Command.Group
              heading="Navigate to Node"
              className="text-xs text-[#888888] font-semibold uppercase tracking-wider px-2 py-2 mt-2"
            >
              {nodes.slice(0, 5).map((node) => (
                <Command.Item
                  key={node.id}
                  onSelect={() => {
                    // Focus on node
                    useComposerStore.getState().setNodes((nds) =>
                      nds.map((n) => ({ ...n, selected: n.id === node.id }))
                    );
                    onClose();
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] data-[selected=true]:bg-[#1a1a1a] text-white mb-1"
                >
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm">{(node.data?.label as string) || node.type}</span>
                  <span className="text-xs text-[#666666] ml-auto">#{node.id.slice(0, 6)}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
