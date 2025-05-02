
/**
 * Standard responses to various concerns
 */

// Crisis response
export const getCrisisMessage = (): string => {
  return "I notice you've shared some concerning thoughts. I'm here with you during this difficult moment. While I'm here to support you as we work through this together, connecting with a crisis professional would provide the specialized assistance you may need right now. The resources below can help you get immediate support. Your wellbeing matters greatly, and I'm here to help you access the right care.";
};

// Medical concern response
export const getMedicalConcernMessage = (): string => {
  return "I notice you mentioned a health concern. I appreciate you sharing this with me and want to ensure you receive the appropriate care. As your peer support companion, I recommend consulting with a healthcare professional about these symptoms. I'm here to support you through this process - would it be helpful to talk about how you might approach this conversation with your doctor?";
};

// Mental health concern response
export const getMentalHealthConcernMessage = (): string => {
  return "Thank you for trusting me with what you're experiencing. I'm here with you as we navigate this together. The symptoms you're describing would benefit from specialized support from a mental health professional who can provide personalized care. I'll remain available to support you while you connect with these additional resources. Would it help to discuss what reaching out for that specialized support might look like?";
};

// Eating disorder response
export const getEatingDisorderMessage = (): string => {
  return "I appreciate you sharing these thoughts about eating, body image, or weight. These are important aspects of your wellbeing, and you deserve supportive, specialized care. The Emily Program has experts who specialize specifically in these areas. I'm here to support you throughout this process - would it help to talk about what connecting with them might look like, or how you're feeling about these concerns?";
};

// Substance use response
export const getSubstanceUseMessage = (): string => {
  return "Thank you for sharing about these substance use concerns - I'm here with you as we work through this together. While I'm providing peer support, connecting with specialized resources could offer additional targeted help with these challenges. I'll continue supporting you while you explore these options. Would you like to discuss what reaching out for specialized support might look like?";
};

// Tentative harm response
export const getTentativeHarmMessage = (): string => {
  return "I'm right here with you during this difficult moment. I hear that you're experiencing some really challenging thoughts about harm, and I want you to know you're not alone in this. Your safety and wellbeing are absolutely paramount. While we continue our conversation, I encourage you to also connect with specialized support through the scheduling link below. I'm here to help you access the care that will best support you through this.";
};

// New: PTSD response for moderate to severe cases
export function getPTSDMessage(): string {
  return "Thank you for sharing these experiences with me - I understand this takes courage. What you're describing sounds related to trauma, and these responses are your mind and body's natural protective mechanisms, even when they feel distressing. I'm here to support you, and a trauma specialist can provide additional specialized care that can make a significant difference. While we continue our conversation, connecting with the CVMHW team would be a beneficial next step. Would it help to discuss trauma-informed resources that might support you?";
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
    return "I notice you're describing some experiences that can follow difficult events. I'm here to support you through this. Would you like to talk more about what you're experiencing and what might be helpful?";
  }
};

