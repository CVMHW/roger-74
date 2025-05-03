
/**
 * Stressor Types
 * 
 * Type definitions for the stressor system
 */

// Age ranges
export type AgeRange = 'child' | 'early-teen' | 'mid-teen' | 'late-teen' | 'young-adult' | 'adult' | 'all';

// Stressor categories
export type StressorCategory = 
  'academic' | 
  'social' | 
  'family' | 
  'health' | 
  'safety' | 
  'environmental' | 
  'financial' | 
  'work' | 
  'relationship' | 
  'societal' |
  'other';

// Severity levels
export type SeverityLevel = 'mild' | 'moderate' | 'severe';

// Frequency levels
export type FrequencyLevel = 'rare' | 'occasional' | 'common' | 'very-common';

// Stressor interface
export interface Stressor {
  id: string;
  name: string;
  category: StressorCategory;
  description: string;
  ageRanges: AgeRange[];
  severity: SeverityLevel;
  frequency: FrequencyLevel;
  keywords: string[];
  relatedStressors?: string[];
  factSheet?: string;
  commonResponses: string[];
}

// Detected stressor interface
export interface DetectedStressor {
  stressor: Stressor;
  confidence: number;
  intensity: SeverityLevel;
  keywords?: string[];
}
