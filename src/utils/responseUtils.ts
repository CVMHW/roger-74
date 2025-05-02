
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
export const getPTSDMessage = (): string => {
  return "I notice you're describing experiences that may be related to trauma or PTSD. These can significantly impact quality of life, including sleep and daily functioning. While I can offer peer support, trauma-specific therapy approaches like CPT, PE, or EMDR provided by a specialized professional can be particularly helpful. The VA's National Center for PTSD or trauma-focused therapists can offer appropriate care. Would it help to discuss what reaching out for that support might look like?";
};

// New: Mild PTSD conversational response
export const getMildPTSDResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for sleep-related symptoms since they're common in PTSD
  const hasSleepIssues = 
    lowerInput.includes("nightmare") || 
    lowerInput.includes("can't sleep") || 
    lowerInput.includes("trouble sleeping") || 
    lowerInput.includes("wake up") ||
    lowerInput.includes("bad dream") ||
    lowerInput.includes("night sweat");
  
  // Check for hypervigilance/startle symptoms
  const hasHypervigilance = 
    lowerInput.includes("always alert") || 
    lowerInput.includes("jumpy") || 
    lowerInput.includes("startle") || 
    lowerInput.includes("on guard") ||
    lowerInput.includes("looking over") ||
    lowerInput.includes("easily frightened");
    
  // Check for avoidance symptoms
  const hasAvoidance = 
    lowerInput.includes("avoid") || 
    lowerInput.includes("don't want to go") || 
    lowerInput.includes("stay away from") || 
    lowerInput.includes("can't handle") ||
    lowerInput.includes("don't like crowds") ||
    lowerInput.includes("uncomfortable around");
    
  // Different responses based on symptom clusters
  if (hasSleepIssues) {
    return "I notice you mentioned difficulties with sleep, which can be common after experiencing stressful events. Sleep disturbances like nightmares or insomnia are actually one of the most reported symptoms following trauma. Would you like to talk more about how these sleep issues have been affecting you day-to-day?";
  } else if (hasHypervigilance) {
    return "It sounds like you've been feeling on high alert or easily startled. This heightened awareness is actually a common response after stressful experiences - your brain is trying to keep you safe. How has this been impacting your daily activities or interactions with others?";
  } else if (hasAvoidance) {
    return "I'm hearing that there are situations or places that you've been avoiding. This is a natural protective response that many people experience after difficult events. Would it help to talk more about how this avoidance has been affecting your everyday life?";
  } else {
    return "Thank you for sharing your experiences. Difficult events can affect each person differently, and the feelings or reactions you're describing are understandable responses to stress. Would it help to explore how these experiences have been impacting different areas of your life?";
  }
};
