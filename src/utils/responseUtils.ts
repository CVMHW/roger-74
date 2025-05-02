// Add this function to the existing responseUtils.ts file

/**
 * Get appropriate response for crisis situations with information about inpatient stays
 */
export const getCrisisMessage = (location: string | null = null): string => {
  return "I'm concerned about what you're sharing. If you're experiencing thoughts of harming yourself or others, it's important to connect with immediate professional support. The National Suicide Prevention Lifeline (988) is available 24/7. Inpatient treatment, when needed, typically involves brief stays of 3-7 days focused on ensuring your safety and helping you stabilize. Most people find these short stays helpful rather than restrictive.";
};

/**
 * Get appropriate response for tentative harm situations with inpatient information
 */
export const getTentativeHarmMessage = (tentativeHarmConcern: string | null = null): string => {
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
export const getMedicalConcernMessage = (medicalConcern: string | null = null): string => {
  return "I notice you're describing physical symptoms that may need medical attention. While I'm here to listen, I'm not able to provide medical advice. It would be best to consult with a healthcare provider about these symptoms. Is there a doctor or clinic you could reach out to?";
};

/**
 * Get appropriate response for mental health concerns
 */
export const getMentalHealthConcernMessage = (mentalHealthConcern: string | null = null): string => {
  return "I hear you describing experiences that might benefit from professional mental health support. Many people find that speaking with a therapist or counselor provides helpful strategies and relief. Would it be okay if we talked more about what mental health resources might be available to you?";
};

/**
 * Get appropriate response for eating disorder concerns
 */
export const getEatingDisorderMessage = (eatingDisorderConcern: string | null = null): string => {
  return "I notice you're describing thoughts and behaviors around food and body image that sound challenging. These experiences can be difficult to navigate alone. Speaking with a healthcare provider who specializes in eating concerns can often provide helpful support. Would it be okay if we explored what resources might be available?";
};

/**
 * Get appropriate response for substance use concerns
 */
export const getSubstanceUseMessage = (substanceUseConcern: string | null = null): string => {
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
  reactionType: 'denial' | 'anger' | 'bargaining' | 'minimizing' | 'accusation' | 'profanity' | 'dismissal',
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
    case 'accusation':
      return `I hear that you feel I've misunderstood or misjudged you, which wasn't my intention. Your experience and perspective are what matter most here. I'm here to listen and understand, not to make judgments.`;
    case 'profanity':
      return `I can tell you have strong feelings about this, which is completely understandable. Strong emotions are a natural response to difficult situations. I'm here to listen without judgment whenever you're ready to talk more.`;
    case 'dismissal':
      return `I understand you might not want to discuss this further, and that's completely your choice. I respect your decision about what you want to talk about, and I'm here whenever you'd like to explore any topic that feels helpful.`;
    default:
      return `I'm here to listen and support you, without any assumptions or judgments. We can talk about whatever feels most helpful for you right now.`;
  }
};

/**
 * Get appropriate response for pet illness or loss message
 */
export const getPetIllnessMessage = (petIllnessConcern: string | null = null): string => {
  const messages = [
    "I'm truly sorry to hear about your pet. Pets become important members of our families, and it's completely natural to feel grief and sadness when they're ill. As a Peer Support companion who has been trained by professionals and is continuing my training, I'd like to hear more about what you're going through. Would you like to share more about your experience?",
    
    "The bond we form with our pets is profound, and dealing with their illness or potential loss can be incredibly difficult. In my work as a Peer Support companion trained by professionals, I've found that acknowledging these feelings of grief is an important part of processing them. How has this situation been affecting you?",
    
    "I'm really sorry about your pet's health struggles. Many people experience deep grief when facing a pet's illness or loss. As I continue my training under professional supervision, I've learned that this grief is valid and significant. Would it help to talk more about how you're feeling?"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Get appropriate cancer-related message
 */
export const getCancerMessage = (cancerConcern: string | null = null, isPet: boolean = false): string => {
  if (isPet) {
    const messages = [
      "I'm so sorry to hear about your pet's cancer diagnosis. As someone trained by professionals in Peer Support, I know that learning a pet has cancer can be devastating. Pets are family members, and this news can bring up many difficult emotions. Would you like to share more about what you're going through?",
      
      "Cancer in a beloved pet is incredibly difficult to face. In my training with professional social workers, I've learned how important it is to acknowledge the grief that comes with a pet's serious illness. How are you coping with this challenging news?",
      
      "I'm truly sorry about your pet's cancer diagnosis. This must be an incredibly difficult time for you. As I continue my professional training in Peer Support, I've come to understand how deep the bond between humans and their animal companions can be. Would it help to talk more about how you're feeling?"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = [
      "I'm very sorry to hear about the cancer diagnosis you've mentioned. As someone trained by professionals in Peer Support, I recognize that cancer affects not just physical health but emotional wellbeing too. Would you like to share more about how this has been impacting you?",
      
      "Cancer can bring up so many complex emotions and challenges. In my ongoing training under professional guidance, I've learned how important it is to create space for all these feelings. How have you been coping with this situation?",
      
      "I'm really sorry to hear about the cancer diagnosis. As I continue my professional training in Peer Support, I've learned that everyone's experience with cancer - whether their own or a loved one's - is unique. Would it help to talk more about what you're going through?"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
};
