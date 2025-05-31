
/**
 * Hallucination Detection System V2 - Enhanced for CVMHW Legal Information
 * 
 * Updated to properly handle comprehensive legal and service information
 */

export interface HallucinationResult {
  isHallucination: boolean;
  confidence: number;
  reason?: string;
  category?: 'medical' | 'legal' | 'service' | 'crisis' | 'factual' | 'other';
}

/**
 * Enhanced hallucination detection with CVMHW legal awareness
 */
export const detectHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): HallucinationResult => {
  
  // Early return for valid CVMHW service information
  if (isValidCVMHWInformation(responseText, userInput)) {
    return {
      isHallucination: false,
      confidence: 0.95,
      category: 'service'
    };
  }

  // Check for inappropriate medical advice (still applies)
  const medicalCheck = checkMedicalAdviceHallucination(responseText);
  if (medicalCheck.isHallucination) {
    return medicalCheck;
  }

  // Check for legal misinformation
  const legalCheck = checkLegalInformationHallucination(responseText);
  if (legalCheck.isHallucination) {
    return legalCheck;
  }

  // Check for service misrepresentation
  const serviceCheck = checkServiceMisrepresentation(responseText);
  if (serviceCheck.isHallucination) {
    return serviceCheck;
  }

  // Check for factual inconsistencies
  const factualCheck = checkFactualInconsistencies(responseText, conversationHistory);
  if (factualCheck.isHallucination) {
    return factualCheck;
  }

  // Check for inappropriate crisis response modifications
  const crisisCheck = checkCrisisResponseHallucination(responseText, userInput);
  if (crisisCheck.isHallucination) {
    return crisisCheck;
  }

  return {
    isHallucination: false,
    confidence: 0.9
  };
};

/**
 * Check if response contains valid CVMHW service information
 */
const isValidCVMHWInformation = (responseText: string, userInput: string): boolean => {
  const validCVMHWTopics = [
    // Service information
    'psychotherapy', 'life coaching', 'athletic coaching',
    'eric riesterer', 'wendy nathan', 'lpcc-s', 'lpc',
    
    // Financial information
    '$120/hour', '$100/hour', '$150', '$45/hour', '$25-$45', '$45-$70',
    'sliding scale', 'pro-bono', 'financial hardship',
    'couch to 5k', 'first marathon', '$250', '$350', '$850',
    
    // Insurance
    'aetna', 'anthem', 'beacon health', 'carelon', 'cigna',
    'medical mutual', 'medicaid', 'medicare', 'united healthcare',
    
    // Legal/compliance
    'hipaa', 'ohio rev. code', 'mandated reporting', 'good faith estimate',
    'no surprises act', 'americans with disabilities act', 'ada',
    'section 1557', 'civil rights act', 'patient rights',
    
    // Contact information
    '(440) 294-8068', '(419) 377-3057', 'wnathanwellness@gmail.com',
    'cvmindfulhealthandwellness@outlook.com',
    
    // Legal references
    '42 u.s.c.', '45 c.f.r.', '17 u.s.c.', '15 u.s.c.',
    '§ 2151.421', '§ 5101.63', '§ 4757'
  ];

  const inputLower = userInput.toLowerCase();
  const responseLower = responseText.toLowerCase();

  // Check if user is asking about CVMHW services
  const isCVMHWInquiry = validCVMHWTopics.some(topic => 
    inputLower.includes(topic) || inputLower.includes('cvmhw') || 
    inputLower.includes('cuyahoga valley') || inputLower.includes('mindful health')
  );

  // Check if response contains valid CVMHW information
  const containsValidInfo = validCVMHWTopics.some(topic => 
    responseLower.includes(topic.toLowerCase())
  );

  return isCVMHWInquiry && containsValidInfo;
};

/**
 * Check for inappropriate medical advice
 */
const checkMedicalAdviceHallucination = (responseText: string): HallucinationResult => {
  const medicalAdvicePatterns = [
    /take this medication/i,
    /i recommend you stop taking/i,
    /you should increase your dosage/i,
    /this will cure your/i,
    /you definitely have/i,
    /i can diagnose/i
  ];

  // Exception: Roger can mention that CVMHW provides therapy services
  const cvmhwServiceMention = /cvmhw|cuyahoga valley|psychotherapy|therapy services/i.test(responseText);
  
  for (const pattern of medicalAdvicePatterns) {
    if (pattern.test(responseText) && !cvmhwServiceMention) {
      return {
        isHallucination: true,
        confidence: 0.9,
        reason: 'Inappropriate medical advice detected',
        category: 'medical'
      };
    }
  }

  return { isHallucination: false, confidence: 0.8 };
};

/**
 * Check for legal information hallucinations
 */
const checkLegalInformationHallucination = (responseText: string): HallucinationResult => {
  const problematicLegalClaims = [
    /roger is a licensed/i,
    /roger provides therapy/i,
    /roger is hipaa/i,
    /roger can diagnose/i,
    /roger is not required to report/i,
    /peersupportai provides medical/i
  ];

  for (const pattern of problematicLegalClaims) {
    if (pattern.test(responseText)) {
      return {
        isHallucination: true,
        confidence: 0.95,
        reason: 'Incorrect legal claim about Roger or PeerSupportAI',
        category: 'legal'
      };
    }
  }

  return { isHallucination: false, confidence: 0.9 };
};

/**
 * Check for service misrepresentation
 */
const checkServiceMisrepresentation = (responseText: string): HallucinationResult => {
  const misrepresentationPatterns = [
    /roger offers therapy/i,
    /roger provides counseling/i,
    /roger is your therapist/i,
    /peersupportai provides mental health treatment/i,
    /roger can treat your/i
  ];

  for (const pattern of misrepresentationPatterns) {
    if (pattern.test(responseText)) {
      return {
        isHallucination: true,
        confidence: 0.9,
        reason: 'Misrepresentation of Roger/PeerSupportAI services',
        category: 'service'
      };
    }
  }

  return { isHallucination: false, confidence: 0.8 };
};

/**
 * Check for factual inconsistencies
 */
const checkFactualInconsistencies = (responseText: string, conversationHistory: string[]): HallucinationResult => {
  // Check for contradictory statements within the response
  const contradictionPatterns = [
    { pattern1: /hipaa.protected/i, pattern2: /not hipaa/i },
    { pattern1: /\$120/i, pattern2: /\$200/i },
    { pattern1: /eric riesterer/i, pattern2: /different therapist name/i }
  ];

  for (const { pattern1, pattern2 } of contradictionPatterns) {
    if (pattern1.test(responseText) && pattern2.test(responseText)) {
      return {
        isHallucination: true,
        confidence: 0.85,
        reason: 'Contradictory information in response',
        category: 'factual'
      };
    }
  }

  return { isHallucination: false, confidence: 0.7 };
};

/**
 * Check for crisis response hallucinations
 */
const checkCrisisResponseHallucination = (responseText: string, userInput: string): HallucinationResult => {
  const crisisIndicators = /suicid|kill.*myself|end.*life|harm.*myself|don'?t want to live/i;
  const isCrisisInput = crisisIndicators.test(userInput);

  if (isCrisisInput) {
    // Crisis responses should include proper resources
    const hasProperCrisisResponse = /988|crisis.*line|emergency|immediate/i.test(responseText);
    
    if (!hasProperCrisisResponse) {
      return {
        isHallucination: true,
        confidence: 0.95,
        reason: 'Inadequate crisis response - missing proper resources',
        category: 'crisis'
      };
    }
  }

  return { isHallucination: false, confidence: 0.9 };
};
