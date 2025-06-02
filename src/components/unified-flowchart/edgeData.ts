
import { Edge, MarkerType } from '@xyflow/react';

export const baseEdges: Edge[] = [
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
