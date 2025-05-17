
import { useState, useEffect } from 'react';
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
  // Track consecutive crisis messages to ensure appropriate response escalation
  const [consecutiveCrisisCount, setConsecutiveCrisisCount] = useState<number>(0);
  
  // Store crisis messages for deception detection
  const handleCrisisMessage = (userInput: string, rogerResponse: MessageType) => {
    const crisisConcernTypes = ['crisis', 'tentative-harm', 'suicide', 'self-harm'];
    if (rogerResponse.concernType && crisisConcernTypes.includes(rogerResponse.concernType)) {
      setRecentCrisisMessage({
        message: userInput,
        timestamp: new Date(),
        concernType: rogerResponse.concernType
      });
      
      // Increment consecutive crisis counter to track escalation
      setConsecutiveCrisisCount(prev => prev + 1);
    } else {
      // Reset consecutive crisis counter if we get a non-crisis message
      setConsecutiveCrisisCount(0);
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
      // Use dynamic import to avoid 'require' issues with browser
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
          }).catch(error => {
            console.error("Error importing deception module:", error);
          });
          return true;
        }
      }).catch(error => {
        console.error("Error in deception detection:", error);
      });
    }
    
    return false;
  };
  
  // Handle persistent suicide messaging with progressive responses
  const handlePersistentCrisis = (userInput: string): MessageType | null => {
    // Check if this is another suicide/self-harm message after we've already responded
    if (consecutiveCrisisCount >= 1 && 
        /suicid|kill myself|die|want to die|end my life|no reason to live|don't want to be alive/i.test(userInput.toLowerCase())) {
      
      // Choose appropriate escalated response based on consecutive count
      let escalatedResponse = "";
      
      if (consecutiveCrisisCount === 1) {
        // First follow-up - reinforce crisis resources
        escalatedResponse = "I'm still very concerned about what you're sharing. I want to emphasize how important it is to speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline at 988 now. Would you like me to provide additional resources or support options?";
      } else if (consecutiveCrisisCount === 2) {
        // Second follow-up - provide more specific guidance
        escalatedResponse = "It's clear you're in significant distress right now. Please understand that reaching out to 988 or going to your nearest emergency room is the most important step you can take. The trained professionals there have the expertise to help you through this difficult time. Would it help to talk through what might be making it difficult to reach out?";
      } else {
        // Third or more - emphasize immediate action with empathy
        escalatedResponse = "I hear your pain and I'm deeply concerned for your safety right now. Please call 988 immediately - even if you've hesitated until now. The crisis counselors there understand what you're going through and can provide immediate support. Your life matters, and help is available right now.";
      }
      
      // Create crisis response
      const crisisResponse = createMessage(
        escalatedResponse,
        'roger',
        'crisis' as ConcernType
      );
      
      // Increment crisis counter again
      setConsecutiveCrisisCount(prev => prev + 1);
      
      return crisisResponse;
    }
    
    return null;
  };
  
  return {
    recentCrisisMessage,
    handleCrisisMessage,
    checkDeception,
    handlePersistentCrisis,
    consecutiveCrisisCount
  };
};
