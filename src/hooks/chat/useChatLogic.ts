
import { useState, useCallback, useEffect } from 'react';
import { MessageType } from '../../components/Message';
import { useToast } from '@/components/ui/use-toast';
import { getInitialMessages, createMessage } from '../../utils/messageUtils';
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
  // Core state
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showCrisisResources, setShowCrisisResources] = useState<boolean>(false);
  
  // Toast notification
  const { toast } = useToast();
  
  // Import response generation hook
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  
  // Import needed hooks for specific functionality
  const { activeLocationConcern, handleLocationData, setActiveLocationConcern } = useLocationConcern();
  const { recentCrisisMessage, handleCrisisMessage, checkDeception } = useCrisisDetection(simulateTypingResponse, setMessages);
  const { feedbackLoopDetected, checkFeedbackLoop, setFeedbackLoopDetected } = useFeedbackLoop(simulateTypingResponse, setMessages);
  
  // Message history hooks
  const { 
    rogerResponseHistory, 
    userMessageHistory, 
    updateRogerResponseHistory, 
    updateUserMessageHistory 
  } = useMessageHistory();
  
  // Hook to handle feedback
  const { handleFeedback } = useFeedbackHandler(setMessages, toast);
  
  // Message processing hook
  const { processResponse } = useMessageProcessor({
    processUserMessage,
    setMessages,
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    updateRogerResponseHistory
  });
  
  // Function to check for crisis-related content in user input
  const checkForCrisisContent = (userInput: string): boolean => {
    const lowerInput = userInput.toLowerCase().trim();
    const crisisPatterns = [
      /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
      /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
      /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
      /crisis|emergency|urgent|need help now|immediate danger|severe (depression|anxiety|panic)/
    ];
    
    return crisisPatterns.some(pattern => pattern.test(lowerInput));
  };

  // Main function to handle sending messages
  const handleSendMessage = useCallback((userInput: string) => {
    if (!userInput.trim() || isProcessing) return;
    
    setIsProcessing(true);

    try {
      // Add user message
      const newUserMessage = createMessage(userInput, 'user');
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      
      // Check for crisis content and show resources if needed
      if (checkForCrisisContent(userInput)) {
        setShowCrisisResources(true);
      }
      
      // Update user message history for context awareness
      updateUserMessageHistory(userInput);
      
      // Check if user is indicating that Roger is in a feedback loop
      if (checkFeedbackLoop(userInput, userMessageHistory)) {
        setIsProcessing(false);
        return;
      }
      
      // Check if this message might contain location data if we're currently asking for it
      if (handleLocationData(userInput, activeLocationConcern)) {
        // Process the user's message normally since they've provided location data
        processResponse(userInput);
        setIsProcessing(false);
        return;
      }
      
      // Check for deception if we have a recent crisis message
      if (checkDeception(userInput, recentCrisisMessage, simulateTypingResponse, setMessages)) {
        setIsProcessing(false);
        return;
      }
      
      // If we previously detected a feedback loop, reset the flag
      if (feedbackLoopDetected) {
        setFeedbackLoopDetected(false);
      }
      
      // Process user input normally
      processResponse(userInput);
      
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      // Add fallback error response
      const errorResponse = createMessage(
        "I'm here to listen and support you. What would you like to talk about?",
        'roger'
      );
      
      setMessages(prevMessages => [...prevMessages, errorResponse]);
      
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    setMessages,
    updateUserMessageHistory,
    checkFeedbackLoop,
    userMessageHistory,
    handleLocationData,
    activeLocationConcern,
    checkDeception,
    recentCrisisMessage,
    simulateTypingResponse,
    feedbackLoopDetected,
    setFeedbackLoopDetected,
    processResponse
  ]);

  // Reset processing state when typing indicator changes
  useEffect(() => {
    if (!isTyping && isProcessing) {
      setIsProcessing(false);
    }
  }, [isTyping, isProcessing]);
  
  return {
    messages,
    isTyping,
    isProcessing,
    handleSendMessage,
    handleFeedback,
    showCrisisResources
  };
};
