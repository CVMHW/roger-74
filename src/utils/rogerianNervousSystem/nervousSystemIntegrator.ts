/**
 * Unified Nervous System Integrator
 * 
 * Integrates all Roger's systems into a single processing pipeline
 */

import { processEmotions } from './processors/emotionProcessor';
import { processCrisis } from './processors/crisisProcessor';
import { processSmallTalk } from './processors/smallTalkProcessor';
import { processMemory } from './processors/memoryProcessor';
import { processRAG } from './processors/ragProcessor';
import { processPersonality } from './processors/personalityProcessor';
import { EmotionalContext, CrisisContext, MemoryContext, RAGContext, SmallTalkContext, PersonalityInsights } from './core/types';
import { identifyEnhancedFeelings } from '../reflection/feelingDetection';

/**
 * Unified context type for the entire nervous system
 */
export interface RogerNervousSystemContext {
  emotionalContext: EmotionalContext;
  crisisContext: CrisisContext;
  memoryContext: MemoryContext;
  ragContext: RAGContext;
  smallTalkContext: SmallTalkContext;
  personalityInsights: PersonalityInsights;
}

/**
 * Process user input through Roger's comprehensive nervous system
 */
export const processRogerianNervousSystem = async (
  originalResponse: string,
  userInput: string,
  conversationHistory: string[] = [],
  messageCount: number = 0,
  updateStage?: () => void
): Promise<{
  enhancedResponse: string;
  context: RogerNervousSystemContext;
  systemsEngaged: string[];
}> => {
  console.log("🧠 ROGERIAN NERVOUS SYSTEM: Starting comprehensive processing");
  
  const systemsEngaged: string[] = [];
  let enhancedResponse = originalResponse;
  
  try {
    // Stage 1: Process Emotions (PRIMARY SYSTEM)
    console.log("🧠 Stage 1: Processing emotional context");
    const emotionalContext = await processEmotions(userInput, conversationHistory);
    systemsEngaged.push('emotion-processor');
    
    // Stage 2: Crisis Detection (HIGHEST PRIORITY)
    console.log("🧠 Stage 2: Crisis detection and intervention");
    const crisisContext = await processCrisis(userInput, updateStage);
    systemsEngaged.push('crisis-processor');
    
    // If crisis detected, return immediately with crisis response
    if (crisisContext.isCrisisDetected) {
      console.log("🚨 CRISIS DETECTED: Returning immediate intervention");
      return {
        enhancedResponse: "I'm really concerned about what you've shared. Your safety is the most important thing right now. Please consider reaching out to a crisis helpline or emergency services.",
        context: {
          emotionalContext,
          crisisContext,
          memoryContext: { relevantMemories: [], isNewConversation: false, conversationThemes: [] },
          ragContext: { shouldApplyRAG: false, confidence: 0.1 },
          smallTalkContext: { isSmallTalk: false, confidence: 0.1 },
          personalityInsights: { shouldIncludeInsight: false, confidence: 0.1 }
        },
        systemsEngaged: [...systemsEngaged, 'crisis-intervention']
      };
    }
    
    // Stage 3: Small Talk Detection
    console.log("🧠 Stage 3: Small talk analysis");
    const smallTalkContext = await processSmallTalk(userInput, conversationHistory);
    systemsEngaged.push('smalltalk-processor');
    
    // Stage 4: Memory Processing
    console.log("🧠 Stage 4: Memory context processing");
    const memoryContext = await processMemory(userInput, emotionalContext, messageCount);
    systemsEngaged.push('memory-processor');
    
    // Stage 5: RAG Processing (if appropriate)
    console.log("🧠 Stage 5: RAG context processing");
    const ragContext = await processRAG(userInput, emotionalContext, conversationHistory, smallTalkContext);
    systemsEngaged.push('rag-processor');
    
    // Stage 6: Personality Insights
    console.log("🧠 Stage 6: Personality insights generation");
    const personalityInsights = await processPersonality(userInput, emotionalContext);
    systemsEngaged.push('personality-processor');
    
    // Stage 7: Response Enhancement
    console.log("🧠 Stage 7: Response enhancement and integration");
    
    // Apply memory-based enhancements
    if (memoryContext.relevantMemories.length > 0) {
      const memoryInsights = memoryContext.relevantMemories
        .slice(0, 2)
        .map(mem => mem.content)
        .join(' ');
      
      // Fixed: Using only one argument for identifyEnhancedFeelings
      const enhancedFeelings = identifyEnhancedFeelings(memoryInsights);
      
      if (enhancedFeelings.length > 0) {
        enhancedResponse = `I remember you mentioned feeling ${enhancedFeelings[0].detectedWord}. ${enhancedResponse}`;
        systemsEngaged.push('memory-enhancement');
      }
    }
    
    // Apply RAG enhancements
    if (ragContext.shouldApplyRAG && ragContext.retrievedKnowledge && ragContext.retrievedKnowledge.length > 0) {
      const relevantKnowledge = ragContext.retrievedKnowledge[0];
      if (relevantKnowledge.includes('depression') && !enhancedResponse.toLowerCase().includes('depression')) {
        enhancedResponse = `I understand this relates to depression. ${enhancedResponse}`;
        systemsEngaged.push('rag-enhancement');
      }
    }
    
    // Apply personality insights
    if (personalityInsights.shouldIncludeInsight && personalityInsights.insight) {
      enhancedResponse += ` ${personalityInsights.insight}`;
      systemsEngaged.push('personality-enhancement');
    }
    
    // Create comprehensive context
    const context: RogerNervousSystemContext = {
      emotionalContext,
      crisisContext,
      memoryContext,
      ragContext,
      smallTalkContext,
      personalityInsights
    };
    
    console.log(`🧠 ROGERIAN NERVOUS SYSTEM: Processing complete. ${systemsEngaged.length} systems engaged.`);
    
    return {
      enhancedResponse,
      context,
      systemsEngaged
    };
    
  } catch (error) {
    console.error("🧠 ROGERIAN NERVOUS SYSTEM: Error in processing", error);
    
    // Return basic fallback
    return {
      enhancedResponse: originalResponse,
      context: {
        emotionalContext: { hasDetectedEmotion: false, isDepressionMentioned: false, confidence: 0.1 },
        crisisContext: { isCrisisDetected: false },
        memoryContext: { relevantMemories: [], isNewConversation: false, conversationThemes: [] },
        ragContext: { shouldApplyRAG: false, confidence: 0.1 },
        smallTalkContext: { isSmallTalk: false, confidence: 0.1 },
        personalityInsights: { shouldIncludeInsight: false, confidence: 0.1 }
      },
      systemsEngaged: ['error-fallback']
    };
  }
};
