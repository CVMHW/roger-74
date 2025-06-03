
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
  // Input Sources
  {
    id: 'user-input',
    type: 'input',
    position: { x: 50, y: 50 },
    data: { label: 'User Input\n"I feel sad"' },
    style: { backgroundColor: '#e3f2fd', border: '2px solid #1976d2', width: 120 }
  },

  // Wrapping Hell Detection Point
  {
    id: 'wrapping-hell-trigger',
    position: { x: 250, y: 50 },
    data: { label: '🔴 WRAPPING HELL\nTRIGGER POINT\n(Multiple System Calls)' },
    style: { backgroundColor: '#ffebee', border: '3px solid #d32f2f', width: 180, textAlign: 'center' }
  },

  // Memory System Confusion
  {
    id: 'memory-confusion',
    position: { x: 50, y: 200 },
    data: { label: 'Memory System\nConfusion\n• False references\n• "Previous conversation"\n• Early convo claims' },
    style: { backgroundColor: '#fff3e0', border: '2px solid #f57c00', width: 150, textAlign: 'center' }
  },

  // Multiple Memory Calls
  {
    id: 'multiple-memory-calls',
    position: { x: 250, y: 200 },
    data: { label: 'Multiple Memory\nSystem Calls\n• 5ResponseMemory\n• MasterMemory\n• FiveResponseMemory\n• MemoryEnhancement' },
    style: { backgroundColor: '#ffcdd2', border: '2px solid #c62828', width: 160, textAlign: 'center' }
  },

  // Hallucination Generator
  {
    id: 'hallucination-generator',
    position: { x: 450, y: 200 },
    data: { label: 'Hallucination\nGenerator\n• Memory conflicts\n• False context\n• "Drawing from..."' },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 150, textAlign: 'center' }
  },

  // System Decision Conflicts
  {
    id: 'decision-conflicts',
    position: { x: 50, y: 350 },
    data: { label: 'System Decision\nConflicts\n• Router confusion\n• Path conflicts\n• Priority chaos' },
    style: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50', width: 150, textAlign: 'center' }
  },

  // Response Processor Overload
  {
    id: 'processor-overload',
    position: { x: 250, y: 350 },
    data: { label: 'Response Processor\nOverload\n• Too many inputs\n• Conflicting data\n• System lag' },
    style: { backgroundColor: '#e1f5fe', border: '2px solid #0288d1', width: 160, textAlign: 'center' }
  },

  // Enhancement Hell
  {
    id: 'enhancement-hell',
    position: { x: 450, y: 350 },
    data: { label: 'Enhancement\nHell Loop\n• memoryEnhancement\n• responseProcessor\n• hallucinationHandler' },
    style: { backgroundColor: '#fff8e1', border: '2px solid #ff8f00', width: 150, textAlign: 'center' }
  },

  // Problematic Output Generation
  {
    id: 'problematic-output',
    position: { x: 150, y: 500 },
    data: { label: 'Problematic Output\nGeneration\n• False memory claims\n• Repetitive patterns\n• Confused responses' },
    style: { backgroundColor: '#ffebee', border: '2px solid #d32f2f', width: 180, textAlign: 'center' }
  },

  // Failed Verification
  {
    id: 'failed-verification',
    position: { x: 350, y: 500 },
    data: { label: 'Failed Verification\n• Systems miss issues\n• Conflicting checks\n• Inadequate prevention' },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 160, textAlign: 'center' }
  },

  // User Receives Bad Response
  {
    id: 'bad-response-output',
    type: 'output',
    position: { x: 250, y: 650 },
    data: { label: '❌ USER RECEIVES\nBAD RESPONSE\n"Drawing from our previous\nconversation, Emotional\nRegulation: The ability..."' },
    style: { backgroundColor: '#ffcdd2', border: '3px solid #c62828', width: 200, textAlign: 'center' }
  },

  // Root Cause Analysis
  {
    id: 'root-cause-analysis',
    position: { x: 600, y: 50 },
    data: { label: '🔍 ROOT CAUSE\nANALYSIS' },
    style: { backgroundColor: '#e8eaf6', border: '3px solid #3f51b5', width: 150, textAlign: 'center' }
  },

  // Circular Dependencies
  {
    id: 'circular-dependencies',
    position: { x: 600, y: 150 },
    data: { label: 'Circular\nDependencies\n• Memory calls memory\n• Processor calls processor\n• Enhancement loops' },
    style: { backgroundColor: '#ffebee', border: '2px solid #d32f2f', width: 160, textAlign: 'center' }
  },

  // Redundant Systems
  {
    id: 'redundant-systems',
    position: { x: 600, y: 250 },
    data: { label: 'Redundant\nSystems\n• Multiple memory stores\n• Duplicate processors\n• Overlapping verification' },
    style: { backgroundColor: '#fff3e0', border: '2px solid #f57c00', width: 160, textAlign: 'center' }
  },

  // Poor State Management
  {
    id: 'poor-state-management',
    position: { x: 600, y: 350 },
    data: { label: 'Poor State\nManagement\n• Global variables\n• Shared memory stores\n• Race conditions' },
    style: { backgroundColor: '#f3e5f5', border: '2px solid #7b1fa2', width: 160, textAlign: 'center' }
  },

  // Solution Framework
  {
    id: 'solution-framework',
    position: { x: 800, y: 200 },
    data: { label: '✅ SOLUTION\nFRAMEWORK' },
    style: { backgroundColor: '#e8f5e8', border: '3px solid #4caf50', width: 150, textAlign: 'center' }
  },

  // Single Source of Truth
  {
    id: 'single-source-truth',
    position: { x: 800, y: 300 },
    data: { label: 'Single Source\nof Truth\n• One memory system\n• Clear data flow\n• No redundancy' },
    style: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50', width: 150, textAlign: 'center' }
  },

  // Clear System Boundaries
  {
    id: 'clear-boundaries',
    position: { x: 800, y: 400 },
    data: { label: 'Clear System\nBoundaries\n• Defined responsibilities\n• No overlapping calls\n• Linear flow' },
    style: { backgroundColor: '#e1f5fe', border: '2px solid #0288d1', width: 150, textAlign: 'center' }
  },

  // Proper Error Handling
  {
    id: 'proper-error-handling',
    position: { x: 800, y: 500 },
    data: { label: 'Proper Error\nHandling\n• Graceful degradation\n• Fallback mechanisms\n• Clear failure paths' },
    style: { backgroundColor: '#fff8e1', border: '2px solid #ff8f00', width: 150, textAlign: 'center' }
  }
];

const edges: Edge[] = [
  // Main flow from input to wrapping hell
  { id: 'e1', source: 'user-input', target: 'wrapping-hell-trigger', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#d32f2f', strokeWidth: 3 } },
  
  // Wrapping hell triggers multiple problems
  { id: 'e2a', source: 'wrapping-hell-trigger', target: 'memory-confusion', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f57c00' } },
  { id: 'e2b', source: 'wrapping-hell-trigger', target: 'multiple-memory-calls', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#c62828' } },
  { id: 'e2c', source: 'wrapping-hell-trigger', target: 'hallucination-generator', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7b1fa2' } },

  // Memory problems cascade
  { id: 'e3a', source: 'memory-confusion', target: 'decision-conflicts', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3b', source: 'multiple-memory-calls', target: 'processor-overload', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3c', source: 'hallucination-generator', target: 'enhancement-hell', markerEnd: { type: MarkerType.ArrowClosed } },

  // System conflicts lead to output problems
  { id: 'e4a', source: 'decision-conflicts', target: 'problematic-output', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4b', source: 'processor-overload', target: 'problematic-output', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4c', source: 'enhancement-hell', target: 'failed-verification', markerEnd: { type: MarkerType.ArrowClosed } },

  // Final bad output
  { id: 'e5a', source: 'problematic-output', target: 'bad-response-output', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5b', source: 'failed-verification', target: 'bad-response-output', markerEnd: { type: MarkerType.ArrowClosed } },

  // Root cause analysis connections
  { id: 'e6a', source: 'wrapping-hell-trigger', target: 'root-cause-analysis', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3f51b5', strokeDasharray: '5,5' } },
  { id: 'e6b', source: 'root-cause-analysis', target: 'circular-dependencies', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6c', source: 'root-cause-analysis', target: 'redundant-systems', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6d', source: 'root-cause-analysis', target: 'poor-state-management', markerEnd: { type: MarkerType.ArrowClosed } },

  // Solution framework connections
  { id: 'e7a', source: 'circular-dependencies', target: 'solution-framework', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#4caf50' } },
  { id: 'e7b', source: 'redundant-systems', target: 'solution-framework', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#4caf50' } },
  { id: 'e7c', source: 'poor-state-management', target: 'solution-framework', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#4caf50' } },

  // Solution implementations
  { id: 'e8a', source: 'solution-framework', target: 'single-source-truth', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8b', source: 'solution-framework', target: 'clear-boundaries', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8c', source: 'solution-framework', target: 'proper-error-handling', markerEnd: { type: MarkerType.ArrowClosed } },

  // Feedback loops showing how problems compound
  { id: 'e9a', source: 'bad-response-output', target: 'memory-confusion', label: 'Stores bad\nresponse', style: { stroke: '#d32f2f', strokeDasharray: '3,3' }, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e9b', source: 'enhancement-hell', target: 'multiple-memory-calls', label: 'Triggers more\ncalls', style: { stroke: '#c62828', strokeDasharray: '3,3' }, markerEnd: { type: MarkerType.ArrowClosed } }
];

export const WrappingHellAnalysisFlowchart: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold text-red-600">🔥 Wrapping Hell Analysis Flowchart</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive analysis of how wrapping hell triggers cascade through Roger's systems
        </p>
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Key Problem Identified:</h3>
          <p className="text-sm text-red-700">
            The "Drawing from our previous conversation, Emotional Regulation: The ability..." response pattern 
            indicates multiple memory systems are conflicting and generating false conversation history.
          </p>
        </div>
      </div>
      
      <div className="h-[calc(100vh-140px)]">
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
              if (node.id.includes('wrapping-hell') || node.id.includes('bad-response')) return '#ffcdd2';
              if (node.id.includes('memory')) return '#fff3e0';
              if (node.id.includes('solution') || node.id.includes('single-source') || node.id.includes('clear-boundaries') || node.id.includes('proper-error')) return '#e8f5e8';
              if (node.id.includes('root-cause')) return '#e8eaf6';
              return '#f5f5f5';
            }}
            pannable 
            zoomable 
          />
        </ReactFlow>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-semibold text-gray-800 mb-2">Critical Issues Identified:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800">Memory System Chaos</h4>
              <p className="text-red-700">Multiple memory systems calling each other creates false conversation history</p>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <h4 className="font-medium text-orange-800">Processing Loops</h4>
              <p className="text-orange-700">Enhancement systems trigger each other in endless loops</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <h4 className="font-medium text-purple-800">State Conflicts</h4>
              <p className="text-purple-700">Shared global state causes race conditions and data corruption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrappingHellAnalysisFlowchart;
