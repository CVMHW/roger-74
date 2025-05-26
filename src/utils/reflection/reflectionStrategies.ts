
/**
 * Reflection strategies for different contexts and developmental stages
 */

import { DevelopmentalStage, FeelingCategory } from './reflectionTypes';

/**
 * Get reflection strategy based on developmental stage
 */
export const getReflectionStrategy = (stage: DevelopmentalStage): {
  approach: string;
  language: string;
  techniques: string[];
} => {
  switch (stage) {
    case 'infant_toddler':
      return {
        approach: 'Simple and concrete',
        language: 'Very basic words',
        techniques: ['Simple validation', 'Basic emotion naming']
      };
      
    case 'young_child':
      return {
        approach: 'Play-based and concrete',
        language: 'Simple, clear words',
        techniques: ['Emotion naming', 'Simple reflections', 'Validation']
      };
      
    case 'middle_childhood':
      return {
        approach: 'Structured and educational',
        language: 'Age-appropriate vocabulary',
        techniques: ['Feeling identification', 'Problem-solving', 'Validation']
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
  const baseReflections = {
    'infant_toddler': `You feel ${feeling}.`,
    'young_child': `It sounds like you're feeling ${feeling}.`,
    'middle_childhood': `I can see that you're feeling ${feeling} about this.`,
    'adolescent': `It seems like you're experiencing ${feeling} right now.`,
    'young-adult': `I hear that you're feeling ${feeling} about this situation.`,
    'young_adult': `I hear that you're feeling ${feeling} about this situation.`,
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
