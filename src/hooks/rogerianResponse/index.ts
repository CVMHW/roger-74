
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
  getContextualMemory,
  recordToMemory
} from '../../utils/reflection/feelingDetection';
import { initializeNLPModel } from '../../utils/nlpProcessor';
import { processResponseThroughMasterRules } from '../../utils/response/responseProcessor';
import { checkAllRules } from '../../utils/rulesEnforcement/rulesEnforcer';
import { applyMemoryRules } from '../../utils/rulesEnforcement/memoryEnforcer';
import { addToFiveResponseMemory, verifyFiveResponseMemorySystem } from '../../utils/memory/fiveResponseMemory';

// Initialize the NLP model when the module loads
initializeNLPModel().catch(error => console.error('Failed to initialize NLP model:', error));

// Verify 5ResponseMemory system is operational
verifyFiveResponseMemorySystem();

/**
 * Hook for generating Rogerian responses to user messages
 * Enhanced with pattern-matching NLP capabilities and UNCONDITIONAL memory retention
 */
const useRogerianResponse = (): UseRogerianResponseReturn => {
  // UNCONDITIONAL: Run rule compliance check on every execution
  checkAllRules();
  
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
  
  // Enhanced process user message with pattern-matching NLP capabilities 
  // and UNCONDITIONAL memory utilization
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    try {
      console.log("UNCONDITIONAL RULE: Processing new user message");
      
      // Run rule enforcement check at beginning of processing
      checkAllRules();
      
      // CRITICAL: Record to 5ResponseMemory
      addToFiveResponseMemory('patient', userInput);
      
      // UNCONDITIONAL RULE: Always update conversation history
      updateConversationHistory(userInput);
      
      // Use enhanced pattern matching for better understanding
      try {
        // Analyze message with pattern matching
        const feelingResult = await detectEnhancedFeelings(userInput);
        
        // Log enhanced understanding
        console.log("Detected feelings:", feelingResult);
        
        // UNCONDITIONAL RULE: Access memory for context
        const persistentFeelings = getPersistentFeelings();
        console.log("Persistent feelings:", persistentFeelings);
        
        const dominantTopics = getDominantTopics();
        console.log("Dominant topics:", dominantTopics);
        
        // UNCONDITIONAL RULE: Always use memory
        const memory = getContextualMemory(userInput);
        
        // If we detect consistent emotions or topics, create more targeted responses
        if ((persistentFeelings.length > 0 || dominantTopics.length > 0)) {
          
          // Create enhanced context-aware response
          let enhancedResponse = "";
          
          // Acknowledge persistent emotions if present
          if (persistentFeelings.length > 0) {
            enhancedResponse = `I remember you've mentioned feeling ${persistentFeelings.join(", ")} several times. `;
            
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
              enhancedResponse = "I remember we've been focusing on ";
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
      
      // UNCONDITIONAL MEMORY RULE: Process response through master rules
      let finalResponseText = response.text;
      
      // Always process through master rules to ensure memory utilization
      finalResponseText = processResponseThroughMasterRules(
        finalResponseText,
        userInput,
        messageCount,
        conversationHistory
      );
      
      // UNCONDITIONAL RULE: Force memory enhancement 
      finalResponseText = applyMemoryRules(
        finalResponseText,
        userInput,
        conversationHistory
      );
      
      // UNCONDITIONAL RULE: Record final response to memory
      recordToMemory(userInput, finalResponseText);
      
      // CRITICAL: Record to 5ResponseMemory
      addToFiveResponseMemory('roger', finalResponseText);
      
      // Return the memory-enhanced response
      const finalResponse = createMessage(finalResponseText, 'roger');
      return finalResponse;
      
    } catch (error) {
      console.error("Error in processUserMessage:", error);
      
      // UNCONDITIONAL RULE: Even in error, attempt to record the interaction
      try {
        recordToMemory(userInput, "Error processing response");
        
        // CRITICAL: Record to 5ResponseMemory even in error case
        addToFiveResponseMemory('patient', userInput);
        addToFiveResponseMemory('roger', "Error processing response");
      } catch (memoryError) {
        console.error("Failed to record to memory during error:", memoryError);
      }
      
      // Return a fallback response if an error occurs
      return Promise.resolve(createMessage(
        "I remember what you've shared with me. Could you tell me more about what's been happening?", 
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
