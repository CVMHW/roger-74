
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { 
  detectCrisisKeywords, 
  detectMedicalConcerns,
  detectMentalHealthConcerns,
  detectEatingDisorderConcerns,
  detectSubstanceUseConcerns,
  detectTentativeHarmLanguage,
  detectPTSDConcerns
} from '../../utils/detectionUtils';
import { detectTraumaResponsePatterns } from '../../utils/response/traumaResponsePatterns';

interface ConcernState {
  crisis: boolean;
  medical: boolean;
  mentalHealth: boolean;
  eatingDisorder: boolean;
  substanceUse: boolean;
  mildGambling: boolean;
  tentativeHarm: boolean;
  ptsd: boolean;
  traumaResponse: boolean; // Added tracking for trauma responses
}

export const useConcernDetection = () => {
  const [concernsShown, setConcernsShown] = useState<ConcernState>({
    crisis: false,
    medical: false,
    mentalHealth: false,
    eatingDisorder: false,
    substanceUse: false,
    mildGambling: false,
    tentativeHarm: false,
    ptsd: false,
    traumaResponse: false // New state tracking
  });

  const { toast } = useToast();

  // Show appropriate toast notifications for detected concerns
  const showConcernToast = (concernType: string) => {
    let title = "Important Notice";
    let description = "";
    
    // Determine the appropriate toast message based on concern type
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
      case 'substance-use-severe':
        description = "For serious substance use or gambling concerns, specialized support is available in the resources below.";
        break;
      case 'substance-use-moderate': 
        description = "I notice you mentioned gambling or substance use that might be concerning. Resources are available if needed.";
        break;
      case 'mild-gambling':
        // No toast for mild gambling - we'll handle it conversationally
        break;
      case 'tentative-harm':
        description = "I've noticed concerning language that requires professional support. Please see scheduling link below.";
        break;
      case 'ptsd-severe':
        description = "I notice you're describing symptoms that may be related to PTSD. Professional support from a trauma specialist is recommended.";
        break;
      case 'ptsd-moderate':
        description = "Your experiences sound challenging and may be related to trauma. Resources for trauma support are available below.";
        break;
      case 'trauma-response':
        description = "I notice you're describing experiences that might be connected to past difficult events. Resources for trauma-informed support are available if needed.";
        break;
      default:
        description = "Please see the resources below for support with your concerns.";
    }
    
    if (description) {
      toast({
        title,
        description,
        duration: 6000,
      });
    }
  };

  // Detect concerns from user input
  const detectConcerns = (userInput: string): ConcernType | null => {
    // Check for various concern keywords
    const containsCrisisKeywords = detectCrisisKeywords(userInput);
    const containsMedicalConcerns = detectMedicalConcerns(userInput);
    const containsMentalHealthConcerns = detectMentalHealthConcerns(userInput);
    const containsEatingDisorderConcerns = detectEatingDisorderConcerns(userInput);
    const substanceConcernsResult = detectSubstanceUseConcerns(userInput);
    const containsSubstanceUseConcerns = substanceConcernsResult.detected;
    const substanceConcernSeverity = substanceConcernsResult.severity || 'mild';
    const containsTentativeHarmLanguage = detectTentativeHarmLanguage(userInput);
    
    // Enhanced PTSD detection
    const ptsdResult = detectPTSDConcerns(userInput);
    const containsPTSDConcerns = ptsdResult.detected;
    const ptsdSeverity = ptsdResult.severity;
    
    // Check for 4F trauma response patterns
    let traumaResponsePatterns;
    try {
      traumaResponsePatterns = detectTraumaResponsePatterns(userInput);
    } catch (e) {
      console.log("Error detecting trauma response patterns:", e);
      traumaResponsePatterns = null;
    }
    
    // Only use 4F detection if the pattern is significant enough and user didn't already trip PTSD
    const significantTraumaResponse = traumaResponsePatterns && 
                                   traumaResponsePatterns.dominant4F && 
                                   traumaResponsePatterns.dominant4F.intensity !== 'mild' &&
                                   !containsPTSDConcerns;

    // Determine if any concerns need to be shown
    const concerns = {
      tentativeHarm: containsTentativeHarmLanguage && !concernsShown.tentativeHarm,
      crisis: containsCrisisKeywords && !concernsShown.crisis,
      medical: containsMedicalConcerns && !concernsShown.medical,
      mentalHealth: containsMentalHealthConcerns && !concernsShown.mentalHealth,
      eatingDisorder: containsEatingDisorderConcerns && !concernsShown.eatingDisorder,
      substanceUseSevere: containsSubstanceUseConcerns && substanceConcernSeverity === 'severe' && !concernsShown.substanceUse,
      substanceUseModerate: containsSubstanceUseConcerns && substanceConcernSeverity === 'moderate' && !concernsShown.substanceUse,
      mildGambling: containsSubstanceUseConcerns && substanceConcernSeverity === 'mild' && !concernsShown.mildGambling,
      ptsdSevere: containsPTSDConcerns && ptsdSeverity === 'severe' && !concernsShown.ptsd,
      ptsdModerate: containsPTSDConcerns && ptsdSeverity === 'moderate' && !concernsShown.ptsd,
      ptsdMild: containsPTSDConcerns && ptsdSeverity === 'mild' && !concernsShown.ptsd,
      traumaResponse: significantTraumaResponse && !concernsShown.traumaResponse
    };

    // Show appropriate alerts based on detected concerns using priority ordering
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
    else if (concerns.ptsdSevere || concerns.ptsdModerate) {
      setConcernsShown(prev => ({ ...prev, ptsd: true }));
      showConcernToast(concerns.ptsdSevere ? 'ptsd-severe' : 'ptsd-moderate');
      return 'ptsd';
    }
    else if (concerns.ptsdMild) {
      setConcernsShown(prev => ({ ...prev, ptsd: true }));
      return 'ptsd-mild';
    }
    else if (concerns.traumaResponse) {
      setConcernsShown(prev => ({ ...prev, traumaResponse: true }));
      showConcernToast('trauma-response');
      return 'trauma-response';
    }
    else if (concerns.substanceUseSevere) {
      setConcernsShown(prev => ({ ...prev, substanceUse: true }));
      showConcernToast('substance-use-severe');
      return 'substance-use';
    }
    else if (concerns.substanceUseModerate) {
      setConcernsShown(prev => ({ ...prev, substanceUse: true }));
      showConcernToast('substance-use-moderate');
      return 'substance-use';
    }
    else if (concerns.mildGambling) {
      setConcernsShown(prev => ({ ...prev, mildGambling: true }));
      showConcernToast('mild-gambling');
      return 'mild-gambling';
    }

    return null;
  };

  return {
    detectConcerns
  };
};
