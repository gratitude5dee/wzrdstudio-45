import { ReactFlowProvider } from '@xyflow/react';
import { StudioComposer } from '@/components/studio/StudioComposer';

export const StudioPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="h-14 border-b border-border-default flex items-center px-4">
        <h1 className="text-lg font-semibold">Studio Composer</h1>
      </header>
      
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
