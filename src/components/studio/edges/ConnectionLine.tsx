import { FC } from 'react';
import { ConnectionLineComponentProps, getBezierPath } from '@xyflow/react';

export const ConnectionLine: FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}) => {
  const [path] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
  });

  return (
    <g>
      {/* Main connecting line */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--studio-edge-connecting))"
        strokeWidth={2}
        strokeDasharray="8 4"
        className="animate-studio-connection-dash"
      />
      {/* Glow effect */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--studio-edge-connecting))"
        strokeWidth={6}
        strokeOpacity={0.2}
        filter="blur(4px)"
      />
      {/* End indicator */}
      <circle 
        cx={toX} 
        cy={toY} 
        r={6} 
        fill="hsl(var(--studio-edge-connecting))" 
        opacity={0.5}
      >
        <animate 
          attributeName="r" 
          values="4;8;4" 
          dur="1s" 
          repeatCount="indefinite" 
        />
      </circle>
    </g>
  );
};
