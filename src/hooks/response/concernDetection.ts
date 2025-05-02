
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectMildSomaticComplaints } from '../../utils/conversationalUtils';

export const useConcernDetection = () => {
  const detectConcerns = (userInput: string): ConcernType | null => {
    // Check if this is a mild somatic complaint from overwork
    const somaticInfo = detectMildSomaticComplaints(userInput);
    if (somaticInfo.isMildSomatic && somaticInfo.likelyFromOverwork) {
      // This is not a medical concern but a temporary state from overwork
      return null;
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
    
    // Check for mental health concerns
    if (/depress|anxiety|bipolar|schizophrenia|ocd|ptsd|trauma|mental illness|mental health|diagnosis|therapist|psychiatrist/.test(lowerInput)) {
      return 'mental-health';
    }
    
    // Check for eating disorders
    if (/eating disorder|anorexia|bulimia|binge|purge|starv|don'?t eat|body image|weight concern/.test(lowerInput)) {
      return 'eating-disorder';
    }
    
    // Check for substance use
    if (/addict|alcohol|drunk|substance|drug|using|withdrawal|sober|recovery|clean|relapse|overdose/.test(lowerInput)) {
      return 'substance-use';
    }
    
    // Check for gambling concerns
    if (/gambling|bet|casino|poker|slots|lottery|lost money|betting|won money/.test(lowerInput) && !/just a small bet|social gambling|once in a while/.test(lowerInput)) {
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
