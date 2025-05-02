
import { useCallback } from 'react';

/**
 * Hook for generating specific responses based on user input
 */
export const useSpecificResponseGenerator = () => {
  // Function to create a specific response based on user input
  const createSpecificResponse = useCallback((userInput: string, userHistory: string[]): string => {
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
  }, []);
  
  return { createSpecificResponse };
};
