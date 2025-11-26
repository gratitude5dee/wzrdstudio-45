import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NodePreviewProps {
  nodeId: string;
  imageUrl?: string;
  metadata?: {
    dimensions?: string;
    model?: string;
    generationTime?: number;
    prompt?: string;
  };
  onClose: () => void;
}

export const NodePreview: FC<NodePreviewProps> = ({ 
  nodeId, 
  imageUrl, 
  metadata,
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setIsLoading(false);
    }
  }, [imageUrl]);

  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#2a2a2a] max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-center justify-between">
            <div className="text-white font-medium">Node Preview</div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = imageUrl;
                  link.download = `node-${nodeId}.png`;
                  link.click();
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => window.open(imageUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
              </div>
            )}
            <img
              src={imageUrl}
              alt="Node preview"
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>

          {/* Metadata Footer */}
          {metadata && (
            <div className="bg-[#0a0a0a] p-4 border-t border-[#2a2a2a]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {metadata.dimensions && (
                  <div>
                    <div className="text-zinc-500 text-xs">Dimensions</div>
                    <div className="text-white font-medium">{metadata.dimensions}</div>
                  </div>
                )}
                {metadata.model && (
                  <div>
                    <div className="text-zinc-500 text-xs">Model</div>
                    <div className="text-white font-medium">{metadata.model}</div>
                  </div>
                )}
                {metadata.generationTime && (
                  <div>
                    <div className="text-zinc-500 text-xs">Generation Time</div>
                    <div className="text-white font-medium">{metadata.generationTime}s</div>
                  </div>
                )}
              </div>
              {metadata.prompt && (
                <div className="mt-3">
                  <div className="text-zinc-500 text-xs mb-1">Prompt</div>
                  <div className="text-white text-sm line-clamp-2">{metadata.prompt}</div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
