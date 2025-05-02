
/**
 * Clinical Protections
 * 
 * Rules that ensure Roger doesn't overstep clinical boundaries
 */

/**
 * Checks if content should be referred to Eric (clinician)
 * @param input User message
 * @returns Whether the content requires clinical expertise
 */
export const requiresClinicianReferral = (input: string): boolean => {
  const clinicalPatterns = [
    // Medication related
    /(medication|meds|drug|dose|prescription|refill)/i,
    // Diagnosis related  
    /(diagnos|disorder|condition|syndrome)/i,
    // Treatment decisions
    /(treatment|therapy|should I (try|start|stop|continue)|recommend)/i,
    // Medical questions
    /(medical advice|doctor's opinion|clinical|professional opinion)/i
  ];
  
  return clinicalPatterns.some(pattern => pattern.test(input));
};

/**
 * Generates appropriate clinician referral message
 * @returns Referral message for clinical topics
 */
export const generateClinicianReferral = (): string => {
  const referrals = [
    "That's something Dr. Eric would be able to address more thoroughly when you see him. In the meantime, what else has been on your mind?",
    "That's an important question about your care that Dr. Eric can help with during your appointment. While we wait, is there anything else you'd like to talk about?",
    "Dr. Eric will be able to provide guidance on that clinical question when you meet. For now, how has this been affecting your day-to-day life?"
  ];
  
  return referrals[Math.floor(Math.random() * referrals.length)];
};

/**
 * Checks if content might relate to subclinical vs clinical concerns
 * @param input User message
 * @returns Whether content might need distinction between normal emotions and clinical issues
 */
export const mightNeedNormalizingLanguage = (input: string): boolean => {
  const subclinicalPatterns = [
    // Normal emotional states described with clinical terms
    /(i think i (have|am)|do i have) (depression|anxiety|adhd|ocd|bipolar)/i,
    // Normal moods being questioned
    /(is it normal to feel|normal to be) (sad|anxious|worried|upset|distracted)/i,
    // Self-diagnosis language
    /(self[- ]diagnos|diagnose myself|think i might have)/i
  ];
  
  return subclinicalPatterns.some(pattern => pattern.test(input));
};

/**
 * Generates normalizing language for subclinical concerns
 * @param input User message
 * @returns Response that normalizes common emotional experiences
 */
export const generateNormalizingResponse = (input: string): string => {
  const normalEmotionPatterns = {
    sadness: /(sad|down|blue|unhappy)/i,
    anxiety: /(nervous|anxious|worried|on edge)/i,
    anger: /(angry|mad|upset|frustrated|irritated)/i,
    attention: /(distracted|unfocused|can't concentrate|focus)/i,
    mood: /(mood swings|ups and downs)/i
  };
  
  // Determine which emotion is being discussed
  let emotionType = "emotion";
  for (const [emotion, pattern] of Object.entries(normalEmotionPatterns)) {
    if (pattern.test(input)) {
      emotionType = emotion;
      break;
    }
  }
  
  // Generate appropriate normalizing response
  const responses = {
    sadness: "Feeling sad is a normal part of the human experience, especially after disappointments or losses. It's different from clinical depression, which involves persistent symptoms that significantly interfere with daily life. What's been bringing on these feelings for you?",
    anxiety: "Feeling nervous or worried, especially about important events or uncertainties, is completely normal. Everyone experiences anxiety at times. Clinical anxiety disorders involve more persistent, intense worry that significantly disrupts daily functioning. What situations tend to bring on these feelings for you?",
    anger: "Feeling angry or frustrated is a normal human emotion, especially when we face obstacles or perceived unfairness. It's different from clinical issues like intermittent explosive disorder, which involves difficulty controlling anger in ways that harm relationships or career. What's been triggering these feelings lately?",
    attention: "Everyone has times when they're distracted or have trouble focusing, especially when tired, stressed, or uninterested in a task. This differs from ADHD, which involves persistent, pervasive patterns that significantly impact functioning across multiple settings. What situations do you find most challenging for your concentration?",
    mood: "Our moods naturally fluctuate based on circumstances, sleep, stress levels, and other factors. These ups and downs are normal. Clinical mood disorders involve more extreme, persistent changes that significantly impact functioning. How have these mood changes been affecting your daily life?",
    emotion: "What you're describing sounds like a normal part of human emotional experience. While it's important to pay attention to our feelings, not every emotional state indicates a clinical condition. Dr. Eric can help you explore the distinction further. How long have you been experiencing these feelings?"
  };
  
  return responses[emotionType as keyof typeof responses];
};
