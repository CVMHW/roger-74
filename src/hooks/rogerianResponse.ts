
/**
 * Simplified Rogerian Response Hook to prevent React context issues
 */

import { useState, useCallback } from 'react';
import { MessageType } from '../components/Message';

// Simple interface to prevent dependency hell
interface RogerianResponseHook {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  currentApproach: string;
}

/**
 * Simplified Rogerian Response Hook
 */
const useRogerianResponse = (): RogerianResponseHook => {
  const [isTyping, setIsTyping] = useState(false);
  
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    setIsTyping(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simple response logic to prevent complex dependencies
      const responses = [
        "I hear what you're saying. Can you tell me more about how that makes you feel?",
        "That sounds like it's been really difficult for you. What's been going through your mind?",
        "I appreciate you sharing that with me. How has this been affecting you?",
        "It sounds like you're dealing with a lot right now. What feels most important to you?",
        "Thank you for trusting me with this. What would help you feel more supported?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return {
        id: `roger-${Date.now()}`,
        text: randomResponse,
        sender: 'roger' as const,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        id: `roger-error-${Date.now()}`,
        text: "I'm having some technical difficulties right now. Could you please try again?",
        sender: 'roger' as const,
        timestamp: new Date()
      };
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    isTyping,
    processUserMessage,
    currentApproach: 'simplified-rogerian'
  };
};

export default useRogerianResponse;
