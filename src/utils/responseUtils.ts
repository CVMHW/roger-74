/**
 * Standard responses to various concerns
 */

// Crisis response
export const getCrisisMessage = (): string => {
  return "I notice that you've shared some concerning thoughts. While I'm here to support you, it's important that you speak with a crisis professional who can provide immediate assistance. Please use the resources below to connect with someone who can help right away. Your safety is the highest priority.";
};

// Medical concern response
export const getMedicalConcernMessage = (): string => {
  return "I notice you mentioned a physical health concern. As a peer support companion, I can't provide medical advice. Please consult with a healthcare professional about these symptoms. Would it be helpful to discuss how you might approach this conversation with your doctor?";
};

// Mental health concern response
export const getMentalHealthConcernMessage = (): string => {
  return "I'm hearing you describe what could be significant mental health symptoms. While I'm here to listen and provide peer support, these concerns should be addressed by a mental health professional who can provide proper evaluation and treatment. Please use the resources below to connect with specialized care. Would you like to talk about what reaching out for that support might look like?";
};

// Eating disorder response
export const getEatingDisorderMessage = (): string => {
  return "I notice you've mentioned concerns related to eating, body image, or weight. These are important topics that often benefit from specialized support. The Emily Program has specialists trained specifically in these areas. Would you like to talk about what reaching out to them might look like, or how you're feeling about these concerns?";
};

// Substance use response
export const getSubstanceUseMessage = (): string => {
  return "I notice you've mentioned substance use that seems to be causing some concern. While I'm here to provide peer support, specialized resources can offer more targeted help with substance use challenges. Would you like to talk about what reaching out for that kind of support might look like?";
};

// Tentative harm response
export const getTentativeHarmMessage = (): string => {
  return "I notice that you've mentioned thoughts about harm that concern me. While I'm here to provide peer support, these types of thoughts require professional support. I encourage you to use the scheduling link below to connect with appropriate care. Your safety and wellbeing are the highest priority.";
};

// New: PTSD response for moderate to severe cases
export function getPTSDMessage(): string {
  return "I notice you're describing experiences that might be related to trauma. These responses are your mind and body's way of trying to protect you, even though they can be distressing. A trauma specialist can provide specific support that can make a real difference. While I'm here to listen, connecting with the CVMHW team would be a good next step for getting specialized help. Would you like me to share more about trauma-informed resources that might be helpful?";
}

// New: Mild PTSD conversational response
export const getMildPTSDResponse = (userInput: string): string => {
  // This function imports and uses the detection utils function
  // It's implemented there to avoid circular dependencies
  let detectionUtils;
  try {
    detectionUtils = require('./detectionUtils');
    return detectionUtils.getMildPTSDResponse(userInput);
  } catch (e) {
    console.log("Error loading detection utils:", e);
    return "I notice you're describing some experiences that can follow difficult events. Would you like to talk more about what you're experiencing and what might be helpful?";
  }
};
