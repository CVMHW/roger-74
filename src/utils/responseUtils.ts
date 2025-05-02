/**
 * Utilities for generating appropriate responses
 */

// Get a crisis message
export const getCrisisMessage = (): string => {
  const crisisResponses = [
    "I'm really concerned about what you're going through. It sounds like you're in crisis. Please know that you're not alone and there are people who can help. I strongly recommend reaching out to one of the crisis resources listed below for immediate support.",
    
    "It sounds like you're going through a difficult time. I want you to know that I'm here for you, but I'm not equipped to handle crisis situations. Please contact one of the crisis resources listed below for immediate help.",
    
    "I'm very sorry to hear that you're going through such a tough time. It sounds like you need immediate support. Please reach out to one of the crisis resources listed below. They are available 24/7 and can provide the help you need.",
    
    "I can hear how much pain you're in. It's important that you get immediate support. Please contact one of the crisis resources listed below. They can provide the support you need right now.",
    
    "I'm really worried about you. It sounds like you're in a crisis situation. Please reach out to one of the crisis resources listed below. They can provide the support you need right now."
  ];
  
  // Select a random response
  return crisisResponses[Math.floor(Math.random() * crisisResponses.length)];
};

// Get a message for medical concerns
export const getMedicalConcernMessage = (): string => {
  const medicalConcernResponses = [
    "I notice you're mentioning some physical health concerns. While I'm here to listen, please remember that I'm not a medical professional. It sounds like speaking with a healthcare provider would be really helpful for what you're experiencing. Would you like me to provide some resources where you can find medical assistance?",
    
    "It sounds like you're dealing with some physical discomfort or health concerns. I want to make sure you get the appropriate care. Since I'm not a medical professional, I'd strongly encourage you to contact your doctor or a healthcare provider about what you're experiencing. There are resources available in the crisis section below if you need immediate assistance.",
    
    "I can understand you're concerned about these physical symptoms. Physical health is really important, and what you're describing should be evaluated by a medical professional. Would it be possible for you to reach out to your doctor soon? The resources below can also help you find immediate medical support if needed.",
    
    "Thank you for sharing that with me. When it comes to physical health symptoms like what you're describing, it's important to get proper medical attention. While I'm here to support you emotionally, a healthcare provider can give you the medical guidance you need. The resources listed below can connect you with medical professionals.",
    
    "I appreciate you trusting me with this information about your physical health. These symptoms sound like they should be checked by a medical professional. While we wait for your therapist, would you like to discuss how you might approach getting medical help, or would you prefer to talk about something else?"
  ];
  
  // Select a random response
  return medicalConcernResponses[Math.floor(Math.random() * medicalConcernResponses.length)];
};

// Get a message for mental health concerns
export const getMentalHealthConcernMessage = (): string => {
  const mentalHealthResponses = [
    "I notice you're describing some experiences that could be related to serious mental health concerns. These are important to address with a qualified mental health professional. While I'm here to listen and provide support while you wait, your therapist will be able to give you the proper guidance. Would it help to talk about how you're feeling right now?",
    
    "What you're describing sounds like symptoms that should be evaluated by a mental health professional. It's important that you get the right kind of support for what you're experiencing. The resources below include mental health crisis lines that can provide immediate assistance. Would you like to talk more about what's been going on while you wait?",
    
    "Thank you for sharing these experiences with me. Changes in sleep, mood, or perception like you're describing are important to discuss with your therapist. They have the training to help with these specific concerns. In the meantime, is there anything that has helped you feel more grounded when you've experienced this before?",
    
    "I understand you're going through some challenging experiences with your mental health. These symptoms you're describing are important to address with a specialist. Your therapist will be able to work with you on these specific concerns. While we wait, would it help to talk about what coping strategies have worked for you in the past?",
    
    "What you're sharing sounds difficult to deal with. Experiences like these are best addressed with a qualified mental health professional who can provide proper evaluation and treatment. The resources below include emergency mental health services. While we wait for your therapist, is there something specific you'd like to talk about today?"
  ];
  
  // Select a random response
  return mentalHealthResponses[Math.floor(Math.random() * mentalHealthResponses.length)];
};

// Get a message for eating disorder concerns
export const getEatingDisorderMessage = (): string => {
  const eatingDisorderResponses = [
    "I notice you're talking about concerns related to eating, body image, or weight. These are important topics that benefit from specialized support. The Emily Program for Eating Disorders in Cleveland provides excellent care for these concerns. Would you like to discuss how you've been feeling about this while you wait for your therapist?",
    
    "Thank you for sharing these thoughts about your body and eating patterns. These concerns deserve compassionate, specialized care. The Emily Program (listed in the resources) specializes in supporting people with similar experiences. While we wait, I'm here to listen without judgment if you'd like to talk more about what you're going through.",
    
    "I hear that you're having some difficult feelings about your body and eating. Many people struggle with these issues, and you deserve supportive, specialized care. The Emily Program listed in our resources can provide that specialized support. Would it help to talk about what's been most challenging for you lately?",
    
    "What you're describing about your relationship with food and your body sounds really challenging. It's important that you know specialized support is available through programs like the Emily Program (listed in our resources). While we wait for your therapist, I'm here to listen if you want to share more about what you're going through.",
    
    "I appreciate you being open about these struggles with food and body image. These concerns are important and deserve specialized care. The Emily Program (1-888-272-0836) provides support specifically for these types of concerns. In the meantime, what would feel most supportive to discuss while you wait for your therapist?"
  ];
  
  // Select a random response
  return eatingDisorderResponses[Math.floor(Math.random() * eatingDisorderResponses.length)];
};

// Get a message for substance use concerns
export const getSubstanceUseMessage = (): string => {
  const substanceUseResponses = [
    "I notice you're mentioning concerns about substance use or gambling. These are important topics that often benefit from specialized support. There are resources listed below that can provide guidance specific to these concerns. Would you like to talk more about what's been going on while you wait for your therapist?",
    
    "Thank you for sharing about your experience with substances/gambling. Many people face similar challenges, and specialized support can make a real difference. The resources section below includes helplines specifically for substance use and gambling concerns. Is there something specific about your experience that you'd like to discuss while you wait?",
    
    "What you're sharing about substance use/gambling is important. These challenges can be complex, and you deserve supportive, specialized care. The resources below include several options for getting more support. While we wait for your therapist, would it help to talk about what prompted you to seek support today?",
    
    "I appreciate your openness about these substance/gambling concerns. It takes courage to talk about these experiences. Specialized services (listed in the resources) can provide support tailored to these specific challenges. While we wait, I'm here to listen if you'd like to share more about what you're going through.",
    
    "The substance use/gambling concerns you're describing are important to address. There are dedicated resources available to help with these specific challenges, including several listed below. While we wait for your therapist, would you like to talk about what has been most difficult for you lately?"
  ];
  
  // Select a random response
  return substanceUseResponses[Math.floor(Math.random() * substanceUseResponses.length)];
};

// We need to add the function getTentativeHarmMessage() to the existing responseUtils.ts file

export const getTentativeHarmMessage = (): string => {
  return `I notice that you're expressing some thoughts that concern me. Your safety is my top priority, and what you're describing requires professional support.

Please schedule an appointment immediately with a therapist who can provide appropriate help: [calendly.com/ericmriesterer](https://calendly.com/ericmriesterer/)

In the meantime, please also refer to the crisis resources below if you need immediate support.

I want to emphasize that any thoughts of harm to yourself or others should be taken seriously, even if they feel uncertain or tentative. A trained professional can help you work through these thoughts in a safe environment.`;
};
