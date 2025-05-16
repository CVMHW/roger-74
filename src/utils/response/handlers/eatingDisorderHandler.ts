
/**
 * Specialized handler for eating disorder concerns
 * Prevents hallucinations and provides appropriate support
 */

import { detectEatingDisorderConcerns } from '../../conversation/specializedDetection/eatingPatterns/detectors';

/**
 * Generates appropriate responses for eating disorder concerns
 * with specific sensitivity to prevent hallucinations
 * 
 * @param userInput User's message
 * @returns Specialized response or null if not applicable
 */
export function createEatingDisorderResponse(userInput: string): string | null {
  // First detect if this is an eating disorder concern
  const detectionResult = detectEatingDisorderConcerns(userInput);
  
  if (!detectionResult.isEatingDisorderConcern) {
    return null;
  }
  
  // Handle based on risk level
  if (detectionResult.riskLevel === 'high') {
    return "I'm concerned about what you're sharing regarding your eating disorder. This sounds serious, and it's important that you speak with a healthcare professional right away. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?";
  }
  
  if (detectionResult.riskLevel === 'moderate') {
    return "I hear that you're struggling with an eating disorder. These challenges can be really difficult to navigate alone. The National Eating Disorders Association (NEDA) offers specialized support through their helpline at 1-800-931-2237. Treatment from eating disorder specialists can be very effective. Would you like to talk more about what you've been experiencing?";
  }
  
  // For low risk concerns
  return "Thank you for sharing about your relationship with food and body image. These topics can be challenging to talk about. While we can discuss this together, specialized support is also available if you'd find it helpful. Would you like to tell me more about what you've been experiencing?";
}

/**
 * Gets specialized referral information for eating disorder concerns
 * 
 * @returns Referral resources for eating disorders
 */
export function getEatingDisorderResources(): string {
  return "Here are some resources that may help:\n" +
    "- National Eating Disorders Association (NEDA) Helpline: 1-800-931-2237\n" +
    "- NEDA Crisis Text Line: Text 'NEDA' to 741741\n" +
    "- The Emily Program: 1-888-364-5977 - Specialized eating disorder treatment\n" +
    "- Eating Recovery Center: 1-877-825-8584";
}
