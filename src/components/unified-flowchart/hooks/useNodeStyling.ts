
import { Node } from '@xyflow/react';
import { NodeData, DrillDownState } from '../types';

export const useNodeStyling = (nodes: Node[], drillDown: DrillDownState) => {
  return nodes.map(node => {
    const nodeData = node.data as NodeData;
    return {
      ...node,
      style: {
        ...node.style,
        ...(drillDown.activeSubsystem === nodeData.subsystem 
          ? { 
              border: '3px solid #ff4081', 
              boxShadow: '0 0 20px rgba(255, 64, 129, 0.5)',
              transform: 'scale(1.05)'
            }
          : {}
        )
      }
    };
  });
};
