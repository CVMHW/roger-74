
import { useState, useCallback } from 'react';
import { RecentCrisisMessage } from './types';
import { extractConversationContext } from '../../utils/conversationEnhancement/repetitionDetector';

/**
 * Hook for managing Rogerian state
 */
export const useRogerianState = () => {
  // Conversation history
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  
  // Client preferences (collected during conversation)
  const [clientPreferences, setClientPreferences] = useState<{[key: string]: any}>({});
  
  // Recent response storage to detect repetition
  const [recentResponses, setRecentResponses] = useState<string[]>([]);
  
  // Track if we're in feedback loop recovery mode
  const [feedbackLoopRecoveryMode, setFeedbackLoopRecoveryMode] = useState<boolean>(false);
  
  // Update conversation history
  const updateConversationHistory = useCallback((userInput: string) => {
    setConversationHistory(prev => {
      const newHistory = [...prev, userInput];
      // Keep last 15 messages for context
      return newHistory.length > 15 ? newHistory.slice(-15) : newHistory;
    });
    
    try {
      // Extract conversation context if available
      const context = extractConversationContext(userInput, conversationHistory);
      
      // Update client preferences if we have new information
      if (context && context.hasContext) {
        // Create an object with relevant context information that we want to store
        const contextInfo = {
          topics: context.topics || [],
          locations: context.locations || [],
          emotions: context.emotions || [],
          keyPhrases: context.keyPhrases || [],
          people: context.people || []
        };
        
        setClientPreferences(prev => ({
          ...prev,
          ...contextInfo
        }));
      }
    } catch (error) {
      console.error("Error updating conversation context:", error);
    }
  }, [conversationHistory]);
  
  return {
    conversationHistory,
    clientPreferences,
    recentResponses,
    feedbackLoopRecoveryMode,
    updateConversationHistory,
    setRecentResponses,
    setFeedbackLoopRecoveryMode,
    setClientPreferences
  };
};
