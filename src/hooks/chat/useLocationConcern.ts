
import { useState, useEffect } from 'react';
import {
  extractPossibleLocation,
  updateMessageWithLocation,
  generateLocationRequestMessage,
  isLocationDataNeeded
} from '../../utils/messageUtils';
import { MessageType } from '../../components/Message';

interface ActiveLocationConcern {
  concernType: string | null;
  messageId: string;
  askedForLocation: boolean;
}

/**
 * Hook for handling location-related concerns in the chat
 */
export const useLocationConcern = () => {
  // Track active concerns that need location data
  const [activeLocationConcern, setActiveLocationConcern] = useState<ActiveLocationConcern | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Handle location data in messages
  const handleLocationData = (
    userInput: string, 
    currentLocationConcern: ActiveLocationConcern | null
  ): boolean => {
    if (currentLocationConcern && currentLocationConcern.askedForLocation) {
      const possibleLocation = extractPossibleLocation(userInput);
      
      if (possibleLocation) {
        // Update the message that triggered the location request with the discovered location
        setMessages(prevMessages => 
          updateMessageWithLocation(prevMessages, currentLocationConcern.messageId, possibleLocation)
        );
        
        // Clear the active location concern since we got the data
        setActiveLocationConcern(null);
        
        return true;
      }
    }
    
    return false;
  };
  
  // Effect to ask for location when needed after the previous message is fully typed
  useEffect(() => {
    // If we have an active concern that needs location data and we haven't asked yet
    if (activeLocationConcern && !activeLocationConcern.askedForLocation && !isTyping) {
      // Mark that we've asked
      setActiveLocationConcern(prev => prev ? { ...prev, askedForLocation: true } : null);
      
      // Generate a location request message
      const locationRequestText = generateLocationRequestMessage(activeLocationConcern.concernType as any);
      const locationRequestMessage = require('../../utils/messageUtils').createMessage(locationRequestText, 'roger');
      
      // Add the location request message
      setMessages(prevMessages => [...prevMessages, locationRequestMessage]);
      
      // Import simulateTypingResponse function dynamically
      const simulateTyping = (text: string, callback: (text: string) => void) => {
        // Simple simulation of typing
        let i = 0;
        const interval = setInterval(() => {
          i++;
          callback(text.substring(0, i));
          if (i === text.length) {
            clearInterval(interval);
            setIsTyping(false);
          }
        }, 30);
        setIsTyping(true);
      };
      
      // Simulate typing for the location request
      simulateTyping(locationRequestText, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === locationRequestMessage.id ? { ...msg, text } : msg
          )
        );
      });
    }
  }, [activeLocationConcern, isTyping]);
  
  return {
    activeLocationConcern,
    setActiveLocationConcern,
    handleLocationData
  };
};
