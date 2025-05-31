
import { useState, useRef } from 'react';

/**
 * Hook for tracking message history for analysis and pattern detection
 */
export const useMessageHistory = () => {
  const [rogerResponseHistory, setRogerResponseHistory] = useState<string[]>([]);
  const [userMessageHistory, setUserMessageHistory] = useState<string[]>([]);
  const initialized = useRef(false);

  // Initialize on first call
  if (!initialized.current) {
    initialized.current = true;
  }

  const updateRogerResponseHistory = (response: string) => {
    setRogerResponseHistory(prev => {
      const newHistory = [...prev, response];
      return newHistory.slice(-10); // Keep last 10 responses
    });
  };

  const updateUserMessageHistory = (message: string) => {
    setUserMessageHistory(prev => {
      const newHistory = [...prev, message];
      return newHistory.slice(-20); // Keep last 20 messages
    });
  };

  return {
    rogerResponseHistory,
    userMessageHistory,
    updateRogerResponseHistory,
    updateUserMessageHistory
  };
};
