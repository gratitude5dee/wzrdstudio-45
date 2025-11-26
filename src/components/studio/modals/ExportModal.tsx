import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Upload, Save } from 'lucide-react';
import { useWorkflowPersistence } from '@/hooks/studio/useWorkflowPersistence';
import { useComposerStore } from '@/store/studio/useComposerStore';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportModal: FC<ExportModalProps> = ({ open, onOpenChange }) => {
  const meta = useComposerStore((s) => s.meta);
  const { saveWorkflow, exportWorkflow, importWorkflow, isSaving } = useWorkflowPersistence();
  const [name, setName] = useState(meta.title || 'Untitled Workflow');
  const [description, setDescription] = useState(meta.description || '');

  const handleSave = async () => {
    const result = await saveWorkflow({ name, description });
    if (result) {
      onOpenChange(false);
    }
  };

  const handleExport = () => {
    exportWorkflow();
    onOpenChange(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importWorkflow(file);
      if (success) {
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-white">Save & Export</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Save your workflow to cloud or export as JSON
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Save to Cloud */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-white">Workflow Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Workflow"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />

            <Label htmlFor="description" className="text-white">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this workflow do?"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white resize-none"
              rows={3}
            />

            <Button
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save to Cloud'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2a]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0a0a0a] px-2 text-zinc-500">OR</span>
            </div>
          </div>

          {/* Export/Import */}
          <div className="space-y-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full bg-transparent border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-file"
              />
              <Button
                variant="outline"
                className="w-full bg-transparent border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
                asChild
              >
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from JSON
                </label>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
