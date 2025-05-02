
import { useState } from 'react';
import { MessageType } from '../components/Message';
import { 
  detectCrisisKeywords, 
  detectMedicalConcerns,
  detectMentalHealthConcerns,
  detectEatingDisorderConcerns,
  detectSubstanceUseConcerns,
  detectTentativeHarmLanguage
} from '../utils/detectionUtils';
import {
  createMessage
} from '../utils/messageUtils';
import {
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage,
  getTentativeHarmMessage
} from '../utils/responseUtils';
import { useToast } from '@/components/ui/use-toast';
import useTypingEffect from './useTypingEffect';
import useAdaptiveResponse from './useAdaptiveResponse';
import { 
  MASTER_RULES, 
  isUniqueResponse, 
  calculateMinimumResponseTime,
  isIntroduction,
  generateIntroductionResponse,
  isSmallTalk,
  generateSmallTalkResponse
} from '../utils/masterRules';

interface ConcernState {
  crisis: boolean;
  medical: boolean;
  mentalHealth: boolean;
  eatingDisorder: boolean;
  substanceUse: boolean;
  tentativeHarm: boolean;
}

interface UseRogerianResponseReturn {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational' | 'socratic';
}

export const useRogerianResponse = (): UseRogerianResponseReturn => {
  const [isTyping, setIsTyping] = useState(false);
  const [concernsShown, setConcernsShown] = useState<ConcernState>({
    crisis: false,
    medical: false,
    mentalHealth: false,
    eatingDisorder: false,
    substanceUse: false,
    tentativeHarm: false
  });
  // Track previous responses to prevent repetition (master rule)
  const [previousResponses, setPreviousResponses] = useState<string[]>([]);
  // Track conversation stage
  const [conversationStage, setConversationStage] = useState<'initial' | 'early' | 'established'>('initial');
  
  const { toast } = useToast();
  const { calculateResponseTime, simulateTypingResponse } = useTypingEffect();
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();

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
        "I'd like to rephrase: "
      ];
      
      // Select a random modifier and add it to the beginning of the response
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      return modifier + proposedResponse;
    }
    
    // If the response is already unique, return it as is
    return proposedResponse;
  };

  const showConcernToast = (concernType: string) => {
    let title = "Important Notice";
    let description = "";
    
    switch(concernType) {
      case 'crisis':
        description = "This appears to be a sensitive topic. Crisis resources are available below.";
        break;
      case 'medical':
        description = "I notice you mentioned physical health concerns. Please consult a medical professional.";
        break;
      case 'mental-health':
        description = "For bipolar symptoms or severe mental health concerns, please contact a professional.";
        break;
      case 'eating-disorder':
        description = "For concerns about eating or body image, the Emily Program has specialists who can help.";
        break;
      case 'substance-use':
        description = "For substance use concerns, specialized support is available in the resources below.";
        break;
      case 'tentative-harm':
        description = "I've noticed concerning language that requires professional support. Please see scheduling link below.";
        break;
      default:
        description = "Please see the resources below for support with your concerns.";
    }
    
    toast({
      title,
      description,
      duration: 6000,
    });
  };

  // Process the user's message and generate a response
  const processUserMessage = async (userInput: string): Promise<MessageType> => {
    setIsTyping(true);
    
    // Check for various concern keywords
    const containsCrisisKeywords = detectCrisisKeywords(userInput);
    const containsMedicalConcerns = detectMedicalConcerns(userInput);
    const containsMentalHealthConcerns = detectMentalHealthConcerns(userInput);
    const containsEatingDisorderConcerns = detectEatingDisorderConcerns(userInput);
    const containsSubstanceUseConcerns = detectSubstanceUseConcerns(userInput);
    const containsTentativeHarmLanguage = detectTentativeHarmLanguage(userInput);
    
    // Update conversation stage based on previous messages
    if (conversationStage === 'initial') {
      setConversationStage('early');
    } else if (conversationStage === 'early' && previousResponses.length >= 3) {
      setConversationStage('established');
    }
    
    // Show appropriate alerts based on detected concerns
    if (containsTentativeHarmLanguage && !concernsShown.tentativeHarm) {
      setConcernsShown(prev => ({ ...prev, tentativeHarm: true }));
      showConcernToast('tentative-harm');
    }
    else if (containsCrisisKeywords && !concernsShown.crisis) {
      setConcernsShown(prev => ({ ...prev, crisis: true }));
      showConcernToast('crisis');
    }
    else if (containsMedicalConcerns && !concernsShown.medical) {
      setConcernsShown(prev => ({ ...prev, medical: true }));
      showConcernToast('medical');
    }
    else if (containsMentalHealthConcerns && !concernsShown.mentalHealth) {
      setConcernsShown(prev => ({ ...prev, mentalHealth: true }));
      showConcernToast('mental-health');
    }
    else if (containsEatingDisorderConcerns && !concernsShown.eatingDisorder) {
      setConcernsShown(prev => ({ ...prev, eatingDisorder: true }));
      showConcernToast('eating-disorder');
    }
    else if (containsSubstanceUseConcerns && !concernsShown.substanceUse) {
      setConcernsShown(prev => ({ ...prev, substanceUse: true }));
      showConcernToast('substance-use');
    }

    // Calculate response time based on message complexity and emotional weight
    // For sensitive topics, use the master rules to ensure appropriate pacing
    let responseTime = calculateResponseTime(userInput);
    
    // Estimate message complexity and emotional weight for timing adjustments
    const estimatedComplexity = containsCrisisKeywords || containsMentalHealthConcerns ? 8 : 
                               containsMedicalConcerns || containsEatingDisorderConcerns ? 7 : 5;
    
    const estimatedEmotionalWeight = containsCrisisKeywords || containsTentativeHarmLanguage ? 9 : 
                                    containsSubstanceUseConcerns || containsMentalHealthConcerns ? 7 : 4;
    
    // Get minimum response time from master rules
    const minimumTime = calculateMinimumResponseTime(estimatedComplexity, estimatedEmotionalWeight);
    
    // Ensure response time meets the minimum requirement
    responseTime = Math.max(responseTime, minimumTime);
    
    // Return a promise that resolves with the appropriate response
    return new Promise(resolve => {
      setTimeout(() => {
        let responseText;
        let concernType = null;
        
        // Safety concerns always take precedence as per master rules
        if (containsTentativeHarmLanguage) {
          responseText = getTentativeHarmMessage();
          concernType = 'tentative-harm';
        }
        else if (containsCrisisKeywords) {
          responseText = getCrisisMessage();
          concernType = 'crisis';
        } 
        else if (containsMedicalConcerns) {
          responseText = getMedicalConcernMessage();
          concernType = 'medical';
        }
        else if (containsMentalHealthConcerns) {
          responseText = getMentalHealthConcernMessage();
          concernType = 'mental-health';
        }
        else if (containsEatingDisorderConcerns) {
          responseText = getEatingDisorderMessage();
          concernType = 'eating-disorder';
        }
        else if (containsSubstanceUseConcerns) {
          responseText = getSubstanceUseMessage();
          concernType = 'substance-use';
        } 
        // Check for introductions and greetings - prioritize human-like interaction
        else if (isIntroduction(userInput)) {
          responseText = generateIntroductionResponse();
        }
        // Check for small talk - natural conversation flow
        else if (isSmallTalk(userInput)) {
          responseText = generateSmallTalkResponse(userInput);
        }
        else {
          // Generate an adaptive response based on the client's input
          responseText = generateAdaptiveResponse(userInput);
        }
        
        // Apply master rules to ensure no repetition
        responseText = ensureResponseCompliance(responseText);
        
        // Add this response to the history to prevent future repetition
        setPreviousResponses(prev => [...prev, responseText]);
        
        // Limit history size to prevent memory issues
        if (previousResponses.length > 20) {
          setPreviousResponses(prev => prev.slice(-20));
        }
        
        // Create response message
        const rogerResponse = createMessage(responseText, 'roger', concernType);
        setIsTyping(false);
        resolve(rogerResponse);
      }, responseTime);
    });
  };

  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    currentApproach
  };
};

export default useRogerianResponse;
