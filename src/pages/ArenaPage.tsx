import { useEffect, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestingSuiteTab from '@/components/arena/TestingSuiteTab';
import SandboxesTab from '@/components/arena/SandboxesTab';

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState<string>('sandboxes');

  // Listen for hash changes from header navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'testing-suite' || hash === 'sandboxes') {
        setActiveTab(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3 text-foreground">
              <Trophy className="w-10 h-10 text-primary" />
              WZRD Evaluation Arena
            </h1>
            <p className="text-muted-foreground mt-2">
              Compare and test frontier image generation models
            </p>
          </div>
        </div>

        {/* Tab System */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-zinc-900/50 border border-zinc-800/50 mb-6">
            <TabsTrigger 
              value="testing-suite"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Testing Suite
            </TabsTrigger>
            <TabsTrigger 
              value="sandboxes"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Sandboxes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="testing-suite">
            <TestingSuiteTab />
          </TabsContent>
          
          <TabsContent value="sandboxes">
            <SandboxesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
