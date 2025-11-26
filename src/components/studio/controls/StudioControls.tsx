import { FC, useState, useEffect } from 'react';
import { Plus, Minus, Maximize2, Hand } from 'lucide-react';
import { useReactFlow, useOnViewportChange } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

export const StudioControls: FC = () => {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const [currentZoom, setCurrentZoom] = useState(100);

  // Update zoom display in real-time
  useOnViewportChange({
    onChange: (viewport) => {
      setCurrentZoom(Math.round(viewport.zoom * 100));
    },
  });

  const handleZoomChange = (value: number[]) => {
    const zoom = value[0] / 100;
    setViewport({ x: 0, y: 0, zoom }, { duration: 200 });
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-[rgba(30,30,30,0.95)] backdrop-blur-lg rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl border border-[#2a2a2a]">
        {/* Zoom Out */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={() => zoomOut({ duration: 200 })}
        >
          <Minus className="h-4 w-4" />
        </Button>

        {/* Zoom Slider */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <Slider
            value={[currentZoom]}
            onValueChange={handleZoomChange}
            min={10}
            max={200}
            step={5}
            className="flex-1"
          />
          <span className="text-white text-xs font-mono w-12 text-center">
            {currentZoom}%
          </span>
        </div>

        {/* Zoom In */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={() => zoomIn({ duration: 200 })}
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-[#444444]" />

        {/* Fit View */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={() => fitView({ duration: 400, padding: 0.2 })}
          title="Fit to Screen (Shift+1)"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Hand Tool (Pan) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          title="Hold Space to Pan"
        >
          <Hand className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
