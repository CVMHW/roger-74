
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { recordToMemory } from '../../utils/nlpProcessor';

// Array of special case patterns for detection
const SPECIAL_CASE_PATTERNS = [
  {
    name: 'inpatient',
    pattern: /\b(inpatient|hospitalized|admitted|hospital stay|psychiatric ward|mental hospital|psych ward)\b/i,
    concernLevel: 'high'
  },
  {
    name: 'weather',
    pattern: /\b(weather|storm|hurricane|tornado|flood|rain|snow|heatwave|cold snap|blizzard|climate|forecast)\b/i,
    concernLevel: 'low'
  },
  {
    name: 'culturalAdjustment',
    pattern: /\b(moved|moving|relocate|relocation|immigration|immigrant|culture shock|different culture|cultural|adjustment|adjusting|adapt|adapting|foreign|new country|new city)\b/i,
    concernLevel: 'medium'
  },
  {
    name: 'grief',
    pattern: /\b(grief|death|died|passed away|funeral|mourning|loss of|lost my)\b/i,
    concernLevel: 'high'
  }
];

/**
 * Detects special case patterns in the user's message
 * @param input User message text
 * @returns Object containing matched special cases
 */
export const detectSpecialCasePatterns = (input: string) => {
  // Initialize results
  const matches: Record<string, any> = {};
  let hasMatch = false;
  
  // Check each pattern
  SPECIAL_CASE_PATTERNS.forEach(specialCase => {
    if (specialCase.pattern.test(input)) {
      matches[specialCase.name] = {
        detected: true,
        concernLevel: specialCase.concernLevel
      };
      hasMatch = true;
    }
  });

  // Return results with UNCONDITIONAL memory recording
  if (hasMatch) {
    try {
      // Record special case to memory - UNCONDITIONAL
      recordToMemory(
        input, 
        undefined, 
        undefined, 
        Object.keys(matches)
      );
    } catch (error) {
      console.error('Failed to record special case to memory:', error);
    }
  }

  // Add specific detection flags for use in processors
  const isInpatientQuestion = !!matches['inpatient'];
  const isWeatherRelated = !!matches['weather'];
  const isCulturalAdjustment = !!matches['culturalAdjustment'];

  return {
    hasSpecialCase: hasMatch,
    specialCases: matches,
    isInpatientQuestion,
    isWeatherRelated,
    isCulturalAdjustment
  };
};

/**
 * Analyze input for special case handling requirements
 * UNCONDITIONALLY records to memory
 */
export const analyzeSpecialCases = (
  input: string,
  concernType: ConcernType | undefined
) => {
  const specialCaseResults = detectSpecialCasePatterns(input);
  
  // Always record to memory as part of UNCONDITIONAL_MEMORY_RULE
  try {
    recordToMemory(
      input,
      undefined,
      undefined,
      Object.keys(specialCaseResults.specialCases)
    );
  } catch (error) {
    console.error('Error in special case memory recording:', error);
  }
  
  return {
    ...specialCaseResults,
    concernType
  };
};

/**
 * Determines the appropriate response time multiplier based on message content
 * @param userInput User's message
 * @param concernType Type of concern detected
 * @returns Multiplier for response timing (lower for urgent matters)
 */
export const determineResponseTimeMultiplier = (userInput: string, concernType: ConcernType): number => {
  // Special case detection
  const { hasSpecialCase, specialCases } = detectSpecialCasePatterns(userInput);
  
  // Critical concerns get fastest response (multiplier < 1)
  if (concernType === 'crisis' || concernType === 'tentative-harm') {
    return 0.7; // 30% faster for crisis situations
  }
  
  // High concern special cases get slightly faster response
  if (hasSpecialCase) {
    // Check for high concern level special cases
    const hasHighConcern = Object.values(specialCases).some(
      (caseInfo: any) => caseInfo.concernLevel === 'high'
    );
    
    if (hasHighConcern) {
      return 0.85; // 15% faster for high concern special cases
    }
  }
  
  // Default response time for normal messages
  return 1.0;
};
