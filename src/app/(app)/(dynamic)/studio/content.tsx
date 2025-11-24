"use client";

import { StudioLeftPanel } from '@/components/studio/panels/StudioLeftPanel';
import { StudioRightPanel } from '@/components/studio/panels/StudioRightPanel';
import { StudioCanvas } from '@/components/studio/StudioCanvas';
import { ReactFlowProvider } from '@xyflow/react';

export default function StudioContent() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background">
      <ReactFlowProvider>
        <StudioLeftPanel />
        <StudioCanvas />
        <StudioRightPanel />
      </ReactFlowProvider>
    </div>
  );
}
