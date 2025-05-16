
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectMildSomaticComplaints, detectSimpleNegativeState } from '../../utils/conversationalUtils';
// Import the eating pattern detector directly from the detectors file
import { detectEatingDisorderConcerns } from '../../utils/conversation/specializedDetection/eatingPatterns/detectors';

export const useConcernDetection = () => {
  const detectConcerns = (userInput: string): ConcernType => {
    // Normalize input for more consistent detection
    const lowerInput = userInput.toLowerCase().trim();
    
    // HIGHEST PRIORITY: Check for suicidal ideation or self-harm - make this check first
    // and ensure it's very sensitive to catch any potential mentions
    if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide|fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/i.test(lowerInput)) {
      console.log("CRITICAL: Detected suicide concern in message:", lowerInput);
      return 'tentative-harm';
    }
    
    // Check for crisis situations - also high sensitivity
    if (/crisis|emergency|urgent|need help now|immediate danger|threat|safety risk/i.test(lowerInput)) {
      console.log("CRITICAL: Detected crisis concern in message:", lowerInput);
      return 'crisis';
    }
    
    // NEW: Enhanced eating disorder detection using our specialized system
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && (edResult.riskLevel === 'high' || edResult.riskLevel === 'moderate')) {
      console.log(`DETECTED EATING DISORDER CONCERN (${edResult.riskLevel}) with phrases:`, edResult.matchedPhrases);
      return 'eating-disorder';
    }
    
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
    
    // Check for weather-related concerns
    const hasWeatherRelatedConcerns = (
      // Check for mentions of severe weather events
      (/\b(snow|blizzard|storm|hurricane|tornado|flood|ice|weather|power outage|electricity|internet down)\b/i.test(lowerInput)) &&
      // Combined with isolation or difficulties
      (/\b(stuck|trapped|can'?t leave|unable to leave|days|inside|home|house|isolated|cabin fever|bored|frustrated)\b/i.test(lowerInput))
    );
    
    if (hasWeatherRelatedConcerns) {
      return 'weather-related';
    }
    
    // Check for cultural adjustment concerns (migration, relocation)
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
    
    // Check for general negative emotions or statements indicating sadness/depression
    if (/\b(depress|sad|down|upset|low|unhappy|hopeless|lost|empty|numb|blue|miserable|despair|dejected|despondent)\b/i.test(lowerInput)) {
      return 'mental-health';
    }
    
    // Continue with regular detection for more serious medical concerns
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
    
    // LOW-PRIORITY: Check for mild/low-risk eating concerns (after the dedicated system check)
    if (/eating disorder|binge|purge|starv|don'?t eat|body image|weight concern/i.test(lowerInput) && 
        !edResult.isEatingDisorderConcern) {
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
