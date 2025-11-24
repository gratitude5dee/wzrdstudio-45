import { ReactFlowProvider } from '@xyflow/react';
import { StudioComposer } from '@/components/studio/StudioComposer';
import { AppHeader } from '@/components/AppHeader';

export const StudioPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Professional App Header */}
      <AppHeader />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <StudioComposer />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default StudioPage;
