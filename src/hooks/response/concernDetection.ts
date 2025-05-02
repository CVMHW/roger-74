
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectMildSomaticComplaints, detectSimpleNegativeState } from '../../utils/conversationalUtils';

export const useConcernDetection = () => {
  const detectConcerns = (userInput: string): ConcernType | null => {
    // First check for explicit feelings related to waiting/appointments
    const negativeStateInfo = detectSimpleNegativeState(userInput);
    const isWaitingFrustration = 
      negativeStateInfo.explicitFeelings && 
      negativeStateInfo.explicitFeelings.length > 0 && 
      /\b(?:wait|waiting|late|appointment|therapist|doctor|eric|schedule)\b/i.test(userInput.toLowerCase());
    
    if (isWaitingFrustration) {
      // This is not a clinical concern but an appropriate frustration
      return null;
    }
    
    // Check if this is a mild somatic complaint from overwork
    const somaticInfo = detectMildSomaticComplaints(userInput);
    if (somaticInfo.isMildSomatic && somaticInfo.likelyFromOverwork) {
      // This is not a medical concern but a temporary state from overwork
      return null;
    }
    
    // Check for cultural adjustment concerns (migration, relocation)
    const lowerInput = userInput.toLowerCase();
    const hasCulturalAdjustmentConcerns = (
      // Check for mentions of immigration, relocation or cultural change
      (/\b(immigrat|refugee|asylum|moved from|came from|new country|new culture|cultural|adjustment)\b/i.test(lowerInput) ||
      // Mentions of specific challenges immigrants often face
      /\b(language barrier|don'?t speak|accent|citizenship|visa|green card|foreign|foreigner)\b/i.test(lowerInput)) &&
      // Combined with emotional difficulty
      /\b(hard|difficult|struggle|miss|homesick|alone|lonely|isolated)\b/i.test(lowerInput)
    );
    
    if (hasCulturalAdjustmentConcerns) {
      return 'cultural-adjustment';
    }
    
    // Continue with regular detection for more serious medical concerns
    const lowerInput = userInput.toLowerCase();
    
    // Check for suicidal ideation or self-harm
    if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/.test(lowerInput)) {
      return 'tentative-harm';
    }
    
    // Check for crisis situations
    if (/crisis|emergency|urgent|need help now|immediate danger|threat|safety risk/.test(lowerInput)) {
      return 'crisis';
    }
    
    // Check for medical concerns (only for specific serious symptoms)
    const medicalPatterns = [
      /severe (pain|bleeding|headache|injury|symptoms)/i,
      /(chest pain|heart attack|stroke|seizure|unconscious)/i,
      /(broken bone|fracture|concussion)/i,
      /(emergency room|hospital|ambulance|911)/i,
      /(blood pressure|pulse|heart rate) (high|low|irregular|abnormal)/i,
      /can'?t (breathe|move|feel|walk|talk|see|hear)/i
    ];
    
    if (medicalPatterns.some(pattern => pattern.test(lowerInput))) {
      return 'medical';
    }
    
    // Check for mental health concerns - make pattern more specific to avoid false positives
    if (/\b(depress|anxiety|bipolar|schizophrenia|ocd|ptsd|trauma|mental illness|mental health|diagnosis|therapist|psychiatrist)\b/.test(lowerInput)) {
      return 'mental-health';
    }
    
    // Check for eating disorders
    if (/eating disorder|anorexia|bulimia|binge|purge|starv|don'?t eat|body image|weight concern/.test(lowerInput)) {
      return 'eating-disorder';
    }
    
    // Check for substance use
    if (/\b(addict|alcohol|drunk|substance|drug|using|withdrawal|sober|recovery|clean|relapse|overdose)\b/.test(lowerInput)) {
      return 'substance-use';
    }
    
    // Check for gambling concerns - stricter pattern to avoid false positives
    if ((/\b(gambling|bet|casino|poker|slots|lottery)\b/.test(lowerInput) && 
         /\b(lost money|betting|won money)\b/.test(lowerInput)) && 
        !/just a small bet|social gambling|once in a while/.test(lowerInput)) {
      return 'mild-gambling';
    }
    
    // Check for PTSD
    if (/(ptsd|post.?traumatic|flashback|trigger|trauma response)/.test(lowerInput)) {
      return 'ptsd';
    }
    
    // Check for mild PTSD
    if (/(nightmare|hypervigilant|startle|jumpy since|trauma|traumatic event)/.test(lowerInput)) {
      return 'ptsd-mild';
    }
    
    // Check for trauma responses that aren't full PTSD
    if (/(freeze|flight|fight|fawn|shutdown|defensive|protect myself|unsafe|threat)/.test(lowerInput)) {
      return 'trauma-response';
    }
    
    return null;
  };
  
  return { detectConcerns };
};
