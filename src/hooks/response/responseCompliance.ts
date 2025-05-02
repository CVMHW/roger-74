
import { useState } from 'react';

export const useResponseCompliance = () => {
  const [previousResponses, setPreviousResponses] = useState<string[]>([]);

  // Function to ensure response complies with the master rules
  const ensureResponseCompliance = (proposedResponse: string): string => {
    // Check if this exact response has been used before
    if (previousResponses.includes(proposedResponse)) {
      // If it's a duplicate, make slight modifications to ensure uniqueness
      const modifiers = [
        "I want to emphasize that ",
        "To put it another way, ",
        "In other words, ",
        "Let me express this differently: ",
        "From another perspective, ",
        "I'd like to rephrase: ",
        "To clarify, ",
        "What I'm hearing is that ",
        "It seems like ",
        "The way I understand it, "
      ];
      
      // Select a random modifier and add it to the beginning of the response
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      return modifier + proposedResponse;
    }
    
    // If the response is already unique, return it as is
    return proposedResponse;
  };

  // Add a response to the history
  const addToResponseHistory = (response: string) => {
    setPreviousResponses(prev => {
      const newResponses = [...prev, response];
      // Limit history size to prevent memory issues
      return newResponses.length > 20 ? newResponses.slice(-20) : newResponses;
    });
  };

  return {
    previousResponses,
    ensureResponseCompliance,
    addToResponseHistory,
    setPreviousResponses
  };
};
