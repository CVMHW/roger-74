
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
  const [consecutiveGenericResponses, setConsecutiveGenericResponses] = useState(0);
  
  // Toast notification
  const { toast } = useToast();
  
  // Import response generation hook
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  
  // Import needed hooks for specific functionality
  const { activeLocationConcern, handleLocationData, setActiveLocationConcern } = useLocationConcern();
  const { recentCrisisMessage, handleCrisisMessage, checkDeception } = useCrisisDetection(simulateTypingResponse, setMessages);
  
  // Enhanced feedback loop prevention system
  const { 
    feedbackLoopDetected, 
    checkFeedbackLoop, 
    setFeedbackLoopDetected,
    trackRogerResponse
  } = useFeedbackLoop(simulateTypingResponse, setMessages);
  
  // Message history hooks
  const { 
    rogerResponseHistory, 
    userMessageHistory, 
    updateRogerResponseHistory, 
    updateUserMessageHistory 
  } = useMessageHistory();
  
  // Hook to handle feedback
  const { handleFeedback } = useFeedbackHandler(setMessages, toast);
  
  // Function to detect if a response is too generic
  const isGenericResponse = useCallback((response: string): boolean => {
    const genericPatterns = [
      /I'm here to listen and support you/i,
      /What's been going on\??$/i,
      /I'm listening\. What would you like to talk about\??$/i,
      /I'm here for you\. What's on your mind\??$/i,
      /I'm sorry, I'm having trouble responding/i,
    ];
    
    return genericPatterns.some(pattern => pattern.test(response));
  }, []);
  
  // Message processing hook with enhanced repetition detection
  const { processResponse } = useMessageProcessor({
    processUserMessage,
    setMessages,
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    updateRogerResponseHistory: (responseText: string) => {
      // Track the response for feedback loop detection
      trackRogerResponse(responseText);
      
      // Check if this is a generic response
      if (isGenericResponse(responseText)) {
        setConsecutiveGenericResponses(prev => prev + 1);
        
        // If we've had too many generic responses in a row, force a more specific response
        if (consecutiveGenericResponses >= 1) {
          console.warn("TOO MANY GENERIC RESPONSES: Forcing more specific response");
          
          // Force a more specific response that acknowledges the user's input
          const lastUserMessage = userMessageHistory[userMessageHistory.length - 1] || "";
          
          // Generate a specific acknowledgment based on the user's input
          const specificResponse = createSpecificResponse(lastUserMessage, userMessageHistory);
          
          // Replace the generic response with a specific one
          setTimeout(() => {
            const specificMsg = createMessage(specificResponse, 'roger');
            
            // Add the response
            setMessages(prevMessages => {
              // Replace the last Roger message if it was generic
              const lastMsg = prevMessages[prevMessages.length - 1];
              if (lastMsg && lastMsg.sender === 'roger' && isGenericResponse(lastMsg.text)) {
                return [...prevMessages.slice(0, prevMessages.length - 1), specificMsg];
              }
              return [...prevMessages, specificMsg];
            });
            
            // Simulate typing for the specific response
            simulateTypingResponse(specificResponse, (text) => {
              setMessages(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === specificMsg.id ? { ...msg, text } : msg
                )
              );
            });
            
            // Reset the counter
            setConsecutiveGenericResponses(0);
          }, 100);
        }
      } else {
        // Reset the counter if we get a non-generic response
        setConsecutiveGenericResponses(0);
      }
      
      // Update the regular response history
      updateRogerResponseHistory(responseText);
    }
  });
  
  // Function to create a specific response based on user input
  const createSpecificResponse = (userInput: string, userHistory: string[]): string => {
    // Extract meaningful content from user input
    const lowerInput = userInput.toLowerCase();
    
    // Check for pet-related content
    if (/pet|dog|cat|animal|died|passed away|molly/i.test(lowerInput)) {
      return "I'm truly sorry to hear about your pet. Losing a pet is incredibly painful - they're family members. Could you tell me more about them and what they meant to you?";
    }
    // Check for personal loss
    else if (/died|death|passed away|funeral|grieving|grief/i.test(lowerInput)) {
      return "I'm very sorry about your loss. Grief can be overwhelming. Would you like to share more about the person and what they meant to you?";
    }
    // Check for sadness
    else if (/sad|upset|down|depressed|blue/i.test(lowerInput)) {
      return "I hear that you're feeling sad. That's really hard. Would you like to share more about what's contributing to those feelings?";
    }
    // Check for anxiety
    else if (/anxious|worried|nervous|anxiety|stress/i.test(lowerInput)) {
      return "It sounds like you're experiencing some anxiety. What specific things have been causing you to feel this way?";
    }
    // Generic but specific fallback
    else {
      return "I want to make sure I understand what matters most to you right now. Could you share a bit more about what's been on your mind?";
    }
  };
  
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
      
      // UNCONDITIONAL RULE: Always check for feedback loops first
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
      
      // Add fallback error response that's specific to what the user shared
      const userInputLower = userInput.toLowerCase();
      let errorResponse;
      
      if (userInputLower.includes("pet") || userInputLower.includes("died") || userInputLower.includes("passed away")) {
        errorResponse = createMessage(
          "I'm truly sorry about your loss. Losing a pet can be devastating. Would you like to tell me more about them?",
          'roger'
        );
      } else {
        errorResponse = createMessage(
          "I'm interested in hearing more about what you're experiencing. Could you share more about what's been going on?",
          'roger'
        );
      }
      
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
