
/**
 * Optimized Response Processor
 * 
 * Uses smart routing to minimize processing time while maintaining quality
 * Target response times: Greeting 400ms, Crisis 500ms, Complex 800ms
 */

import { determineOptimalRoute, executeMinimalProcessing, executeStandardProcessing } from '../smartInteractionRouter';
import { processOptimizedMemory } from '../optimizedMemoryManager';
import { detectEmotionConsolidated } from '../emotions/consolidatedEmotionDetector';

export interface OptimizedResponseResult {
  response: string;
  processingTime: number;
  systemsUsed: string[];
  confidence: number;
  routeType: string;
}

/**
 * Process user message with optimized routing
 */
export const processOptimizedResponse = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<OptimizedResponseResult> => {
  const startTime = Date.now();
  
  try {
    // Step 1: Determine optimal route (fast)
    const route = determineOptimalRoute(userInput, conversationHistory);
    
    let response: string;
    let systemsUsed: string[] = [...route.systemsToUse];
    let confidence = 0.8;
    
    // Step 2: Execute based on route type
    switch (route.type) {
      case 'greeting':
        response = await executeMinimalProcessing(userInput);
        confidence = 0.9;
        break;
        
      case 'crisis':
        response = await executeCrisisProcessing(userInput, conversationHistory);
        systemsUsed.push('crisis-priority');
        confidence = 0.95;
        break;
        
      case 'emotional':
        response = await executeStandardProcessing(userInput, conversationHistory);
        confidence = 0.85;
        break;
        
      case 'complex':
      default:
        response = await executeComplexProcessing(userInput, conversationHistory);
        systemsUsed.push('full-pipeline');
        confidence = 0.8;
        break;
    }
    
    const processingTime = Date.now() - startTime;
    
    // Log if we exceeded target time
    if (processingTime > route.estimatedTime) {
      console.warn(`Processing exceeded target ${route.estimatedTime}ms: ${processingTime}ms for ${route.type}`);
    }
    
    return {
      response,
      processingTime,
      systemsUsed,
      confidence,
      routeType: route.type
    };
    
  } catch (error) {
    console.error('Optimized response processing error:', error);
    
    return {
      response: "I'm here to listen. What would you like to share?",
      processingTime: Date.now() - startTime,
      systemsUsed: ['error-fallback'],
      confidence: 0.7,
      routeType: 'fallback'
    };
  }
};

/**
 * Crisis processing - fast and focused
 */
const executeCrisisProcessing = async (userInput: string, conversationHistory: string[]): Promise<string> => {
  const emotionResult = detectEmotionConsolidated(userInput);
  
  if (emotionResult.isCrisis) {
    return emotionResult.rogerResponse;
  }
  
  return "I hear how difficult this is for you right now. You're not alone in this. Can you tell me more about what you're experiencing?";
};

/**
 * Complex processing - full pipeline when needed
 */
const executeComplexProcessing = async (userInput: string, conversationHistory: string[]): Promise<string> => {
  // Use optimized memory
  const memoryResult = await processOptimizedMemory(userInput, 'complex', conversationHistory);
  
  // Get emotion analysis
  const emotionResult = detectEmotionConsolidated(userInput);
  
  // Use Roger's personality
  const { getRogerPersonalityInsight } = await import('../reflection/rogerPersonality');
  const personalityResponse = getRogerPersonalityInsight(userInput);
  
  // Combine results efficiently
  return emotionResult.rogerResponse || personalityResponse || "I hear what you're sharing. Tell me more about how this is affecting you.";
};
