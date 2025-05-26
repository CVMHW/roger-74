
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

// Updated to match actual usage across the system
export type DevelopmentalStage = 
  | 'child' 
  | 'adolescent' 
  | 'young-adult'
  | 'young_adult'  // Keep both for compatibility
  | 'adult' 
  | 'older-adult'
  | 'infant_toddler'
  | 'young_child'
  | 'middle_childhood';

// Severity levels that match crisis detection system
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// Updated FeelingCategory to be a simple string-based category
export type FeelingCategory = 
  | "angry" | "happy" | "sad" | "anxious" | "confused" 
  | "hurt" | "embarrassed" | "guilty" | "ashamed" | "afraid" 
  | "hopeful" | "lonely" | "overwhelmed" | "relieved" | "neutral";

export interface ReflectionData {
  primaryConcern: ConcernType;
  secondaryConcerns: ConcernType[];
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
  urgencyLevel: SeverityLevel;
  supportNeeded: boolean;
  resourcesRecommended: string[];
  followUpSuggested: boolean;
}

export interface TraumaResponseAnalysis {
  hasPTSDIndicators: boolean;
  traumaType: string;
  severity: SeverityLevel;
  triggersIdentified: string[];
  copingMechanisms: string[];
  requiresSpecializedCare: boolean;
  dominant4F?: {
    type: 'freeze' | 'fawn' | 'fight' | 'flight';
    intensity: SeverityLevel;
  };
  secondary4F?: {
    type: 'freeze' | 'fawn' | 'fight' | 'flight';
    intensity: SeverityLevel;
  };
  angerLevel?: 'calm' | 'irritated' | 'angry' | 'enraged';
  hybrid?: boolean;
}

export interface ReflectionPhrases {
  category: string;
  phrases: string[];
  appropriateUse: string[];
  opening?: string[];
  closing?: string[];
  sad?: string[];
  angry?: string[];
  anxious?: string[];
  confused?: string[];
  hurt?: string[];
  embarrassed?: string[];
  guilty?: string[];
  ashamed?: string[];
  afraid?: string[];
  hopeful?: string[];
  lonely?: string[];
  overwhelmed?: string[];
  relieved?: string[];
  neutral?: string[];
}

export interface ReflectionPrinciple {
  name: string;
  description: string;
  applications: string[];
  contraindications: string[];
  examples?: string[];
}
