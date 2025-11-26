import { useEffect, useState } from 'react';
import { useComposerStore } from '@/store/studio/useComposerStore';
import { useExecuteWorkflow } from './useExecuteWorkflow';
import { useClipboard } from './useClipboard';
import { useNodeOperations } from './useNodeOperations';

// Export hook for shortcuts modal state
export const useKeyboardShortcutsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};

export const useComposerKeyboardShortcuts = () => {
  const undo = useComposerStore((state) => state.undo);
  const redo = useComposerStore((state) => state.redo);
  const { execute } = useExecuteWorkflow();
  const { copy, cut, paste } = useClipboard();
  const { deleteSelectedNodes } = useNodeOperations();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + Z: Undo
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Cmd/Ctrl + Shift + Z: Redo
      if (modifier && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Cmd/Ctrl + Enter: Execute
      if (modifier && e.key === 'Enter') {
        e.preventDefault();
        execute();
      }

      // Cmd/Ctrl + C: Copy
      if (modifier && e.key === 'c') {
        e.preventDefault();
        copy();
      }

      // Cmd/Ctrl + X: Cut
      if (modifier && e.key === 'x') {
        e.preventDefault();
        cut();
      }

      // Cmd/Ctrl + V: Paste
      if (modifier && e.key === 'v') {
        e.preventDefault();
        paste();
      }

      // Delete/Backspace: Delete selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelectedNodes();
      }

      // Cmd/Ctrl + A: Select all
      if (modifier && e.key === 'a') {
        e.preventDefault();
        useComposerStore.getState().setNodes((nodes) =>
          nodes.map((node) => ({ ...node, selected: true }))
        );
      }

      // ?: Show keyboard shortcuts
      if (e.key === '?' && !modifier) {
        e.preventDefault();
        // Dispatch custom event to show shortcuts modal
        window.dispatchEvent(new CustomEvent('show-shortcuts-modal'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, execute, copy, cut, paste, deleteSelectedNodes]);
};
