
import { useCallback, useState } from 'react';
import { MessageType } from '../../../components/Message';
import { generateSpontaneousResponse } from '../../../utils/response/personalityVariation';

/**
 * Hook for enhancing responses with specific context and improving response quality
 */
export const useResponseEnhancement = (
  isGenericResponse: (response: string) => boolean,
  createSpecificResponse: (userInput: string, userMessageHistory: string[]) => string,
  userMessageHistory: string[],
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  getResponseDelay: (content: string) => number
) => {
  // Track consecutive generic responses
  const [consecutiveGenericResponses, setConsecutiveGenericResponses] = useState<number>(0);
  // Track previously seen responses to detect loops
  const [recentResponses, setRecentResponses] = useState<string[]>([]);
  // Track specific patterns we've seen
  const [seenPatterns, setSeenPatterns] = useState<Record<string, number>>({});

  // Enhanced response tracking with generic response detection
  const enhanceAndTrackResponse = useCallback((responseText: string) => {
    // First, check for repetition patterns
    const patterns = extractPatterns(responseText);
    const updatedSeenPatterns = { ...seenPatterns };
    let hasRepeatedPattern = false;
    
    // Check if we're seeing the same patterns repeatedly
    for (const pattern of patterns) {
      updatedSeenPatterns[pattern] = (updatedSeenPatterns[pattern] || 0) + 1;
      if (updatedSeenPatterns[pattern] >= 2) {
        hasRepeatedPattern = true;
      }
    }
    
    // Update the pattern tracking
    setSeenPatterns(updatedSeenPatterns);
    
    // Check if this response is too similar to recent responses
    const isTooSimilar = recentResponses.length > 0 && 
      recentResponses.some(prevResponse => calculateSimilarity(responseText, prevResponse) > 0.65);
    
    // Add to recent responses for future checking
    setRecentResponses(prev => [responseText, ...prev.slice(0, 4)]);
    
    // Check if this is a generic response
    if (isGenericResponse(responseText)) {
      setConsecutiveGenericResponses(prev => prev + 1);
      
      // If we've had too many generic responses in a row, force a more specific response
      if (consecutiveGenericResponses >= 1 || hasRepeatedPattern || isTooSimilar) {
        console.warn("PATTERN BREAKING: Forcing more personalized response");
        
        // Force a more specific response that acknowledges the user's input
        const lastUserMessage = userMessageHistory[userMessageHistory.length - 1] || "";
        
        // Get a completely fresh response using the spontaneity system
        const spontaneousResponse = generateSpontaneousResponse(lastUserMessage, recentResponses);
        
        // Replace the generic response with a specific one after a deliberate pause
        setTimeout(() => {
          const specificMsg = createMessage(spontaneousResponse, 'roger');
          
          // Add the response
          setMessages(prevMessages => {
            // Replace the last Roger message if it was generic
            const lastMsg = prevMessages[prevMessages.length - 1];
            if (lastMsg && lastMsg.sender === 'roger' && 
                (isGenericResponse(lastMsg.text) || hasRepeatedPattern || isTooSimilar)) {
              return [...prevMessages.slice(0, prevMessages.length - 1), specificMsg];
            }
            return [...prevMessages, specificMsg];
          });
          
          // Simulate typing for the specific response
          simulateTypingResponse(spontaneousResponse, (text) => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === specificMsg.id ? { ...msg, text } : msg
              )
            );
          });
          
          // Reset the counter and add the spontaneous response to tracked responses
          setConsecutiveGenericResponses(0);
          setRecentResponses(prev => [spontaneousResponse, ...prev.slice(0, 4)]);
        }, getResponseDelay(lastUserMessage));
        
        // Return the original for now, it will be replaced
        return responseText;
      }
    } else {
      // Reset the counter if we get a non-generic response
      setConsecutiveGenericResponses(0);
    }
    
    return responseText;
  }, [
    isGenericResponse,
    consecutiveGenericResponses,
    userMessageHistory, 
    createSpecificResponse,
    setMessages,
    simulateTypingResponse,
    getResponseDelay,
    seenPatterns,
    recentResponses
  ]);

  return {
    consecutiveGenericResponses,
    setConsecutiveGenericResponses,
    enhanceAndTrackResponse,
    recentResponses
  };
};

// Helper function to extract common patterns from a response
const extractPatterns = (text: string): string[] => {
  const patterns: string[] = [];
  
  // Extract common phrases that might be repetitive
  if (/I notice I may have been repeating myself/i.test(text)) {
    patterns.push('repetition-notice');
  }
  
  if (/I'd like to focus specifically on/i.test(text)) {
    patterns.push('focus-specifically');
  }
  
  if (/It seems like you shared that/i.test(text)) {
    patterns.push('shared-that');
  }
  
  if (/I hear you('re| are) feeling/i.test(text)) {
    patterns.push('hear-feeling');
  }
  
  if (/Would you like to tell me more about/i.test(text)) {
    patterns.push('tell-more-about');
  }
  
  return patterns;
};

// Calculate simple text similarity
const calculateSimilarity = (text1: string, text2: string): number => {
  // Get 4-word sequences from both texts
  const getSequences = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/);
    const sequences: string[] = [];
    for (let i = 0; i <= words.length - 4; i++) {
      sequences.push(words.slice(i, i + 4).join(' '));
    }
    return sequences;
  };
  
  const seq1 = getSequences(text1);
  const seq2 = getSequences(text2);
  
  // Count shared sequences
  let sharedCount = 0;
  for (const seq of seq1) {
    if (seq2.includes(seq)) {
      sharedCount++;
    }
  }
  
  // Calculate similarity ratio
  return seq1.length > 0 ? sharedCount / seq1.length : 0;
};

// Import necessary utilities
import { createMessage } from '../../../utils/messageUtils';
