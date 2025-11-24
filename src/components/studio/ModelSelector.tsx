import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ModelOption {
  id: string;
  name?: string; // Support 'name' from FalModel
  label?: string; // Support 'label' from generic options
  description?: string;
  icon?: string;
}

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  modelType?: 'image' | 'video' | 'audio' | 'text';
  isOpen: boolean;
  toggleOpen: () => void;
}

export default function ModelSelector({
  models,
  selectedModelId,
  onModelSelect,
  modelType = 'image',
  isOpen,
  toggleOpen,
}: ModelSelectorProps) {
  const selectedModel = models.find((m) => m.id === selectedModelId);

  return (
    <Popover open={isOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between text-xs h-9"
        >
          <span className="truncate">
            {selectedModel ? (selectedModel.name || selectedModel.label) : `Select ${modelType} model...`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${modelType} models...`} />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {models.map((model) => (
              <CommandItem
                key={model.id}
                value={model.name || model.label}
                onSelect={() => {
                  onModelSelect(model.id);
                  toggleOpen();
                }}
                className="text-xs"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedModelId === model.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                   <span>{model.name || model.label}</span>
                   {model.description && (
                     <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                       {model.description}
                     </span>
                   )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
