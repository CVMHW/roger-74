import { useState } from 'react';
import { ClientPreferences } from './types';

/**
 * Hook for managing Rogerian response state
 */
export const useRogerianState = () => {
  // Store conversation history for context awareness
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  
  // Track detected client preferences
  const [clientPreferences, setClientPreferences] = useState<ClientPreferences>({
    prefersFormalLanguage: false,
    prefersDirectApproach: false,
    isFirstTimeWithMentalHealth: false
  });
  
  // Track repeated responses to prevent repetition loop
  const [recentResponses, setRecentResponses] = useState<string[]>([]);
  
  // Track if we're in recovery mode after a feedback loop
  const [feedbackLoopRecoveryMode, setFeedbackLoopRecoveryMode] = useState(false);
  
  // Update conversation history when user messages are received
  const updateConversationHistory = (userInput: string) => {
    setConversationHistory(prev => {
      const newHistory = [...prev, userInput];
      // Keep last 10 messages for context
      return newHistory.length > 10 ? newHistory.slice(-10) : newHistory;
    });
    
    // Update detected client preferences
    const { detectClientPreferences } = require('../../utils/conversationalUtils');
    const newPreferences = detectClientPreferences(userInput, conversationHistory);
    setClientPreferences(prev => ({
      prefersFormalLanguage: prev.prefersFormalLanguage || newPreferences.prefersFormalLanguage,
      prefersDirectApproach: prev.prefersDirectApproach || newPreferences.prefersDirectApproach,
      isFirstTimeWithMentalHealth: prev.isFirstTimeWithMentalHealth || newPreferences.isFirstTimeWithMentalHealth
    }));
  };
  
  return {
    conversationHistory,
    setConversationHistory,
    clientPreferences,
    setClientPreferences,
    recentResponses,
    setRecentResponses,
    feedbackLoopRecoveryMode,
    setFeedbackLoopRecoveryMode,
    updateConversationHistory
  };
};
