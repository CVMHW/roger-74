
import { ConcernType, TraumaResponseAnalysis } from '../../../utils/reflection/reflectionTypes';

/**
 * Handles analysis of special concerns that might need specific timing or handling
 */
export const analyzeSpecialConcerns = async (
  userInput: string,
  concernType: ConcernType,
  youngAdultConcernFn?: () => any
) => {
  // Check for young adult concerns
  let youngAdultConcern = null;
  if (youngAdultConcernFn) {
    youngAdultConcern = youngAdultConcernFn();
  }
  
  // Check for trauma response patterns
  let traumaResponsePatterns: TraumaResponseAnalysis | null = null;
  try {
    // Use dynamic import instead of require
    const traumaModule = await import('../../../utils/response/traumaResponsePatterns').catch(() => null);
    if (traumaModule && traumaModule.detectTraumaResponsePatterns) {
      traumaResponsePatterns = traumaModule.detectTraumaResponsePatterns(userInput);
    }
  } catch (e) {
    console.log("Trauma patterns module not available:", e);
  }
  
  // Further adjust for young adult concerns if present
  if (youngAdultConcern) {
    youngAdultConcern = adjustForYoungAdultConcerns(youngAdultConcern);
  }
  
  return {
    youngAdultConcern,
    traumaResponsePatterns
  };
};

/**
 * Enhances young adult concern data with additional analysis
 */
const adjustForYoungAdultConcerns = (youngAdultConcern: any) => {
  // This is a placeholder for future enhanced young adult concern analysis
  return youngAdultConcern;
};

/**
 * Adjusts complexity and emotional weight based on trauma response patterns
 */
export const adjustForTraumaPatterns = (
  traumaResponsePatterns: TraumaResponseAnalysis | null,
  estimatedComplexity: number,
  estimatedEmotionalWeight: number
): { adjustedComplexity: number, adjustedEmotionalWeight: number } => {
  let adjustedComplexity = estimatedComplexity;
  let adjustedEmotionalWeight = estimatedEmotionalWeight;
  
  if (traumaResponsePatterns && traumaResponsePatterns.dominant4F) {
    const intensityMap = {
      'mild': 1,
      'moderate': 2,
      'severe': 3,
      'extreme': 4
    };
    
    const intensity = intensityMap[traumaResponsePatterns.dominant4F.intensity] || 1;
    
    // Increase complexity based on intensity and dominant pattern
    if (traumaResponsePatterns.dominant4F.type === 'freeze' || 
        traumaResponsePatterns.dominant4F.type === 'fawn') {
      // For freeze and fawn, which need more delicate responses
      adjustedComplexity += Math.min(intensity, 2);
    }
    
    // For hybrid responses (multiple strong patterns), increase complexity
    if (traumaResponsePatterns.secondary4F) {
      adjustedComplexity += 1;
    }
    
    // Increase emotional weight for higher intensity responses
    if (intensity >= 3) {
      adjustedEmotionalWeight += 1;
    }
    
    // If anger level is high in trauma response, increase emotional weight
    if (traumaResponsePatterns.angerLevel === 'angry' || 
        traumaResponsePatterns.angerLevel === 'enraged') {
      adjustedEmotionalWeight += 1;
    }
  }
  
  return {
    adjustedComplexity,
    adjustedEmotionalWeight
  };
};
