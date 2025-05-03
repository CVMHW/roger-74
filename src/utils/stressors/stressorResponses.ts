
/**
 * Stressor Responses
 * 
 * Provides responses tailored to specific stressors
 */

import { DetectedStressor, Stressor } from './stressorTypes';
import { findRelatedStressors } from './stressorData';

/**
 * Generate a stressor-specific response
 */
export const generateStressorResponse = (
  detectedStressor: DetectedStressor, 
  userInput: string
): string => {
  const { stressor, intensity } = detectedStressor;
  
  // Get base response for this stressor
  const baseResponse = getBaseResponse(stressor, intensity);
  
  // Add follow-up question appropriate to the stressor
  const followUpQuestion = getFollowUpQuestion(stressor, intensity);
  
  return `${baseResponse} ${followUpQuestion}`;
};

/**
 * Get base response text for a stressor
 */
const getBaseResponse = (stressor: Stressor, intensity?: string): string => {
  // We'll provide specific responses for certain common stressors
  switch (stressor.id) {
    case 'stressor_001': // Academic pressure
      return intensity === 'severe' 
        ? "I hear how overwhelming that academic pressure feels right now. When expectations get this high, it can feel like there's no room to breathe."
        : "Academic pressure can be really challenging. I hear that you're feeling stressed about your performance.";
      
    case 'stressor_004': // Bullying
      return "I'm sorry you're experiencing this. Bullying can be incredibly painful and isolating, and you don't deserve to be treated that way.";
      
    case 'stressor_006': // Social media pressure
      return "Social media can create so much pressure to present a certain image. It's easy to fall into comparing ourselves to highly curated versions of others' lives.";
      
    case 'stressor_007': // Family financial stress
      return "Financial stress affects the whole family, and I hear how this is impacting you. These kinds of worries can feel very heavy to carry.";
      
    case 'stressor_008': // Parental divorce/separation
      return "When parents separate or divorce, it creates a lot of complicated feelings. It's a major change, and it makes sense that you're feeling stressed about it.";
      
    case 'stressor_010': // Body image concerns
      return "Body image concerns are really common, but that doesn't make them any less painful. These thoughts about our appearances can be incredibly hard to deal with.";
      
    case 'stressor_013': // Fear of school shootings
      return "That fear is completely understandable. School should feel like a safe place, and worrying about your safety there is an enormous burden to carry.";
      
    case 'stressor_015': // Environmental anxiety
      return "Climate anxiety is something many people your age are experiencing. It's natural to feel concerned about the future of our planet.";
      
    // Default response based on category
    default:
      return getCategoryResponse(stressor.category, intensity);
  }
};

/**
 * Get category-based response
 */
const getCategoryResponse = (category: string, intensity?: string): string => {
  switch (category) {
    case 'academic':
      return "I can hear that school is causing you stress right now. Academic pressures can feel overwhelming sometimes.";
      
    case 'social':
      return "Social situations can be really complicated and stressful. I can hear that this is affecting you.";
      
    case 'family':
      return "Family dynamics can be really challenging. When things are difficult at home, it affects how we feel in all areas of life.";
      
    case 'health':
      return "Health concerns can bring up a lot of worry and uncertainty. I can understand why this would be on your mind.";
      
    case 'safety':
      return "Feeling unsafe is really distressing. Everyone deserves to feel secure, and I can hear that this is impacting you.";
      
    case 'environmental':
      return "Concerns about larger issues like the environment can feel overwhelming because they're so much bigger than any one person.";
      
    default:
      return "I hear that you're dealing with something stressful. That sounds really challenging.";
  }
};

/**
 * Get follow-up question for a stressor
 */
const getFollowUpQuestion = (stressor: Stressor, intensity?: string): string => {
  // For severe intensity, focus on immediate coping
  if (intensity === 'severe') {
    return "How have you been trying to cope with this so far?";
  }
  
  // Stressor-specific follow-ups
  switch (stressor.id) {
    case 'stressor_001': // Academic pressure
      return "What aspect of school performance feels most stressful right now?";
      
    case 'stressor_004': // Bullying
      return "Have you been able to talk to anyone you trust about what's happening?";
      
    case 'stressor_006': // Social media pressure
      return "How do you think social media affects how you feel about yourself?";
      
    case 'stressor_007': // Family financial stress
      return "How has this financial situation been affecting your daily life?";
      
    case 'stressor_008': // Parental divorce/separation
      return "What's been the hardest part of this change for you?";
      
    case 'stressor_010': // Body image concerns
      return "When did you first start feeling this way about your appearance?";
      
    case 'stressor_013': // Fear of school shootings
      return "What helps you feel safer when you're worried about this?";
      
    case 'stressor_015': // Environmental anxiety
      return "How does thinking about environmental issues affect your view of your own future?";
      
    // Default category-based follow-ups
    default:
      return getCategoryFollowUp(stressor.category);
  }
};

/**
 * Get category-based follow-up question
 */
const getCategoryFollowUp = (category: string): string => {
  switch (category) {
    case 'academic':
      return "What part of your academic life feels most overwhelming right now?";
      
    case 'social':
      return "How have these social challenges been affecting your daily life?";
      
    case 'family':
      return "How have things at home been impacting how you feel in other areas of life?";
      
    case 'health':
      return "What concerns you most about this health situation?";
      
    case 'safety':
      return "What helps you feel more secure when you're worried about your safety?";
      
    case 'environmental':
      return "How do these larger concerns affect your day-to-day thoughts and feelings?";
      
    default:
      return "Can you tell me more about how this has been affecting you?";
  }
};

/**
 * Get enhanced response for co-occurring stressors
 */
export const getCoOccurringStressorResponse = (
  primaryStressor: DetectedStressor,
  secondaryStressor: DetectedStressor
): string => {
  return `I notice you're dealing with both ${primaryStressor.stressor.name.toLowerCase()} and ${secondaryStressor.stressor.name.toLowerCase()}. These challenges can often feed into each other. Which one has been affecting you more lately?`;
};

/**
 * Check if stressors are related and get appropriate response
 */
export const getRelatedStressorResponse = (stressorId: string): string | null => {
  const relatedStressors = findRelatedStressors(stressorId);
  
  if (relatedStressors.length === 0) {
    return null;
  }
  
  const relatedStressor = relatedStressors[0];
  return `Sometimes ${relatedStressor.name.toLowerCase()} can also come up when dealing with this. Has that been part of your experience too?`;
};

