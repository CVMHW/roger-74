
import { Node } from '@xyflow/react';
import { NodeData } from './types';

export const baseNodes: Node<NodeData>[] = [
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
