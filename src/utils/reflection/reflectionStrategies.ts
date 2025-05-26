
/**
 * Reflection strategies for different contexts and developmental stages
 */

import { DevelopmentalStage, FeelingCategory } from './reflectionTypes';

/**
 * Detect developmental stage from message content
 */
export const detectDevelopmentalStage = (message: string): DevelopmentalStage => {
  const lowerMessage = message.toLowerCase();
  
  // Look for age indicators
  if (/\b(mom|mommy|dad|daddy|toy|playground|school)\b/i.test(lowerMessage)) {
    return 'child';
  }
  
  if (/\b(high school|teenager|teen|homework|parents)\b/i.test(lowerMessage)) {
    return 'adolescent';
  }
  
  if (/\b(college|university|career|job)\b/i.test(lowerMessage)) {
    return 'young-adult';
  }
  
  if (/\b(retirement|grandchild|elderly|senior)\b/i.test(lowerMessage)) {
    return 'older-adult';
  }
  
  // Default to adult
  return 'adult';
};

/**
 * Get reflection strategy based on developmental stage
 */
export const getReflectionStrategy = (stage: DevelopmentalStage): {
  approach: string;
  language: string;
  techniques: string[];
} => {
  switch (stage) {
    case 'child':
      return {
        approach: 'Play-based and concrete',
        language: 'Simple, clear words',
        techniques: ['Emotion naming', 'Simple reflections', 'Validation']
      };
      
    case 'adolescent':
      return {
        approach: 'Collaborative and respectful',
        language: 'Teen-friendly but not overly casual',
        techniques: ['Identity exploration', 'Autonomy support', 'Validation']
      };
      
    case 'young-adult':
      return {
        approach: 'Goal-oriented and supportive',
        language: 'Professional but warm',
        techniques: ['Future planning', 'Skill building', 'Validation']
      };
      
    case 'adult':
      return {
        approach: 'Collaborative and insight-oriented',
        language: 'Professional and empathetic',
        techniques: ['Deep reflection', 'Pattern recognition', 'Integration']
      };
      
    case 'older-adult':
      return {
        approach: 'Respectful and life-review oriented',
        language: 'Respectful and patient',
        techniques: ['Life review', 'Wisdom integration', 'Legacy focus']
      };
      
    default:
      return {
        approach: 'Collaborative and insight-oriented',
        language: 'Professional and empathetic',
        techniques: ['Deep reflection', 'Pattern recognition', 'Integration']
      };
  }
};

/**
 * Generate age-appropriate reflection based on feeling and stage
 */
export const generateAgeAppropriateReflection = (
  feeling: FeelingCategory,
  stage: DevelopmentalStage,
  context?: string
): string => {
  const strategy = getReflectionStrategy(stage);
  
  // Base reflections by developmental stage
  const baseReflections = {
    'child': `You feel ${feeling}.`,
    'adolescent': `It seems like you're experiencing ${feeling} right now.`,
    'young-adult': `I hear that you're feeling ${feeling} about this situation.`,
    'adult': `From what you're sharing, it sounds like you're feeling ${feeling}.`,
    'older-adult': `I understand that you're feeling ${feeling} about this.`
  };
  
  let reflection = baseReflections[stage] || baseReflections['adult'];
  
  // Add context if provided
  if (context) {
    reflection += ` ${context}`;
  }
  
  return reflection;
};
