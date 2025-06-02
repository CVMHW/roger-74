
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
    style: { backgroundColor: '#e3f2fd', border: '2px solid #1976d2', width: 120 }
  },

  // Initial Analysis
  {
    id: 'input-analysis',
    position: { x: 350, y: 150 },
    data: { label: 'Input Analysis\n& Classification' },
    style: { backgroundColor: '#fff3e0', border: '2px solid #f57c00', width: 160, textAlign: 'center' }
  },

  // Content Type Detection
  {
    id: 'content-detection',
    position: { x: 350, y: 250 },
    data: { label: 'Content Type\nDetection' },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 160, textAlign: 'center' }
  },

  // Detection Results - Level 1
  {
    id: 'crisis-detected',
    position: { x: 50, y: 350 },
    data: { label: 'Crisis Content\nDetected' },
    style: { backgroundColor: '#ffebee', border: '2px solid #d32f2f', width: 120, textAlign: 'center' }
  },
  {
    id: 'smalltalk-detected',
    position: { x: 200, y: 350 },
    data: { label: 'Small Talk\nDetected' },
    style: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50', width: 120, textAlign: 'center' }
  },
  {
    id: 'emotional-detected',
    position: { x: 350, y: 350 },
    data: { label: 'Emotional Content\nDetected' },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 120, textAlign: 'center' }
  },
  {
    id: 'everyday-detected',
    position: { x: 500, y: 350 },
    data: { label: 'Everyday Issue\nDetected' },
    style: { backgroundColor: '#fff8e1', border: '2px solid #ff8f00', width: 120, textAlign: 'center' }
  },
  {
    id: 'complex-detected',
    position: { x: 650, y: 350 },
    data: { label: 'Complex/Deep\nContent' },
    style: { backgroundColor: '#e1f5fe', border: '2px solid #0288d1', width: 120, textAlign: 'center' }
  },

  // Approach Selection
  {
    id: 'approach-selector',
    position: { x: 350, y: 450 },
    data: { label: 'Response Approach\nSelector' },
    style: { backgroundColor: '#fce4ec', border: '2px solid #c2185b', width: 180, textAlign: 'center' }
  },

  // Conversation Context Analysis
  {
    id: 'conversation-analysis',
    position: { x: 150, y: 550 },
    data: { label: 'Conversation Context\nAnalysis' },
    style: { backgroundColor: '#e8eaf6', border: '2px solid #3f51b5', width: 160, textAlign: 'center' }
  },
  {
    id: 'message-history',
    position: { x: 350, y: 550 },
    data: { label: 'Message Count &\nHistory Review' },
    style: { backgroundColor: '#e8eaf6', border: '2px solid #3f51b5', width: 160, textAlign: 'center' }
  },
  {
    id: 'resistance-detection',
    position: { x: 550, y: 550 },
    data: { label: 'Resistance to\nExistential Detected' },
    style: { backgroundColor: '#ffebee', border: '2px solid #d32f2f', width: 160, textAlign: 'center' }
  },

  // Response Type Decisions
  {
    id: 'crisis-response',
    position: { x: 50, y: 650 },
    data: { label: 'Crisis Response\n(Immediate Help)' },
    style: { backgroundColor: '#ffcdd2', border: '2px solid #c62828', width: 140, textAlign: 'center' }
  },
  {
    id: 'practical-response',
    position: { x: 220, y: 650 },
    data: { label: 'Practical Support\n(No Meaning Focus)' },
    style: { backgroundColor: '#c8e6c9', border: '2px solid #388e3c', width: 140, textAlign: 'center' }
  },
  {
    id: 'emotional-reflection',
    position: { x: 390, y: 650 },
    data: { label: 'Emotional Reflection\n(Feeling Focus)' },
    style: { backgroundColor: '#e1bee7', border: '2px solid #8e24aa', width: 140, textAlign: 'center' }
  },
  {
    id: 'meaning-reflection',
    position: { x: 560, y: 650 },
    data: { label: 'Meaning Reflection\n(Logotherapy)' },
    style: { backgroundColor: '#b3e5fc', border: '2px solid #0277bd', width: 140, textAlign: 'center' }
  },

  // Response Configuration
  {
    id: 'response-config',
    position: { x: 350, y: 750 },
    data: { label: 'Response Configuration\n(Spontaneity, Creativity, Logotherapy Strength)' },
    style: { backgroundColor: '#fff9c4', border: '2px solid #f57f17', width: 300, textAlign: 'center' }
  },

  // Final Response
  {
    id: 'final-response',
    type: 'output',
    position: { x: 350, y: 850 },
    data: { label: 'Generated Response\nwith Selected Approach' },
    style: { backgroundColor: '#e3f2fd', border: '2px solid #1976d2', width: 200, textAlign: 'center' }
  }
];

const edges: Edge[] = [
  // Main flow
  { id: 'e1', source: 'user-input', target: 'input-analysis', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2', source: 'input-analysis', target: 'content-detection', markerEnd: { type: MarkerType.ArrowClosed } },

  // Content detection branches
  { id: 'e3a', source: 'content-detection', target: 'crisis-detected', label: 'Crisis', style: { stroke: '#d32f2f' } },
  { id: 'e3b', source: 'content-detection', target: 'smalltalk-detected', label: 'Greeting/Chat', style: { stroke: '#4caf50' } },
  { id: 'e3c', source: 'content-detection', target: 'emotional-detected', label: 'Emotions', style: { stroke: '#7b1fa2' } },
  { id: 'e3d', source: 'content-detection', target: 'everyday-detected', label: 'Daily Issues', style: { stroke: '#ff8f00' } },
  { id: 'e3e', source: 'content-detection', target: 'complex-detected', label: 'Deep/Complex', style: { stroke: '#0288d1' } },

  // To approach selector
  { id: 'e4a', source: 'crisis-detected', target: 'approach-selector', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4b', source: 'smalltalk-detected', target: 'approach-selector', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4c', source: 'emotional-detected', target: 'approach-selector', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4d', source: 'everyday-detected', target: 'approach-selector', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4e', source: 'complex-detected', target: 'approach-selector', markerEnd: { type: MarkerType.ArrowClosed } },

  // Context analysis
  { id: 'e5a', source: 'approach-selector', target: 'conversation-analysis', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5b', source: 'approach-selector', target: 'message-history', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5c', source: 'approach-selector', target: 'resistance-detection', markerEnd: { type: MarkerType.ArrowClosed } },

  // Response type selection
  { id: 'e6a', source: 'conversation-analysis', target: 'crisis-response', label: 'Crisis Path', style: { stroke: '#d32f2f' } },
  { id: 'e6b', source: 'conversation-analysis', target: 'practical-response', label: 'Everyday/Smalltalk', style: { stroke: '#4caf50' } },
  { id: 'e6c', source: 'message-history', target: 'emotional-reflection', label: 'Emotional Content', style: { stroke: '#7b1fa2' } },
  { id: 'e6d', source: 'message-history', target: 'meaning-reflection', label: 'Deep/Existential', style: { stroke: '#0288d1' } },

  // Resistance override
  { id: 'e7', source: 'resistance-detection', target: 'practical-response', label: 'Override to Practical', style: { stroke: '#d32f2f', strokeDasharray: '5,5' } },

  // To configuration
  { id: 'e8a', source: 'crisis-response', target: 'response-config', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8b', source: 'practical-response', target: 'response-config', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8c', source: 'emotional-reflection', target: 'response-config', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8d', source: 'meaning-reflection', target: 'response-config', markerEnd: { type: MarkerType.ArrowClosed } },

  // Final response
  { id: 'e9', source: 'response-config', target: 'final-response', markerEnd: { type: MarkerType.ArrowClosed } }
];

export const ConversationProcessingFlowchart: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Roger's Conversation Processing & Response Selection</h1>
        <p className="text-gray-600 mt-1">How Roger chooses the appropriate response type for each conversation</p>
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
              if (node.id.includes('smalltalk') || node.id.includes('practical')) return '#c8e6c9';
              if (node.id.includes('emotional')) return '#e1bee7';
              if (node.id.includes('meaning') || node.id.includes('complex')) return '#b3e5fc';
              if (node.id.includes('everyday')) return '#fff8e1';
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

export default ConversationProcessingFlowchart;
