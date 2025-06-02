
import React from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes: Node[] = [
  // Input
  {
    id: 'user-input',
    type: 'input',
    position: { x: 400, y: 50 },
    data: { label: 'User Input' },
    style: { backgroundColor: '#e3f2fd', border: '2px solid #1976d2' }
  },

  // Smart Router
  {
    id: 'smart-router',
    position: { x: 350, y: 150 },
    data: { label: 'Smart Interaction Router\n(Route Determination)' },
    style: { backgroundColor: '#fff3e0', border: '2px solid #f57c00', width: 200, textAlign: 'center' }
  },

  // Crisis Detection Branch
  {
    id: 'crisis-detection',
    position: { x: 50, y: 250 },
    data: { label: 'Crisis Detection\n(Highest Priority)' },
    style: { backgroundColor: '#ffebee', border: '2px solid #d32f2f', width: 150, textAlign: 'center' }
  },
  {
    id: 'crisis-response',
    position: { x: 50, y: 350 },
    data: { label: 'Emergency Response\n& Resources' },
    style: { backgroundColor: '#ffcdd2', border: '2px solid #c62828', width: 150, textAlign: 'center' }
  },

  // Greeting Detection Branch
  {
    id: 'greeting-detection',
    position: { x: 250, y: 250 },
    data: { label: 'Greeting Detection\n(Fast Path)' },
    style: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50', width: 150, textAlign: 'center' }
  },
  {
    id: 'minimal-processing',
    position: { x: 250, y: 350 },
    data: { label: 'Minimal Processing\n(200ms target)' },
    style: { backgroundColor: '#c8e6c9', border: '2px solid #388e3c', width: 150, textAlign: 'center' }
  },

  // Emotional Processing Branch
  {
    id: 'emotion-detection',
    position: { x: 450, y: 250 },
    data: { label: 'Emotion Detection\n& Analysis' },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 150, textAlign: 'center' }
  },

  // Complex Processing Branch
  {
    id: 'complex-processing',
    position: { x: 650, y: 250 },
    data: { label: 'Complex Processing\n(Full Pipeline)' },
    style: { backgroundColor: '#e1f5fe', border: '2px solid #0288d1', width: 150, textAlign: 'center' }
  },

  // Nervous System Coordinator
  {
    id: 'nervous-system',
    position: { x: 400, y: 400 },
    data: { label: 'Roger Nervous System\nCoordinator' },
    style: { backgroundColor: '#fce4ec', border: '2px solid #c2185b', width: 200, textAlign: 'center' }
  },

  // Processing Systems
  {
    id: 'memory-processing',
    position: { x: 150, y: 500 },
    data: { label: 'Memory Systems\n• Working Memory\n• Short-term\n• Long-term' },
    style: { backgroundColor: '#fff8e1', border: '2px solid #ff8f00', width: 150, textAlign: 'center' }
  },
  {
    id: 'personality-insights',
    position: { x: 350, y: 500 },
    data: { label: 'Personality Insights\n& Roger Traits' },
    style: { backgroundColor: '#f1f8e9', border: '2px solid #689f38', width: 150, textAlign: 'center' }
  },
  {
    id: 'rag-processing',
    position: { x: 550, y: 500 },
    data: { label: 'RAG Enhancement\n& Knowledge Retrieval' },
    style: { backgroundColor: '#e8eaf6', border: '2px solid #3f51b5', width: 150, textAlign: 'center' }
  },
  {
    id: 'cvmhw-knowledge',
    position: { x: 750, y: 500 },
    data: { label: 'CVMHW Knowledge\n& Policies' },
    style: { backgroundColor: '#e0f2f1', border: '2px solid #00695c', width: 150, textAlign: 'center' }
  },

  // Response Processing
  {
    id: 'response-processor',
    position: { x: 400, y: 650 },
    data: { label: 'Response Processor\n& Enhancement' },
    style: { backgroundColor: '#fff3e0', border: '2px solid #ef6c00', width: 200, textAlign: 'center' }
  },

  // Verification Systems
  {
    id: 'hallucination-prevention',
    position: { x: 200, y: 750 },
    data: { label: 'Hallucination\nPrevention' },
    style: { backgroundColor: '#ffebee', border: '2px solid #d32f2f', width: 150, textAlign: 'center' }
  },
  {
    id: 'emotional-verification',
    position: { x: 400, y: 750 },
    data: { label: 'Emotional\nVerification' },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 150, textAlign: 'center' }
  },
  {
    id: 'final-compliance',
    position: { x: 600, y: 750 },
    data: { label: 'Final Compliance\n& Safety Check' },
    style: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50', width: 150, textAlign: 'center' }
  },

  // Output
  {
    id: 'typed-response',
    type: 'output',
    position: { x: 350, y: 850 },
    data: { label: 'Typed Response\nto User' },
    style: { backgroundColor: '#e3f2fd', border: '2px solid #1976d2', width: 200, textAlign: 'center' }
  },

  // Feedback Loop
  {
    id: 'conversation-history',
    position: { x: 650, y: 850 },
    data: { label: 'Update Conversation\nHistory & Memory' },
    style: { backgroundColor: '#fff8e1', border: '2px solid #ff8f00', width: 150, textAlign: 'center' }
  }
];

const edges: Edge[] = [
  // Main flow
  { id: 'e1', source: 'user-input', target: 'smart-router', markerEnd: { type: MarkerType.ArrowClosed } },
  
  // Router branches
  { id: 'e2a', source: 'smart-router', target: 'crisis-detection', label: 'Crisis Content', style: { stroke: '#d32f2f' } },
  { id: 'e2b', source: 'smart-router', target: 'greeting-detection', label: 'Simple Greeting', style: { stroke: '#4caf50' } },
  { id: 'e2c', source: 'smart-router', target: 'emotion-detection', label: 'Emotional Content', style: { stroke: '#7b1fa2' } },
  { id: 'e2d', source: 'smart-router', target: 'complex-processing', label: 'Complex Input', style: { stroke: '#0288d1' } },

  // Crisis path
  { id: 'e3a', source: 'crisis-detection', target: 'crisis-response', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4a', source: 'crisis-response', target: 'typed-response', label: 'Emergency', style: { stroke: '#d32f2f' } },

  // Greeting path
  { id: 'e3b', source: 'greeting-detection', target: 'minimal-processing', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4b', source: 'minimal-processing', target: 'typed-response', label: 'Fast Response', style: { stroke: '#4caf50' } },

  // Standard processing paths
  { id: 'e3c', source: 'emotion-detection', target: 'nervous-system', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3d', source: 'complex-processing', target: 'nervous-system', markerEnd: { type: MarkerType.ArrowClosed } },

  // Nervous system to processing systems
  { id: 'e5a', source: 'nervous-system', target: 'memory-processing', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5b', source: 'nervous-system', target: 'personality-insights', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5c', source: 'nervous-system', target: 'rag-processing', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5d', source: 'nervous-system', target: 'cvmhw-knowledge', markerEnd: { type: MarkerType.ArrowClosed } },

  // Processing to response processor
  { id: 'e6a', source: 'memory-processing', target: 'response-processor', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6b', source: 'personality-insights', target: 'response-processor', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6c', source: 'rag-processing', target: 'response-processor', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6d', source: 'cvmhw-knowledge', target: 'response-processor', markerEnd: { type: MarkerType.ArrowClosed } },

  // Verification pipeline
  { id: 'e7a', source: 'response-processor', target: 'hallucination-prevention', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7b', source: 'response-processor', target: 'emotional-verification', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7c', source: 'response-processor', target: 'final-compliance', markerEnd: { type: MarkerType.ArrowClosed } },

  // Final output
  { id: 'e8a', source: 'hallucination-prevention', target: 'typed-response', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8b', source: 'emotional-verification', target: 'typed-response', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8c', source: 'final-compliance', target: 'typed-response', markerEnd: { type: MarkerType.ArrowClosed } },

  // Feedback loop
  { id: 'e9', source: 'typed-response', target: 'conversation-history', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e10', source: 'conversation-history', target: 'memory-processing', label: 'Memory Update', style: { stroke: '#ff8f00', strokeDasharray: '5,5' } }
];

export const RogerFlowchart: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Roger AI Conversation Processing Pipeline</h1>
        <p className="text-gray-600 mt-1">Complete visual representation of how Roger handles all conversations</p>
      </div>
      
      <div className="h-[calc(100vh-80px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          style={{ backgroundColor: '#f9fafb' }}
        >
          <Background color="#e5e7eb" gap={20} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              if (node.id.includes('crisis')) return '#ffcdd2';
              if (node.id.includes('greeting')) return '#c8e6c9';
              if (node.id.includes('emotion')) return '#e1bee7';
              if (node.id.includes('complex')) return '#b3e5fc';
              return '#f5f5f5';
            }}
            pannable 
            zoomable 
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default RogerFlowchart;
