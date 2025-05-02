
import { useState } from 'react';

/**
 * Hook for creating a realistic typing effect for Roger's responses
 */
export const useTypingEffect = () => {
  // Calculate dynamic response time based on message length and complexity
  const calculateResponseTime = (message: string): number => {
    // Base time (milliseconds)
    const baseTime = 1500;
    
    // Factor in message length (30ms per character with a cap)
    const lengthFactor = Math.min(message.length * 30, 5000);
    
    // Add randomness for more human-like timing (±30% variation)
    const randomVariation = (Math.random() * 0.6 + 0.7);
    
    // Add extra time if it's an emotional or complex topic
    let complexityFactor = 0;
    const complexTopics = ['died', 'death', 'grief', 'suicide', 'depression', 'anxiety', 'trauma', 'refugee', 'immigrant'];
    if (complexTopics.some(topic => message.toLowerCase().includes(topic))) {
      complexityFactor = 2000; // Add extra "thinking time" for sensitive topics
    }
    
    return Math.round((baseTime + lengthFactor + complexityFactor) * randomVariation);
  };

  // Simulate realistic typing with variable speed and pauses
  const simulateTypingResponse = (response: string, callback: (text: string) => void) => {
    let currentIndex = 0;
    let fullResponse = '';
    
    // Function to add next character with variable speed
    const addNextChar = () => {
      if (currentIndex < response.length) {
        fullResponse += response[currentIndex];
        currentIndex++;
        
        // Variable typing speed with more human-like patterns
        let delay = 35 + Math.random() * 70; // Base variable typing speed
        
        const currentChar = response[currentIndex - 1];
        
        // Add natural typing rhythm and pauses
        if (['.', '!', '?'].includes(currentChar)) {
          delay += 500 + Math.random() * 300; // Longer varied pause at end of sentences
        } else if ([',', ';', ':'].includes(currentChar)) {
          delay += 250 + Math.random() * 150; // Medium varied pause at punctuation
        } else if (currentChar === ' ') {
          // Occasionally add a longer pause between words (like thinking)
          if (Math.random() < 0.08) {
            delay += 400 + Math.random() * 300;
          }
        }
        
        // Sometimes add "typing errors" and corrections for realism
        if (Math.random() < 0.005 && currentChar !== ' ' && currentIndex < response.length - 2) {
          const wrongChar = String.fromCharCode(currentChar.charCodeAt(0) + 1);
          fullResponse += wrongChar;
          
          // Show the error briefly, then remove it
          callback(fullResponse);
          
          setTimeout(() => {
            fullResponse = fullResponse.slice(0, -1); // Remove the wrong character
            callback(fullResponse);
            setTimeout(addNextChar, 80 + Math.random() * 120); // Continue after a short delay
          }, 200 + Math.random() * 300);
          return;
        }
        
        callback(fullResponse);
        setTimeout(addNextChar, delay);
      }
    };
    
    // Simulate "thinking" before typing begins
    setTimeout(addNextChar, 500 + Math.random() * 800);
  };

  return {
    calculateResponseTime,
    simulateTypingResponse
  };
};

export default useTypingEffect;
