
import { useState, useRef, useEffect } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { 
  isUserIndicatingFeedbackLoop, 
  extractConversationContext,
  generateFeedbackLoopRecoveryResponse 
} from '../../utils/conversationEnhancement/repetitionDetector';

/**
 * Enhanced hook for detecting and preventing feedback loops in conversation
 * UNCONDITIONAL RULE: Roger must never get stuck in a feedback loop
 */
export const useFeedbackLoop = (
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  // Track if we've detected a feedback loop pattern
  const [feedbackLoopDetected, setFeedbackLoopDetected] = useState<boolean>(false);
  
  // Store recent Roger responses to detect repetition
  const [recentRogerResponses, setRecentRogerResponses] = useState<string[]>([]);
  
  // Track consecutive identical responses
  const [repetitionCount, setRepetitionCount] = useState<{[key: string]: number}>({});
  
  // Reference to the last user message for context
  const lastUserMessageRef = useRef<string>("");
  
  /**
   * Add Roger's response to history and check for repetition
   */
  const trackRogerResponse = (responseText: string) => {
    if (!responseText) return;
    
    // Add to recent responses
    setRecentRogerResponses(prev => {
      const newHistory = [...prev, responseText];
      return newHistory.length > 5 ? newHistory.slice(-5) : newHistory;
    });
    
    // Check for and count repetitions
    setRepetitionCount(prev => {
      const newCount = { ...prev };
      
      // Create a normalized version for comparison (remove punctuation and lowercase)
      const normalizedResponse = responseText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
      
      // If this exact response exists, increment its count
      if (newCount[normalizedResponse]) {
        newCount[normalizedResponse] += 1;
      } else {
        // First time seeing this response
        newCount[normalizedResponse] = 1;
      }
      
      // Check if any response has been repeated too many times (2+ is already problematic)
      Object.entries(newCount).forEach(([resp, count]) => {
        if (count >= 2 && resp.includes(normalizedResponse)) {
          console.warn("FEEDBACK LOOP DETECTED: Same response repeated multiple times:", resp);
          setFeedbackLoopDetected(true);
        }
      });
      
      return newCount;
    });
  };
  
  /**
   * Explicit user feedback loop detection based on user message
   */
  const checkFeedbackLoop = (
    userInput: string, 
    userMessageHistory: string[]
  ): boolean => {
    // Store the user message for context
    lastUserMessageRef.current = userInput;
    
    // Check for explicit user complaints about repetition
    const isUserComplaining = isUserIndicatingFeedbackLoop(userInput);
    
    // Check for implicit feedback loop indicators
    const implicitLoopIndicators = [
      /i (just |already |)told you/i,
      /i (just |already |)said/i,
      /are you listening/i,
      /you('re| are) repeating/i,
      /stop (saying|repeating)/i,
      /you (just |already |)said/i,
      /same (thing|response)/i,
      /not helpful/i,
      /listen to me/i
    ];
    
    const isImplicitlyComplaining = implicitLoopIndicators.some(regex => regex.test(userInput));
    
    // If any type of complaint is detected
    if (isUserComplaining || isImplicitlyComplaining) {
      // Set feedback loop detected flag
      setFeedbackLoopDetected(true);
      
      // Generate a context-aware recovery response
      const context = extractConversationContext(userInput, userMessageHistory);
      let recoveryResponse = generateFeedbackLoopRecoveryResponse(context);
      
      // Ensure the recovery response is not generic or empty
      if (!recoveryResponse || recoveryResponse.includes("I'm here to listen")) {
        recoveryResponse = "I apologize for not responding appropriately. Let me focus specifically on what you've shared. Could you tell me more about what happened with your pet? I'm genuinely interested in understanding your experience.";
      }
      
      // Create Roger's response to acknowledge the problem
      const rogerResponse = createMessage(recoveryResponse, 'roger');
      
      // Add the response
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Simulate typing
      simulateTypingResponse(recoveryResponse, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === rogerResponse.id ? { ...msg, text } : msg
          )
        );
      });
      
      // Reset repetition counts after recovery
      setRepetitionCount({});
      
      return true;
    }
    
    // Also detect feedback loops based on recent responses
    if (recentRogerResponses.length >= 2) {
      const lastTwoResponses = recentRogerResponses.slice(-2);
      
      // If the last two responses are very similar
      if (checkResponseSimilarity(lastTwoResponses[0], lastTwoResponses[1])) {
        // Handle the detected loop
        handleDetectedFeedbackLoop(userInput, userMessageHistory);
        return true;
      }
    }
    
    return false;
  };
  
  /**
   * Check if two responses are very similar (accounting for minor variations)
   */
  const checkResponseSimilarity = (response1: string, response2: string): boolean => {
    // Create normalized versions for comparison
    const normalized1 = response1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    const normalized2 = response2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    
    // Check if they are identical
    if (normalized1 === normalized2) return true;
    
    // Check if one contains the other (for short responses)
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
    
    // For longer responses, calculate similarity score
    const words1 = normalized1.split(/\s+/);
    const words2 = normalized2.split(/\s+/);
    
    // Count common words
    const commonWords = words1.filter(word => words2.includes(word));
    
    // Calculate similarity ratio
    const similarityRatio = commonWords.length / Math.max(words1.length, words2.length);
    
    // Consider similar if 70% or more words are the same
    return similarityRatio >= 0.7;
  };
  
  /**
   * Handle a detected feedback loop without explicit user complaint
   */
  const handleDetectedFeedbackLoop = (userInput: string, userMessageHistory: string[]) => {
    console.warn("FEEDBACK LOOP AUTOMATICALLY DETECTED: Breaking the loop");
    setFeedbackLoopDetected(true);
    
    // Generate a context-specific response that focuses on the user's actual input
    const specificFocus = userInput.length > 10 ? 
      userInput : 
      (userMessageHistory.length > 0 ? userMessageHistory[userMessageHistory.length - 1] : "");
    
    // Create a targeted response that specifically addresses the user's content
    let recoveryResponse = "";
    
    // Check for pet-related content
    if (/pet|dog|cat|animal|died|passed away|molly/i.test(specificFocus)) {
      recoveryResponse = "I'm truly sorry to hear about your pet. Losing a pet is incredibly painful - they're family members. Could you tell me more about them and what they meant to you?";
    }
    // Check for personal loss
    else if (/died|death|passed away|funeral|grieving|grief/i.test(specificFocus)) {
      recoveryResponse = "I'm very sorry about your loss. Grief can be overwhelming. Would you like to share more about the person and what they meant to you?";
    }
    // Check for general emotional state
    else if (/sad|depressed|anxious|worried|upset|angry|frustrated/i.test(specificFocus)) {
      recoveryResponse = "I hear that you're feeling emotional right now. Could you help me understand more about what specifically has been going on that's made you feel this way?";
    }
    // Generic but specific fallback
    else {
      recoveryResponse = "I notice I may have been repeating myself, which isn't helpful. I'd like to focus specifically on what you've shared. Could you tell me more about what's been most on your mind?";
    }
    
    // Create and add the response
    const rogerResponse = createMessage(recoveryResponse, 'roger');
    setMessages(prevMessages => [...prevMessages, rogerResponse]);
    
    // Simulate typing
    simulateTypingResponse(recoveryResponse, (text) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === rogerResponse.id ? { ...msg, text } : msg
        )
      );
    });
    
    // Reset repetition counts after recovery
    setRepetitionCount({});
  };
  
  // Reset the feedback loop flag if enough new, varied responses occur
  useEffect(() => {
    if (feedbackLoopDetected && recentRogerResponses.length >= 3) {
      const lastResponses = recentRogerResponses.slice(-3);
      
      // Check if the last 3 responses are all different from each other
      if (!checkResponseSimilarity(lastResponses[0], lastResponses[1]) && 
          !checkResponseSimilarity(lastResponses[1], lastResponses[2]) &&
          !checkResponseSimilarity(lastResponses[0], lastResponses[2])) {
        // If we have 3 different responses in a row, consider the loop broken
        setFeedbackLoopDetected(false);
      }
    }
  }, [recentRogerResponses, feedbackLoopDetected]);
  
  return {
    feedbackLoopDetected,
    setFeedbackLoopDetected,
    checkFeedbackLoop,
    trackRogerResponse
  };
};
