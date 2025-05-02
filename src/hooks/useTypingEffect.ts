
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
    // Base response time between 1-2 seconds
    const baseTime = Math.floor(Math.random() * 1000) + 1000;
    
    // For very short messages, respond a bit faster
    if (input.length < 10) {
      return baseTime;
    }
    
    // For medium length messages add some extra time
    if (input.length < 50) {
      return baseTime + Math.floor(Math.random() * 1000);
    }
    
    // For longer messages, simulate more thinking time
    return baseTime + Math.floor(Math.random() * 2000) + 1000;
  }, []);

  /**
   * Simulate typing a response with realistic timing
   * @param response - The full response text
   * @param callback - Function called on each letter typed with current text
   */
  const simulateTypingResponse = useCallback((response: string, callback: (text: string) => void) => {
    if (!response) {
      return;
    }
    
    setIsTyping(true);
    
    const words = response.split(' ');
    let currentIndex = 0;
    let displayedText = '';
    
    const typeWord = () => {
      if (currentIndex < words.length) {
        // Add the next word (with a space if not first word)
        displayedText += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
        callback(displayedText);
        currentIndex++;
        
        // Calculate delay based on word length and some randomness
        const nextWord = words[currentIndex];
        const delay = nextWord ? 
                    // Longer words take longer to type (30-80ms per character)
                    Math.max(150, Math.min(nextWord.length * (Math.random() * 50 + 30), 400)) : 
                    200;
        
        // Add occasional longer pauses (15% chance)
        const randomPause = Math.random() < 0.15 ? 
                          Math.floor(Math.random() * 300) + 200 : 0;
        
        // Type the next word after the delay
        typingTimeout.current = setTimeout(typeWord, delay + randomPause);
      } else {
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
