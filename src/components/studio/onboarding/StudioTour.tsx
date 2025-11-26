import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Studio',
    description: 'Create powerful AI workflows by connecting nodes on this infinite canvas. Let\'s take a quick tour!',
  },
  {
    id: 'sidebar',
    title: 'Add Nodes',
    description: 'Click these icons to add different types of nodes: prompts, images, references, and more.',
    target: '[data-tour="icon-sidebar"]',
    position: 'right',
  },
  {
    id: 'canvas',
    title: 'Infinite Canvas',
    description: 'Double-click anywhere to create a new node. Drag to pan, scroll to zoom.',
    target: '[data-tour="canvas"]',
    position: 'top',
  },
  {
    id: 'connections',
    title: 'Connect Nodes',
    description: 'Drag from the + handle on one node to another to create connections and build your workflow.',
  },
  {
    id: 'templates',
    title: 'Quick Start Templates',
    description: 'Use pre-built templates to get started quickly. Find them in the Templates panel.',
    target: '[data-tour="templates"]',
    position: 'right',
  },
  {
    id: 'execute',
    title: 'Run Your Workflow',
    description: 'Click the Play button in the bottom bar to execute your workflow and see results in real-time.',
    target: '[data-tour="bottom-bar"]',
    position: 'top',
  },
];

interface StudioTourProps {
  onComplete: () => void;
}

export const StudioTour: FC<StudioTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = tourSteps[currentStep];

  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, step.target]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const getTooltipPosition = () => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const offset = 20;
    switch (step.position) {
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.right + offset}px`,
          transform: 'translateY(-50%)',
        };
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          right: `${window.innerWidth - targetRect.left + offset}px`,
          transform: 'translateY(-50%)',
        };
      case 'top':
        return {
          bottom: `${window.innerHeight - targetRect.top + offset}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: `${targetRect.bottom + offset}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] pointer-events-none">
        {/* Overlay with spotlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={handleComplete}
        />

        {/* Spotlight on target element */}
        {targetRect && (
          <motion.div
            className="absolute bg-transparent border-2 border-white rounded-lg pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          className="absolute pointer-events-auto max-w-sm"
          style={getTooltipPosition()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                <p className="text-zinc-400 text-sm">{step.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1 text-zinc-500 hover:text-white hover:bg-white/10"
                onClick={handleComplete}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentStep
                        ? 'w-8 bg-white'
                        : idx < currentStep
                        ? 'w-1.5 bg-zinc-600'
                        : 'w-1.5 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    className="text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
