
import { useCallback, useState } from 'react';
import { MessageType } from '../../../components/Message';
import { generateSpontaneousResponse, addResponseVariety } from '../../../utils/response/personalityVariation';
import { getRandomPersonality } from '../../../utils/response/spontaneityGenerator';
import { detectConversationPatterns } from '../../../utils/response/patternDetection';

/**
 * Hook for enhancing responses with specific context and improving response quality
 * Now with ENHANCED personality and spontaneity as universal laws
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
  // Track personality spontaneity level (0-100)
  const [spontaneityLevel, setSpontaneityLevel] = useState<number>(65);
  // Track creativity level (0-100)
  const [creativityLevel, setCreativityLevel] = useState<number>(70);

  // Enhanced response tracking with generic response detection and spontaneity injection
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
        // Increase spontaneity when patterns repeat
        setSpontaneityLevel(prev => Math.min(prev + 15, 100));
      }
    }
    
    // Update the pattern tracking
    setSeenPatterns(updatedSeenPatterns);
    
    // Check if this response is too similar to recent responses
    const isTooSimilar = recentResponses.length > 0 && 
      recentResponses.some(prevResponse => calculateSimilarity(responseText, prevResponse) > 0.5); // Lower threshold to catch more repetition
    
    // Detect conversation patterns and adjust spontaneity/creativity accordingly
    const patternResults = detectConversationPatterns(responseText, recentResponses, userMessageHistory);
    
    if (patternResults.isRepetitive) {
      setSpontaneityLevel(prev => Math.min(prev + 20, 100)); // Significant increase in spontaneity
      setCreativityLevel(prev => Math.min(prev + 15, 100));
    }
    
    // UNIVERSAL LAW: APPLY PERSONALITY VARIATION REGARDLESS OF PATTERN DETECTION
    // This ensures every response has some level of personality variation
    let enhancedResponse = addResponseVariety(responseText, 
                                            userMessageHistory[userMessageHistory.length - 1] || "", 
                                            userMessageHistory.length,
                                            spontaneityLevel,
                                            creativityLevel);
    
    // Add to recent responses for future checking
    setRecentResponses(prev => [enhancedResponse, ...prev.slice(0, 4)]);
    
    // Check if the response is generic or we're seeing patterns
    // Now we check AFTER adding basic personality variation
    if (isGenericResponse(enhancedResponse) || hasRepeatedPattern || isTooSimilar) {
      setConsecutiveGenericResponses(prev => prev + 1);
      
      // If we've had any generic responses, patterns, or similar responses, force a more spontaneous response
      if (consecutiveGenericResponses >= 0 || hasRepeatedPattern || isTooSimilar) {
        console.warn("PATTERN BREAKING: Forcing highly personalized spontaneous response");
        
        // Force a more specific response that acknowledges the user's input
        const lastUserMessage = userMessageHistory[userMessageHistory.length - 1] || "";
        
        // Select a random personality mode to further vary responses
        const personalityMode = getRandomPersonality();
        
        // Get a completely fresh response using the enhanced spontaneity system
        const spontaneousResponse = generateSpontaneousResponse(
          lastUserMessage, 
          recentResponses, 
          spontaneityLevel, 
          creativityLevel,
          personalityMode
        );
        
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
          
          // Adjust spontaneity and creativity levels after generating a spontaneous response
          setSpontaneityLevel(prev => Math.max(prev - 10, 50)); // Don't go below 50
          setCreativityLevel(prev => Math.max(prev - 5, 55)); // Don't go below 55
        }, getResponseDelay(lastUserMessage));
        
        // Return the original for now, it will be replaced
        return enhancedResponse;
      }
    } else {
      // Reset the counter if we get a non-generic response
      setConsecutiveGenericResponses(0);
      // Gradually reduce spontaneity for natural conversation flow
      setSpontaneityLevel(prev => Math.max(prev - 5, 45)); 
    }
    
    return enhancedResponse;
  }, [
    isGenericResponse,
    consecutiveGenericResponses,
    userMessageHistory, 
    createSpecificResponse,
    setMessages,
    simulateTypingResponse,
    getResponseDelay,
    seenPatterns,
    recentResponses,
    spontaneityLevel,
    creativityLevel
  ]);

  return {
    consecutiveGenericResponses,
    setConsecutiveGenericResponses,
    enhanceAndTrackResponse,
    recentResponses,
    spontaneityLevel,
    setSpontaneityLevel,
    creativityLevel,
    setCreativityLevel
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
  
  // New pattern detection for even more variability
  if (/that sounds (difficult|challenging|hard|tough)/i.test(text)) {
    patterns.push('sounds-difficult');
  }
  
  if (/I understand (that|how) you/i.test(text)) {
    patterns.push('understand-you');
  }
  
  if (/what (do you think|would you say|feels)/i.test(text)) {
    patterns.push('what-do-you');
  }
  
  return patterns;
};

// Calculate simple text similarity
const calculateSimilarity = (text1: string, text2: string): number => {
  // Get 3-word sequences from both texts (reduced from 4 to catch more similarities)
  const getSequences = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/);
    const sequences: string[] = [];
    for (let i = 0; i <= words.length - 3; i++) {
      sequences.push(words.slice(i, i + 3).join(' '));
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
