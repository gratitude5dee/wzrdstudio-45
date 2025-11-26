import { FC } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShortcutCategory {
  title: string;
  shortcuts: Array<{ keys: string[]; description: string }>;
}

const SHORTCUTS: ShortcutCategory[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Cmd/Ctrl', 'S'], description: 'Save workflow' },
      { keys: ['Cmd/Ctrl', 'Enter'], description: 'Execute workflow' },
      { keys: ['Escape'], description: 'Deselect all' },
    ],
  },
  {
    title: 'Editing',
    shortcuts: [
      { keys: ['Cmd/Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Cmd/Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Cmd/Ctrl', 'C'], description: 'Copy' },
      { keys: ['Cmd/Ctrl', 'X'], description: 'Cut' },
      { keys: ['Cmd/Ctrl', 'V'], description: 'Paste' },
      { keys: ['Cmd/Ctrl', 'D'], description: 'Duplicate' },
      { keys: ['Delete'], description: 'Delete selected' },
      { keys: ['Backspace'], description: 'Delete selected' },
    ],
  },
  {
    title: 'Selection',
    shortcuts: [
      { keys: ['Cmd/Ctrl', 'A'], description: 'Select all nodes' },
      { keys: ['Shift', 'Click'], description: 'Multi-select' },
      { keys: ['Shift', 'Drag'], description: 'Box selection' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Space', 'Drag'], description: 'Pan canvas' },
      { keys: ['+'], description: 'Zoom in' },
      { keys: ['-'], description: 'Zoom out' },
      { keys: ['Shift', '1'], description: 'Fit to screen' },
      { keys: ['Shift', '2'], description: 'Zoom to selection' },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-[#2a2a2a] text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl">
              Keyboard Shortcuts
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#666666] hover:text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {SHORTCUTS.map((category) => (
            <div key={category.title}>
              <h3 className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-3">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0"
                  >
                    <span className="text-sm text-[#cccccc]">
                      {shortcut.description}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-2 py-1 text-xs font-mono bg-[#1a1a1a] border border-[#333333] rounded text-white"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <p className="text-sm text-[#888888]">
            <span className="text-white font-medium">Tip:</span> Hold{' '}
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-[#0a0a0a] border border-[#333333] rounded">
              Space
            </kbd>{' '}
            and drag to pan around the canvas, or use the scroll wheel to zoom
            in and out.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
