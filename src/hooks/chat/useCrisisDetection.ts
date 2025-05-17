
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
 * Enhanced hook for detecting and handling crisis-related messages
 * with vector-based pattern detection
 */
export const useCrisisDetection = (
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  // Track potential crisis messaging for deception detection
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<RecentCrisisMessage | null>(null);
  // Track consecutive crisis messages to ensure appropriate response escalation
  const [consecutiveCrisisCount, setConsecutiveCrisisCount] = useState<number>(0);
  // Track crisis type for contextual responses
  const [lastCrisisType, setLastCrisisType] = useState<string | null>(null);
  
  // Store crisis messages for deception detection
  const handleCrisisMessage = (userInput: string, rogerResponse: MessageType) => {
    const crisisConcernTypes = ['crisis', 'tentative-harm', 'suicide', 'self-harm', 'eating-disorder'];
    if (rogerResponse.concernType && crisisConcernTypes.includes(rogerResponse.concernType)) {
      setRecentCrisisMessage({
        message: userInput,
        timestamp: new Date(),
        concernType: rogerResponse.concernType
      });
      
      // Store the crisis type for context-aware follow-ups
      setLastCrisisType(rogerResponse.concernType);
      
      // Increment consecutive crisis counter to track escalation
      setConsecutiveCrisisCount(prev => prev + 1);
    } else {
      // Only reset counter if we're not receiving another crisis-related message
      // This prevents counter reset during persistent crisis situations
      if (!isCrisisContent(userInput)) {
        setConsecutiveCrisisCount(0);
        setLastCrisisType(null);
      }
    }
  };
  
  // Helper function to determine if new input is crisis-related
  const isCrisisContent = (userInput: string): boolean => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for suicide/self-harm indicators
    const suicidePatterns = /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|want to die/i;
    if (suicidePatterns.test(lowerInput)) return true;
    
    // Check for eating disorder indicators
    const eatingDisorderPatterns = /can't stop eating|binge eating|overeating|eating too much|not eating|haven'?t been eating|purge|anorexia|bulimia/i;
    if (eatingDisorderPatterns.test(lowerInput)) return true;
    
    // Check for substance abuse indicators
    const substancePatterns = /drinking|drunk|alcohol|can't stop drinking|addicted/i;
    if (substancePatterns.test(lowerInput)) return true;
    
    return false;
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
      try {
        // Simple deception detection without dynamic import
        const isPotentialDeception = 
          currentCrisisMessage.concernType === 'suicide' && 
          (/just kidding|joking|not serious|didn't mean it/i.test(userInput.toLowerCase()));
        
        if (isPotentialDeception) {
          // Generate a deception response
          const deceptionResponse = 
            "I take all mentions of suicide or self-harm very seriously. Even if you're feeling better now, " +
            "I strongly encourage you to speak with a mental health professional. The 988 Suicide & Crisis " +
            "Lifeline (call or text 988) is available 24/7 to provide support.";
          
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
          return true;
        }
      } catch (error) {
        console.error("Error in deception detection:", error);
      }
    }
    
    return false;
  };
  
  // Handle persistent crisis messaging with progressive responses
  const handlePersistentCrisis = (userInput: string): MessageType | null => {
    // Check for new crisis content to maintain the crisis context even with different phrasings
    const isNewCrisisContent = isCrisisContent(userInput);
    
    // Update consecutive counter for new crisis content
    if (isNewCrisisContent && consecutiveCrisisCount === 0) {
      setConsecutiveCrisisCount(1);
    }
    
    // If this is a follow-up crisis message after we've already responded
    if ((consecutiveCrisisCount >= 1 && isNewCrisisContent) || consecutiveCrisisCount >= 2) {
      // Choose appropriate escalated response based on consecutive count and crisis type
      let escalatedResponse = "";
      let concernType: ConcernType = 'crisis';
      
      // Handle based on previous crisis type for continuity
      const isSuicideContent = /suicid|kill myself|die|want to die|end my life|no reason to live|don't want to be alive/i.test(userInput.toLowerCase());
      const isEatingDisorderContent = /can't stop eating|binge eating|overeating|eating too much|not eating|haven't been eating|purge|anorexia|bulimia/i.test(userInput.toLowerCase());
      const isSubstanceContent = /drinking|drunk|alcohol|can't stop drinking|addicted/i.test(userInput.toLowerCase());
      
      // Prioritize suicide content detection
      if (isSuicideContent || lastCrisisType === 'suicide' || lastCrisisType === 'crisis') {
        concernType = 'crisis';
        
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
      }
      // Handle eating disorder content
      else if (isEatingDisorderContent || lastCrisisType === 'eating-disorder') {
        concernType = 'eating-disorder';
        
        if (consecutiveCrisisCount === 1) {
          escalatedResponse = "I'm still concerned about your eating patterns. The National Eating Disorders Association has professionals who understand what you're going through. Please reach out to their helpline at 1-800-931-2237. Would you be willing to call them today?";
        } else {
          escalatedResponse = "Your continued struggle with eating is serious, and professional help is essential. The NEDA helpline at 1-800-931-2237 can connect you with treatment options tailored to your needs. You deserve support during this difficult time.";
        }
      }
      // Handle substance use content
      else if (isSubstanceContent) {
        concernType = 'substance-abuse';
        
        if (consecutiveCrisisCount === 1) {
          escalatedResponse = "I understand your struggle with drinking is serious. The SAMHSA National Helpline at 1-800-662-4357 provides confidential support and can connect you with local resources. They're available 24/7. Would you consider calling them?";
        } else {
          escalatedResponse = "Your continued struggle with alcohol is concerning. Please know that recovery is possible with the right support. The SAMHSA helpline at 1-800-662-4357 can help you find treatment options that work for your situation. You don't have to face this alone.";
        }
      }
      // Default crisis response for other scenarios
      else {
        if (consecutiveCrisisCount <= 2) {
          escalatedResponse = "I'm still concerned about what you're sharing. Speaking with a professional who can provide appropriate support would be helpful. The 988 Lifeline (call or text 988) connects you with trained counselors. Would you be willing to reach out to them?";
        } else {
          escalatedResponse = "I continue to hear your distress, and I want to emphasize that professional help is available. Please consider calling 988 or visiting your local emergency services where professionals can provide the support you need right now.";
        }
      }
      
      // Create crisis response
      const crisisResponse = createMessage(
        escalatedResponse,
        'roger',
        concernType
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
    consecutiveCrisisCount,
    lastCrisisType
  };
};
