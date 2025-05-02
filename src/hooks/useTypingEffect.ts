
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for creating realistic typing effects in chat interfaces
 */
const useTypingEffect = () => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  /**
   * Calculate a realistic response time based on input length and complexity
   * @param input - User input to calculate response time for
   * @returns Number of milliseconds to wait before starting to type
   */
  const calculateResponseTime = useCallback((input: string): number => {
    // Base response time between 0.5-1.5 seconds (reduced for production)
    const baseTime = Math.floor(Math.random() * 1000) + 500;
    
    // For very short messages, respond a bit faster
    if (input.length < 10) {
      return baseTime;
    }
    
    // For medium length messages add minimal extra time
    if (input.length < 50) {
      return baseTime + Math.floor(Math.random() * 500);
    }
    
    // For longer messages, simulate slightly more thinking time
    return baseTime + Math.floor(Math.random() * 1000) + 500;
  }, []);

  /**
   * Simulate typing a response with realistic timing
   * @param response - The full response text
   * @param callback - Function called on each letter typed with current text
   */
  const simulateTypingResponse = useCallback((response: string, callback: (text: string) => void) => {
    if (!response) {
      console.warn("Empty response passed to simulateTypingResponse");
      callback("I'm here to listen. What would you like to talk about?");
      return;
    }
    
    setIsTyping(true);
    
    const words = response.split(' ');
    let currentIndex = 0;
    let displayedText = '';
    
    const typeWord = () => {
      try {
        if (currentIndex < words.length) {
          // Add the next word (with a space if not first word)
          displayedText += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
          callback(displayedText);
          currentIndex++;
          
          // Calculate delay based on word length - faster for production
          const nextWord = words[currentIndex];
          const delay = nextWord ? 
                      // Use shorter delays for production readiness
                      Math.max(50, Math.min(nextWord.length * 15, 200)) : 
                      100;
          
          // Add occasional longer pauses (5% chance)
          const randomPause = Math.random() < 0.05 ? 
                            Math.floor(Math.random() * 150) + 100 : 0;
          
          // Type the next word after the delay
          typingTimeout.current = setTimeout(typeWord, delay + randomPause);
        } else {
          setIsTyping(false);
        }
      } catch (error) {
        console.error("Error in typeWord function:", error);
        callback(response); // Show full response in case of error
        setIsTyping(false);
      }
    };
    
    // Start typing the first word
    typeWord();
  }, []);

  return {
    isTyping,
    calculateResponseTime,
    simulateTypingResponse
  };
};

export default useTypingEffect;
