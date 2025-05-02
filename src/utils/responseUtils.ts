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
  return "Thank you for trusting me with what you're experiencing. I'm here with you as we navigate this together. The symptoms you're describing would benefit from specialized support from a mental health professional who can provide personalized care. I'll remain available to support you while you connect with these additional resources. Would it help to discuss what reaching out for that specialized support might look like? Your perspective on what would be most helpful is what matters most here.";
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

// New function: response for when patients react defensively to bipolar or mood disorder suggestions
export const getDefensiveBipolarReactionResponse = (): string => {
  return "I hear that this suggestion doesn't feel right to you, and I understand why that would be upsetting. I want to clarify that I'm not qualified to diagnose any conditions - my role is only to suggest resources that might be helpful based on what we discuss. Your experience is your own, and only you know how you truly feel. I'm still here with you and want to support you in a way that feels helpful and respectful. What would feel most useful for us to focus on right now?";
};

// New function: response for when patients use strong language or profanity in reaction to suggestions
export const getAngryReactionResponse = (): string => {
  return "I understand this has provoked strong feelings, which is completely valid. Mental health suggestions can feel very personal and intense. I appreciate your honesty about how this feels. As a peer support companion, I don't diagnose or make definitive clinical judgments - only licensed professionals can determine that. I'm still here with you through this difficult moment, and I respect your understanding of your own experiences. You're in control of how we proceed, and I'm here to assist in whatever way feels right for you.";
};

// New comprehensive de-escalation response generator
export const generateDeescalationResponse = (
  defensiveType: 'denial' | 'anger' | 'accusation' | 'profanity' | 'dismissal',
  concernType: string | null
): string => {
  // Base validation statements
  const validations = [
    "I hear your reaction, and it's completely valid to feel that way.",
    "I understand why that suggestion might feel wrong or upsetting to you.",
    "Your response makes perfect sense - it's important to be accurate about these things.",
    "I appreciate you letting me know how that felt for you.",
    "Thank you for being direct about how my suggestion landed."
  ];
  
  // Clarification about Roger's role
  const clarifications = [
    "I want to clarify that I'm not qualified to diagnose anyone - my role is just to suggest resources that might be helpful.",
    "As a peer support companion, I don't make clinical judgments, only highlight potential resources.",
    "I should emphasize that only a qualified healthcare provider can determine if any clinical label applies.",
    "It's important for me to clarify that I'm trained to suggest resources, not to diagnose conditions.",
    "I want to be clear that my suggestions are about potential resources, not definitive clinical statements."
  ];
  
  // For bipolar-specific reactions
  const bipolarSpecific = concernType === 'bipolar' ? [
    "Discussions about mood changes can sometimes bring up strong reactions, which is understandable.",
    "Mood-related terms can sometimes feel overly clinical or not representative of your experience.",
    "The experience of mood fluctuations is highly personal and only you know how they truly feel for you."
  ] : [];
  
  // Repair statements
  const repairStatements = [
    "I'm still here with you and want to continue our conversation in a way that feels supportive to you.",
    "I value our conversation and want to make sure we're moving forward in a way that feels right for you.",
    "What matters most is that you feel heard and respected in our interaction.",
    "I'm here to support you regardless of any specific terminology or suggestions.",
    "Your comfort and agency in this conversation are my priorities."
  ];
  
  // Redirection options
  const redirections = [
    "What would feel most helpful for us to focus on right now?",
    "How would you prefer we continue our conversation?",
    "What direction would feel most supportive for our discussion?",
    "What would be most useful for us to talk about next?",
    "How can I best support you in this moment?"
  ];
  
  // Build response based on defensive type
  let response = "";
  
  // Start with validation
  response += validations[Math.floor(Math.random() * validations.length)] + " ";
  
  // Add clarification
  response += clarifications[Math.floor(Math.random() * clarifications.length)] + " ";
  
  // Add bipolar-specific language if relevant
  if (bipolarSpecific.length > 0) {
    response += bipolarSpecific[Math.floor(Math.random() * bipolarSpecific.length)] + " ";
  }
  
  // Special additions for anger/profanity
  if (defensiveType === 'anger' || defensiveType === 'profanity') {
    response += "Strong reactions are completely understandable when discussing sensitive topics. ";
  }
  
  // Special additions for denial
  if (defensiveType === 'denial') {
    response += "You know yourself best, and I respect your understanding of your own experiences. ";
  }
  
  // Special additions for accusation
  if (defensiveType === 'accusation') {
    response += "I appreciate you letting me know if I've misunderstood something. Your perspective is what matters most. ";
  }
  
  // Add repair statement
  response += repairStatements[Math.floor(Math.random() * repairStatements.length)] + " ";
  
  // Add redirection
  response += redirections[Math.floor(Math.random() * redirections.length)];
  
  return response;
};
