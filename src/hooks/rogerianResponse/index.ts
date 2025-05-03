
import { useState, useEffect, useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import useTypingEffect from '../useTypingEffect';
import useAdaptiveResponse from '../useAdaptiveResponse';
import { useConcernDetection } from '../response/concernDetection';
import { useConversationStage } from '../response/conversationStageManager';
import { useResponseCompliance } from '../response/responseCompliance';
import { useResponseGenerator } from '../response/responseGenerator';
import { useResponseProcessing } from '../response/responseProcessing';
import { createMessage } from '../../utils/messageUtils';
import { useAlternativeResponseGenerator } from '../response/alternativeResponseGenerator';
import { useFeedbackLoopHandler } from '../response/feedbackLoopHandler';
import { handlePotentialDeception } from './deceptionHandler';
import { useRogerianState } from './stateManagement';
import { handleEmotionalPatterns } from './emotionalResponseHandlers';
import { processUserMessage as processMessage } from './messageProcessor';
import { RecentCrisisMessage, UseRogerianResponseReturn } from './types';
import { 
  detectEnhancedFeelings, 
  getPersistentFeelings, 
  getDominantTopics, 
  getAllMemory,
  getContextualMemory,
  recordToMemory
} from '../../utils/reflection/feelingDetection';
import { initializeNLPModel } from '../../utils/nlpProcessor';
import { enforceMemoryRule } from '../../utils/masterRules/unconditionalRuleProtections';

// Initialize the NLP model when the module loads
initializeNLPModel().catch(error => console.error('Failed to initialize NLP model:', error));

/**
 * Hook for generating Rogerian responses to user messages
 * Enhanced with transformer-based NLP capabilities and UNCONDITIONAL memory retention
 */
const useRogerianResponse = (): UseRogerianResponseReturn => {
  // Hook for conversation stage management
  const { 
    conversationStage, 
    messageCount, 
    introductionMade,
    updateStage, 
    setIntroductionMade 
  } = useConversationStage();
  
  // Get state management hooks
  const {
    conversationHistory,
    clientPreferences,
    recentResponses,
    feedbackLoopRecoveryMode,
    updateConversationHistory,
    setRecentResponses,
    setFeedbackLoopRecoveryMode
  } = useRogerianState();
  
  // Track potential crisis messaging for deception detection
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<RecentCrisisMessage | null>(null);
  
  // Track if we've detected a feedback loop pattern
  const [feedbackLoopDetected, setFeedbackLoopDetected] = useState<boolean>(false);
  
  // Import all necessary hooks
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();
  const { detectConcerns } = useConcernDetection();
  const { 
    previousResponses, 
    ensureResponseCompliance, 
    addToResponseHistory,
    setPreviousResponses 
  } = useResponseCompliance();
  const { calculateResponseTime, simulateTypingResponse } = useTypingEffect();
  const { generateAlternativeResponse, isResponseRepetitive } = useAlternativeResponseGenerator();
  const { checkForFeedbackLoopComplaints, handleFeedbackLoop } = useFeedbackLoopHandler();
  
  // Hook for response generation
  const { generateResponse } = useResponseGenerator({
    conversationStage,
    messageCount,
    introductionMade,
    adaptiveResponseFn: generateAdaptiveResponse,
    conversationHistory
  });
  
  // Hook for response processing
  const { isTyping, processUserMessage: baseProcessUserMessage } = useResponseProcessing({
    ensureResponseCompliance,
    addToResponseHistory,
    calculateResponseTime,
    simulateTypingResponse
  });
  
  // Effect to prevent response repetition
  useEffect(() => {
    // Keep only the last 5 responses to compare against
    if (recentResponses.length > 5) {
      setRecentResponses(prev => prev.slice(-5));
    }
  }, [recentResponses, setRecentResponses]);
  
  // Handle potential deception with our custom deception handler
  const handlePotentialDeceptionWrapper = useCallback(async (
    originalMessage: string,
    followUpMessage: string
  ): Promise<MessageType | null> => {
    return handlePotentialDeception(originalMessage, followUpMessage, addToResponseHistory);
  }, [addToResponseHistory]);
  
  // Enhanced process user message with NLP capabilities and UNCONDITIONAL memory utilization
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    try {
      // UNCONDITIONAL RULE: Always update conversation history
      updateConversationHistory(userInput);
      
      // Use enhanced NLP for better understanding
      try {
        // Analyze message with transformer model
        const feelingResult = await detectEnhancedFeelings(userInput);
        
        // Log enhanced understanding
        console.log("Enhanced NLP analysis:", {
          feelings: feelingResult.allFeelings,
          primaryFeeling: feelingResult.primaryFeeling,
          topics: feelingResult.topics,
          severity: feelingResult.severity,
        });
        
        // UNCONDITIONAL RULE: Access memory for context
        const memory = getContextualMemory(userInput);
        
        // Check for consistent emotional patterns - using UNCONDITIONAL memory rule
        const persistentFeelings = getPersistentFeelings();
        const dominantTopics = getDominantTopics();
        
        // If we detect consistent emotions or topics, create more targeted responses
        if ((persistentFeelings.length > 0 || dominantTopics.length > 0) && 
            messageCount > 2 && messageCount < 10) {
          
          // Create enhanced context-aware response
          let enhancedResponse = "";
          
          // Acknowledge persistent emotions if present
          if (persistentFeelings.length > 0) {
            enhancedResponse = `I notice you've mentioned feeling ${persistentFeelings.join(", ")} several times. `;
            
            // Add relevant follow-up based on emotion
            if (persistentFeelings.includes('angry')) {
              enhancedResponse += "It sounds like this is really frustrating for you. ";
            } else if (persistentFeelings.includes('sad')) {
              enhancedResponse += "This seems to be weighing heavily on you. ";
            } else if (persistentFeelings.includes('anxious')) {
              enhancedResponse += "This appears to be causing you some worry. ";
            }
          }
          
          // Acknowledge dominant topics
          if (dominantTopics.length > 0) {
            if (enhancedResponse) {
              enhancedResponse += "I also notice we've been talking about ";
            } else {
              enhancedResponse = "I notice we've been focusing on ";
            }
            enhancedResponse += `${dominantTopics.join(", ")}. `;
          }
          
          // Add appropriate follow-up question
          if (enhancedResponse) {
            enhancedResponse += "What aspect of this feels most important for us to discuss right now?";
            
            // If this is detailed enough, use it directly
            if (enhancedResponse.length > 80 && Math.random() < 0.7) {
              // Update conversation stage
              updateStage();
              
              // UNCONDITIONAL RULE: Record response to memory
              recordToMemory(userInput, enhancedResponse);
              
              // Return the enhanced context response
              return Promise.resolve(createMessage(enhancedResponse, 'roger'));
            }
          }
        }
      } catch (error) {
        console.error("Error in enhanced NLP processing:", error);
      }
      
      // Check if the user is indicating Roger isn't listening or is stuck in a loop
      const feedbackLoopResponse = handleFeedbackLoop(userInput, conversationHistory);
      if (feedbackLoopResponse) {
        // Update conversation stage
        updateStage();
        
        // UNCONDITIONAL RULE: Record response to memory
        recordToMemory(userInput, feedbackLoopResponse);
        
        // Create a message with the recovery response
        return Promise.resolve(createMessage(feedbackLoopResponse, 'roger'));
      }
      
      // Handle emotional patterns and special cases
      const emotionalResponse = await handleEmotionalPatterns(
        userInput, 
        conversationHistory,
        baseProcessUserMessage,
        detectConcerns,
        updateStage
      );
      
      if (emotionalResponse) {
        // UNCONDITIONAL RULE: Record response to memory
        recordToMemory(userInput, emotionalResponse.text);
        
        return emotionalResponse;
      }
      
      // Process standard messages
      const response = await processMessage(
        userInput,
        detectConcerns,
        generateResponse,
        baseProcessUserMessage,
        conversationHistory,
        clientPreferences,
        updateStage
      );
      
      // UNCONDITIONAL RULE: Record final response to memory
      recordToMemory(userInput, response.text);
      
      return response;
    } catch (error) {
      console.error("Error in processUserMessage:", error);
      
      // UNCONDITIONAL RULE: Even in error, attempt to record the interaction
      try {
        recordToMemory(userInput, "Error processing response");
      } catch (memoryError) {
        console.error("Failed to record to memory during error:", memoryError);
      }
      
      // Return a fallback response if an error occurs
      return Promise.resolve(createMessage(
        "I'm sorry, I'm having trouble responding right now. Could you try again?", 
        'roger'
      ));
    }
  }, [
    updateConversationHistory,
    handleFeedbackLoop,
    conversationHistory,
    updateStage,
    baseProcessUserMessage,
    detectConcerns,
    clientPreferences,
    generateResponse,
    messageCount
  ]);
  
  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    currentApproach,
    handlePotentialDeception: handlePotentialDeceptionWrapper
  };
};

export default useRogerianResponse;
