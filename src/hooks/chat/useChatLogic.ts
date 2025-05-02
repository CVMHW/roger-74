import { useState, useEffect, useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { useToast } from '@/components/ui/use-toast';
import {
  getInitialMessages,
  createMessage,
  storeFeedback,
} from '../../utils/messageUtils';
import useRogerianResponse from '../useRogerianResponse';
import { useLocationConcern } from './useLocationConcern';
import { useCrisisDetection } from './useCrisisDetection';
import { useFeedbackLoop } from './useFeedbackLoop';

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
  
  // Track all Roger responses to prevent repetition (in accordance with master rules)
  const [rogerResponseHistory, setRogerResponseHistory] = useState<string[]>([]);
  
  // Track user message history for context awareness
  const [userMessageHistory, setUserMessageHistory] = useState<string[]>([]);
  
  // On component mount, extract existing Roger responses for the history
  useEffect(() => {
    const initialRogerMessages = messages
      .filter(msg => msg.sender === 'roger')
      .map(msg => msg.text);
    
    if (initialRogerMessages.length > 0) {
      setRogerResponseHistory(initialRogerMessages);
    }
  }, []);

  // Handle feedback for Roger's messages
  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    // Update the message with feedback
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
    
    // Store feedback for learning
    storeFeedback(messageId, feedback);
    
    // Show toast notification
    toast({
      title: feedback === 'positive' ? "Thank you for your feedback" : "We'll improve our responses",
      description: feedback === 'positive' 
        ? "We're glad this response was helpful." 
        : "Thank you for helping us improve Roger's responses.",
      duration: 3000,
    });
  };

  // Update user message history for context-awareness
  const updateUserMessageHistory = useCallback((message: string) => {
    setUserMessageHistory(prev => {
      const newHistory = [...prev, message];
      // Keep only the last 10 messages
      return newHistory.length > 10 ? newHistory.slice(-10) : newHistory;
    });
  }, []);

  // Main function to handle sending messages
  const handleSendMessage = (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message
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
  
  const processResponse = (userInput: string) => {
    // Process user input to generate Roger's response
    processUserMessage(userInput).then(rogerResponse => {
      // Add the response to history to prevent future repetition
      setRogerResponseHistory(prev => [...prev, rogerResponse.text]);
      
      // Check if this is a crisis-related response and store it for deception detection
      handleCrisisMessage(userInput, rogerResponse);
      
      // Add the empty response message first (will be updated during typing simulation)
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Set up to request location after this message if needed
      if (rogerResponse.concernType && 
          require('../../utils/messageUtils').isLocationDataNeeded(rogerResponse.concernType) && 
          !activeLocationConcern) {
        
        setActiveLocationConcern({
          concernType: rogerResponse.concernType,
          messageId: rogerResponse.id,
          askedForLocation: false
        });
      }
      
      // Simulate typing with a callback to update the message text
      simulateTypingResponse(rogerResponse.text, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === rogerResponse.id ? { ...msg, text } : msg
          )
        );
      });
    });
  };
  
  return {
    messages,
    isTyping,
    handleSendMessage,
    handleFeedback
  };
};
