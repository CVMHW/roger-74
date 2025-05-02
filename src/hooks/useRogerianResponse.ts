
import { useState } from 'react';
import { MessageType } from '../components/Message';
import { 
  detectCrisisKeywords, 
  detectMedicalConcerns,
  detectMentalHealthConcerns,
  detectEatingDisorderConcerns,
  detectSubstanceUseConcerns,
} from '../utils/detectionUtils';
import {
  createMessage
} from '../utils/messageUtils';
import {
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage
} from '../utils/responseUtils';
import { useToast } from '@/components/ui/use-toast';
import useTypingEffect from './useTypingEffect';
import useAdaptiveResponse from './useAdaptiveResponse';

interface ConcernState {
  crisis: boolean;
  medical: boolean;
  mentalHealth: boolean;
  eatingDisorder: boolean;
  substanceUse: boolean;
}

interface UseRogerianResponseReturn {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational';
}

export const useRogerianResponse = (): UseRogerianResponseReturn => {
  const [isTyping, setIsTyping] = useState(false);
  const [concernsShown, setConcernsShown] = useState<ConcernState>({
    crisis: false,
    medical: false,
    mentalHealth: false,
    eatingDisorder: false,
    substanceUse: false
  });
  const { toast } = useToast();
  const { calculateResponseTime, simulateTypingResponse } = useTypingEffect();
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();

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
    
    // Show appropriate alerts based on detected concerns
    if (containsCrisisKeywords && !concernsShown.crisis) {
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

    // Calculate response time based on message complexity
    const responseTime = calculateResponseTime(userInput);
    
    // Return a promise that resolves with the appropriate response
    return new Promise(resolve => {
      setTimeout(() => {
        let responseText;
        let concernType = null;
        
        // Determine which response to use based on detected concerns
        if (containsCrisisKeywords) {
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
        else {
          // Generate an adaptive response based on the client's input
          responseText = generateAdaptiveResponse(userInput);
        }
        
        // Create response message
        const rogerResponse = createMessage('', 'roger', concernType);
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
