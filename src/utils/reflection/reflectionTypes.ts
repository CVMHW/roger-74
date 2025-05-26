
/**
 * Types for reflection and concern detection system
 */

export type ConcernType = 
  | 'crisis'
  | 'crisis-refusal'
  | 'tentative-harm'
  | 'eating-disorder'
  | 'substance-use'
  | 'depression'
  | 'anxiety'
  | 'self-harm'
  | 'suicide'
  | 'mental-health'
  | 'emotional-distress'
  | 'relationship-issues'
  | 'family-problems'
  | 'work-stress'
  | 'academic-pressure'
  | 'financial-stress'
  | 'grief-loss'
  | 'trauma'
  | 'adjustment-difficulties'
  | 'social-isolation'
  | 'low-self-esteem'
  | 'anger-management'
  | 'sleep-issues'
  | 'concentration-problems'
  | 'decision-making-difficulties'
  | 'life-transitions'
  | 'identity-issues'
  | 'spiritual-concerns'
  | 'health-anxiety'
  | 'social-anxiety'
  | 'perfectionism'
  | 'procrastination'
  | 'conflict-resolution'
  | 'communication-issues'
  | 'boundary-setting'
  | 'assertiveness'
  | 'time-management'
  | 'stress-management'
  | 'coping-strategies'
  | 'personal-growth'
  | 'self-care'
  | 'mindfulness'
  | 'wellness'
  | 'medical'
  | 'mild-gambling'
  | 'ptsd'
  | 'ptsd-mild'
  | 'trauma-response'
  | 'pet-illness'
  | 'weather-related'
  | 'cultural-adjustment'
  | 'minor-illness'
  | 'pet-loss'
  | null;

export type ConversationStage = 'opening' | 'exploration' | 'deepening' | 'resolution' | 'closing';

export type DevelopmentalStage = 'child' | 'adolescent' | 'young-adult' | 'adult' | 'older-adult';

export interface FeelingCategory {
  primary: string;
  secondary: string[];
  intensity: number;
}

export interface ReflectionData {
  primaryConcern: ConcernType;
  secondaryConcerns: ConcernType[];
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  supportNeeded: boolean;
  resourcesRecommended: string[];
  followUpSuggested: boolean;
}

export interface TraumaResponseAnalysis {
  hasPTSDIndicators: boolean;
  traumaType: string;
  severity: 'mild' | 'moderate' | 'severe';
  triggersIdentified: string[];
  copingMechanisms: string[];
  requiresSpecializedCare: boolean;
  dominant4F?: string;
  secondary4F?: string;
  angerLevel?: number;
}

export interface ReflectionPhrases {
  category: string;
  phrases: string[];
  appropriateUse: string[];
  opening?: string[];
}

export interface ReflectionPrinciple {
  name: string;
  description: string;
  applications: string[];
  contraindications: string[];
  examples?: string[];
}
