
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  detectCrisisKeywords, 
  detectMedicalConcerns,
  detectMentalHealthConcerns,
  detectEatingDisorderConcerns,
  detectSubstanceUseConcerns,
  detectTentativeHarmLanguage
} from '../../utils/detectionUtils';

interface ConcernState {
  crisis: boolean;
  medical: boolean;
  mentalHealth: boolean;
  eatingDisorder: boolean;
  substanceUse: boolean;
  tentativeHarm: boolean;
}

export const useConcernDetection = () => {
  const [concernsShown, setConcernsShown] = useState<ConcernState>({
    crisis: false,
    medical: false,
    mentalHealth: false,
    eatingDisorder: false,
    substanceUse: false,
    tentativeHarm: false
  });

  const { toast } = useToast();

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

  const detectConcerns = (userInput: string) => {
    // Check for various concern keywords
    const containsCrisisKeywords = detectCrisisKeywords(userInput);
    const containsMedicalConcerns = detectMedicalConcerns(userInput);
    const containsMentalHealthConcerns = detectMentalHealthConcerns(userInput);
    const containsEatingDisorderConcerns = detectEatingDisorderConcerns(userInput);
    const containsSubstanceUseConcerns = detectSubstanceUseConcerns(userInput);
    const containsTentativeHarmLanguage = detectTentativeHarmLanguage(userInput);

    // Determine if any concerns need to be shown
    const concerns = {
      tentativeHarm: containsTentativeHarmLanguage && !concernsShown.tentativeHarm,
      crisis: containsCrisisKeywords && !concernsShown.crisis,
      medical: containsMedicalConcerns && !concernsShown.medical,
      mentalHealth: containsMentalHealthConcerns && !concernsShown.mentalHealth,
      eatingDisorder: containsEatingDisorderConcerns && !concernsShown.eatingDisorder,
      substanceUse: containsSubstanceUseConcerns && !concernsShown.substanceUse
    };

    // Show appropriate alerts based on detected concerns
    if (concerns.tentativeHarm) {
      setConcernsShown(prev => ({ ...prev, tentativeHarm: true }));
      showConcernToast('tentative-harm');
      return 'tentative-harm';
    }
    else if (concerns.crisis) {
      setConcernsShown(prev => ({ ...prev, crisis: true }));
      showConcernToast('crisis');
      return 'crisis';
    }
    else if (concerns.medical) {
      setConcernsShown(prev => ({ ...prev, medical: true }));
      showConcernToast('medical');
      return 'medical';
    }
    else if (concerns.mentalHealth) {
      setConcernsShown(prev => ({ ...prev, mentalHealth: true }));
      showConcernToast('mental-health');
      return 'mental-health';
    }
    else if (concerns.eatingDisorder) {
      setConcernsShown(prev => ({ ...prev, eatingDisorder: true }));
      showConcernToast('eating-disorder');
      return 'eating-disorder';
    }
    else if (concerns.substanceUse) {
      setConcernsShown(prev => ({ ...prev, substanceUse: true }));
      showConcernToast('substance-use');
      return 'substance-use';
    }

    return null;
  };

  return {
    detectConcerns
  };
};
