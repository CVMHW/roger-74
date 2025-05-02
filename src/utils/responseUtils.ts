
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

// Tentative harm response - updated for de-escalation and calm support
export const getTentativeHarmMessage = (): string => {
  return "I'm right here with you during this difficult moment. I hear that you're experiencing some really challenging thoughts, and I want you to know that you're not alone in this. Your safety and wellbeing are my primary concern right now. While we continue our conversation, connecting with specialized support through the resources below can provide additional help. I'm here to listen and support you through this process. What would feel most helpful for us to focus on right now?";
};

// PTSD response for moderate to severe cases - updated with more supportive language
export function getPTSDMessage(): string {
  return "Thank you for sharing these experiences with me - I understand this takes courage. What you're describing sounds related to trauma, and these responses are your mind and body's natural protective mechanisms, even when they feel distressing. I'm here to support you through this, and a trauma specialist can provide additional specialized care that can make a significant difference. Would it help to discuss trauma-informed resources that might support you while we continue our conversation?";
}

// Mild PTSD conversational response
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

// Trauma response pattern support - new for 4F trauma responses
export const getTraumaResponseMessage = (userInput: string): string => {
  // Dynamically import trauma patterns to avoid circular dependencies
  try {
    const traumaPatterns = require('./response/traumaResponsePatterns');
    if (traumaPatterns && traumaPatterns.generateTraumaInformedResponse) {
      const analysis = traumaPatterns.detectTraumaResponsePatterns(userInput);
      if (analysis && analysis.dominant4F) {
        return traumaPatterns.generateTraumaInformedResponse(analysis);
      }
    }
  } catch (e) {
    console.log("Error generating trauma response:", e);
  }
  
  // Fallback general trauma-informed response
  return "I notice you're describing experiences that might relate to past challenging events. Our bodies and minds develop protective responses that can persist even when the immediate situation has passed. These responses were helpful at one time, and understanding them can help us navigate current challenges. I'm here to support you through this process. What feels most important for us to focus on right now?";
};
