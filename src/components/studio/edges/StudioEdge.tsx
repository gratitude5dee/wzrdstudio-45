import { FC, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
  Edge,
} from '@xyflow/react';
import { motion } from 'framer-motion';

export type EdgeStatus = 'idle' | 'running' | 'succeeded' | 'error';

export const StudioEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const status = data?.status || 'idle';

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getStrokeColor = () => {
    if (selected) return '#888888';
    if (isHovered) return '#666666';
    return '#444444';
  };

  const getStrokeWidth = () => {
    if (selected) return 2.5;
    if (isHovered) return 2;
    return 1.5;
  };

  return (
    <>
      {/* Main edge - smooth bezier */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: getStrokeColor(),
          strokeWidth: getStrokeWidth(),
          strokeLinecap: 'round',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Running animation */}
      {status === 'running' && (
        <g>
          <circle r="4" fill={getStrokeColor()}>
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
          <circle r="4" fill={getStrokeColor()} opacity="0.5">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
              begin="1s"
            />
          </circle>
        </g>
      )}

      {/* Success flash */}
      {status === 'succeeded' && (
        <EdgeLabelRenderer>
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="w-4 h-4 rounded-full bg-green-500/50"
          />
        </EdgeLabelRenderer>
      )}

      {/* Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan px-2 py-1 rounded text-xs bg-background border shadow-sm"
          >
            {String(data.label)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
