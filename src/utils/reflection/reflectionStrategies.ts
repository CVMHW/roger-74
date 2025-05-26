
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
    case 'infant_toddler':
    case 'young_child':
      return {
        approach: 'Play-based and concrete',
        language: 'Simple, clear words',
        techniques: ['Emotion naming', 'Simple reflections', 'Validation']
      };
      
    case 'middle_childhood':
      return {
        approach: 'Structured and supportive',
        language: 'Clear but more sophisticated',
        techniques: ['Skill building', 'Problem solving', 'Validation']
      };
      
    case 'adolescent':
      return {
        approach: 'Collaborative and respectful',
        language: 'Teen-friendly but not overly casual',
        techniques: ['Identity exploration', 'Autonomy support', 'Validation']
      };
      
    case 'young-adult':
    case 'young_adult':
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
  const getBaseReflection = (stage: DevelopmentalStage, feeling: FeelingCategory): string => {
    switch (stage) {
      case 'child':
      case 'infant_toddler':
      case 'young_child':
        return `You feel ${feeling}.`;
      case 'middle_childhood':
        return `It looks like you're feeling ${feeling} right now.`;
      case 'adolescent':
        return `It seems like you're experiencing ${feeling} right now.`;
      case 'young-adult':
      case 'young_adult':
        return `I hear that you're feeling ${feeling} about this situation.`;
      case 'adult':
        return `From what you're sharing, it sounds like you're feeling ${feeling}.`;
      case 'older-adult':
        return `I understand that you're feeling ${feeling} about this.`;
      default:
        return `From what you're sharing, it sounds like you're feeling ${feeling}.`;
    }
  };
  
  let reflection = getBaseReflection(stage, feeling);
  
  // Add context if provided
  if (context) {
    reflection += ` ${context}`;
  }
  
  return reflection;
};
