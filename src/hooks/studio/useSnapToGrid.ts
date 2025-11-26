import { Node } from '@xyflow/react';

const SNAP_GRID_SIZE = 50;
const SNAP_THRESHOLD = 10;

interface SnapResult {
  position: { x: number; y: number };
  guides: {
    horizontal: number[];
    vertical: number[];
  };
}

/**
 * Calculate snapped position and alignment guides for a node
 */
export const useSnapToGrid = () => {
  const snapToGrid = (
    position: { x: number; y: number },
    nodeId: string,
    allNodes: Node[],
    enableSnap: boolean = true
  ): SnapResult => {
    if (!enableSnap) {
      return { position, guides: { horizontal: [], vertical: [] } };
    }

    const guides: { horizontal: number[]; vertical: number[] } = {
      horizontal: [],
      vertical: [],
    };

    let snappedX = position.x;
    let snappedY = position.y;

    // Snap to grid
    const gridSnapX = Math.round(position.x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
    const gridSnapY = Math.round(position.y / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;

    if (Math.abs(position.x - gridSnapX) < SNAP_THRESHOLD) {
      snappedX = gridSnapX;
    }
    if (Math.abs(position.y - gridSnapY) < SNAP_THRESHOLD) {
      snappedY = gridSnapY;
    }

    // Snap to other nodes
    const otherNodes = allNodes.filter((n) => n.id !== nodeId);
    const currentNode = allNodes.find((n) => n.id === nodeId);
    const nodeWidth = currentNode?.width || 200;
    const nodeHeight = currentNode?.height || 100;

    for (const node of otherNodes) {
      const nodePos = node.position;
      const otherWidth = node.width || 200;
      const otherHeight = node.height || 100;

      // Vertical alignment (X-axis)
      // Left edge to left edge
      if (Math.abs(position.x - nodePos.x) < SNAP_THRESHOLD) {
        snappedX = nodePos.x;
        guides.vertical.push(nodePos.x);
      }
      // Right edge to right edge
      if (Math.abs(position.x + nodeWidth - (nodePos.x + otherWidth)) < SNAP_THRESHOLD) {
        snappedX = nodePos.x + otherWidth - nodeWidth;
        guides.vertical.push(nodePos.x + otherWidth);
      }
      // Center to center (X)
      const centerX = nodePos.x + otherWidth / 2;
      const currentCenterX = position.x + nodeWidth / 2;
      if (Math.abs(currentCenterX - centerX) < SNAP_THRESHOLD) {
        snappedX = centerX - nodeWidth / 2;
        guides.vertical.push(centerX);
      }

      // Horizontal alignment (Y-axis)
      // Top edge to top edge
      if (Math.abs(position.y - nodePos.y) < SNAP_THRESHOLD) {
        snappedY = nodePos.y;
        guides.horizontal.push(nodePos.y);
      }
      // Bottom edge to bottom edge
      if (Math.abs(position.y + nodeHeight - (nodePos.y + otherHeight)) < SNAP_THRESHOLD) {
        snappedY = nodePos.y + otherHeight - nodeHeight;
        guides.horizontal.push(nodePos.y + otherHeight);
      }
      // Center to center (Y)
      const centerY = nodePos.y + otherHeight / 2;
      const currentCenterY = position.y + nodeHeight / 2;
      if (Math.abs(currentCenterY - centerY) < SNAP_THRESHOLD) {
        snappedY = centerY - nodeHeight / 2;
        guides.horizontal.push(centerY);
      }
    }

    return {
      position: { x: snappedX, y: snappedY },
      guides,
    };
  };

  return { snapToGrid };
};
