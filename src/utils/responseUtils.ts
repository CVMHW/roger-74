
// Add this function to the existing responseUtils.ts file

/**
 * Get appropriate response for crisis situations with information about inpatient stays
 */
export const getCrisisMessage = (): string => {
  return "I'm concerned about what you're sharing. If you're experiencing thoughts of harming yourself or others, it's important to connect with immediate professional support. The National Suicide Prevention Lifeline (988) is available 24/7. Inpatient treatment, when needed, typically involves brief stays of 3-7 days focused on ensuring your safety and helping you stabilize. Most people find these short stays helpful rather than restrictive.";
};

/**
 * Get appropriate response for tentative harm situations with inpatient information
 */
export const getTentativeHarmMessage = (): string => {
  return "I'm hearing some concerning thoughts about potential harm. Your safety is the top priority right now. Please consider contacting a crisis service like the 988 Lifeline or going to your nearest emergency room. If inpatient care is recommended, these stays are typically brief (3-7 days) and focused on helping you regain stability in a safe environment.";
};

/**
 * Generate a response for potentially deceptive backtracking on crisis statements
 */
export const getDeceptionResponse = (originalConcern: string): string => {
  return `I notice you may be downplaying what you shared earlier. Many people worry about what might happen if they express thoughts of ${originalConcern}. I want to reassure you that seeking help is focused on supporting you, not restricting you. If inpatient treatment is recommended, it typically involves a brief 3-7 day stay focused on safety and stabilization. Would it help to talk more about what professional support options look like?`;
};

/**
 * Get appropriate response for medical concerns
 */
export const getMedicalConcernMessage = (): string => {
  return "I notice you're describing physical symptoms that may need medical attention. While I'm here to listen, I'm not able to provide medical advice. It would be best to consult with a healthcare provider about these symptoms. Is there a doctor or clinic you could reach out to?";
};

/**
 * Get appropriate response for mental health concerns
 */
export const getMentalHealthConcernMessage = (): string => {
  return "I hear you describing experiences that might benefit from professional mental health support. Many people find that speaking with a therapist or counselor provides helpful strategies and relief. Would it be okay if we talked about what mental health resources might be available to you?";
};

/**
 * Get appropriate response for eating disorder concerns
 */
export const getEatingDisorderMessage = (): string => {
  return "I notice you're describing thoughts and behaviors around food and body image that sound challenging. These experiences can be difficult to navigate alone. Speaking with a healthcare provider who specializes in eating concerns can often provide helpful support. Would it be okay if we explored what resources might be available?";
};

/**
 * Get appropriate response for substance use concerns
 */
export const getSubstanceUseMessage = (): string => {
  return "I'm hearing that substance use might be having some impacts in your life. Many people find it helpful to speak with a professional who specializes in substance use concerns. They can offer support without judgment and help you explore options that work for you. Would you be open to discussing what resources might be available?";
};

/**
 * Get appropriate response for PTSD concerns
 */
export const getPTSDMessage = (): string => {
  return "I'm hearing you describe experiences that might be related to trauma. Many people find that working with a trauma-informed therapist can help process these experiences and develop coping strategies. These professionals are specifically trained to provide support in a safe, understanding environment. Would you like to talk about what resources might be available?";
};

/**
 * Get appropriate response for mild PTSD concerns
 */
export const getMildPTSDResponse = (userInput: string): string => {
  return "I notice you're describing some reactions that might be connected to difficult past experiences. It's common for our bodies and minds to develop protective responses after challenging events. Many people find it helpful to work with a professional who understands trauma responses. They can help identify helpful coping strategies. Would you like to talk more about this?";
};

/**
 * Get appropriate response for trauma-related concerns
 */
export const getTraumaResponseMessage = (userInput: string): string => {
  return "I hear you sharing experiences that sound very difficult to process. Trauma can affect us in many ways, and your reactions are valid responses to what you've been through. Many people find that working with a trauma-informed professional provides helpful support. Would it be okay to talk about what resources might be available to you?";
};

/**
 * Generate a deescalation response based on defensive reaction type
 */
export const generateDeescalationResponse = (
  reactionType: 'denial' | 'anger' | 'bargaining' | 'minimizing',
  suggestedConcern: string
): string => {
  switch (reactionType) {
    case 'denial':
      return `I understand you may not see it that way, and your perspective is important. I'm not here to label or diagnose, just to listen and support you. Would it be helpful to explore what's been going on in a different way?`;
    case 'anger':
      return `I can hear this topic brings up strong feelings, which is completely understandable. Your reactions are valid, and I appreciate you sharing them with me. We can approach this conversation however feels most comfortable for you.`;
    case 'bargaining':
      return `I hear you trying to make sense of these experiences. It's natural to look for explanations and solutions. I'm here to support you in finding what works best for your unique situation, without any pressure or expectations.`;
    case 'minimizing':
      return `I notice you might be downplaying what you're going through, which many people do. Even challenges that seem small can have a big impact, and your experiences are valid. I'm here to listen without judgment, whatever you'd like to discuss.`;
    default:
      return `I'm here to listen and support you, without any assumptions or judgments. We can talk about whatever feels most helpful for you right now.`;
  }
};

