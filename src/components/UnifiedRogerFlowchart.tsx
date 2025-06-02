import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Type definitions for node data
interface NodeData extends Record<string, unknown> {
  label: string;
  subsystem: string;
  details: string;
}

// Drill-down state interface
interface DrillDownState {
  activeSubsystem: string | null;
  showDetails: boolean;
}

// Base nodes for the unified view
const baseNodes: Node<NodeData>[] = [
  // User Input
  {
    id: 'user-input',
    type: 'input',
    position: { x: 400, y: 50 },
    data: { 
      label: 'User Input',
      subsystem: 'input',
      details: 'All user messages enter here. Voice, text, or other modalities.'
    },
    style: { backgroundColor: '#e3f2fd', border: '2px solid #1976d2', width: 140 }
  },

  // Smart Router with detailed decision logic
  {
    id: 'smart-router',
    position: { x: 350, y: 150 },
    data: { 
      label: 'Smart Interaction Router\n🔍 Route Analysis',
      subsystem: 'router',
      details: 'Analyzes input complexity, emotional content, crisis indicators, and conversation context to determine optimal processing path in <400ms'
    },
    style: { backgroundColor: '#fff3e0', border: '2px solid #f57c00', width: 200, textAlign: 'center' }
  },

  // Crisis Path - Highest Priority
  {
    id: 'crisis-path',
    position: { x: 50, y: 300 },
    data: { 
      label: 'CRISIS PATH\n⚠️ Immediate Response',
      subsystem: 'crisis',
      details: 'Triggered by: suicide mentions, self-harm, immediate danger. Bypasses normal processing for <300ms response with emergency resources.'
    },
    style: { backgroundColor: '#ffebee', border: '3px solid #d32f2f', width: 160, textAlign: 'center' }
  },

  // Fast Path - Greetings
  {
    id: 'fast-path',
    position: { x: 250, y: 300 },
    data: { 
      label: 'FAST PATH\n⚡ Quick Response',
      subsystem: 'greeting',
      details: 'For simple greetings, "hi", "hello". Minimal processing, <200ms target response time.'
    },
    style: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50', width: 160, textAlign: 'center' }
  },

  // Standard Path - Emotional
  {
    id: 'standard-path',
    position: { x: 450, y: 300 },
    data: { 
      label: 'STANDARD PATH\n💭 Emotional Processing',
      subsystem: 'emotional',
      details: 'For emotional content, feelings, concerns. Engages emotion detection, memory, personality systems. <600ms target.'
    },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 160, textAlign: 'center' }
  },

  // Complex Path - Full Processing
  {
    id: 'complex-path',
    position: { x: 650, y: 300 },
    data: { 
      label: 'COMPLEX PATH\n🧠 Full Processing',
      subsystem: 'complex',
      details: 'For complex issues, therapy topics, deep conversations. Uses all systems including RAG enhancement. <800ms target.'
    },
    style: { backgroundColor: '#e1f5fe', border: '2px solid #0288d1', width: 160, textAlign: 'center' }
  },

  // Processing Systems Hub
  {
    id: 'processing-hub',
    position: { x: 400, y: 450 },
    data: { 
      label: 'Roger Processing Hub\n🔄 System Coordination',
      subsystem: 'hub',
      details: 'Coordinates all processing systems based on route decision. Manages parallel processing and system interactions.'
    },
    style: { backgroundColor: '#fce4ec', border: '2px solid #c2185b', width: 220, textAlign: 'center' }
  },

  // Core Processing Systems (clustered)
  {
    id: 'emotion-system',
    position: { x: 150, y: 600 },
    data: { 
      label: 'Emotion Detection\n😊 Unified Analysis',
      subsystem: 'emotion',
      details: 'Detects primary emotions, emotional intensity, depression indicators. Uses multiple detection methods with confidence scoring.'
    },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 150, textAlign: 'center' }
  },

  {
    id: 'memory-system',
    position: { x: 320, y: 600 },
    data: { 
      label: 'Memory Systems\n🧠 Multi-Layer Storage',
      subsystem: 'memory',
      details: 'Working memory (current conversation), Short-term (recent sessions), Long-term (persistent patterns), Patient profile memory.'
    },
    style: { backgroundColor: '#fff8e1', border: '2px solid #ff8f00', width: 150, textAlign: 'center' }
  },

  {
    id: 'personality-system',
    position: { x: 490, y: 600 },
    data: { 
      label: 'Roger Personality\n🎭 Therapeutic Voice',
      subsystem: 'personality',
      details: 'Maintains Rogers authentic therapeutic presence, communication style, warmth, and person-centered approach.'
    },
    style: { backgroundColor: '#f1f8e9', border: '2px solid #689f38', width: 150, textAlign: 'center' }
  },

  {
    id: 'rag-system',
    position: { x: 660, y: 600 },
    data: { 
      label: 'RAG Enhancement\n📚 Knowledge Integration',
      subsystem: 'rag',
      details: 'Retrieval-Augmented Generation using therapeutic knowledge base, evidence-based practices, and contextual information.'
    },
    style: { backgroundColor: '#e8eaf6', border: '2px solid #3f51b5', width: 150, textAlign: 'center' }
  },

  // Response Processing
  {
    id: 'response-synthesis',
    position: { x: 400, y: 750 },
    data: { 
      label: 'Response Synthesis\n✨ Integration & Enhancement',
      subsystem: 'synthesis',
      details: 'Combines outputs from all engaged systems. Applies logotherapy principles, ensures therapeutic appropriateness, maintains conversation flow.'
    },
    style: { backgroundColor: '#fff3e0', border: '2px solid #ef6c00', width: 220, textAlign: 'center' }
  },

  // Verification Layer
  {
    id: 'verification-layer',
    position: { x: 200, y: 900 },
    data: { 
      label: 'Hallucination Prevention\n🛡️ Safety First',
      subsystem: 'verification',
      details: 'Prevents factual errors, inappropriate content, repetitive responses. Especially aggressive in first 30 seconds of conversation.'
    },
    style: { backgroundColor: '#ffebee', border: '2px solid #d32f2f', width: 180, textAlign: 'center' }
  },

  {
    id: 'compliance-check',
    position: { x: 420, y: 900 },
    data: { 
      label: 'HIPAA Compliance\n🔒 Privacy Protection',
      subsystem: 'compliance',
      details: 'Ensures all responses meet healthcare privacy standards, removes PII, maintains therapeutic boundaries.'
    },
    style: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50', width: 180, textAlign: 'center' }
  },

  {
    id: 'final-validation',
    position: { x: 640, y: 900 },
    data: { 
      label: 'Final Validation\n✅ Quality Assurance',
      subsystem: 'validation',
      details: 'Final check for therapeutic appropriateness, emotional sensitivity, response coherence, and conversation continuity.'
    },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 180, textAlign: 'center' }
  },

  // Output
  {
    id: 'response-output',
    type: 'output',
    position: { x: 380, y: 1050 },
    data: { 
      label: 'Typed Response\n💬 To Patient',
      subsystem: 'output',
      details: 'Final response delivered to patient with appropriate timing, typing indicators, and emotional tone.'
    },
    style: { backgroundColor: '#e3f2fd', border: '2px solid #1976d2', width: 200, textAlign: 'center' }
  },

  // Feedback Loop
  {
    id: 'feedback-loop',
    position: { x: 650, y: 1050 },
    data: { 
      label: 'Memory Update\n🔄 Learning Loop',
      subsystem: 'feedback',
      details: 'Updates conversation history, learns from interaction patterns, adjusts future responses based on patient feedback.'
    },
    style: { backgroundColor: '#fff8e1', border: '2px solid #ff8f00', width: 170, textAlign: 'center' }
  }
];

// Base edges showing the main flow and decision points
const baseEdges: Edge[] = [
  // Main input flow
  { id: 'e1', source: 'user-input', target: 'smart-router', markerEnd: { type: MarkerType.ArrowClosed } },
  
  // Router decision branches with context
  { 
    id: 'e2a', 
    source: 'smart-router', 
    target: 'crisis-path', 
    label: 'Crisis Keywords\nSuicide, Self-harm', 
    style: { stroke: '#d32f2f', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  { 
    id: 'e2b', 
    source: 'smart-router', 
    target: 'fast-path', 
    label: 'Simple Greeting\n<50 chars, basic', 
    style: { stroke: '#4caf50' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  { 
    id: 'e2c', 
    source: 'smart-router', 
    target: 'standard-path', 
    label: 'Emotional Content\nFeelings, concerns', 
    style: { stroke: '#7b1fa2' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  { 
    id: 'e2d', 
    source: 'smart-router', 
    target: 'complex-path', 
    label: 'Complex/Therapy\nDeep discussions', 
    style: { stroke: '#0288d1' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },

  // Crisis direct path (bypasses hub)
  { 
    id: 'e3a', 
    source: 'crisis-path', 
    target: 'response-output', 
    label: 'Emergency\nDirect Route', 
    style: { stroke: '#d32f2f', strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },

  // Fast path to hub
  { id: 'e3b', source: 'fast-path', target: 'processing-hub', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3c', source: 'standard-path', target: 'processing-hub', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3d', source: 'complex-path', target: 'processing-hub', markerEnd: { type: MarkerType.ArrowClosed } },

  // Hub to processing systems (conditional based on path)
  { 
    id: 'e4a', 
    source: 'processing-hub', 
    target: 'emotion-system', 
    label: 'Standard+\nComplex', 
    style: { stroke: '#7b1fa2' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  { 
    id: 'e4b', 
    source: 'processing-hub', 
    target: 'memory-system', 
    label: 'All Paths', 
    style: { stroke: '#ff8f00' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  { 
    id: 'e4c', 
    source: 'processing-hub', 
    target: 'personality-system', 
    label: 'All Paths', 
    style: { stroke: '#689f38' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  { 
    id: 'e4d', 
    source: 'processing-hub', 
    target: 'rag-system', 
    label: 'Complex Only', 
    style: { stroke: '#3f51b5' },
    markerEnd: { type: MarkerType.ArrowClosed }
  },

  // Systems to synthesis
  { id: 'e5a', source: 'emotion-system', target: 'response-synthesis', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5b', source: 'memory-system', target: 'response-synthesis', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5c', source: 'personality-system', target: 'response-synthesis', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5d', source: 'rag-system', target: 'response-synthesis', markerEnd: { type: MarkerType.ArrowClosed } },

  // Synthesis to verification
  { id: 'e6a', source: 'response-synthesis', target: 'verification-layer', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6b', source: 'response-synthesis', target: 'compliance-check', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6c', source: 'response-synthesis', target: 'final-validation', markerEnd: { type: MarkerType.ArrowClosed } },

  // Verification to output
  { id: 'e7a', source: 'verification-layer', target: 'response-output', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7b', source: 'compliance-check', target: 'response-output', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7c', source: 'final-validation', target: 'response-output', markerEnd: { type: MarkerType.ArrowClosed } },

  // Feedback loop
  { id: 'e8', source: 'response-output', target: 'feedback-loop', markerEnd: { type: MarkerType.ArrowClosed } },
  { 
    id: 'e9', 
    source: 'feedback-loop', 
    target: 'memory-system', 
    label: 'Learning\nUpdate', 
    style: { stroke: '#ff8f00', strokeDasharray: '3,3' },
    markerEnd: { type: MarkerType.ArrowClosed }
  }
];

export const UnifiedRogerFlowchart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    activeSubsystem: null,
    showDetails: false
  });

  // Handle node clicks for drill-down
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const nodeData = node.data as NodeData;
    const subsystem = nodeData.subsystem;
    
    if (drillDown.activeSubsystem === subsystem) {
      // Toggle details view
      setDrillDown(prev => ({
        ...prev,
        showDetails: !prev.showDetails
      }));
    } else {
      // Select new subsystem
      setDrillDown({
        activeSubsystem: subsystem,
        showDetails: true
      });
    }
  }, [drillDown.activeSubsystem]);

  // Get active node details
  const getActiveNodeDetails = (): string | null => {
    if (!drillDown.activeSubsystem || !drillDown.showDetails) return null;
    
    const activeNode = nodes.find(node => {
      const nodeData = node.data as NodeData;
      return nodeData.subsystem === drillDown.activeSubsystem;
    });
    
    if (activeNode) {
      const nodeData = activeNode.data as NodeData;
      return nodeData.details;
    }
    
    return null;
  };

  // Update node styles based on selection
  const enhancedNodes = nodes.map(node => {
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

  const activeDetails = getActiveNodeDetails();

  return (
    <div className="w-full h-screen bg-gray-50 relative">
      <div className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Unified Roger Architecture & Decision Flow
        </h1>
        <p className="text-gray-600 mt-1">
          Complete system showing both architecture and decision logic. Click any component for detailed information.
        </p>
        <div className="mt-2 text-sm text-blue-600">
          💡 Click on any system component to see detailed information about when and why it's used
        </div>
      </div>
      
      {/* Drill-down details panel */}
      {activeDetails && (
        <div className="absolute top-20 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border-2 border-pink-400 max-w-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800">System Details</h3>
            <button 
              onClick={() => setDrillDown({ activeSubsystem: null, showDetails: false })}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{activeDetails}</p>
        </div>
      )}
      
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
            nodeColor={(node) => {
              const nodeData = node.data as NodeData;
              if (nodeData?.subsystem === drillDown.activeSubsystem) return '#ff4081';
              if (node.id.includes('crisis')) return '#ffcdd2';
              if (node.id.includes('fast') || node.id.includes('greeting')) return '#c8e6c9';
              if (node.id.includes('emotional') || node.id.includes('emotion')) return '#e1bee7';
              if (node.id.includes('complex') || node.id.includes('rag')) return '#b3e5fc';
              if (node.id.includes('memory')) return '#fff8e1';
              if (node.id.includes('personality')) return '#f1f8e9';
              return '#f5f5f5';
            }}
            pannable 
            zoomable 
          />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-xs">
        <h4 className="font-bold mb-2">Processing Paths</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-600"></div>
            <span>Crisis (Emergency)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-600"></div>
            <span>Fast (Greetings)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-600"></div>
            <span>Standard (Emotional)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-600"></div>
            <span>Complex (Full Processing)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedRogerFlowchart;
