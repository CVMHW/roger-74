
import { useState, useCallback } from 'react';

/**
 * Hook for managing message history
 */
export const useMessageHistory = () => {
  // Track all Roger responses to prevent repetition (in accordance with master rules)
  const [rogerResponseHistory, setRogerResponseHistory] = useState<string[]>([]);
  
  // Track user message history for context awareness
  const [userMessageHistory, setUserMessageHistory] = useState<string[]>([]);
  
  // Update user message history for context-awareness
  const updateUserMessageHistory = useCallback((message: string) => {
    if (!message || typeof message !== 'string') {
      console.error("Invalid message passed to updateUserMessageHistory:", message);
      return;
    }
    
    setUserMessageHistory(prev => {
      const newHistory = [...prev, message];
      // Keep only the last 10 messages
      return newHistory.length > 10 ? newHistory.slice(-10) : newHistory;
    });
  }, []);

  // Update Roger's response history
  const updateRogerResponseHistory = useCallback((responseText: string) => {
    if (!responseText || typeof responseText !== 'string') {
      console.error("Invalid response text passed to updateRogerResponseHistory:", responseText);
      return;
    }
    
    setRogerResponseHistory(prev => [...prev, responseText]);
  }, []);

  return {
    rogerResponseHistory,
    userMessageHistory,
    updateUserMessageHistory,
    updateRogerResponseHistory,
    setRogerResponseHistory
  };
};
