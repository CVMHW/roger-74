
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodeData, DrillDownState } from './unified-flowchart/types';
import { baseNodes } from './unified-flowchart/nodeData';
import { baseEdges } from './unified-flowchart/edgeData';
import { FlowchartHeader } from './unified-flowchart/FlowchartHeader';
import { DrillDownPanel } from './unified-flowchart/DrillDownPanel';
import { ProcessingPathsLegend } from './unified-flowchart/ProcessingPathsLegend';
import { useNodeStyling } from './unified-flowchart/hooks/useNodeStyling';
import { getNodeColor, getActiveNodeDetails } from './unified-flowchart/utils/nodeUtils';

export const UnifiedRogerFlowchart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    activeSubsystem: null,
    showDetails: false
  });

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const nodeData = node.data as NodeData;
    const subsystem = nodeData.subsystem;
    
    if (drillDown.activeSubsystem === subsystem) {
      setDrillDown(prev => ({
        ...prev,
        showDetails: !prev.showDetails
      }));
    } else {
      setDrillDown({
        activeSubsystem: subsystem,
        showDetails: true
      });
    }
  }, [drillDown.activeSubsystem]);

  const enhancedNodes = useNodeStyling(nodes, drillDown);
  const activeDetails = getActiveNodeDetails(nodes, drillDown.activeSubsystem, drillDown.showDetails);

  return (
    <div className="w-full h-screen bg-gray-50 relative">
      <FlowchartHeader
        title="Unified Roger Architecture & Decision Flow"
        description="Complete system showing both architecture and decision logic. Click any component for detailed information."
        helpText="💡 Click on any system component to see detailed information about when and why it's used"
      />
      
      <DrillDownPanel
        activeDetails={activeDetails}
        onClose={() => setDrillDown({ activeSubsystem: null, showDetails: false })}
      />
      
      <div className="h-[calc(100vh-140px)]">
        <ReactFlow
          nodes={enhancedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
          style={{ backgroundColor: '#f9fafb' }}
        >
          <Background color="#e5e7eb" gap={20} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => getNodeColor(node, drillDown.activeSubsystem)}
            pannable 
            zoomable 
          />
        </ReactFlow>
      </div>

      <ProcessingPathsLegend />
    </div>
  );
};

export default UnifiedRogerFlowchart;
