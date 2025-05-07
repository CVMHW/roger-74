
/**
 * Conversation Pattern Detection
 * 
 * Specialized utility for detecting patterns in conversations
 * and preventing repetitive interaction loops
 */

// Export main functionality
export { detectConversationPatterns } from './detector';
export { detectTopicRepetition } from './topicExtractor';

// Export utility functions
export { 
  getSentenceStructure, 
  calculateStructureSimilarity 
} from './sentenceAnalyzer';
export { extractQuestions } from './questionExtractor';
export { calculateSimilarity } from './similarityUtils';
export { extractTopics } from './topicExtractor';

// Export types
export type { PatternDetectionResult } from './types';
