
import { useState } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { ConcernType } from '../../utils/reflection/reflectionTypes';

interface RecentCrisisMessage {
  message: string;
  timestamp: Date;
  concernType: string;
}

/**
 * Hook for detecting and handling crisis-related messages
 */
export const useCrisisDetection = (
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  // Track potential crisis messaging for deception detection
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<RecentCrisisMessage | null>(null);
  
  // Store crisis messages for deception detection
  const handleCrisisMessage = (userInput: string, rogerResponse: MessageType) => {
    const crisisConcernTypes = ['crisis', 'tentative-harm', 'suicide', 'self-harm'];
    if (rogerResponse.concernType && crisisConcernTypes.includes(rogerResponse.concernType)) {
      setRecentCrisisMessage({
        message: userInput,
        timestamp: new Date(),
        concernType: rogerResponse.concernType
      });
    }
  };
  
  // Check for deception in crisis messages
  const checkDeception = (
    userInput: string, 
    currentCrisisMessage: RecentCrisisMessage | null,
    simulateTyping: (response: string, callback: (text: string) => void) => void,
    setMsgs: React.Dispatch<React.SetStateAction<MessageType[]>>
  ): boolean => {
    if (currentCrisisMessage && 
        (new Date().getTime() - currentCrisisMessage.timestamp.getTime() < 5 * 60 * 1000)) {
      // Analyze for potential deception/backtracking on crisis statements
      import('../../utils/detectionUtils/deceptionDetection').then(module => {
        const deceptionAnalysis = module.detectPotentialDeception(currentCrisisMessage.message, userInput);
        
        if (deceptionAnalysis.isPotentialDeception && deceptionAnalysis.confidence !== 'low') {
          // We've detected potential deception - handle according to the unconditional law
          // Import and use the response generator for deception
          import('../../utils/detectionUtils/deceptionDetection').then(deceptionModule => {
            const deceptionResponse = deceptionModule.generateDeceptionResponseMessage(deceptionAnalysis);
            
            // Create Roger's response to the potential deception
            const rogerResponse = createMessage(deceptionResponse, 'roger', currentCrisisMessage.concernType as any);
            
            // Add the response
            setMsgs(prevMessages => [...prevMessages, rogerResponse]);
            
            // Simulate typing
            simulateTyping(deceptionResponse, (text) => {
              setMsgs(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === rogerResponse.id ? { ...msg, text } : msg
                )
              );
            });
            
            // Clear the crisis tracking since we've addressed it
            setRecentCrisisMessage(null);
          });
          return true;
        }
      });
    }
    
    return false;
  };
  
  return {
    recentCrisisMessage,
    handleCrisisMessage,
    checkDeception
  };
};
