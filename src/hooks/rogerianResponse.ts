
/**
 * Enhanced Rogerian Response Hook with Unified Integration
 * 
 * Now properly integrated with all new systems and memory layers
 */

import { unifiedMemoryProcessor } from '../memory/UnifiedMemoryProcessor';
import { unifiedRAGIntegrator } from '../integration/UnifiedRAGIntegrator';
import { accessControlSystem } from '../security/AccessControlSystem';
import { userFeedbackSystem } from '../feedback/UserFeedbackSystem';
import originalUseRogerianResponse from './rogerianResponse/index';
import { extractEmotionsFromInput } from '../utils/response/processor/emotions';

/**
 * Fully integrated Rogerian Response Hook
 */
const useRogerianResponse = () => {
  const originalHook = originalUseRogerianResponse();
  let conversationHistory: string[] = [];
  let sessionId: string | undefined;

  // Enhanced processUserMessage with full integration
  const enhancedProcessUserMessage = async (userInput: string) => {
    try {
      console.log("🧠 ENHANCED ROGERIAN (UNIFIED): Processing with full integration");
      
      // Initialize session if needed
      if (!sessionId) {
        sessionId = await accessControlSystem.createUserSession(
          `user_${Date.now()}`,
          { privacyLevel: 'private', memoryRetentionDays: 30 }
        );
      }

      // Extract emotional context using unified system
      const emotionInfo = extractEmotionsFromInput(userInput);
      
      // Add to conversation history
      conversationHistory.push(userInput);
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }

      // Store user input through unified memory processor
      await unifiedMemoryProcessor.addMemory(
        userInput,
        'patient',
        {
          emotions: emotionInfo.emotionalContent?.hasEmotion ? [emotionInfo.emotionalContent.primaryEmotion] : [],
          isDepressionMentioned: emotionInfo.isDepressionMentioned,
          conversationTurn: conversationHistory.length
        },
        emotionInfo.isDepressionMentioned ? 0.9 : 0.7,
        sessionId
      );

      // Process through original hook first
      const originalResponse = await originalHook.processUserMessage(userInput);

      // Apply unified RAG integration
      const ragResult = await unifiedRAGIntegrator.processUnifiedRAG(
        originalResponse.text,
        {
          userInput,
          conversationHistory,
          sessionId,
          emotionalContext: emotionInfo,
          memoryContext: {
            hasHistory: conversationHistory.length > 1,
            emotionalState: emotionInfo.emotionalContent?.primaryEmotion
          }
        }
      );

      // Store enhanced response through unified memory processor
      await unifiedMemoryProcessor.addMemory(
        ragResult.enhancedResponse,
        'roger',
        {
          originalResponse: originalResponse.text,
          enhancementApplied: ragResult.systemsEngaged.length > 0,
          confidence: ragResult.confidence,
          systemsUsed: ragResult.systemsEngaged
        },
        0.8,
        sessionId
      );

      // Add to conversation history
      conversationHistory.push(ragResult.enhancedResponse);
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }

      // Submit feedback if confidence is low
      if (ragResult.confidence < 0.6) {
        await userFeedbackSystem.submitFeedback(
          sessionId,
          sessionId,
          {
            type: 'suggestion',
            content: `Low confidence response: ${ragResult.confidence}`,
            severity: 'medium',
            category: 'response-quality'
          }
        );
      }

      console.log(`🧠 ENHANCED ROGERIAN (UNIFIED): Complete. Confidence: ${ragResult.confidence}, Systems: ${ragResult.systemsEngaged.join(', ')}`);

      // Return enhanced response with all metadata
      return {
        ...originalResponse,
        text: ragResult.enhancedResponse,
        metadata: {
          confidence: ragResult.confidence,
          systemsEngaged: ragResult.systemsEngaged,
          memoryIntegration: ragResult.memoryIntegration,
          evaluationMetrics: ragResult.evaluationMetrics
        }
      };

    } catch (error) {
      console.error("🧠 ENHANCED ROGERIAN (UNIFIED): Error in processing:", error);
      
      // Fallback to original implementation
      return originalHook.processUserMessage(userInput);
    }
  };

  // Return enhanced hook with all original functionality
  return {
    ...originalHook,
    processUserMessage: enhancedProcessUserMessage,
    getSessionId: () => sessionId,
    getConversationHistory: () => conversationHistory,
    getMemoryStatus: () => unifiedMemoryProcessor.getMemoryStatus()
  };
};

export default useRogerianResponse;
