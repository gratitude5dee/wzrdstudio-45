import { FC } from 'react';
import { useReactFlow } from '@xyflow/react';

interface SnapGuidesProps {
  alignmentGuides: {
    horizontal: number[];
    vertical: number[];
  };
}

export const SnapGuides: FC<SnapGuidesProps> = ({ alignmentGuides }) => {
  const { getViewport } = useReactFlow();
  const viewport = getViewport();

  // Calculate viewport dimensions
  const viewportWidth = window.innerWidth / viewport.zoom;
  const viewportHeight = window.innerHeight / viewport.zoom;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        zIndex: 1000,
      }}
    >
      {/* Horizontal alignment guides */}
      {alignmentGuides.horizontal.map((y, index) => {
        const screenY = y * viewport.zoom + viewport.y;
        return (
          <g key={`h-${index}`}>
            {/* Main guide line */}
            <line
              x1={0}
              y1={screenY}
              x2={viewportWidth * viewport.zoom}
              y2={screenY}
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.8}
            />
            {/* Glow effect */}
            <line
              x1={0}
              y1={screenY}
              x2={viewportWidth * viewport.zoom}
              y2={screenY}
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="4 4"
              opacity={0.2}
              filter="blur(2px)"
            />
          </g>
        );
      })}

      {/* Vertical alignment guides */}
      {alignmentGuides.vertical.map((x, index) => {
        const screenX = x * viewport.zoom + viewport.x;
        return (
          <g key={`v-${index}`}>
            {/* Main guide line */}
            <line
              x1={screenX}
              y1={0}
              x2={screenX}
              y2={viewportHeight * viewport.zoom}
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.8}
            />
            {/* Glow effect */}
            <line
              x1={screenX}
              y1={0}
              x2={screenX}
              y2={viewportHeight * viewport.zoom}
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="4 4"
              opacity={0.2}
              filter="blur(2px)"
            />
          </g>
        );
      })}
    </svg>
  );
};
