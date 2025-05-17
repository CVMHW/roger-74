
/**
 * Crisis Response Coordinator
 * 
 * Provides coordinated crisis responses based on detected crisis types
 */

import { CrisisType } from '../../hooks/chat/useCrisisDetector';
import { ConcernType } from '../reflection/reflectionTypes';

/**
 * Get an appropriate crisis response based on the detected crisis type
 */
export const getCrisisResponse = (crisisType: CrisisType | ConcernType): string => {
  switch (crisisType) {
    case 'suicide':
      return getSuicideResponse();
    case 'self-harm':
    case 'tentative-harm':
      return getSelfHarmResponse();
    case 'eating-disorder':
      return getEatingDisorderCrisisResponse();
    case 'substance-use':
      return getSubstanceUseCrisisResponse();
    case 'crisis':
      return getSuicideResponse();
    case 'general-crisis':
    default:
      return getGeneralCrisisResponse();
  }
};

/**
 * Get a response for suicide crisis situations
 */
const getSuicideResponse = (): string => {
  return "I'm very concerned about what you're sharing regarding thoughts of suicide. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
};

/**
 * Get a response for self-harm crisis situations
 */
const getSelfHarmResponse = (): string => {
  return "I'm very concerned about what you're sharing regarding self-harm. Your safety is important, and it would be beneficial to speak with a crisis professional who can provide immediate support. The 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7. Would it be possible for you to reach out to them today?";
};

/**
 * Get a response for eating disorder crisis situations
 */
const getEatingDisorderCrisisResponse = (): string => {
  return "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?";
};

/**
 * Get a response for substance use crisis situations
 */
const getSubstanceUseCrisisResponse = (): string => {
  return "I'm concerned about what you're sharing regarding substance use. This situation sounds serious, and it's important that you speak with a healthcare professional. The SAMHSA National Helpline (1-800-662-4357) provides free, confidential, 24/7 treatment referral and information. Would it help to discuss resources available to you?";
};

/**
 * Get a response for general crisis situations
 */
const getGeneralCrisisResponse = (): string => {
  return "I'm concerned about what you're sharing. This sounds like a difficult situation that would benefit from immediate professional support. The 988 Suicide & Crisis Lifeline (call or text 988) can provide guidance and resources. Would it be helpful if I shared some additional support options?";
};

/**
 * Get a crisis response based on a concern type from the reflection system
 */
export const getCrisisResponseFromConcernType = (concernType: ConcernType | CrisisType): string => {
  switch (concernType) {
    case 'crisis':
      return getSuicideResponse();
    case 'tentative-harm':
    case 'self-harm':
      return getSelfHarmResponse();
    case 'eating-disorder':
      return getEatingDisorderCrisisResponse();
    case 'substance-use':
      return getSubstanceUseCrisisResponse();
    default:
      return getGeneralCrisisResponse();
  }
};

/**
 * Get resources for a specific crisis type
 */
export const getCrisisResources = (crisisType: CrisisType | ConcernType): string => {
  switch (crisisType) {
    case 'suicide':
    case 'crisis':
    case 'self-harm':
    case 'tentative-harm':
      return "- National Suicide Prevention Lifeline: 988 or 1-800-273-8255\n" +
             "- Crisis Text Line: Text HOME to 741741\n" +
             "- Veterans Crisis Line: 988 then press 1\n" +
             "- Your nearest emergency room\n" +
             "- 911 for immediate danger";
    
    case 'eating-disorder':
      return "- National Eating Disorders Association (NEDA) Helpline: 1-800-931-2237\n" +
             "- NEDA Crisis Text Line: Text 'NEDA' to 741741\n" +
             "- The Emily Program: 1-888-364-5977\n" +
             "- Eating Recovery Center: 1-877-825-8584";
    
    case 'substance-use':
      return "- SAMHSA National Helpline: 1-800-662-4357\n" +
             "- Alcoholics Anonymous: http://aa.org\n" +
             "- Narcotics Anonymous: http://na.org\n" +
             "- National Drug Helpline: 1-844-289-0879";
    
    default:
      return "- National Crisis Hotline: 988\n" +
             "- Crisis Text Line: Text HOME to 741741\n" +
             "- Your nearest emergency room\n" +
             "- 911 for immediate emergency";
  }
};
