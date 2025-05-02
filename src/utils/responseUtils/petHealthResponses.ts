
/**
 * Specialized response generation for pet health issues
 */

type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'hamster' | 'rabbit' | 'guinea pig' | 'pet';

interface PetHealthResponseParams {
  petType?: string;
  condition?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  userMessage: string;
}

/**
 * Extracts pet type from a user message
 * @param message User's message
 * @returns The detected pet type or 'pet' as default
 */
export const extractPetType = (message: string): PetType => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('dog') || lowerMessage.includes('puppy')) return 'dog';
  if (lowerMessage.includes('cat') || lowerMessage.includes('kitten')) return 'cat';
  if (lowerMessage.includes('bird')) return 'bird';
  if (lowerMessage.includes('fish')) return 'fish';
  if (lowerMessage.includes('hamster')) return 'hamster';
  if (lowerMessage.includes('rabbit')) return 'rabbit';
  if (lowerMessage.includes('guinea pig')) return 'guinea pig';
  
  return 'pet';
};

/**
 * Attempts to extract the specific health condition mentioned
 * @param message User's message
 * @returns The condition if detected
 */
export const extractPetCondition = (message: string): string | undefined => {
  const lowerMessage = message.toLowerCase();
  
  const conditions = [
    { term: 'cancer', result: 'cancer' },
    { term: 'tumor', result: 'tumor' },
    { term: 'broken leg', result: 'injury' },
    { term: 'not eating', result: 'loss of appetite' },
    { term: 'vomit', result: 'digestive issue' },
    { term: 'diarrhea', result: 'digestive issue' },
    { term: 'seizure', result: 'neurological issue' },
    { term: 'dying', result: 'end-of-life condition' },
    { term: 'put down', result: 'end-of-life decision' },
    { term: 'euthanasia', result: 'end-of-life decision' }
  ];
  
  for (const condition of conditions) {
    if (lowerMessage.includes(condition.term)) {
      return condition.result;
    }
  }
  
  return undefined;
};

/**
 * Generates appropriate responses for pet health concerns
 */
export const generatePetHealthResponse = (params: PetHealthResponseParams): string => {
  const { petType = 'pet', condition, severity = 'moderate', userMessage } = params;
  
  // Determine if this is about end-of-life decision making
  const isEndOfLife = condition === 'end-of-life decision' || 
                      userMessage.toLowerCase().includes('put down') ||
                      userMessage.toLowerCase().includes('euthanasia');
  
  // Responses for end-of-life situations
  if (isEndOfLife) {
    return `I can hear how much you care about your ${petType}, and I understand that making end-of-life decisions is incredibly difficult. Many people describe this as one of the hardest choices they face with their animal companions. The bond you share with your ${petType} is special, and it's natural to feel conflicted, sad, or even guilty when considering what's best for them. How are you coping with this difficult time?`;
  }
  
  // Responses for pet cancer
  if (condition === 'cancer' || condition === 'tumor') {
    return `I'm truly sorry to hear about your ${petType}'s cancer diagnosis. This is such a difficult situation to face with a beloved pet. Many pet owners describe feeling overwhelmed by emotions and decisions during this time. Would it help to talk more about what you're going through with this diagnosis, or are there specific concerns about your ${petType}'s care that are on your mind?`;
  }
  
  // Response for general illness
  return `I can hear your concern about your ${petType}'s health. The bond we form with our pets makes it especially hard when they're not well. Many people find it challenging to see their animal companions suffering or uncomfortable. Would you like to share more about what you're experiencing as you care for your ${petType}?`;
};
