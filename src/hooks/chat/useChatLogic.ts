
import { useState, useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { useToast } from '@/components/ui/use-toast';
import { getInitialMessages, storeFeedback } from '../../utils/messageUtils';
import useRogerianResponse from '../useRogerianResponse';
import { useLocationConcern } from './useLocationConcern';
import { useCrisisDetection } from './useCrisisDetection';
import { useFeedbackLoop } from './useFeedbackLoop';
import { useMessageHistory } from './useMessageHistory';
import { useFeedbackHandler } from './useFeedbackHandler';
import { useMessageProcessor } from './useMessageProcessor';

/**
 * Hook that contains the main chat business logic
 */
export const useChatLogic = () => {
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  const { toast } = useToast();
  
  // Import needed hooks for specific functionality
  const { activeLocationConcern, handleLocationData, setActiveLocationConcern } = useLocationConcern();
  const { recentCrisisMessage, handleCrisisMessage, checkDeception } = useCrisisDetection(simulateTypingResponse, setMessages);
  const { feedbackLoopDetected, checkFeedbackLoop, setFeedbackLoopDetected } = useFeedbackLoop(simulateTypingResponse, setMessages);
  const { rogerResponseHistory, updateRogerResponseHistory, userMessageHistory, updateUserMessageHistory } = useMessageHistory();
  const { handleFeedback } = useFeedbackHandler(setMessages, toast);
  const { processResponse } = useMessageProcessor({
    processUserMessage,
    setMessages,
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    updateRogerResponseHistory
  });

  // Main function to handle sending messages
  const handleSendMessage = (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message
    const { createMessage } = require('../../utils/messageUtils');
    const newUserMessage = createMessage(userInput, 'user');
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Update user message history for context awareness
    updateUserMessageHistory(userInput);
    
    // Check if user is indicating that Roger is in a feedback loop
    if (checkFeedbackLoop(userInput, userMessageHistory)) {
      return;
    }
    
    // Check if this message might contain location data if we're currently asking for it
    if (handleLocationData(userInput, activeLocationConcern)) {
      // Process the user's message normally since they've provided location data
      processResponse(userInput);
      return;
    }
    
    // Check for deception if we have a recent crisis message
    if (checkDeception(userInput, recentCrisisMessage, simulateTypingResponse, setMessages)) {
      return;
    }
    
    // If we previously detected a feedback loop, reset the flag
    if (feedbackLoopDetected) {
      setFeedbackLoopDetected(false);
    }
    
    // Process user input normally
    processResponse(userInput);
  };
  
  return {
    messages,
    isTyping,
    handleSendMessage,
    handleFeedback
  };
};

