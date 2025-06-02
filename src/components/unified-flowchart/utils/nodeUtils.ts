
import { Node } from '@xyflow/react';
import { NodeData } from '../types';

export const getNodeColor = (node: Node, activeSubsystem: string | null): string => {
  const nodeData = node.data as NodeData;
  if (nodeData?.subsystem === activeSubsystem) return '#ff4081';
  if (node.id.includes('crisis')) return '#ffcdd2';
  if (node.id.includes('fast') || node.id.includes('greeting')) return '#c8e6c9';
  if (node.id.includes('emotional') || node.id.includes('emotion')) return '#e1bee7';
  if (node.id.includes('complex') || node.id.includes('rag')) return '#b3e5fc';
  if (node.id.includes('memory')) return '#fff8e1';
  if (node.id.includes('personality')) return '#f1f8e9';
  return '#f5f5f5';
};

export const getActiveNodeDetails = (
  nodes: Node[], 
  activeSubsystem: string | null, 
  showDetails: boolean
): string | null => {
  if (!activeSubsystem || !showDetails) return null;
  
  const activeNode = nodes.find(node => {
    const nodeData = node.data as NodeData;
    return nodeData.subsystem === activeSubsystem;
  });
  
  if (activeNode) {
    const nodeData = activeNode.data as NodeData;
    return nodeData.details;
  }
  
  return null;
};
