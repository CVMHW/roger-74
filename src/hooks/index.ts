

// Export all hooks from this file for easy importing
export { default as useRogerianResponse } from './rogerianResponse';
export { default as useTypingEffect } from './useTypingEffect';
export { default as useAdaptiveResponse } from './useAdaptiveResponse';
export { useConversationStage } from './response/conversationStageManager';

// Export feelings wheel related exports
export * from '../utils/reflection/feelingsWheel';
export * from '../utils/reflection/childEmotionsWheel';
export * from '../utils/reflection/feelingDetection';

// Export enhanced memory system
export { 
  recordToMemory, 
  getAllMemory, 
  getContextualMemory,
  detectEmotion,
  extractKeyTopics,
  analyzeProblemSeverity,
  detectProblems  
} from '../utils/nlpProcessor';

