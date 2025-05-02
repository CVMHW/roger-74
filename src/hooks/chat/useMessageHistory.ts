import { useState, useEffect, useCallback } from 'react';
import { MessageType } from '../../components/Message';

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
    setUserMessageHistory(prev => {
      const newHistory = [...prev, message];
      // Keep only the last 10 messages
      return newHistory.length > 10 ? newHistory.slice(-10) : newHistory;
    });
  }, []);

  // Update Roger's response history
  const updateRogerResponseHistory = useCallback((responseText: string) => {
    setRogerResponseHistory(prev => [...prev, responseText]);
  }, []);

  // Extract existing Roger responses for the history on mount
  useEffect(() => {
    // This would initialize from any existing messages
    const initializeFromExistingMessages = (messages: MessageType[]) => {
      const initialRogerMessages = messages
        .filter(msg => msg.sender === 'roger')
        .map(msg => msg.text);
      
      if (initialRogerMessages.length > 0) {
        setRogerResponseHistory(initialRogerMessages);
      }
    };

    // We would call this with the initial messages, but since we don't have access to them here,
    // this will be handled in the parent component if needed
  }, []);

  return {
    rogerResponseHistory,
    userMessageHistory,
    updateUserMessageHistory,
    updateRogerResponseHistory,
    setRogerResponseHistory
  };
};
